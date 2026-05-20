from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

Visibility = Literal["public", "private"]
ExpiresIn = Literal["10m", "1h", "1d", "1w", "never"]


class PasteCreate(BaseModel):
    title: str | None = Field(default=None, max_length=200)
    content: str = Field(..., min_length=1, max_length=200_000)
    language: str = Field(default="plain", max_length=20)
    visibility: Visibility = "public"
    expires_in: ExpiresIn = "1d"
    password: str | None = Field(default=None, max_length=200)
    burn_after_read: bool = False


class PasteCreated(BaseModel):
    slug: str
    url: str
    expires_at: datetime | None


class PasteOut(BaseModel):
    slug: str
    title: str | None
    content: str
    language: str
    visibility: Visibility
    burn_after_read: bool
    expires_at: datetime | None
    view_count: int
    created_at: datetime
    is_owner: bool


class PasteListItem(BaseModel):
    slug: str
    title: str | None
    snippet: str
    language: str
    visibility: Visibility
    burn_after_read: bool
    expires_at: datetime | None
    created_at: datetime
