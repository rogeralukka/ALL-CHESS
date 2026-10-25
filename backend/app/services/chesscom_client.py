import httpx
import asyncio
from typing import List, Dict, Any, Optional
from app.config import settings

class ChesscomClient:
    def __init__(self, contact_email: Optional[str] = None):
        email = contact_email or settings.chesscom_contact_email
        self.headers = {
            "User-Agent": f"ChessGuideApp/1.0 ({email})",
            "Accept": "application/json"
        }
        self.timeout = 15.0

    async def fetch_archives(self, username: str) -> List[str]:
        """Fetches list of monthly archive URLs for a user (oldest to newest)."""
        clean_user = username.strip().lower()
        archives_url = f"https://api.chess.com/pub/player/{clean_user}/games/archives"

        async with httpx.AsyncClient(headers=self.headers, timeout=self.timeout) as client:
            resp = await self._get_with_retry(client, archives_url)
            if not resp or resp.status_code != 200:
                return []
            return resp.json().get("archives", [])

    async def fetch_archive_games(self, archive_url: str) -> List[Dict[str, Any]]:
        """Fetches all games from a specific monthly archive URL."""
        async with httpx.AsyncClient(headers=self.headers, timeout=self.timeout) as client:
            resp = await self._get_with_retry(client, archive_url)
            if not resp or resp.status_code != 200:
                return []
            return resp.json().get("games", [])

    async def fetch_player_stats(self, username: str) -> Optional[Dict[str, Any]]:
        """Fetches current stats for player from /pub/player/{user}/stats."""
        clean_user = username.strip().lower()
        stats_url = f"https://api.chess.com/pub/player/{clean_user}/stats"
        async with httpx.AsyncClient(headers=self.headers, timeout=self.timeout) as client:
            resp = await self._get_with_retry(client, stats_url)
            if resp and resp.status_code == 200:
                return resp.json()
            return None

    async def fetch_recent_games(self, username: str, max_games: int = 50) -> List[Dict[str, Any]]:
        """Fetches games from the most recent monthly archive(s) for a Chess.com user."""
        archives = await self.fetch_archives(username)
        if not archives:
            return []

        collected_games: List[Dict[str, Any]] = []
        for archive_url in reversed(archives):
            games = await self.fetch_archive_games(archive_url)
            for g in reversed(games):
                collected_games.append(g)
                if len(collected_games) >= max_games:
                    break
            if len(collected_games) >= max_games:
                break
            await asyncio.sleep(0.1)

        return collected_games

    async def _get_with_retry(self, client: httpx.AsyncClient, url: str, max_retries: int = 3) -> Optional[httpx.Response]:
        delay = 1.0
        for attempt in range(max_retries):
            try:
                resp = await client.get(url)
                if resp.status_code == 429:  # Rate limit
                    await asyncio.sleep(delay)
                    delay *= 2.0
                    continue
                return resp
            except (httpx.RequestError, httpx.TimeoutException):
                if attempt == max_retries - 1:
                    return None
                await asyncio.sleep(delay)
                delay *= 2.0
        return None
