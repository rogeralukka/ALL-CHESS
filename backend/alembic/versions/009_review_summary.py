"""Add review_summary to games

Revision ID: 009
Revises: 008
Create Date: 2026-11-01 23:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '009'
down_revision: Union[str, None] = '008'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)

    cols = {c["name"] for c in inspector.get_columns("games")}
    with op.batch_alter_table("games") as batch_op:
        if "review_summary" not in cols:
            batch_op.add_column(sa.Column("review_summary", sa.JSON(), nullable=True))


def downgrade() -> None:
    with op.batch_alter_table("games") as batch_op:
        batch_op.drop_column("review_summary")
