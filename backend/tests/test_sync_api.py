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
    with patch("app.services.chesscom_client.ChesscomClient.fetch_recent_games", new_callable=AsyncMock) as mock_cc:
        mock_cc.return_value = [MOCK_CHESSCOM_GAME]

        response = auth_client.post("/api/v1/sync")
        assert response.status_code == 200
        data = response.json()
        assert data["syncedCount"] == 1
        assert data["chesscom"] == 1
        assert "Synced 1 new games" in data["message"]

        # Run sync again; verify de-duplication (0 new games)
        response2 = auth_client.post("/api/v1/sync")
        assert response2.status_code == 200
        data2 = response2.json()
        assert data2["syncedCount"] == 0
        assert "up to date" in data2["message"]
