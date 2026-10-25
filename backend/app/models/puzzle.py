from sqlalchemy import Column, String, Integer, Boolean, JSON, DateTime, ForeignKey, Text
from datetime import datetime
import uuid
from app.database import Base

class Puzzle(Base):
    __tablename__ = "puzzles"

    id = Column(String(64), primary_key=True)
    fen = Column(String(128), nullable=False)
    solution = Column(JSON, nullable=False) # list of move strings
    rating = Column(Integer, nullable=False, index=True)
    theme = Column(JSON, nullable=False) # list of theme strings
    goal = Column(Text, nullable=False)

class PuzzleAttempt(Base):
    __tablename__ = "puzzle_attempts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    puzzle_id = Column(String(64), ForeignKey("puzzles.id"), nullable=False, index=True)
    solved = Column(Boolean, nullable=False)
    time_seconds = Column(Integer, default=0, nullable=False)
    rating_delta = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

class UserPuzzleRating(Base):
    __tablename__ = "user_puzzle_ratings"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), unique=True, nullable=False, index=True)
    rating = Column(Integer, default=650, nullable=False)
    streak = Column(Integer, default=0, nullable=False)
    best_streak = Column(Integer, default=0, nullable=False)
    last_attempt_date = Column(String(32), nullable=True)
