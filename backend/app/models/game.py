from sqlalchemy import Column, String, Text, JSON, DateTime, ForeignKey, Boolean
from datetime import datetime
import uuid
from app.database import Base

class Game(Base):
    __tablename__ = "games"

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
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
