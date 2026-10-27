from datetime import datetime, timezone
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from typing import Generator
from app.config import settings

def utc_now() -> datetime:
    return datetime.now(timezone.utc)

def normalize_db_url(url: str) -> str:
    """Hosts (Neon, Render, Heroku) hand out plain postgres:// or postgresql:// URLs. SQLAlchemy may then pick a
    driver we do not install, so pin the one in requirements.txt."""
    for prefix in ("postgres://", "postgresql://"):
        if url.startswith(prefix):
            return "postgresql+psycopg2://" + url[len(prefix):]
    return url


# If relative sqlite URL, resolve from backend dir
db_url = settings.database_url
if db_url.startswith("sqlite:///./"):
    import os
    from app.config import BACKEND_DIR
    db_file = db_url.replace("sqlite:///./", "")
    full_path = os.path.join(BACKEND_DIR, db_file)
    db_url = f"sqlite:///{full_path}"

db_url = normalize_db_url(db_url)

connect_args = {"check_same_thread": False} if db_url.startswith("sqlite") else {}

engine = create_engine(
    db_url,
    connect_args=connect_args,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
