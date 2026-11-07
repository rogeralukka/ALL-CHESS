"""Add extended Lichess puzzle fields, puzzle_themes table, and attempt flags

Revision ID: 010
Revises: 009
Create Date: 2026-11-07 17:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '010'
down_revision: Union[str, None] = '009'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)

    # 1. Update puzzles table
    puzzles_cols = {c["name"] for c in inspector.get_columns("puzzles")}
    with op.batch_alter_table("puzzles") as batch_op:
        if "solution_uci" not in puzzles_cols:
            batch_op.add_column(sa.Column("solution_uci", sa.JSON(), nullable=True))
        if "setup_move_uci" not in puzzles_cols:
            batch_op.add_column(sa.Column("setup_move_uci", sa.String(16), nullable=True))
        if "popularity" not in puzzles_cols:
            batch_op.add_column(sa.Column("popularity", sa.Integer(), nullable=False, server_default=sa.text("100")))
        if "nb_plays" not in puzzles_cols:
            batch_op.add_column(sa.Column("nb_plays", sa.Integer(), nullable=False, server_default=sa.text("0")))
        if "game_url" not in puzzles_cols:
            batch_op.add_column(sa.Column("game_url", sa.String(256), nullable=True))
        if "opening_tags" not in puzzles_cols:
            batch_op.add_column(sa.Column("opening_tags", sa.JSON(), nullable=True))
        if "import_run" not in puzzles_cols:
            batch_op.add_column(sa.Column("import_run", sa.String(64), nullable=True))
            batch_op.create_index("ix_puzzles_import_run", ["import_run"])

    # 2. Create puzzle_themes table if not exists
    tables = inspector.get_table_names()
    if "puzzle_themes" not in tables:
        op.create_table(
            "puzzle_themes",
            sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
            sa.Column("puzzle_id", sa.String(64), sa.ForeignKey("puzzles.id", ondelete="CASCADE"), nullable=False),
            sa.Column("theme", sa.String(64), nullable=False),
        )
        op.create_index("ix_puzzle_themes_puzzle_id", "puzzle_themes", ["puzzle_id"])
        op.create_index("ix_puzzle_themes_theme", "puzzle_themes", ["theme"])
        op.create_index("ix_puzzle_themes_theme_puzzle_id", "puzzle_themes", ["theme", "puzzle_id"])

    # 3. Update puzzle_attempts table
    attempts_cols = {c["name"] for c in inspector.get_columns("puzzle_attempts")}
    with op.batch_alter_table("puzzle_attempts") as batch_op:
        if "used_hint" not in attempts_cols:
            batch_op.add_column(sa.Column("used_hint", sa.Boolean(), nullable=False, server_default=sa.false()))
        if "is_repeat" not in attempts_cols:
            batch_op.add_column(sa.Column("is_repeat", sa.Boolean(), nullable=False, server_default=sa.false()))
        batch_op.create_index("ix_puzzle_attempts_user_puzzle", ["user_id", "puzzle_id"])


def downgrade() -> None:
    with op.batch_alter_table("puzzle_attempts") as batch_op:
        batch_op.drop_index("ix_puzzle_attempts_user_puzzle")
        batch_op.drop_column("is_repeat")
        batch_op.drop_column("used_hint")

    op.drop_table("puzzle_themes")

    with op.batch_alter_table("puzzles") as batch_op:
        batch_op.drop_index("ix_puzzles_import_run")
        batch_op.drop_column("import_run")
        batch_op.drop_column("opening_tags")
        batch_op.drop_column("game_url")
        batch_op.drop_column("nb_plays")
        batch_op.drop_column("popularity")
        batch_op.drop_column("setup_move_uci")
        batch_op.drop_column("solution_uci")
