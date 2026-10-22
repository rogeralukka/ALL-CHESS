"""
Chess Guide & Coach - Backend API Service
Provides game fetching, Stockfish analysis queuing, and tactic detection.
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import chess
import chess.pgn
import chess.engine
import io
import requests

app = FastAPI(title="Chess Guide Engine API", version="1.0.0")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "Chess Guide Engine"}

@app.get("/api/games/chesscom/{username}")
def fetch_chesscom_games(username: str, year: int = Query(...), month: int = Query(...)):
    """Fetch monthly game archives from Chess.com public API."""
    month_str = f"{month:02d}"
    url = f"https://api.chess.com/pub/player/{username}/games/{year}/{month_str}"
    headers = {"User-Agent": "ChessGuideApp/1.0 (contact@chessguide.local)"}
    
    resp = requests.get(url, headers=headers)
    if resp.status_code == 404:
        raise HTTPException(status_code=404, detail="Player or month not found")
    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail="Failed to fetch from Chess.com")
        
    return resp.json()

@app.get("/api/games/lichess/{username}")
def fetch_lichess_games(username: str, max_games: int = 50, since: int = None):
    """Fetch recent games from Lichess public API."""
    url = f"https://lichess.org/api/games/user/{username}"
    params = {"max": max_games, "pgnInJson": "true", "clocks": "true", "evals": "true"}
    if since:
        params["since"] = since
        
    headers = {"Accept": "application/x-ndjson"}
    resp = requests.get(url, params=params, headers=headers)
    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail="Failed to fetch from Lichess")
        
    games = []
    for line in resp.text.strip().split("\n"):
        if line:
            import json
            try:
                games.append(json.loads(line))
            except Exception:
                continue
    return {"games": games}
