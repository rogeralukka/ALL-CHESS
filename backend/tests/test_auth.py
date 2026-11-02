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



# ---- login needs a real Chess.com / Lichess account ----

def _login(client, name="LinkTester", **extra):
    payload = {"passcode": settings.app_passcode, "username": name, "lichessUsername": "seed_li", **extra}
    r = client.post("/api/v1/session", json=payload)
    assert r.status_code == 200, r.text
    return r


def test_login_requires_a_linked_account(client):
    r = client.post("/api/v1/session", json={"passcode": settings.app_passcode, "username": "NoLink"})
    assert r.status_code == 422
    assert "Chess.com or Lichess" in r.json()["detail"]
    r = client.post("/api/v1/session", json={"passcode": settings.app_passcode, "username": "NoLink", "chesscomUsername": "   "})
    assert r.status_code == 422


def test_login_rejects_unknown_or_malformed_accounts(client):
    with patch("app.services.chesscom_client.ChesscomClient.fetch_player_profile", new_callable=AsyncMock) as m:
        m.return_value = None
        r = client.post("/api/v1/session", json={"passcode": settings.app_passcode, "username": "X", "chesscomUsername": "ghost_user"})
        assert r.status_code == 404 and "not found" in r.json()["detail"]
    with patch("app.services.lichess_client.LichessClient.fetch_player_stats", new_callable=AsyncMock) as m:
        m.return_value = None
        r = client.post("/api/v1/session", json={"passcode": settings.app_passcode, "username": "X", "lichessUsername": "ghost_user"})
        assert r.status_code == 404
    r = client.post("/api/v1/session", json={"passcode": settings.app_passcode, "username": "X", "chesscomUsername": "bad name!"})
    assert r.status_code == 422
    # nothing was created by the failed attempts
    assert client.get("/api/v1/session").status_code == 401


def test_returning_user_can_log_in_without_retyping_the_account(client):
    _login(client, "Returner", chesscomUsername="returner_cc")
    client.cookies.clear()
    r = client.post("/api/v1/session", json={"passcode": settings.app_passcode, "username": "Returner"})
    assert r.status_code == 200
    assert r.json()["user"]["chesscomUsername"] == "returner_cc"


def test_login_survives_chesscom_being_unreachable(client):
    with patch("app.services.chesscom_client.ChesscomClient.fetch_player_profile", new_callable=AsyncMock) as m:
        m.side_effect = RuntimeError("network down")
        r = client.post("/api/v1/session", json={"passcode": settings.app_passcode, "username": "Offline", "chesscomUsername": "someone"})
        assert r.status_code == 200


# ---- PATCH /session/linked-accounts ----

def test_linked_accounts_link_change_unlink(client):
    _login(client)  # starts with lichess seed_li
    ok_profile = {"avatar": "https://img/a.jpg", "country": "https://api.chess.com/pub/country/IN"}
    with patch("app.services.chesscom_client.ChesscomClient.fetch_player_profile", new_callable=AsyncMock) as m:
        m.return_value = ok_profile
        r = client.patch("/api/v1/session/linked-accounts", json={"chesscomUsername": " rogeralukka ", "lichessUsername": "rl_1"})
        assert r.status_code == 200
        u = r.json()["user"]
        assert u["chesscomUsername"] == "rogeralukka" and u["lichessUsername"] == "rl_1"
        assert u["avatarUrl"] == "https://img/a.jpg" and u["countryCode"] == "IN"

        # omitting a field leaves it alone
        r = client.patch("/api/v1/session/linked-accounts", json={"chesscomUsername": "other_name"})
        u = r.json()["user"]
        assert u["chesscomUsername"] == "other_name" and u["lichessUsername"] == "rl_1"

        # null / blank unlinks one platform...
        r = client.patch("/api/v1/session/linked-accounts", json={"chesscomUsername": None})
        u = r.json()["user"]
        assert "chesscomUsername" not in u and u["lichessUsername"] == "rl_1" and "avatarUrl" not in u

        # ...but never the last one
        r = client.patch("/api/v1/session/linked-accounts", json={"lichessUsername": ""})
        assert r.status_code == 422
        assert client.get("/api/v1/session").json()["user"]["lichessUsername"] == "rl_1"


def test_linked_accounts_rejects_bad_names_and_unknown_users(client):
    _login(client, "LinkTester2")
    r = client.patch("/api/v1/session/linked-accounts", json={"chesscomUsername": "bad name!"})
    assert r.status_code == 422
    r = client.patch("/api/v1/session/linked-accounts", json={"lichessUsername": "x" * 65})
    assert r.status_code == 422
    with patch("app.services.chesscom_client.ChesscomClient.fetch_player_profile", new_callable=AsyncMock) as m:
        m.return_value = None
        r = client.patch("/api/v1/session/linked-accounts", json={"chesscomUsername": "doesnotexist123"})
        assert r.status_code == 404
        me = client.get("/api/v1/session").json()["user"]
        assert "chesscomUsername" not in me


def test_linked_accounts_allows_linking_when_chesscom_unreachable(client):
    _login(client, "LinkTester3")
    with patch("app.services.chesscom_client.ChesscomClient.fetch_player_profile", new_callable=AsyncMock) as m:
        m.side_effect = RuntimeError("network down")
        r = client.patch("/api/v1/session/linked-accounts", json={"chesscomUsername": "someone"})
        assert r.status_code == 200
        assert r.json()["user"]["chesscomUsername"] == "someone"


def test_linked_accounts_requires_session_and_is_per_user(client):
    assert client.patch("/api/v1/session/linked-accounts", json={"lichessUsername": "x"}).status_code == 401
    _login(client, "UserA", lichessUsername="aaa")
    client.patch("/api/v1/session/linked-accounts", json={"lichessUsername": "changed"})
    client.cookies.clear()
    _login(client, "UserB", lichessUsername="bbb")
    me = client.get("/api/v1/session").json()["user"]
    assert me["lichessUsername"] == "bbb"
