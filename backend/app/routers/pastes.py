from __future__ import annotations

import re
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, Header, HTTPException, Query, Response, status
from sqlalchemy import or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from ..db import get_session
from ..models import Paste
from ..schemas import (
    ExpiresIn,
    PasteCreate,
    PasteCreated,
    PasteListItem,
    PasteOut,
    Visibility,
)
from ..security import hash_password, verify_password
from ..slug import make_slug


router = APIRouter(prefix="/api/pastes", tags=["pastes"])

_OWNER_RE = re.compile(r"^[a-zA-Z0-9_\-]{8,64}$")
_MAX_SLUG_RETRIES = 6


def _expires_at(kind: ExpiresIn) -> datetime | None:
    if kind == "1h":
        return datetime.now(timezone.utc) + timedelta(hours=1)
    if kind == "1d":
        return datetime.now(timezone.utc) + timedelta(days=1)
    return None


def _require_owner(x_owner_token: str | None) -> str:
    if not x_owner_token or not _OWNER_RE.match(x_owner_token):
        raise HTTPException(status_code=400, detail="missing or invalid X-Owner-Token")
    return x_owner_token


def _is_expired(p: Paste) -> bool:
    return p.expires_at is not None and p.expires_at <= datetime.now(timezone.utc)


def _snippet(content: str, n: int = 80) -> str:
    one_line = content.replace("\n", " ").strip()
    return one_line[:n]


@router.post("", response_model=PasteCreated, status_code=status.HTTP_201_CREATED)
async def create_paste(
    body: PasteCreate,
    x_owner_token: str | None = Header(default=None, alias="X-Owner-Token"),
    db: AsyncSession = Depends(get_session),
) -> PasteCreated:
    owner = _require_owner(x_owner_token)

    pw_hash = hash_password(body.password) if body.password else None

    paste: Paste | None = None
    last_err: Exception | None = None
    for attempt in range(_MAX_SLUG_RETRIES):
        slug_len = 4 if attempt < 3 else 5 if attempt < 5 else 6
        candidate = Paste(
            slug=make_slug(slug_len),
            title=body.title,
            content=body.content,
            language=body.language,
            visibility=body.visibility,
            password_hash=pw_hash,
            burn_after_read=body.burn_after_read,
            expires_at=_expires_at(body.expires_in),
            owner_token=owner,
        )
        db.add(candidate)
        try:
            await db.commit()
            paste = candidate
            break
        except IntegrityError as e:
            last_err = e
            await db.rollback()
            continue

    if paste is None:
        raise HTTPException(status_code=500, detail=f"could not allocate slug: {last_err}")

    return PasteCreated(
        slug=paste.slug,
        url=f"mepaste.to/{paste.slug}",
        expires_at=paste.expires_at,
    )


async def _load_for_read(
    slug: str,
    password: str | None,
    owner_token: str | None,
    db: AsyncSession,
) -> Paste:
    row = (await db.execute(select(Paste).where(Paste.slug == slug))).scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=404, detail="not_found")
    if row.burned:
        raise HTTPException(status_code=410, detail={"reason": "burned"})
    if _is_expired(row):
        raise HTTPException(status_code=410, detail={"reason": "wilted"})
    if row.password_hash is not None:
        # owners can always read their own paste without password
        is_owner = bool(owner_token) and owner_token == row.owner_token
        if not is_owner:
            if not password or not verify_password(password, row.password_hash):
                raise HTTPException(
                    status_code=401,
                    detail={"password_required": True},
                )
    return row


async def _record_read(row: Paste, owner_token: str | None, db: AsyncSession) -> None:
    """Increment view count, and burn the paste if burn_after_read is set and reader is not the owner."""
    row.view_count = row.view_count + 1
    is_owner = bool(owner_token) and owner_token == row.owner_token
    if row.burn_after_read and not is_owner:
        row.burned = True
    await db.commit()


@router.get("/{slug}", response_model=PasteOut)
async def get_paste(
    slug: str,
    password: str | None = Query(default=None),
    x_owner_token: str | None = Header(default=None, alias="X-Owner-Token"),
    db: AsyncSession = Depends(get_session),
) -> PasteOut:
    row = await _load_for_read(slug, password, x_owner_token, db)
    is_owner = bool(x_owner_token) and x_owner_token == row.owner_token
    # capture before mutation
    out = PasteOut(
        slug=row.slug,
        title=row.title,
        content=row.content,
        language=row.language,
        visibility=row.visibility,  # type: ignore[arg-type]
        burn_after_read=row.burn_after_read,
        expires_at=row.expires_at,
        view_count=row.view_count + 1,
        created_at=row.created_at,
        is_owner=is_owner,
    )
    await _record_read(row, x_owner_token, db)
    return out


@router.get("/{slug}/raw", response_class=Response)
async def get_paste_raw(
    slug: str,
    password: str | None = Query(default=None),
    x_owner_token: str | None = Header(default=None, alias="X-Owner-Token"),
    db: AsyncSession = Depends(get_session),
) -> Response:
    row = await _load_for_read(slug, password, x_owner_token, db)
    body = row.content
    await _record_read(row, x_owner_token, db)
    return Response(content=body, media_type="text/plain; charset=utf-8")


@router.get("", response_model=list[PasteListItem])
async def list_pastes(
    q: str | None = Query(default=None),
    visibility: Visibility | None = Query(default=None),
    x_owner_token: str | None = Header(default=None, alias="X-Owner-Token"),
    db: AsyncSession = Depends(get_session),
) -> list[PasteListItem]:
    owner = _require_owner(x_owner_token)
    stmt = select(Paste).where(Paste.owner_token == owner).order_by(Paste.created_at.desc())
    if visibility:
        stmt = stmt.where(Paste.visibility == visibility)
    if q:
        like = f"%{q}%"
        stmt = stmt.where(or_(Paste.title.ilike(like), Paste.content.ilike(like)))
    rows = (await db.execute(stmt.limit(100))).scalars().all()
    return [
        PasteListItem(
            slug=r.slug,
            title=r.title,
            snippet=_snippet(r.content),
            language=r.language,
            visibility=r.visibility,  # type: ignore[arg-type]
            burn_after_read=r.burn_after_read,
            expires_at=r.expires_at,
            created_at=r.created_at,
        )
        for r in rows
        if not r.burned
    ]


@router.delete("/{slug}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_paste(
    slug: str,
    x_owner_token: str | None = Header(default=None, alias="X-Owner-Token"),
    db: AsyncSession = Depends(get_session),
) -> Response:
    owner = _require_owner(x_owner_token)
    row = (await db.execute(select(Paste).where(Paste.slug == slug))).scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=404, detail="not_found")
    if row.owner_token != owner:
        raise HTTPException(status_code=403, detail="not_yours")
    await db.delete(row)
    await db.commit()
    return Response(status_code=204)
