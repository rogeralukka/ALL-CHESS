import os

TEST_PASSCODE = "test-passcode-for-ci"
os.environ["TESTING"] = "1"
os.environ["APP_PASSCODE"] = TEST_PASSCODE
os.environ["SESSION_SECRET"] = "test-session-secret-key-32-chars-long-123456"

import pytest
import sys
from pathlib import Path
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Ensure backend root is in sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.main import app
from app.database import Base, get_db
from app.config import settings
from app.models.user import User
from app.auth import sign_user_id

# In-memory SQLite database using StaticPool
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture
def db_session():
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture
def client(db_session, monkeypatch):
    monkeypatch.setattr("app.database.SessionLocal", TestingSessionLocal)
    monkeypatch.setattr("app.routers.sync.SessionLocal", TestingSessionLocal)

    def override_get_db():
        try:
            yield db_session
        finally:
            db_session.expire_all()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()

@pytest.fixture
def test_user(db_session):
    user = User(
        username="TestGrandmaster",
        chesscom_username="test_chesscom_user",
        lichess_username="test_lichess_user"
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

@pytest.fixture
def auth_client(client, test_user):
    token = sign_user_id(test_user.id)
    client.cookies.set(settings.session_cookie_name, token)
    return client
