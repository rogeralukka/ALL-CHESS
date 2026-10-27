"""Add termination to games

Revision ID: 006
Revises: 005
Create Date: 2026-10-27 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '006'
down_revision: Union[str, None] = '005'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)

    cols = {c["name"] for c in inspector.get_columns("games")}
    with op.batch_alter_table("games") as batch_op:
        if "termination" not in cols:
            batch_op.add_column(
                sa.Column("termination", sa.String(length=128), nullable=True)
            )


def downgrade() -> None:
    with op.batch_alter_table("games") as batch_op:
        batch_op.drop_column("termination")
