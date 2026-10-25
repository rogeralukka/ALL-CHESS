from app.models.game import Game as GameModel

def test_brand_new_user_empty_stats(auth_client):
    """Asserts a brand-new user with 0 games gets empty or zero stats."""
    # Games list is empty
    resp_games = auth_client.get("/api/v1/games")
    assert resp_games.status_code == 200
    assert resp_games.json() == []

    # Rating history is empty list
    resp_history = auth_client.get("/api/v1/stats/rating-history?range=90d")
    assert resp_history.status_code == 200
    assert resp_history.json() == []

    # Ratings per speed returns 0s for unplayed speeds, no fake hard-coded numbers
    resp_ratings = auth_client.get("/api/v1/stats/ratings")
    assert resp_ratings.status_code == 200
    ratings = resp_ratings.json()
    assert len(ratings) == 3
    for r in ratings:
        assert r["rating"] == 0
        assert r["deltaWeekly"] == 0

    # Openings is empty list
    resp_openings = auth_client.get("/api/v1/stats/openings")
    assert resp_openings.status_code == 200
    assert resp_openings.json() == []

    # Phases returns exact 0.0s
    resp_phases = auth_client.get("/api/v1/stats/phases")
    assert resp_phases.status_code == 200
    phases = resp_phases.json()
    assert phases == {"opening": 0.0, "middlegame": 0.0, "endgame": 0.0}

    # Insights returns empty lists
    resp_insights = auth_client.get("/api/v1/stats/insights")
    assert resp_insights.status_code == 200
    insights = resp_insights.json()
    assert insights == {"strengths": [], "weaknesses": []}

def test_user_with_games_stats(auth_client, test_user, db_session):
    """Asserts stats are derived from real games, calculating ratings per speed and openings."""
    # Add 2 games for test_user: Rapid (1200) and Blitz (1150)
    g1 = GameModel(
        id="real-game-01",
        user_id=test_user.id,
        source="online",
        platform="chesscom",
        pgn="1. e4 e5 2. Nf3 Nc6 1-0",
        white={"username": test_user.username, "rating": 1200},
        black={"username": "Opponent", "rating": 1180},
        result="1-0",
        date="2026-10-20T14:00:00Z",
        time_control="10 min",
        speed="rapid",
        opening={"eco": "C50", "name": "Italian Game"},
        moves=[],
        is_user_white=True
    )
    g2 = GameModel(
        id="real-game-02",
        user_id=test_user.id,
        source="online",
        platform="lichess",
        pgn="1. d4 Nf6 0-1",
        white={"username": "Opponent2", "rating": 1140},
        black={"username": test_user.username, "rating": 1150},
        result="0-1",
        date="2026-10-22T16:00:00Z",
        time_control="3|2",
        speed="blitz",
        opening={"eco": "A45", "name": "Queen's Pawn"},
        moves=[],
        is_user_white=False
    )
    db_session.add_all([g1, g2])
    db_session.commit()

    # Games list has 2 games
    games = auth_client.get("/api/v1/games").json()
    assert len(games) == 2

    # Rating history has 2 points
    history = auth_client.get("/api/v1/stats/rating-history?range=all").json()
    assert len(history) == 2
    assert history[0]["date"] == "2026-10-20"
    assert history[0]["rapid"] == 1200
    assert history[1]["date"] == "2026-10-22"
    assert history[1]["blitz"] == 1150

    # Ratings shows Rapid 1200, Blitz 1150, Bullet 0
    ratings = auth_client.get("/api/v1/stats/ratings").json()
    ratings_by_mode = {r["mode"]: r["rating"] for r in ratings}
    assert ratings_by_mode["Rapid"] == 1200
    assert ratings_by_mode["Blitz"] == 1150
    assert ratings_by_mode["Bullet"] == 0

    # Openings shows Italian Game (100% win rate) and Queen's Pawn (100% win rate)
    # avgAccuracy is null because games are unanalysed
    openings = auth_client.get("/api/v1/stats/openings").json()
    assert len(openings) == 2
    assert openings[0]["avgAccuracy"] is None or openings[0].get("avgAccuracy") is None

def test_get_game_by_id(auth_client, test_user, db_session):
    game = GameModel(
        id="single-fetch-game",
        user_id=test_user.id,
        source="online",
        pgn="1. e4 e5 *",
        white={"username": "P1", "rating": 1000},
        black={"username": "P2", "rating": 1000},
        result="*",
        date="2026-10-25T15:00:00Z",
        time_control="10 min",
        speed="rapid",
        opening={"eco": "C20", "name": "King Pawn"},
        moves=[{"san": "e4", "from": "e2", "to": "e4", "color": "w", "fen": "...", "moveNumber": 1}],
        is_user_white=True
    )
    db_session.add(game)
    db_session.commit()

    resp = auth_client.get("/api/v1/games/single-fetch-game")
    assert resp.status_code == 200
    data = resp.json()
    assert data["id"] == "single-fetch-game"
    # Verify response_model_exclude_none omitted null fields like title, avatarUrl
    assert "title" not in data["white"]
    assert "avatarUrl" not in data["white"]
    assert "promotion" not in data["moves"][0]

def test_get_game_by_id_not_found(auth_client):
    response = auth_client.get("/api/v1/games/non-existent-game-id")
    assert response.status_code == 404
    data = response.json()
    assert data["error"] == "NotFound"

def test_games_filtering(auth_client, test_user, db_session):
    g1 = GameModel(
        id="filter-rapid",
        user_id=test_user.id,
        source="online",
        pgn="1. e4 e5 *",
        white={"username": "P1", "rating": 1000},
        black={"username": "P2", "rating": 1000},
        result="1-0",
        date="2026-10-25T15:00:00Z",
        time_control="10 min",
        speed="rapid",
        opening={"eco": "C20", "name": "King Pawn"},
        moves=[],
        is_user_white=True
    )
    g2 = GameModel(
        id="filter-coach",
        user_id=test_user.id,
        source="vs_coach",
        pgn="1. d4 d5 *",
        white={"username": "P1", "rating": 1000},
        black={"username": "Coach", "rating": 1000},
        result="0-1",
        date="2026-10-25T16:00:00Z",
        time_control="Unlimited",
        speed="rapid",
        opening={"eco": "D00", "name": "Queen's Pawn"},
        moves=[],
        is_user_white=True
    )
    db_session.add_all([g1, g2])
    db_session.commit()

    # Filter speed=rapid
    rapid_resp = auth_client.get("/api/v1/games?speed=rapid")
    assert rapid_resp.status_code == 200
    assert len(rapid_resp.json()) == 2

    # Filter source=vs_coach
    coach_resp = auth_client.get("/api/v1/games?source=vs_coach")
    assert coach_resp.status_code == 200
    assert len(coach_resp.json()) == 1
    assert coach_resp.json()[0]["id"] == "filter-coach"
