from sqlalchemy import Column, String, Integer, Boolean, JSON, DateTime, ForeignKey
from datetime import datetime
import uuid
from app.database import Base

class Friend(Base):
    __tablename__ = "friends"

    id = Column(String(36), primary_key=True, default=lambda: f"f-{uuid.uuid4().hex[:8]}")
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    username = Column(String(64), nullable=False)
    platform = Column(String(32), default="chesscom", nullable=False) # 'chesscom' | 'lichess'
    rating = Column(Integer, default=900, nullable=False)
    ratings = Column(JSON, nullable=True) # { rapid: int, blitz: int, bullet: int }
    online = Column(Boolean, default=False, nullable=False)
    avatar_url = Column(String(256), nullable=True)
    last_active = Column(String(64), default="Recently", nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
