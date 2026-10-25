def test_get_games_list(auth_client):
    response = auth_client.get("/api/v1/games")
    assert response.status_code == 200
    games = response.json()
    assert isinstance(games, list)
    assert len(games) > 0
    first_game = games[0]
    assert "id" in first_game
    assert "white" in first_game
    assert "black" in first_game
    assert "result" in first_game
    assert "timeControl" in first_game
    assert "speed" in first_game
    assert "source" in first_game
    assert "opening" in first_game
    assert "moves" in first_game

def test_get_game_by_id(auth_client):
    games_resp = auth_client.get("/api/v1/games")
    games = games_resp.json()
    assert len(games) > 0
    target_id = games[0]["id"]

    single_resp = auth_client.get(f"/api/v1/games/{target_id}")
    assert single_resp.status_code == 200
    game = single_resp.json()
    assert game["id"] == target_id
    assert isinstance(game["moves"], list)

def test_get_game_by_id_not_found(auth_client):
    response = auth_client.get("/api/v1/games/non-existent-game-id")
    assert response.status_code == 404
    data = response.json()
    assert data["error"] == "NotFound"

def test_games_filtering(auth_client):
    # Filter by speed
    rapid_resp = auth_client.get("/api/v1/games?speed=rapid")
    assert rapid_resp.status_code == 200
    for g in rapid_resp.json():
        assert g["speed"] == "rapid"

    # Filter by source
    coach_resp = auth_client.get("/api/v1/games?source=vs_coach")
    assert coach_resp.status_code == 200
    for g in coach_resp.json():
        assert g["source"] == "vs_coach"

def test_stats_rating_history(auth_client):
    response = auth_client.get("/api/v1/stats/rating-history?range=90d")
    assert response.status_code == 200
    history = response.json()
    assert isinstance(history, list)
    assert len(history) > 0
    assert "rapid" in history[0]
    assert "blitz" in history[0]
    assert "bullet" in history[0]

def test_stats_ratings(auth_client):
    response = auth_client.get("/api/v1/stats/ratings")
    assert response.status_code == 200
    ratings = response.json()
    assert isinstance(ratings, list)
    modes = {r["mode"] for r in ratings}
    assert "Rapid" in modes
    assert "Blitz" in modes
    assert "Bullet" in modes

def test_stats_openings(auth_client):
    response = auth_client.get("/api/v1/stats/openings")
    assert response.status_code == 200
    openings = response.json()
    assert isinstance(openings, list)
    assert len(openings) > 0
    first_op = openings[0]
    assert "eco" in first_op
    assert "name" in first_op
    assert "winRate" in first_op
    assert "avgAccuracy" in first_op

def test_stats_phases(auth_client):
    response = auth_client.get("/api/v1/stats/phases")
    assert response.status_code == 200
    phases = response.json()
    assert "opening" in phases
    assert "middlegame" in phases
    assert "endgame" in phases

def test_stats_insights(auth_client):
    response = auth_client.get("/api/v1/stats/insights")
    assert response.status_code == 200
    insights = response.json()
    assert "strengths" in insights
    assert "weaknesses" in insights
    assert len(insights["strengths"]) > 0
    assert len(insights["weaknesses"]) > 0
