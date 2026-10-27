import httpx
import asyncio
import json
from typing import List, Dict, Any, Optional

class LichessError(Exception):
    """Exception raised when Lichess API returns an error or is unreachable."""
    pass

class LichessClient:
    def __init__(self):
        self.headers = {
            "Accept": "application/x-ndjson",
            "User-Agent": "ChessGuideApp/1.0"
        }
        self.timeout = 20.0

    async def fetch_games(
        self,
        username: str,
        since: int = 0,
        max_games: Optional[int] = None
    ) -> List[Dict[str, Any]]:
        """
        Fetches games for a Lichess user in NDJSON format.
        since: Milliseconds epoch timestamp (0 for full history).
        """
        clean_user = username.strip().lower()
        url = f"https://lichess.org/api/games/user/{clean_user}"
        params: Dict[str, Any] = {
            "pgnInJson": "true",
            "clocks": "true",
            "opening": "true",
            "evals": "true"
        }
        if since > 0:
            params["since"] = since
        if max_games is not None:
            params["max"] = max_games

        async with httpx.AsyncClient(headers=self.headers, timeout=self.timeout) as client:
            resp = await self._get_with_retry(client, url, params)
            if not resp:
                return []
            if resp.status_code == 404:
                return []
            if resp.status_code >= 500:
                raise LichessError(f"Lichess API returned status {resp.status_code} for user '{clean_user}' games.")
            if resp.status_code != 200:
                return []

            games = []
            for line in resp.text.strip().split("\n"):
                line_str = line.strip()
                if line_str:
                    try:
                        game_obj = json.loads(line_str)
                        games.append(game_obj)
                    except Exception:
                        continue
            return games

    async def fetch_player_stats(self, username: str) -> Optional[Dict[str, Any]]:
        """Fetches public user profile with ratings per speed from https://lichess.org/api/user/{username}."""
        clean_user = username.strip().lower()
        url = f"https://lichess.org/api/user/{clean_user}"
        headers = {
            "Accept": "application/json",
            "User-Agent": "ChessGuideApp/1.0"
        }
        async with httpx.AsyncClient(headers=headers, timeout=self.timeout) as client:
            resp = await self._get_with_retry(client, url, params={})
            if resp and resp.status_code == 200:
                return resp.json()
            if resp and resp.status_code == 404:
                return None
            if resp and resp.status_code >= 500:
                raise LichessError(f"Lichess API returned status {resp.status_code} for user '{clean_user}' profile.")
            return None

    async def fetch_recent_games(self, username: str, max_games: int = 50) -> List[Dict[str, Any]]:
        return await self.fetch_games(username, since=0, max_games=max_games)

    async def _get_with_retry(
        self,
        client: httpx.AsyncClient,
        url: str,
        params: Dict[str, Any],
        max_retries: int = 3
    ) -> Optional[httpx.Response]:
        delay = 1.0
        last_exc: Optional[Exception] = None
        for attempt in range(max_retries):
            try:
                resp = await client.get(url, params=params)
                if resp.status_code == 429:  # Rate limit
                    await asyncio.sleep(delay)
                    delay *= 2.0
                    continue
                return resp
            except (httpx.RequestError, httpx.TimeoutException) as exc:
                last_exc = exc
                if attempt == max_retries - 1:
                    raise LichessError(f"Failed to connect to Lichess: {exc}")
                await asyncio.sleep(delay)
                delay *= 2.0
        if last_exc:
            raise LichessError(f"Failed to connect to Lichess: {last_exc}")
        return None
