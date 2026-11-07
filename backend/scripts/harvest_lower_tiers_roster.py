"""Harvests qualified players with 100+ reviewable games for the 3 missing lower tiers:
  1. < 500 (Novice / Casual Beginner)
  2. 500 - 800 (Developing)
  3. 800 - 1200 (Club Beginner / Intermediate)

Mines exclusively from the opponents of:
  - ishowspeed
  - jynxzii
  - gyrostomp
  - nickorlando24

Saves qualified players and their queue order to backend/.cache/tier_roster_queues.json.
"""

import json
import os
import re
import sys
import time
import urllib.request
from typing import Any, Dict, List, Tuple

HERE = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(HERE)
sys.path.insert(0, BACKEND_DIR)

from app.services.pgn_parser import parse_pgn_game

CACHE_DIR = os.path.join(BACKEND_DIR, ".cache")
CANDIDATES_FILE = os.path.join(CACHE_DIR, "candidate_opponents.json")
ROSTER_OUT_FILE = os.path.join(CACHE_DIR, "tier_roster_queues.json")
EVALUATED_GAMES_FILE = os.path.join(CACHE_DIR, "drops_all_2123_games.json")

HEADERS = {"User-Agent": "ChessReviewCalibration/1.0 (contact: roger@example.com)"}


def fetch_url(url: str, pause: float = 0.15) -> dict:
    time.sleep(pause)
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=12) as resp:
        return json.loads(resp.read().decode("utf-8"))


def count_valid_reviewed_games(username: str, already_ids: set, target_max: int = 150) -> Tuple[int, List[Dict[str, Any]]]:
    try:
        arch_url = f"https://api.chess.com/pub/player/{username}/games/archives"
        arch_data = fetch_url(arch_url)
        archives = arch_data.get("archives", [])
    except Exception as e:
        return 0, []

    valid_games = []
    # Scan from most recent archives backwards
    for arc_url in reversed(archives):
        if len(valid_games) >= target_max:
            break
        try:
            m_data = fetch_url(arc_url)
            games = m_data.get("games", [])
            for g in reversed(games):
                if len(valid_games) >= target_max:
                    break
                if g.get("rules") != "chess":
                    continue
                gid = g.get("url", "").split("/")[-1] or g.get("uuid")
                if not gid or str(gid) in already_ids:
                    continue
                acc = g.get("accuracies")
                if not acc or acc.get("white") is None or acc.get("black") is None:
                    continue
                pgn = g.get("pgn", "")
                if not pgn or re.search(r"\[(FEN|SetUp|Setup)\s+", pgn, re.IGNORECASE):
                    continue
                try:
                    parsed = parse_pgn_game(pgn, target_user_names=[username], platform="chesscom")
                except Exception:
                    continue

                moves = parsed.get("moves", [])
                if len(moves) < 40:
                    continue

                w_obj = g.get("white", {})
                b_obj = g.get("black", {})

                valid_games.append({
                    "id": gid,
                    "url": g.get("url"),
                    "user": username,
                    "time_class": g.get("time_class"),
                    "white_user": w_obj.get("username"),
                    "white_rating": w_obj.get("rating"),
                    "black_user": b_obj.get("username"),
                    "black_rating": b_obj.get("rating"),
                    "cc": {"white": float(acc["white"]), "black": float(acc["black"])},
                    "moves": moves,
                })
        except Exception:
            continue

    return len(valid_games), valid_games


def main():
    print("=" * 80)
    print("HARVESTING CANDIDATE OPPONENTS FOR MISSING TIERS (<500, 500-800, 800-1200)")
    print("=" * 80)

    already_ids = set()
    if os.path.exists(EVALUATED_GAMES_FILE):
        with open(EVALUATED_GAMES_FILE, "r", encoding="utf-8") as f:
            for g in json.load(f):
                already_ids.add(str(g["id"]))

    with open(CANDIDATES_FILE, "r", encoding="utf-8") as f:
        candidates_by_bucket = json.load(f)

    rosters = {
        "< 500": [],
        "500 - 800": [],
        "800 - 1200": []
    }

    # Target 3-5 qualified players (100+ reviewable games each) per tier
    for tier in ["< 500", "500 - 800", "800 - 1200"]:
        print(f"\nScanning candidates for Tier: {tier}...")
        candidates = candidates_by_bucket.get(tier, [])
        # Prioritize candidates who have played multiple games against seed accounts
        candidates_sorted = sorted(candidates, key=lambda x: -x.get("game_count_in_our_db", 1))

        qualified = []
        for cand in candidates_sorted:
            if len(qualified) >= 3:
                break
            uname = cand["username"]
            rating = cand.get("rating")
            print(f"  Checking {uname} (~{rating} Elo)...", end="", flush=True)

            count, sample_games = count_valid_reviewed_games(uname, already_ids, target_max=120)
            if count >= 100:
                print(f" -> QUALIFIED! ({count} valid reviewed games)")
                qualified.append({
                    "username": uname,
                    "rating": rating,
                    "valid_reviewed_count": count,
                    "games": sample_games[:100],  # Cache the 100 games
                })
            else:
                print(f" -> {count} valid games (not enough)")

        rosters[tier] = qualified
        print(f"Tier {tier} Roster Filled: {len(qualified)} players qualified.")

    with open(ROSTER_OUT_FILE, "w", encoding="utf-8") as f:
        # Save without full moves in summary for readability
        summary = {}
        for tier, players in rosters.items():
            summary[tier] = [
                {"username": p["username"], "rating": p["rating"], "games_available": p["valid_reviewed_count"]}
                for p in players
            ]
        json.dump(summary, f, indent=2)

    # Save full games payload for batch use
    PAYLOAD_FILE = os.path.join(CACHE_DIR, "tier_roster_games_payload.json")
    with open(PAYLOAD_FILE, "w", encoding="utf-8") as f:
        json.dump(rosters, f)

    print("\n" + "=" * 80)
    print("FINAL ROSTER QUEUES:")
    for tier, players in rosters.items():
        print(f"\n{tier}:")
        for i, p in enumerate(players, 1):
            print(f"  Slot {i}: {p['username']} (~{p['rating']} Elo) - {p['valid_reviewed_count']} games available")
    print("=" * 80)


if __name__ == "__main__":
    main()
