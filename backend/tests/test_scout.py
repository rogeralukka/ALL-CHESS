import pytest
from unittest.mock import patch, AsyncMock
from datetime import datetime, timedelta, timezone
from app.models.scout import ScoutCache
from app.database import utc_now

SAMPLE_PGN_1 = """[Event "Live Chess"]
[Site "Chess.com"]
[Date "2026.10.20"]
[White "OpponentAce"]
[Black "RandomPlayer"]
[Result "1-0"]
[WhiteElo "1250"]
[BlackElo "1200"]
[TimeControl "600"]
[ECO "C50"]
[CurrentPosition "rnbqk2r/pppp1ppp/5n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4"]

1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. d3 Nf6 1-0"""

SAMPLE_PGN_2 = """[Event "Live Chess"]
[Site "Chess.com"]
[Date "2026.10.21"]
[White "OtherPlayer"]
[Black "OpponentAce"]
[Result "1-0"]
[WhiteElo "1260"]
[BlackElo "1250"]
[TimeControl "600"]
[ECO "B20"]

1. e4 c5 2. Nf3 d6 3. d4 cxd4 1-0"""

SAMPLE_GAME_OBJ_1 = {
    "url": "https://www.chess.com/game/live/101",
    "pgn": SAMPLE_PGN_1,
    "time_control": "600",
    "end_time": 1792600000,
    "rated": True,
    "time_class": "rapid",
    "rules": "chess",
    "white": {"rating": 1250, "result": "win", "username": "opponentace"},
    "black": {"rating": 1200, "result": "resigned", "username": "randomplayer"},
    "eco": "https://www.chess.com/openings/Italian-Game-C50"
}

SAMPLE_GAME_OBJ_2 = {
    "url": "https://www.chess.com/game/live/102",
    "pgn": SAMPLE_PGN_2,
    "time_control": "600",
    "end_time": 1792600100,
    "rated": True,
    "time_class": "rapid",
    "rules": "chess",
    "white": {"rating": 1260, "result": "win", "username": "otherplayer"},
    "black": {"rating": 1250, "result": "checkmated", "username": "opponentace"},
    "eco": "https://www.chess.com/openings/Sicilian-Defense-B20"
}


def test_get_scout_profile_live_and_cached(auth_client, db_session):
    mock_stats = {
        "chess_rapid": {"last": {"rating": 1250}}
    }
    mock_profile = {
        "username": "OpponentAce",
        "title": "CM",
        "country": "https://api.chess.com/pub/country/US"
    }

    with patch("app.services.chesscom_client.ChesscomClient.fetch_recent_games", new_callable=AsyncMock) as mock_games, \
         patch("app.services.chesscom_client.ChesscomClient.fetch_player_stats", new_callable=AsyncMock) as mock_st, \
         patch("app.services.chesscom_client.ChesscomClient.fetch_player_profile", new_callable=AsyncMock) as mock_prof:

        mock_games.return_value = [SAMPLE_GAME_OBJ_1, SAMPLE_GAME_OBJ_2]
        mock_st.return_value = mock_stats
        mock_prof.return_value = mock_profile

        # 1. First fetch (cache miss -> fetches live from Chess.com)
        resp = auth_client.get("/api/v1/scout/OpponentAce?platform=chesscom")
        assert resp.status_code == 200
        data = resp.json()
        assert data["username"] == "OpponentAce"
        assert data["rating"] == 1250
        assert data["title"] == "CM"
        assert data["winRate"] == 50.0  # 1 win, 1 loss = 50%
        assert len(data["mostPlayed"]) >= 1
        assert len(data["recentGames"]) == 2
        assert mock_games.call_count == 1

        # 2. Verify cache was written to DB
        cached = db_session.query(ScoutCache).filter(ScoutCache.username == "opponentace").first()
        assert cached is not None
        exp = cached.expires_at.replace(tzinfo=timezone.utc) if cached.expires_at.tzinfo is None else cached.expires_at
        assert exp > utc_now()

        # 3. Second fetch (cache hit -> does not call external API)
        resp2 = auth_client.get("/api/v1/scout/OpponentAce?platform=chesscom")
        assert resp2.status_code == 200
        data2 = resp2.json()
        assert data2["username"] == "OpponentAce"
        assert mock_games.call_count == 1  # Unchanged!


def test_get_scout_profile_not_found(auth_client):
    with patch("app.services.chesscom_client.ChesscomClient.fetch_recent_games", new_callable=AsyncMock) as mock_games, \
         patch("app.services.chesscom_client.ChesscomClient.fetch_player_stats", new_callable=AsyncMock) as mock_st, \
         patch("app.services.chesscom_client.ChesscomClient.fetch_player_profile", new_callable=AsyncMock) as mock_prof:

        mock_games.return_value = []
        mock_st.return_value = None
        mock_prof.return_value = None

        resp = auth_client.get("/api/v1/scout/nonexistentuser99999?platform=chesscom")
        assert resp.status_code == 404


def test_search_scout_profiles(auth_client, db_session):
    # Pre-populate cache with two scouted players
    c1 = ScoutCache(
        username="magnuscarlsen",
        profile_json={
            "username": "MagnusCarlsen",
            "rating": 2850,
            "winRate": 72.0,
            "mostPlayed": [],
            "recentGames": []
        },
        expires_at=utc_now() + timedelta(hours=24)
    )
    c2 = ScoutCache(
        username="hikaru",
        profile_json={
            "username": "Hikaru",
            "rating": 2840,
            "winRate": 70.0,
            "mostPlayed": [],
            "recentGames": []
        },
        expires_at=utc_now() + timedelta(hours=24)
    )
    db_session.add_all([c1, c2])
    db_session.commit()

    resp = auth_client.get("/api/v1/scout?query=magnus")
    assert resp.status_code == 200
    results = resp.json()
    assert len(results) == 1
    assert results[0]["username"] == "MagnusCarlsen"
