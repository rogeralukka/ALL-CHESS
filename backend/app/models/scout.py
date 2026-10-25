from sqlalchemy import Column, String, JSON, DateTime, ForeignKey
from datetime import datetime
import uuid
from app.database import Base

class ScoutCache(Base):
    __tablename__ = "scout_cache"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String(64), nullable=False, index=True)
    profile_json = Column(JSON, nullable=False)
    cached_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    expires_at = Column(DateTime, nullable=False)

class CoachCache(Base):
    __tablename__ = "coach_cache"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    fen_hash = Column(String(64), nullable=False, index=True)
    move_san = Column(String(16), nullable=False)
    response_text = Column(String(256), nullable=False)
    expression = Column(String(32), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
