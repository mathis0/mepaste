"""users table + pastes.user_id

Revision ID: 0002
Revises: 0001
Create Date: 2026-05-18

"""
from __future__ import annotations

from alembic import op
import sqlalchemy as sa


revision = "0002"
down_revision = "0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("email", sa.String(length=200), nullable=False, unique=True),
        sa.Column("password_hash", sa.String(length=200), nullable=False),
        sa.Column("name", sa.String(length=80), nullable=True),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()
        ),
    )
    op.create_index("ix_users_email", "users", ["email"])
    op.add_column(
        "pastes",
        sa.Column("user_id", sa.BigInteger(), nullable=True),
    )
    op.create_index("ix_pastes_user_id", "pastes", ["user_id"])
    op.create_foreign_key(
        "fk_pastes_user_id_users",
        "pastes",
        "users",
        ["user_id"],
        ["id"],
        ondelete="SET NULL",
    )


def downgrade() -> None:
    op.drop_constraint("fk_pastes_user_id_users", "pastes", type_="foreignkey")
    op.drop_index("ix_pastes_user_id", table_name="pastes")
    op.drop_column("pastes", "user_id")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")
