from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, UniqueConstraint
import uuid
from app.database import Base

class LessonProgress(Base):
    __tablename__ = "lesson_progress"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    stage_id = Column(String(64), nullable=False, index=True)
    status = Column(String(32), default="locked", nullable=False) # 'locked' | 'current' | 'done' | 'unlocked'
    xp = Column(Integer, default=0, nullable=False)
    stars = Column(Integer, default=0, nullable=False)
    last_completed_at = Column(DateTime, nullable=True)

    __table_args__ = (
        UniqueConstraint('user_id', 'stage_id', name='uq_user_stage'),
    )

class UserStreak(Base):
    __tablename__ = "user_streaks"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), unique=True, nullable=False, index=True)
    current_streak = Column(Integer, default=1, nullable=False)
    longest_streak = Column(Integer, default=1, nullable=False)
    last_active_date = Column(String(32), nullable=False)
