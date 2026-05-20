from __future__ import annotations

from datetime import datetime

from fastapi import APIRouter, Depends, Header, HTTPException, Response, status
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from ..auth import current_user, issue_token
from ..db import get_session
from ..models import User
from ..security import hash_password, verify_password


router = APIRouter(prefix="/api/auth", tags=["auth"])


class SignUpIn(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=200)
    name: str | None = Field(default=None, max_length=80)


class SignInIn(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1, max_length=200)


class UserOut(BaseModel):
    id: int
    email: str
    name: str | None
    created_at: datetime


class AuthOut(BaseModel):
    user: UserOut
    token: str


def _user_out(u: User) -> UserOut:
    return UserOut(id=u.id, email=u.email, name=u.name, created_at=u.created_at)


@router.post("/signup", response_model=AuthOut, status_code=status.HTTP_201_CREATED)
async def signup(body: SignUpIn, db: AsyncSession = Depends(get_session)) -> AuthOut:
    email = body.email.lower()
    user = User(email=email, password_hash=hash_password(body.password), name=body.name)
    db.add(user)
    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=409, detail="email_taken")
    await db.refresh(user)
    return AuthOut(user=_user_out(user), token=issue_token(user.id))


@router.post("/signin", response_model=AuthOut)
async def signin(body: SignInIn, db: AsyncSession = Depends(get_session)) -> AuthOut:
    email = body.email.lower()
    user = (await db.execute(select(User).where(User.email == email))).scalar_one_or_none()
    if user is None or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail="bad_credentials")
    return AuthOut(user=_user_out(user), token=issue_token(user.id))


@router.get("/me", response_model=UserOut)
async def me(
    authorization: str | None = Header(default=None),
    db: AsyncSession = Depends(get_session),
) -> UserOut:
    user = await current_user(authorization, db)
    if user is None:
        raise HTTPException(status_code=401, detail="auth_required")
    return _user_out(user)


@router.post("/signout", status_code=status.HTTP_204_NO_CONTENT)
async def signout() -> Response:
    # Tokens are stateless JWTs — client just discards. Endpoint exists so the
    # frontend can call it before clearing local state, and so we have a hook
    # for future revocation lists.
    return Response(status_code=204)


@router.get("/google", status_code=status.HTTP_501_NOT_IMPLEMENTED)
async def google_oauth() -> dict:
    raise HTTPException(status_code=501, detail="oauth_coming_soon")


@router.get("/apple", status_code=status.HTTP_501_NOT_IMPLEMENTED)
async def apple_oauth() -> dict:
    raise HTTPException(status_code=501, detail="oauth_coming_soon")
