"""User avatar and country

Revision ID: 003
Revises: 002
Create Date: 2026-10-26 23:55:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '003'
down_revision: Union[str, None] = '002'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)

    user_cols = {c["name"] for c in inspector.get_columns("users")}
    with op.batch_alter_table("users") as batch_op:
        if "avatar_url" not in user_cols:
            batch_op.add_column(
                sa.Column("avatar_url", sa.String(length=512), nullable=True)
            )
        if "country_code" not in user_cols:
            batch_op.add_column(
                sa.Column("country_code", sa.String(length=8), nullable=True)
            )


def downgrade() -> None:
    with op.batch_alter_table("users") as batch_op:
        batch_op.drop_column("country_code")
        batch_op.drop_column("avatar_url")
