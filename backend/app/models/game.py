from sqlalchemy import Column, String, Text, JSON, DateTime, ForeignKey, Boolean, Integer, Index
from sqlalchemy.orm import validates
import uuid
from app.database import Base, utc_now

class Game(Base):
    __tablename__ = "games"
    __table_args__ = (
        Index("ix_games_user_id_date", "user_id", "date"),
    )

    id = Column(String(64), primary_key=True, default=lambda: f"game-{uuid.uuid4().hex[:12]}")
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    source = Column(String(32), default="online", nullable=False) # 'online' | 'vs_coach'
    platform = Column(String(32), nullable=True) # 'chesscom' | 'lichess' | 'coach'
    external_id = Column(String(128), nullable=True, index=True)
    
    pgn = Column(Text, nullable=False)
    white = Column(JSON, nullable=False) # { username, rating, title, avatarUrl }
    black = Column(JSON, nullable=False) # { username, rating, title, avatarUrl }
    result = Column(String(16), nullable=False) # '1-0' | '0-1' | '1/2-1/2' | '*'
    date = Column(String(64), nullable=False) # ISO UTC string
    time_control = Column(String(32), nullable=False) # e.g. "10 min", "3|2"
    speed = Column(String(16), nullable=False) # 'bullet' | 'blitz' | 'rapid' | 'daily'
    
    opening = Column(JSON, nullable=False) # { eco, name }
    moves = Column(JSON, nullable=False) # list of Move dicts
    is_user_white = Column(Boolean, default=True, nullable=False)
    
    accuracy = Column(JSON, nullable=True) # { white, black }
    estimated_rating = Column(JSON, nullable=True) # { white, black }
    phase_grades = Column(JSON, nullable=True) # { opening, middlegame, tactics, endgame }
    termination = Column(String(128), nullable=True) # e.g. "Aahanafrr won by resignation"
    
    analysis_level = Column(String(32), nullable=True) # 'standard' | 'deep' | 'deeper' | 'max'
    analysis_depth = Column(Integer, nullable=True)
    book_end = Column(Integer, nullable=True)
    move_count = Column(Integer, nullable=True)
    ends_in_mate = Column(Boolean, nullable=True, default=False)
    review_summary = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, default=utc_now, nullable=False)

    def __init__(self, **kwargs):
        if "moves" in kwargs and kwargs["moves"] is not None and isinstance(kwargs["moves"], list):
            if "move_count" not in kwargs or kwargs["move_count"] is None:
                kwargs["move_count"] = len(kwargs["moves"])
            if "ends_in_mate" not in kwargs or kwargs["ends_in_mate"] is None:
                last_san = kwargs["moves"][-1].get("san", "") if kwargs["moves"] and isinstance(kwargs["moves"][-1], dict) else ""
                kwargs["ends_in_mate"] = last_san.endswith("#")
        super().__init__(**kwargs)

    @validates("moves")
    def validate_moves(self, key, value):
        if value is not None and isinstance(value, list):
            if getattr(self, "move_count", None) is None:
                self.move_count = len(value)
            if getattr(self, "ends_in_mate", None) is None:
                last_san = value[-1].get("san", "") if value and isinstance(value[-1], dict) else ""
                self.ends_in_mate = last_san.endswith("#")
        return value
