from __future__ import annotations

import os
from datetime import datetime, timedelta, timezone

import jwt
from fastapi import Header, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .models import User


JWT_SECRET = os.environ.get("JWT_SECRET", "dev-only-secret-please-change")
JWT_ALG = "HS256"
JWT_TTL = timedelta(days=30)


def issue_token(user_id: int) -> str:
    now = datetime.now(timezone.utc)
    payload = {"sub": str(user_id), "iat": int(now.timestamp()), "exp": int((now + JWT_TTL).timestamp())}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)


def _decode(token: str) -> int | None:
    try:
        data = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
        return int(data["sub"])
    except Exception:
        return None


def _bearer_token(header: str | None) -> str | None:
    if not header:
        return None
    parts = header.split(" ", 1)
    if len(parts) != 2 or parts[0].lower() != "bearer":
        return None
    return parts[1].strip() or None


async def current_user(
    authorization: str | None = Header(default=None),
    db: AsyncSession | None = None,
) -> User | None:
    """Resolve the bearer token to a User. Returns None if absent/invalid.
    Callers that require an authenticated user should raise their own 401."""
    token = _bearer_token(authorization)
    if not token:
        return None
    uid = _decode(token)
    if uid is None or db is None:
        return None
    return (await db.execute(select(User).where(User.id == uid))).scalar_one_or_none()


async def require_user(user: User | None) -> User:
    if user is None:
        raise HTTPException(status_code=401, detail="auth_required")
    return user
