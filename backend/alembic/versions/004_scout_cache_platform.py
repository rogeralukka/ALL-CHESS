"""Scout cache platform column

Revision ID: 004
Revises: 003
Create Date: 2026-10-27 00:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '004'
down_revision: Union[str, None] = '003'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)

    cols = {c["name"] for c in inspector.get_columns("scout_cache")}
    with op.batch_alter_table("scout_cache") as batch_op:
        if "platform" not in cols:
            batch_op.add_column(
                sa.Column("platform", sa.String(length=16), nullable=False, server_default="chesscom")
            )


def downgrade() -> None:
    with op.batch_alter_table("scout_cache") as batch_op:
        batch_op.drop_column("platform")
