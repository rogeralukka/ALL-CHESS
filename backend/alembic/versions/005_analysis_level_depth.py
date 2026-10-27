"""Add analysis_level and analysis_depth to games

Revision ID: 005
Revises: 004
Create Date: 2026-10-27 11:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '005'
down_revision: Union[str, None] = '004'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)

    cols = {c["name"] for c in inspector.get_columns("games")}
    with op.batch_alter_table("games") as batch_op:
        if "analysis_level" not in cols:
            batch_op.add_column(
                sa.Column("analysis_level", sa.String(length=32), nullable=True)
            )
        if "analysis_depth" not in cols:
            batch_op.add_column(
                sa.Column("analysis_depth", sa.Integer(), nullable=True)
            )


def downgrade() -> None:
    with op.batch_alter_table("games") as batch_op:
        batch_op.drop_column("analysis_depth")
        batch_op.drop_column("analysis_level")
