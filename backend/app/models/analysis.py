from sqlalchemy import Column, String, Integer, JSON, DateTime, ForeignKey, Text
import uuid
from app.database import Base, utc_now

class GameAnalysis(Base):
    __tablename__ = "game_analysis"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    game_id = Column(String(64), ForeignKey("games.id"), nullable=False, index=True)
    depth = Column(Integer, nullable=False, default=16)
    analysis_data = Column(JSON, nullable=False)
    cached_at = Column(DateTime, default=utc_now, nullable=False)

class AnalysisJob(Base):
    __tablename__ = "analysis_jobs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    game_id = Column(String(64), ForeignKey("games.id"), nullable=True, index=True)
    job_type = Column(String(32), default="analysis", nullable=False)  # 'analysis' | 'sync'
    status = Column(String(32), default="queued", nullable=False)  # 'queued', 'processing', 'done', 'failed'
    progress = Column(Integer, default=0, nullable=False)  # 0 to 100
    error_message = Column(Text, nullable=True)
    result = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)


# A background analysis runs inside the API process, so it dies whenever the process restarts (deploy, crash, free-tier
# restart) and its row would stay "processing" forever. These helpers keep such rows from blocking new reviews.
STALE_JOB_MINUTES = 10


def fail_orphaned_jobs(db) -> int:
    """Mark every queued/processing job as failed. Call once at startup, when no job can really be running."""
    jobs = db.query(AnalysisJob).filter(AnalysisJob.status.in_(["queued", "processing"])).all()
    for job in jobs:
        job.status = "failed"
        job.error_message = "Interrupted by a server restart. Please start the review again."
    if jobs:
        db.commit()
    return len(jobs)
