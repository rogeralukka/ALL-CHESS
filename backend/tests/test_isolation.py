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
