"""Phase 2 columns

Revision ID: 002
Revises: 001
Create Date: 2026-10-26 11:56:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '002'
down_revision: Union[str, None] = '001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)

    # 1. Update users table
    user_cols = {c["name"] for c in inspector.get_columns("users")}
    with op.batch_alter_table("users") as batch_op:
        if "chesscom_backfill_done" not in user_cols:
            batch_op.add_column(
                sa.Column("chesscom_backfill_done", sa.Boolean(), nullable=False, server_default=sa.text("0"))
            )
        if "lichess_backfill_done" not in user_cols:
            batch_op.add_column(
                sa.Column("lichess_backfill_done", sa.Boolean(), nullable=False, server_default=sa.text("0"))
            )

    # 2. Update analysis_jobs table
    job_cols = {c["name"] for c in inspector.get_columns("analysis_jobs")}
    with op.batch_alter_table("analysis_jobs") as batch_op:
        if "job_type" not in job_cols:
            batch_op.add_column(
                sa.Column("job_type", sa.String(length=32), nullable=False, server_default="analysis")
            )
        if "result" not in job_cols:
            batch_op.add_column(
                sa.Column("result", sa.JSON(), nullable=True)
            )
        batch_op.alter_column(
            "game_id",
            existing_type=sa.String(length=64),
            nullable=True
        )


def downgrade() -> None:
    with op.batch_alter_table("analysis_jobs") as batch_op:
        batch_op.alter_column(
            "game_id",
            existing_type=sa.String(length=64),
            nullable=False
        )
        batch_op.drop_column("result")
        batch_op.drop_column("job_type")

    with op.batch_alter_table("users") as batch_op:
        batch_op.drop_column("lichess_backfill_done")
        batch_op.drop_column("chesscom_backfill_done")
