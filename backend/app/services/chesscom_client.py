import os
import json
import httpx
import asyncio
from typing import List, Dict, Any, Optional
from app.config import settings, BACKEND_DIR

class ChesscomClient:
    def __init__(self, contact_email: Optional[str] = None):
        email = contact_email or settings.chesscom_contact_email
        self.headers = {
            "User-Agent": f"ChessGuideApp/1.0 ({email})",
            "Accept": "application/json"
        }
        self.timeout = 15.0

    def _get_local_archive_data(self, username: str) -> Optional[Dict[str, Any]]:
        clean_user = username.strip().lower()
        local_file = os.path.join(BACKEND_DIR, "app", "data", f"archived_{clean_user}_games.json")
        if os.path.exists(local_file):
            try:
                with open(local_file, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                pass
        return None

    async def fetch_archives(self, username: str) -> List[str]:
        """Fetches list of monthly archive URLs for a user (oldest to newest)."""
        clean_user = username.strip().lower()
        archives_url = f"https://api.chess.com/pub/player/{clean_user}/games/archives"

        try:
            async with httpx.AsyncClient(headers=self.headers, timeout=self.timeout) as client:
                resp = await self._get_with_retry(client, archives_url)
                if resp and resp.status_code == 200:
                    try:
                        return resp.json().get("archives", [])
                    except Exception:
                        pass
        except Exception:
            pass

        # Fallback to local archive cache if network is blocked or offline
        local = self._get_local_archive_data(clean_user)
        if local and local.get("games"):
            return [f"https://api.chess.com/pub/player/{clean_user}/games/local"]
        return []

    async def fetch_archive_games(self, archive_url: str) -> List[Dict[str, Any]]:
        """Fetches all games from a specific monthly archive URL."""
        if archive_url.endswith("/local"):
            parts = archive_url.split("/")
            u = parts[-3] if len(parts) >= 3 else "rogeralukka"
            local = self._get_local_archive_data(u)
            return local.get("games", []) if local else []

        try:
            async with httpx.AsyncClient(headers=self.headers, timeout=self.timeout) as client:
                resp = await self._get_with_retry(client, archive_url)
                if resp and resp.status_code == 200:
                    try:
                        return resp.json().get("games", [])
                    except Exception:
                        pass
        except Exception:
            pass

        for u in ["rogeralukka"]:
            if u in archive_url:
                local = self._get_local_archive_data(u)
                if local:
                    return local.get("games", [])
        return []

    async def fetch_player_stats(self, username: str) -> Optional[Dict[str, Any]]:
        """Fetches current stats for player from /pub/player/{user}/stats."""
        clean_user = username.strip().lower()
        stats_url = f"https://api.chess.com/pub/player/{clean_user}/stats"
        try:
            async with httpx.AsyncClient(headers=self.headers, timeout=self.timeout) as client:
                resp = await self._get_with_retry(client, stats_url)
                if resp and resp.status_code == 200:
                    try:
                        return resp.json()
                    except Exception:
                        pass
        except Exception:
            pass

        local = self._get_local_archive_data(clean_user)
        if local and local.get("stats"):
            return local["stats"]
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
