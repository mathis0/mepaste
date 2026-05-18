from __future__ import annotations

import re
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, Header, HTTPException, Query, Response, status
from pydantic import BaseModel
from sqlalchemy import or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from ..auth import current_user
from ..db import get_session
from ..models import Paste, User
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
    now = datetime.now(timezone.utc)
    if kind == "10m":
        return now + timedelta(minutes=10)
    if kind == "1h":
        return now + timedelta(hours=1)
    if kind == "1d":
        return now + timedelta(days=1)
    if kind == "1w":
        return now + timedelta(weeks=1)
    return None


def _require_owner(x_owner_token: str | None) -> str:
    if not x_owner_token or not _OWNER_RE.match(x_owner_token):
        raise HTTPException(status_code=400, detail="missing or invalid X-Owner-Token")
    return x_owner_token


def _is_expired(p: Paste) -> bool:
    return p.expires_at is not None and p.expires_at <= datetime.now(timezone.utc)


def _is_owner(row: Paste, owner_token: str | None, user: User | None) -> bool:
    if user is not None and row.user_id == user.id:
        return True
    if owner_token and owner_token == row.owner_token:
        return True
    return False


def _snippet(content: str, n: int = 80) -> str:
    one_line = content.replace("\n", " ").strip()
    return one_line[:n]


@router.post("", response_model=PasteCreated, status_code=status.HTTP_201_CREATED)
async def create_paste(
    body: PasteCreate,
    x_owner_token: str | None = Header(default=None, alias="X-Owner-Token"),
    authorization: str | None = Header(default=None),
    db: AsyncSession = Depends(get_session),
) -> PasteCreated:
    owner = _require_owner(x_owner_token)
    user = await current_user(authorization, db)

    # Anonymous visitors can't ship a private paste — that's a logged-in feature.
    if body.visibility == "private" and user is None:
        raise HTTPException(status_code=403, detail="private_requires_account")

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
            user_id=user.id if user else None,
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
    user: User | None,
    db: AsyncSession,
) -> Paste:
    row = (await db.execute(select(Paste).where(Paste.slug == slug))).scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=404, detail="not_found")
    if row.burned:
        raise HTTPException(status_code=410, detail={"reason": "burned"})
    if _is_expired(row):
        raise HTTPException(status_code=410, detail={"reason": "wilted"})
    if row.password_hash is not None and not _is_owner(row, owner_token, user):
        if not password or not verify_password(password, row.password_hash):
            raise HTTPException(status_code=401, detail={"password_required": True})
    return row


async def _record_read(
    row: Paste, owner_token: str | None, user: User | None, db: AsyncSession
) -> None:
    row.view_count = row.view_count + 1
    if row.burn_after_read and not _is_owner(row, owner_token, user):
        row.burned = True
    await db.commit()


class PasteMeta(BaseModel):
    slug: str
    title: str | None
    language: str
    visibility: Visibility
    burn_after_read: bool
    has_password: bool
    is_owner: bool
    expires_at: datetime | None
    created_at: datetime
    line_count: int


@router.get("/{slug}/meta", response_model=PasteMeta)
async def get_paste_meta(
    slug: str,
    x_owner_token: str | None = Header(default=None, alias="X-Owner-Token"),
    authorization: str | None = Header(default=None),
    db: AsyncSession = Depends(get_session),
) -> PasteMeta:
    """Peek at a paste without revealing content or burning it.
    Lets the frontend decide between password gate / burn warning / direct view."""
    row = (await db.execute(select(Paste).where(Paste.slug == slug))).scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=404, detail="not_found")
    if row.burned:
        raise HTTPException(status_code=410, detail={"reason": "burned"})
    if _is_expired(row):
        raise HTTPException(status_code=410, detail={"reason": "wilted"})
    user = await current_user(authorization, db)
    return PasteMeta(
        slug=row.slug,
        title=row.title,
        language=row.language,
        visibility=row.visibility,  # type: ignore[arg-type]
        burn_after_read=row.burn_after_read,
        has_password=row.password_hash is not None,
        is_owner=_is_owner(row, x_owner_token, user),
        expires_at=row.expires_at,
        created_at=row.created_at,
        line_count=row.content.count("\n") + 1,
    )


@router.get("/{slug}", response_model=PasteOut)
async def get_paste(
    slug: str,
    password: str | None = Query(default=None),
    x_owner_token: str | None = Header(default=None, alias="X-Owner-Token"),
    authorization: str | None = Header(default=None),
    db: AsyncSession = Depends(get_session),
) -> PasteOut:
    user = await current_user(authorization, db)
    row = await _load_for_read(slug, password, x_owner_token, user, db)
    is_owner = _is_owner(row, x_owner_token, user)
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
    await _record_read(row, x_owner_token, user, db)
    return out


@router.get("/{slug}/raw", response_class=Response)
async def get_paste_raw(
    slug: str,
    password: str | None = Query(default=None),
    x_owner_token: str | None = Header(default=None, alias="X-Owner-Token"),
    authorization: str | None = Header(default=None),
    db: AsyncSession = Depends(get_session),
) -> Response:
    user = await current_user(authorization, db)
    row = await _load_for_read(slug, password, x_owner_token, user, db)
    body = row.content
    await _record_read(row, x_owner_token, user, db)
    return Response(content=body, media_type="text/plain; charset=utf-8")


@router.get("", response_model=list[PasteListItem])
async def list_pastes(
    q: str | None = Query(default=None),
    visibility: Visibility | None = Query(default=None),
    x_owner_token: str | None = Header(default=None, alias="X-Owner-Token"),
    authorization: str | None = Header(default=None),
    db: AsyncSession = Depends(get_session),
) -> list[PasteListItem]:
    owner = _require_owner(x_owner_token)
    user = await current_user(authorization, db)
    # Logged-in users see every paste tied to their account, plus anything
    # this browser owns. Anonymous users see only this browser's pastes.
    if user is not None:
        ownership = or_(Paste.owner_token == owner, Paste.user_id == user.id)
    else:
        ownership = Paste.owner_token == owner
    stmt = select(Paste).where(ownership).order_by(Paste.created_at.desc())
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
    authorization: str | None = Header(default=None),
    db: AsyncSession = Depends(get_session),
) -> Response:
    owner = _require_owner(x_owner_token)
    user = await current_user(authorization, db)
    row = (await db.execute(select(Paste).where(Paste.slug == slug))).scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=404, detail="not_found")
    if not _is_owner(row, owner, user):
        raise HTTPException(status_code=403, detail="not_yours")
    await db.delete(row)
    await db.commit()
    return Response(status_code=204)
