from unittest.mock import AsyncMock, patch
import httpx
import json

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

MOCK_LICHESS_GAME = {
    "id": "lichess12345",
    "pgn": """[Event "Rated Blitz game"]
[Site "https://lichess.org/lichess12345"]
[Date "2026.10.24"]
[White "test_lichess_user"]
[Black "GrandmasterOpponent"]
[Result "1-0"]
[UTCDate "2026.10.24"]
[UTCTime "12:00:00"]
[WhiteElo "1500"]
[BlackElo "1480"]
[TimeControl "180+2"]
[ECO "C50"]

1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 1-0"""
}

def test_sync_games_mocked(auth_client):
    """Test sync flow with both Chess.com and Lichess clients fully mocked (zero network calls)."""
    with patch("app.services.chesscom_client.ChesscomClient.fetch_archives", new_callable=AsyncMock) as mock_archives, \
         patch("app.services.chesscom_client.ChesscomClient.fetch_archive_games", new_callable=AsyncMock) as mock_games, \
         patch("app.services.lichess_client.LichessClient.fetch_games", new_callable=AsyncMock) as mock_lichess_games:

        mock_archives.return_value = ["https://api.chess.com/pub/player/test_chesscom_user/games/2026/10"]
        mock_games.return_value = [MOCK_CHESSCOM_GAME]
        mock_lichess_games.return_value = []

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
        assert job_data["result"]["lichess"] == 0

        # Run sync again; verify de-duplication (0 new games)
        response2 = auth_client.post("/api/v1/sync")
        assert response2.status_code == 200
        job_id2 = response2.json()["jobId"]
        job_resp2 = auth_client.get(f"/api/v1/jobs/{job_id2}")
        assert job_resp2.status_code == 200
        job_data2 = job_resp2.json()
        assert job_data2["status"] == "done"
        assert job_data2["result"]["syncedCount"] == 0


def test_sync_games_offline_transport_mock(auth_client):
    """Verifies Lichess HTTP transport mocking fully passes offline using httpx MockTransport."""
    def mock_handler(request: httpx.Request):
        # Return NDJSON response matching Lichess API format
        ndjson_body = json.dumps(MOCK_LICHESS_GAME) + "\n"
        return httpx.Response(200, text=ndjson_body)

    mock_transport = httpx.MockTransport(mock_handler)
    real_async_client = httpx.AsyncClient

    with patch("app.services.chesscom_client.ChesscomClient.fetch_archives", new_callable=AsyncMock) as mock_archives, \
         patch("app.services.chesscom_client.ChesscomClient.fetch_archive_games", new_callable=AsyncMock) as mock_games, \
         patch("app.services.lichess_client.httpx.AsyncClient", side_effect=lambda *a, **kw: real_async_client(transport=mock_transport, **{k: v for k, v in kw.items() if k != "transport"})):

        mock_archives.return_value = []
        mock_games.return_value = []

        response = auth_client.post("/api/v1/sync")
        assert response.status_code == 200
        job_id = response.json()["jobId"]

        job_resp = auth_client.get(f"/api/v1/jobs/{job_id}")
        assert job_resp.status_code == 200
        job_data = job_resp.json()
        assert job_data["status"] == "done"
        assert job_data["result"]["lichess"] == 1
