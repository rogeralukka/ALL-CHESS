from sqlalchemy import Column, String, DateTime, Boolean
import uuid
from app.database import Base, utc_now

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String(64), unique=True, nullable=False, index=True)
    chesscom_username = Column(String(64), nullable=True)
    lichess_username = Column(String(64), nullable=True)
    chesscom_backfill_done = Column(Boolean, default=False, nullable=False)
    lichess_backfill_done = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)
