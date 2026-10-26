import logging
import httpx
import asyncio
from typing import List, Dict, Any, Optional
from app.config import settings

logger = logging.getLogger("all_chess.chesscom_client")

class ChesscomError(Exception):
    """Exception raised when Chess.com API returns an error or is unreachable."""
    pass

class ChesscomClient:
    def __init__(self, contact_email: Optional[str] = None):
        email = contact_email or settings.chesscom_contact_email
        self.headers = {
            "User-Agent": f"ChessGuideApp/1.0 ({email})",
            "Accept": "application/json"
        }
        self.timeout = 20.0

    async def fetch_archives(self, username: str) -> List[str]:
        """Fetches list of monthly archive URLs for a user (oldest to newest)."""
        clean_user = username.strip().lower()
        archives_url = f"https://api.chess.com/pub/player/{clean_user}/games/archives"

        async with httpx.AsyncClient(headers=self.headers, timeout=self.timeout) as client:
            resp = await self._get_with_retry(client, archives_url)
            if resp.status_code == 404:
                logger.warning(f"Chess.com user '{clean_user}' not found (404).")
                return []
            if resp.status_code != 200:
                raise ChesscomError(
                    f"Chess.com API returned status {resp.status_code} for user '{clean_user}' archives."
                )
            try:
                data = resp.json()
                return data.get("archives", [])
            except Exception as e:
                raise ChesscomError(f"Failed to parse Chess.com archives JSON: {e}")

    async def fetch_archive_games(self, archive_url: str) -> List[Dict[str, Any]]:
        """Fetches all games from a specific monthly archive URL."""
        async with httpx.AsyncClient(headers=self.headers, timeout=self.timeout) as client:
            resp = await self._get_with_retry(client, archive_url)
            if resp.status_code != 200:
                logger.warning(f"Could not fetch Chess.com archive {archive_url}: HTTP {resp.status_code}")
                return []
            try:
                data = resp.json()
                return data.get("games", [])
            except Exception as e:
                logger.warning(f"Failed to parse Chess.com games in {archive_url}: {e}")
                return []

    async def fetch_player_stats(self, username: str) -> Optional[Dict[str, Any]]:
        """Fetches current stats for player from /pub/player/{user}/stats."""
        clean_user = username.strip().lower()
        stats_url = f"https://api.chess.com/pub/player/{clean_user}/stats"
        async with httpx.AsyncClient(headers=self.headers, timeout=self.timeout) as client:
            resp = await self._get_with_retry(client, stats_url)
            if resp.status_code == 200:
                return resp.json()
            if resp.status_code == 404:
                return None
            raise ChesscomError(f"Chess.com returned status {resp.status_code} for user '{clean_user}' stats.")

    async def fetch_player_profile(self, username: str) -> Optional[Dict[str, Any]]:
        """Fetches public player profile from https://api.chess.com/pub/player/{username}."""
        clean_user = username.strip().lower()
        profile_url = f"https://api.chess.com/pub/player/{clean_user}"
        async with httpx.AsyncClient(headers=self.headers, timeout=self.timeout) as client:
            resp = await self._get_with_retry(client, profile_url)
            if resp.status_code == 200:
                return resp.json()
            if resp.status_code == 404:
                return None
            raise ChesscomError(f"Chess.com returned status {resp.status_code} for user '{clean_user}' profile.")

    def get_player_profile(self, username: str) -> Optional[Dict[str, Any]]:
        """Synchronous fetch for public player profile."""
        clean_user = username.strip().lower()
        profile_url = f"https://api.chess.com/pub/player/{clean_user}"
        try:
            with httpx.Client(headers=self.headers, timeout=self.timeout) as client:
                resp = client.get(profile_url)
                if resp.status_code == 200:
                    return resp.json()
                return None
        except Exception as e:
            logger.warning(f"Error fetching Chess.com profile synchronously for {clean_user}: {e}")
            return None

    def get_player_stats(self, username: str) -> Optional[Dict[str, Any]]:
        """Synchronous fetch for player stats."""
        clean_user = username.strip().lower()
        stats_url = f"https://api.chess.com/pub/player/{clean_user}/stats"
        try:
            with httpx.Client(headers=self.headers, timeout=self.timeout) as client:
                resp = client.get(stats_url)
                if resp.status_code == 200:
                    return resp.json()
                return None
        except Exception as e:
            logger.warning(f"Error fetching Chess.com stats synchronously for {clean_user}: {e}")
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

    async def _get_with_retry(self, client: httpx.AsyncClient, url: str, max_retries: int = 3) -> httpx.Response:
        delay = 1.0
        last_exc: Optional[Exception] = None
        for attempt in range(max_retries):
            try:
                resp = await client.get(url)
                if resp.status_code == 429:  # Rate limit
                    await asyncio.sleep(delay)
                    delay *= 2.0
                    continue
                return resp
            except (httpx.RequestError, httpx.TimeoutException) as exc:
                last_exc = exc
                if attempt == max_retries - 1:
                    break
                await asyncio.sleep(delay)
                delay *= 2.0
        raise ChesscomError(f"Failed to connect to Chess.com ({url}): {last_exc}")
