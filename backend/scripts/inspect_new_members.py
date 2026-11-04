import json
import time
import urllib.request
import re

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 ChessReviewResearch/1.0"
}

usernames = [
    "jynxzii",
    "gyrostomp",
    "ishowspeed",
    "loveandpeach",
    "samayraina",
]

def fetch_json(url, retries=3):
    for i in range(retries):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=10) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except Exception as e:
            time.sleep(1)
            if i == retries - 1:
                print(f"Error fetching {url}: {e}")
                return None

results = []

for u in usernames:
    print(f"Checking user: {u}...")
    # 1. Profile & Stats
    stats = fetch_json(f"https://api.chess.com/pub/player/{u}/stats") or {}
    profile = fetch_json(f"https://api.chess.com/pub/player/{u}") or {}
    
    rapid_rating = stats.get("chess_rapid", {}).get("last", {}).get("rating")
    blitz_rating = stats.get("chess_blitz", {}).get("last", {}).get("rating")
    bullet_rating = stats.get("chess_bullet", {}).get("last", {}).get("rating")
    daily_rating = stats.get("chess_daily", {}).get("last", {}).get("rating")
    
    # 2. Archives
    arch_data = fetch_json(f"https://api.chess.com/pub/player/{u}/games/archives") or {}
    archives = arch_data.get("archives", [])
    
    total_games = 0
    reviewed_games = 0
    valid_filtered_reviewed = 0
    
    print(f"  Found {len(archives)} monthly archives for {u}. Scanning games...")
    for arc_url in archives:
        time.sleep(0.15)
        m_data = fetch_json(arc_url) or {}
        games = m_data.get("games", [])
        total_games += len(games)
        for g in games:
            acc = g.get("accuracies")
            if acc and acc.get("white") is not None and acc.get("black") is not None:
                reviewed_games += 1
                # Check standard chess + >= 40 plies
                if g.get("rules") == "chess":
                    pgn = g.get("pgn", "")
                    # count moves roughly from pgn or pgn header
                    if pgn:
                        # rough ply count from moves or pgn
                        move_tokens = re.findall(r"\b\d+\.\s+", pgn)
                        # if at least 20 move numbers, it's roughly 40 plies
                        if len(move_tokens) >= 20:
                            valid_filtered_reviewed += 1

    results.append({
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
    })

print("\n" + "="*80)
print("RESULTS SUMMARY:")
print(json.dumps(results, indent=2))
