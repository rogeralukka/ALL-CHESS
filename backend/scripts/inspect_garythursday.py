import json
import time
import urllib.request
import re

HEADERS = {
    "User-Agent": "ChessReviewResearch/1.0 (contact: roger@example.com)"
}

u = "garythursday"
def fetch_json(url):
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=10) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

profile = fetch_json(f"https://api.chess.com/pub/player/{u}") or {}
stats = fetch_json(f"https://api.chess.com/pub/player/{u}/stats") or {}
arch_data = fetch_json(f"https://api.chess.com/pub/player/{u}/games/archives") or {}
archives = arch_data.get("archives", [])

rapid_rating = stats.get("chess_rapid", {}).get("last", {}).get("rating")
blitz_rating = stats.get("chess_blitz", {}).get("last", {}).get("rating")
bullet_rating = stats.get("chess_bullet", {}).get("last", {}).get("rating")
daily_rating = stats.get("chess_daily", {}).get("last", {}).get("rating")

total_games = 0
reviewed_games = 0
valid_filtered_reviewed = 0

print(f"Scanning {len(archives)} archives for {u}...")
for arc_url in archives:
    time.sleep(0.1)
    m_data = fetch_json(arc_url) or {}
    games = m_data.get("games", [])
    total_games += len(games)
    for g in games:
        acc = g.get("accuracies")
        if acc and acc.get("white") is not None and acc.get("black") is not None:
            reviewed_games += 1
            if g.get("rules") == "chess":
                pgn = g.get("pgn", "")
                if pgn:
                    move_tokens = re.findall(r"\b\d+\.\s+", pgn)
                    if len(move_tokens) >= 20:
                        valid_filtered_reviewed += 1

res = {
    "username": u,
    "name": profile.get("name", u),
    "rapid": rapid_rating,
    "blitz": blitz_rating,
    "bullet": bullet_rating,
    "daily": daily_rating,
    "total_archives": len(archives),
    "total_games": total_games,
    "reviewed_games": reviewed_games,
    "valid_filtered_reviewed": valid_filtered_reviewed,
}

print(json.dumps(res, indent=2))
