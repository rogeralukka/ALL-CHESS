"""Initial schema

Revision ID: 001
Revises: 
Create Date: 2026-10-26 11:55:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    existing_tables = set(inspector.get_table_names())

    if "users" not in existing_tables:
        op.create_table(
            "users",
            sa.Column("id", sa.String(length=36), primary_key=True),
            sa.Column("username", sa.String(length=64), nullable=False),
            sa.Column("chesscom_username", sa.String(length=64), nullable=True),
            sa.Column("lichess_username", sa.String(length=64), nullable=True),
            sa.Column("created_at", sa.DateTime(), nullable=False),
        )
        op.create_index("ix_users_username", "users", ["username"], unique=True)

    if "games" not in existing_tables:
        op.create_table(
            "games",
            sa.Column("id", sa.String(length=64), primary_key=True),
            sa.Column("user_id", sa.String(length=36), sa.ForeignKey("users.id"), nullable=False),
            sa.Column("source", sa.String(length=32), nullable=False, server_default="online"),
            sa.Column("platform", sa.String(length=32), nullable=True),
            sa.Column("external_id", sa.String(length=128), nullable=True),
            sa.Column("pgn", sa.Text(), nullable=False),
            sa.Column("white", sa.JSON(), nullable=False),
            sa.Column("black", sa.JSON(), nullable=False),
            sa.Column("result", sa.String(length=16), nullable=False),
            sa.Column("date", sa.String(length=64), nullable=False),
            sa.Column("time_control", sa.String(length=32), nullable=False),
            sa.Column("speed", sa.String(length=16), nullable=False),
            sa.Column("opening", sa.JSON(), nullable=False),
            sa.Column("moves", sa.JSON(), nullable=False),
            sa.Column("is_user_white", sa.Boolean(), nullable=False, server_default=sa.text("1")),
            sa.Column("accuracy", sa.JSON(), nullable=True),
            sa.Column("estimated_rating", sa.JSON(), nullable=True),
            sa.Column("phase_grades", sa.JSON(), nullable=True),
            sa.Column("created_at", sa.DateTime(), nullable=False),
        )
        op.create_index("ix_games_user_id", "games", ["user_id"])
        op.create_index("ix_games_external_id", "games", ["external_id"])

    if "game_analysis" not in existing_tables:
        op.create_table(
            "game_analysis",
            sa.Column("id", sa.String(length=36), primary_key=True),
            sa.Column("game_id", sa.String(length=64), sa.ForeignKey("games.id"), nullable=False),
            sa.Column("depth", sa.Integer(), nullable=False, server_default="16"),
            sa.Column("analysis_data", sa.JSON(), nullable=False),
            sa.Column("cached_at", sa.DateTime(), nullable=False),
        )
        op.create_index("ix_game_analysis_game_id", "game_analysis", ["game_id"])

    if "analysis_jobs" not in existing_tables:
        op.create_table(
            "analysis_jobs",
            sa.Column("id", sa.String(length=36), primary_key=True),
            sa.Column("user_id", sa.String(length=36), sa.ForeignKey("users.id"), nullable=False),
            sa.Column("game_id", sa.String(length=64), sa.ForeignKey("games.id"), nullable=False),
            sa.Column("status", sa.String(length=32), nullable=False, server_default="queued"),
            sa.Column("progress", sa.Integer(), nullable=False, server_default="0"),
            sa.Column("error_message", sa.Text(), nullable=True),
            sa.Column("created_at", sa.DateTime(), nullable=False),
            sa.Column("updated_at", sa.DateTime(), nullable=False),
        )
        op.create_index("ix_analysis_jobs_user_id", "analysis_jobs", ["user_id"])
        op.create_index("ix_analysis_jobs_game_id", "analysis_jobs", ["game_id"])

    if "puzzles" not in existing_tables:
        op.create_table(
            "puzzles",
            sa.Column("id", sa.String(length=64), primary_key=True),
            sa.Column("fen", sa.String(length=128), nullable=False),
            sa.Column("solution", sa.JSON(), nullable=False),
            sa.Column("rating", sa.Integer(), nullable=False),
            sa.Column("theme", sa.JSON(), nullable=False),
            sa.Column("goal", sa.Text(), nullable=False),
        )
        op.create_index("ix_puzzles_rating", "puzzles", ["rating"])

    if "puzzle_attempts" not in existing_tables:
        op.create_table(
            "puzzle_attempts",
            sa.Column("id", sa.String(length=36), primary_key=True),
            sa.Column("user_id", sa.String(length=36), sa.ForeignKey("users.id"), nullable=False),
            sa.Column("puzzle_id", sa.String(length=64), sa.ForeignKey("puzzles.id"), nullable=False),
            sa.Column("solved", sa.Boolean(), nullable=False),
            sa.Column("time_seconds", sa.Integer(), nullable=False, server_default="0"),
            sa.Column("rating_delta", sa.Integer(), nullable=False, server_default="0"),
            sa.Column("created_at", sa.DateTime(), nullable=False),
        )
        op.create_index("ix_puzzle_attempts_user_id", "puzzle_attempts", ["user_id"])
        op.create_index("ix_puzzle_attempts_puzzle_id", "puzzle_attempts", ["puzzle_id"])

    if "user_puzzle_ratings" not in existing_tables:
        op.create_table(
            "user_puzzle_ratings",
            sa.Column("id", sa.String(length=36), primary_key=True),
            sa.Column("user_id", sa.String(length=36), sa.ForeignKey("users.id"), nullable=False),
            sa.Column("rating", sa.Integer(), nullable=False, server_default="650"),
            sa.Column("streak", sa.Integer(), nullable=False, server_default="0"),
            sa.Column("best_streak", sa.Integer(), nullable=False, server_default="0"),
            sa.Column("last_attempt_date", sa.String(length=32), nullable=True),
        )
        op.create_index("ix_user_puzzle_ratings_user_id", "user_puzzle_ratings", ["user_id"], unique=True)

    if "lesson_progress" not in existing_tables:
        op.create_table(
            "lesson_progress",
            sa.Column("id", sa.String(length=36), primary_key=True),
            sa.Column("user_id", sa.String(length=36), sa.ForeignKey("users.id"), nullable=False),
            sa.Column("stage_id", sa.String(length=64), nullable=False),
            sa.Column("status", sa.String(length=32), nullable=False, server_default="locked"),
            sa.Column("xp", sa.Integer(), nullable=False, server_default="0"),
            sa.Column("stars", sa.Integer(), nullable=False, server_default="0"),
            sa.Column("last_completed_at", sa.DateTime(), nullable=True),
            sa.UniqueConstraint("user_id", "stage_id", name="uq_user_stage"),
        )
        op.create_index("ix_lesson_progress_user_id", "lesson_progress", ["user_id"])
        op.create_index("ix_lesson_progress_stage_id", "lesson_progress", ["stage_id"])

    if "user_streaks" not in existing_tables:
        op.create_table(
            "user_streaks",
            sa.Column("id", sa.String(length=36), primary_key=True),
            sa.Column("user_id", sa.String(length=36), sa.ForeignKey("users.id"), nullable=False),
            sa.Column("current_streak", sa.Integer(), nullable=False, server_default="1"),
            sa.Column("longest_streak", sa.Integer(), nullable=False, server_default="1"),
            sa.Column("last_active_date", sa.String(length=32), nullable=False),
        )
        op.create_index("ix_user_streaks_user_id", "user_streaks", ["user_id"], unique=True)

    if "friends" not in existing_tables:
        op.create_table(
            "friends",
            sa.Column("id", sa.String(length=36), primary_key=True),
            sa.Column("user_id", sa.String(length=36), sa.ForeignKey("users.id"), nullable=False),
            sa.Column("username", sa.String(length=64), nullable=False),
            sa.Column("platform", sa.String(length=32), nullable=False, server_default="chesscom"),
            sa.Column("rating", sa.Integer(), nullable=False, server_default="900"),
            sa.Column("ratings", sa.JSON(), nullable=True),
            sa.Column("online", sa.Boolean(), nullable=False, server_default=sa.text("0")),
            sa.Column("avatar_url", sa.String(length=256), nullable=True),
            sa.Column("last_active", sa.String(length=64), nullable=False, server_default="Recently"),
            sa.Column("updated_at", sa.DateTime(), nullable=False),
        )
        op.create_index("ix_friends_user_id", "friends", ["user_id"])

    if "scout_cache" not in existing_tables:
        op.create_table(
            "scout_cache",
            sa.Column("id", sa.String(length=36), primary_key=True),
            sa.Column("username", sa.String(length=64), nullable=False),
            sa.Column("profile_json", sa.JSON(), nullable=False),
            sa.Column("cached_at", sa.DateTime(), nullable=False),
            sa.Column("expires_at", sa.DateTime(), nullable=False),
        )
        op.create_index("ix_scout_cache_username", "scout_cache", ["username"])

    if "coach_cache" not in existing_tables:
        op.create_table(
            "coach_cache",
            sa.Column("id", sa.String(length=36), primary_key=True),
            sa.Column("fen_hash", sa.String(length=64), nullable=False),
            sa.Column("move_san", sa.String(length=16), nullable=False),
            sa.Column("response_text", sa.String(length=256), nullable=False),
            sa.Column("expression", sa.String(length=32), nullable=False),
            sa.Column("created_at", sa.DateTime(), nullable=False),
        )
        op.create_index("ix_coach_cache_fen_hash", "coach_cache", ["fen_hash"])


def downgrade() -> None:
    op.drop_table("coach_cache")
    op.drop_table("scout_cache")
    op.drop_table("friends")
    op.drop_table("user_streaks")
    op.drop_table("lesson_progress")
    op.drop_table("user_puzzle_ratings")
    op.drop_table("puzzle_attempts")
    op.drop_table("puzzles")
    op.drop_table("analysis_jobs")
    op.drop_table("game_analysis")
    op.drop_table("games")
    op.drop_table("users")
