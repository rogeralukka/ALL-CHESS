from app.models.user import User
from app.models.game import Game as GameModel
from app.auth import sign_user_id
from app.config import settings

def test_user_data_isolation(client, db_session):
    # Create User A
    user_a = User(username="UserAlpha")
    # Create User B
    user_b = User(username="UserBeta")
    db_session.add_all([user_a, user_b])
    db_session.commit()
    db_session.refresh(user_a)
    db_session.refresh(user_b)

    # Add game for User A only
    game_a = GameModel(
        id="game-alpha-exclusive",
        user_id=user_a.id,
        source="online",
        platform="chesscom",
        pgn="1. e4 e5 1-0",
        white={"username": "You", "rating": 1200},
        black={"username": "Opponent", "rating": 1200},
        result="1-0",
        date="2026-10-25T12:00:00Z",
        time_control="10 min",
        speed="rapid",
        opening={"eco": "C20", "name": "King Pawn"},
        moves=[]
    )
    db_session.add(game_a)
    db_session.commit()

    # Authenticate as User A -> Can see game
    token_a = sign_user_id(user_a.id)
    client.cookies.set(settings.session_cookie_name, token_a)
    resp_a = client.get("/api/v1/games/game-alpha-exclusive")
    assert resp_a.status_code == 200
    assert resp_a.json()["id"] == "game-alpha-exclusive"

    # Authenticate as User B -> Cannot see User A's game! Returns 404
    token_b = sign_user_id(user_b.id)
    client.cookies.set(settings.session_cookie_name, token_b)
    resp_b = client.get("/api/v1/games/game-alpha-exclusive")
    assert resp_b.status_code == 404
    assert resp_b.json()["error"] == "NotFound"

    # User B games list does not contain User A's game
    list_b = client.get("/api/v1/games").json()
    assert all(g["id"] != "game-alpha-exclusive" for g in list_b)

def test_two_users_login_list_games_isolation(client, db_session):
    """Asserts two users log in, both list games, neither errors, and each only sees their own."""
    # User 1 logs in via POST /session
    resp1 = client.post("/api/v1/session", json={"passcode": settings.app_passcode, "username": "alice"})
    assert resp1.status_code == 200
    user1_id = resp1.json()["user"]["id"]

    # User 2 logs in via POST /session
    resp2 = client.post("/api/v1/session", json={"passcode": settings.app_passcode, "username": "bob"})
    assert resp2.status_code == 200
    user2_id = resp2.json()["user"]["id"]

    # Give Alice 1 game
    game1 = GameModel(
        id="game-alice-1",
        user_id=user1_id,
        source="online",
        platform="chesscom",
        pgn="1. d4 d5 1-0",
        white={"username": "alice", "rating": 1000},
        black={"username": "someone", "rating": 1000},
        result="1-0",
        date="2026-10-25T10:00:00Z",
        time_control="10 min",
        speed="rapid",
        opening={"eco": "D00", "name": "Queen's Pawn"},
        moves=[]
    )
    # Give Bob 1 game
    game2 = GameModel(
        id="game-bob-1",
        user_id=user2_id,
        source="online",
        platform="lichess",
        pgn="1. e4 c5 0-1",
        white={"username": "someone", "rating": 1100},
        black={"username": "bob", "rating": 1100},
        result="0-1",
        date="2026-10-25T11:00:00Z",
        time_control="3|2",
        speed="blitz",
        opening={"eco": "B20", "name": "Sicilian Defense"},
        moves=[]
    )
    db_session.add_all([game1, game2])
    db_session.commit()

    # Alice queries games
    client.cookies.set(settings.session_cookie_name, sign_user_id(user1_id))
    list1 = client.get("/api/v1/games").json()
    assert len(list1) == 1
    assert list1[0]["id"] == "game-alice-1"

    # Bob queries games
    client.cookies.set(settings.session_cookie_name, sign_user_id(user2_id))
    list2 = client.get("/api/v1/games").json()
    assert len(list2) == 1
    assert list2[0]["id"] == "game-bob-1"
