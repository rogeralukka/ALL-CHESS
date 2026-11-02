"""Saving a finished Play Coach game so Review can open it."""


def _body(**over):
    body = {
        "moves": ["e4", "e5", "Qh5", "Nc6", "Bc4", "Nf6", "Qxf7#"],
        "userColor": "white",
        "result": "1-0",
        "opponentName": "Coach All-Chess",
        "opponentRating": 800,
        "userRating": 905,
        "termination": "Checkmate",
    }
    body.update(over)
    return body


def test_save_coach_game_then_fetch_it(auth_client):
    resp = auth_client.post("/api/v1/games/coach", json=_body())
    assert resp.status_code == 201, resp.text
    game_id = resp.json()["id"]

    got = auth_client.get(f"/api/v1/games/{game_id}")
    assert got.status_code == 200
    g = got.json()
    assert g["source"] == "vs_coach" and g["platform"] == "coach"
    assert g["isUserWhite"] is True
    assert g["black"]["username"] == "Coach All-Chess" and g["black"]["rating"] == 800
    assert g["white"]["rating"] == 905
    assert g["result"] == "1-0"
    assert g["termination"] == "Checkmate"
    assert len(g["moves"]) == 7
    assert g["opening"]["name"]

    listed = auth_client.get("/api/v1/games").json()
    assert any(x["id"] == game_id for x in listed)


def test_save_coach_game_as_black(auth_client):
    resp = auth_client.post("/api/v1/games/coach", json=_body(userColor="black", result="0-1"))
    assert resp.status_code == 201
    g = auth_client.get(f"/api/v1/games/{resp.json()['id']}").json()
    assert g["isUserWhite"] is False
    assert g["white"]["username"] == "Coach All-Chess"


def test_save_coach_game_rejects_illegal_moves(auth_client):
    resp = auth_client.post("/api/v1/games/coach", json=_body(moves=["e4", "e4"]))
    assert resp.status_code == 422


def test_save_coach_game_requires_login(client):
    assert client.post("/api/v1/games/coach", json=_body()).status_code in (401, 403)


def test_coach_game_uses_the_players_own_rating_not_a_made_up_one(auth_client, test_user, db_session):
    """With no rating sent, the save falls back to the player's latest real rating, never 800/1200."""
    from app.models.game import Game as GameModel

    body = _body()
    body.pop("userRating")

    # no games yet -> no rating is invented, the UI shows a dash (0)
    g = auth_client.get(f"/api/v1/games/{auth_client.post('/api/v1/games/coach', json=body).json()['id']}").json()
    assert g["white"]["rating"] == 0

    db_session.add(GameModel(
        id="rated-rapid-01", user_id=test_user.id, source="online", platform="chesscom",
        pgn="1. e4 e5", white={"username": test_user.username, "rating": 842},
        black={"username": "Someone", "rating": 900}, result="1-0",
        date="2026-10-28T10:00:00Z", time_control="600", speed="rapid",
        opening={"eco": "C20", "name": "King's Pawn"}, moves=[], is_user_white=True,
    ))
    db_session.commit()

    g = auth_client.get(f"/api/v1/games/{auth_client.post('/api/v1/games/coach', json=body).json()['id']}").json()
    assert g["white"]["rating"] == 842
    assert g["black"]["rating"] == 800  # the coach level that was sent


def test_coach_game_prefers_an_explicit_rating(auth_client):
    g = auth_client.get(f"/api/v1/games/{auth_client.post('/api/v1/games/coach', json=_body(userRating=1111)).json()['id']}").json()
    assert g["white"]["rating"] == 1111
