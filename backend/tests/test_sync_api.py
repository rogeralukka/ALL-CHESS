from unittest.mock import AsyncMock, patch

MOCK_CHESSCOM_GAME = {
    "url": "https://www.chess.com/game/live/123456789",
    "pgn": """[Event "Live Chess"]
[Site "Chess.com"]
[Date "2026.10.24"]
[White "test_chesscom_user"]
[Black "GrandmasterOpponent"]
[Result "1-0"]
[UTCDate "2026.10.24"]
[UTCTime "12:00:00"]
[WhiteElo "1500"]
[BlackElo "1480"]
[TimeControl "600"]
[ECO "C50"]

1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 1-0"""
}

def test_sync_games_mocked(auth_client):
    with patch("app.services.chesscom_client.ChesscomClient.fetch_archives", new_callable=AsyncMock) as mock_archives, \
         patch("app.services.chesscom_client.ChesscomClient.fetch_archive_games", new_callable=AsyncMock) as mock_games:

        mock_archives.return_value = ["https://api.chess.com/pub/player/test_chesscom_user/games/2026/10"]
        mock_games.return_value = [MOCK_CHESSCOM_GAME]

        response = auth_client.post("/api/v1/sync")
        assert response.status_code == 200
        data = response.json()
        assert "jobId" in data
        job_id = data["jobId"]

        # Check job status
        job_resp = auth_client.get(f"/api/v1/jobs/{job_id}")
        assert job_resp.status_code == 200
        job_data = job_resp.json()
        assert job_data["status"] == "done"
        assert job_data["progress"] == 100
        assert job_data["result"]["syncedCount"] == 1
        assert job_data["result"]["chesscom"] == 1

        # Run sync again; verify de-duplication (0 new games)
        response2 = auth_client.post("/api/v1/sync")
        assert response2.status_code == 200
        job_id2 = response2.json()["jobId"]
        job_resp2 = auth_client.get(f"/api/v1/jobs/{job_id2}")
        assert job_resp2.status_code == 200
        job_data2 = job_resp2.json()
        assert job_data2["status"] == "done"
        assert job_data2["result"]["syncedCount"] == 0
