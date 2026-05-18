"""init pastes table

Revision ID: 0001
Revises:
Create Date: 2026-05-15

"""
from __future__ import annotations

from alembic import op
import sqlalchemy as sa


revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "pastes",
        sa.Column("id", sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("slug", sa.String(length=12), nullable=False, unique=True),
        sa.Column("title", sa.String(length=200), nullable=True),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("language", sa.String(length=20), nullable=False, server_default="plain"),
        sa.Column("visibility", sa.String(length=10), nullable=False, server_default="public"),
        sa.Column("password_hash", sa.String(length=200), nullable=True),
        sa.Column("burn_after_read", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("burned", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("view_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("owner_token", sa.String(length=64), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_pastes_slug", "pastes", ["slug"])
    op.create_index("ix_pastes_owner_token", "pastes", ["owner_token"])
    op.create_index("ix_pastes_expires_at", "pastes", ["expires_at"])


def downgrade() -> None:
    op.drop_index("ix_pastes_expires_at", table_name="pastes")
    op.drop_index("ix_pastes_owner_token", table_name="pastes")
    op.drop_index("ix_pastes_slug", table_name="pastes")
    op.drop_table("pastes")
