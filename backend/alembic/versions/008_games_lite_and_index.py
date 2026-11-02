"""Add move_count, ends_in_mate and ix_games_user_id_date to games

Revision ID: 008
Revises: 007
Create Date: 2026-11-02 10:20:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '008'
down_revision: Union[str, None] = '007'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)

    cols = {c["name"] for c in inspector.get_columns("games")}
    indexes = {ix["name"] for ix in inspector.get_indexes("games")}

    with op.batch_alter_table("games") as batch_op:
        if "move_count" not in cols:
            batch_op.add_column(sa.Column("move_count", sa.Integer(), nullable=True))
        if "ends_in_mate" not in cols:
            batch_op.add_column(sa.Column("ends_in_mate", sa.Boolean(), nullable=True, server_default=sa.false()))
        if "ix_games_user_id_date" not in indexes:
            batch_op.create_index("ix_games_user_id_date", ["user_id", "date"])

    # Fill the new columns for the games that already exist, so the lite list never has to load their moves
    import json

    rows = conn.execute(sa.text("SELECT id, moves FROM games WHERE move_count IS NULL")).fetchall()
    for game_id, moves in rows:
        if isinstance(moves, (str, bytes)):
            try:
                moves = json.loads(moves)
            except ValueError:
                moves = []
        moves = moves if isinstance(moves, list) else []
        last = moves[-1].get("san", "") if moves and isinstance(moves[-1], dict) else ""
        conn.execute(
            sa.text("UPDATE games SET move_count = :mc, ends_in_mate = :em WHERE id = :id"),
            {"mc": len(moves), "em": bool(last.endswith("#")), "id": game_id},
        )


def downgrade() -> None:
    with op.batch_alter_table("games") as batch_op:
        batch_op.drop_index("ix_games_user_id_date")
        batch_op.drop_column("ends_in_mate")
        batch_op.drop_column("move_count")
