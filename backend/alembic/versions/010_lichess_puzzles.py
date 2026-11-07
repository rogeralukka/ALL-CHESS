"""Add extended Lichess puzzle fields, puzzle_themes table, and attempt flags

Revision ID: 010
Revises: 009
Create Date: 2026-11-07 17:30:00.000000

"""
import json
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

    # 2. Create puzzle_themes table if not exists (composite PK puzzle_id + theme)
    tables = inspector.get_table_names()
    if "puzzle_themes" not in tables:
        op.create_table(
            "puzzle_themes",
            sa.Column("puzzle_id", sa.String(64), sa.ForeignKey("puzzles.id", ondelete="CASCADE"), primary_key=True, nullable=False),
            sa.Column("theme", sa.String(64), primary_key=True, nullable=False),
        )
        op.create_index("ix_puzzle_themes_theme_puzzle_id", "puzzle_themes", ["theme", "puzzle_id"])

    # 2b. Backfill existing puzzles into puzzle_themes from puzzles.theme JSON column
    puzzles_table = sa.table(
        "puzzles",
        sa.column("id", sa.String),
        sa.column("theme", sa.JSON),
    )
    puzzle_themes_table = sa.table(
        "puzzle_themes",
        sa.column("puzzle_id", sa.String),
        sa.column("theme", sa.String),
    )

    try:
        existing_puzzles = conn.execute(sa.select(puzzles_table.c.id, puzzles_table.c.theme)).fetchall()
        backfill_rows = []
        seen = set()
        for row in existing_puzzles:
            pid = row[0]
            raw_theme = row[1]
            themes = []
            if isinstance(raw_theme, list):
                themes = raw_theme
            elif isinstance(raw_theme, str):
                try:
                    parsed = json.loads(raw_theme)
                    if isinstance(parsed, list):
                        themes = parsed
                    else:
                        themes = raw_theme.split()
                except Exception:
                    themes = raw_theme.split()
            for t in themes:
                t_clean = str(t).strip()
                if t_clean and (pid, t_clean) not in seen:
                    seen.add((pid, t_clean))
                    backfill_rows.append({"puzzle_id": pid, "theme": t_clean})

        if backfill_rows:
            existing_pairs = {
                (r[0], r[1])
                for r in conn.execute(sa.select(puzzle_themes_table.c.puzzle_id, puzzle_themes_table.c.theme)).fetchall()
            }
            to_insert = [r for r in backfill_rows if (r["puzzle_id"], r["theme"]) not in existing_pairs]
            if to_insert:
                op.bulk_insert(puzzle_themes_table, to_insert)
    except Exception:
        # If puzzles table is empty or uninitialized during initial tests
        pass

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
