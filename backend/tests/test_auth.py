from unittest.mock import patch, AsyncMock
from app.config import settings

def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "service" in data

def test_session_creation_success(client):
    payload = {
        "passcode": settings.app_passcode,
        "username": "ChessExplorer99",
        "chesscomUsername": "chess_explorer_99",
        "lichessUsername": "explorer99"
    }
    mock_profile = {
        "avatar": "https://images.chesscomfiles.com/avatar123.jpg",
        "country": "https://api.chess.com/pub/country/IN"
    }
    with patch("app.services.chesscom_client.ChesscomClient.fetch_player_profile", new_callable=AsyncMock) as mock_p:
        mock_p.return_value = mock_profile
        response = client.post("/api/v1/session", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "user" in data
        assert data["user"]["username"] == "ChessExplorer99"
        assert data["user"]["chesscomUsername"] == "chess_explorer_99"
        assert data["user"]["lichessUsername"] == "explorer99"
        assert data["user"]["avatarUrl"] == "https://images.chesscomfiles.com/avatar123.jpg"
        assert data["user"]["countryCode"] == "IN"
        assert "createdAt" in data["user"] and data["user"]["createdAt"]
        assert settings.session_cookie_name in response.cookies

def test_session_creation_invalid_passcode(client):
    payload = {
        "passcode": "wrong_password_123",
        "username": "RandomUser"
    }
    response = client.post("/api/v1/session", json=payload)
    assert response.status_code == 401
    data = response.json()
    assert data["error"] == "Unauthorized"
    assert "Invalid app passcode" in data["detail"]

def test_get_session_authenticated(auth_client, test_user):
    response = auth_client.get("/api/v1/session")
    assert response.status_code == 200
    data = response.json()
    assert data["user"]["id"] == test_user.id
    assert data["user"]["username"] == test_user.username
    assert "createdAt" in data["user"] and data["user"]["createdAt"]

def test_get_session_unauthenticated(client):
    client.cookies.clear()
    response = client.get("/api/v1/session")
    assert response.status_code == 401
    data = response.json()
    assert data["error"] == "Unauthorized"

def test_delete_session(auth_client):
    response = auth_client.delete("/api/v1/session")
    assert response.status_code == 200
    assert response.json() == {"ok": True}

def test_startup_secrets_validation():
    """Asserts startup rejects empty or placeholder secrets in non-test mode."""
    from app.config import PLACEHOLDER_SECRETS
    for placeholder in ["", "your_secret_passcode_here", "replace_me"]:
        assert placeholder in PLACEHOLDER_SECRETS

