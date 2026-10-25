import httpx
import asyncio
import json
from typing import List, Dict, Any, Optional

class LichessClient:
    def __init__(self):
        self.headers = {
            "Accept": "application/x-ndjson",
            "User-Agent": "ChessGuideApp/1.0"
        }
        self.timeout = 15.0

    async def fetch_recent_games(self, username: str, max_games: int = 50) -> List[Dict[str, Any]]:
        """
        Fetches recent games for a Lichess user in NDJSON format.
        """
        clean_user = username.strip().lower()
        url = f"https://lichess.org/api/games/user/{clean_user}"
        params = {
            "max": max_games,
            "pgnInJson": "true",
            "clocks": "true",
            "opening": "true",
            "evals": "true"
        }

        async with httpx.AsyncClient(headers=self.headers, timeout=self.timeout) as client:
            resp = await self._get_with_retry(client, url, params)
            if not resp or resp.status_code != 200:
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

    async def _get_with_retry(
        self,
        client: httpx.AsyncClient,
        url: str,
        params: Dict[str, Any],
        max_retries: int = 3
    ) -> Optional[httpx.Response]:
        delay = 1.0
        for attempt in range(max_retries):
            try:
                resp = await client.get(url, params=params)
                if resp.status_code == 429: # Rate limit
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
