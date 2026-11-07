from sqlalchemy import Column, String, Integer, Boolean, JSON, DateTime, ForeignKey, Text, Index
import uuid
from app.database import Base, utc_now


class Puzzle(Base):
    __tablename__ = "puzzles"

    id = Column(String(64), primary_key=True)
    fen = Column(String(128), nullable=False)
    solution = Column(JSON, nullable=False)  # list of SAN move strings
    rating = Column(Integer, nullable=False, index=True)
    theme = Column(JSON, nullable=False)  # list of theme strings
    goal = Column(Text, nullable=False)

    # Extended Lichess puzzle metadata
    solution_uci = Column(JSON, nullable=True)  # list of UCI move strings
    setup_move_uci = Column(String(16), nullable=True)  # opponent's setup move
    popularity = Column(Integer, default=100, nullable=False)
    nb_plays = Column(Integer, default=0, nullable=False)
    game_url = Column(String(256), nullable=True)
    opening_tags = Column(JSON, nullable=True)
    import_run = Column(String(64), nullable=True, index=True)


class PuzzleTheme(Base):
    __tablename__ = "puzzle_themes"

    # Composite primary key (puzzle_id, theme) eliminates surrogate id & redundant index
    puzzle_id = Column(String(64), ForeignKey("puzzles.id", ondelete="CASCADE"), primary_key=True)
    theme = Column(String(64), primary_key=True)

    __table_args__ = (
        Index("ix_puzzle_themes_theme_puzzle_id", "theme", "puzzle_id"),
    )


class PuzzleAttempt(Base):
    __tablename__ = "puzzle_attempts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    puzzle_id = Column(String(64), ForeignKey("puzzles.id"), nullable=False, index=True)
    solved = Column(Boolean, nullable=False)
    time_seconds = Column(Integer, default=0, nullable=False)
    rating_delta = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    used_hint = Column(Boolean, default=False, nullable=False)
    is_repeat = Column(Boolean, default=False, nullable=False)

    __table_args__ = (
        Index("ix_puzzle_attempts_user_puzzle", "user_id", "puzzle_id"),
    )


class UserPuzzleRating(Base):
    __tablename__ = "user_puzzle_ratings"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), unique=True, nullable=False, index=True)
    rating = Column(Integer, default=1200, nullable=False)
    streak = Column(Integer, default=0, nullable=False)
    best_streak = Column(Integer, default=0, nullable=False)
    last_attempt_date = Column(String(32), nullable=True)
