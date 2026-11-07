import json
import os
import re
import sys
import time
import urllib.request
from collections import defaultdict
from typing import Dict, List, Any

HERE = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(HERE)
sys.path.insert(0, BACKEND_DIR)

CACHE_DIR = os.path.join(BACKEND_DIR, ".cache")
GAMES_FILE = os.path.join(CACHE_DIR, "drops_all_2123_games.json")

# Seed accounts to mine opponents from
SEED_ACCOUNTS = {"ishowspeed", "jynxzii", "gyrostomp", "nickorlando24"}

with open(GAMES_FILE, "r", encoding="utf-8") as f:
    games = json.load(f)

# Extract unique opponents and their ratings
opponents = {}
for g in games:
    u = g.get("user")
    if u in SEED_ACCOUNTS:
        w_u = (g.get("white_user") or "").lower()
        b_u = (g.get("black_user") or "").lower()
        opp_name = b_u if w_u == u else w_u
        opp_rating = g.get("black_rating") if w_u == u else g.get("white_rating")
        if opp_name and opp_name not in SEED_ACCOUNTS:
            if opp_name not in opponents:
                opponents[opp_name] = {
                    "username": opp_name,
                    "rating": opp_rating,
                    "seen_from": u,
                    "game_count_in_our_db": 1,
                }
            else:
                opponents[opp_name]["game_count_in_our_db"] += 1
                if opp_rating and (not opponents[opp_name]["rating"] or opp_rating > opponents[opp_name]["rating"]):
                    opponents[opp_name]["rating"] = opp_rating

print(f"Total unique opponents mined from {SEED_ACCOUNTS}: {len(opponents)}")

# Group by rating buckets
buckets = {
    "< 500": [],
    "500 - 800": [],
    "800 - 1200": [],
    "1200 - 1500": [],
    "Other": []
}

for name, d in opponents.items():
    r = d.get("rating")
    if not r:
        buckets["Other"].append(d)
    elif r < 500:
        buckets["< 500"].append(d)
    elif r < 800:
        buckets["500 - 800"].append(d)
    elif r < 1200:
        buckets["800 - 1200"].append(d)
    elif r < 1500:
        buckets["1200 - 1500"].append(d)
    else:
        buckets["Other"].append(d)

print("\nOpponent Counts per Target Bucket:")
for b_name, lst in buckets.items():
    print(f"  {b_name:<12}: {len(lst)} candidates")

# Save candidate list to cache
CANDIDATES_FILE = os.path.join(CACHE_DIR, "candidate_opponents.json")
with open(CANDIDATES_FILE, "w", encoding="utf-8") as f:
    json.dump(buckets, f, indent=2)
print(f"\nSaved candidates to {CANDIDATES_FILE}")
