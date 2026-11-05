"""Prepares 150 valid reviewed games each from:
  1. jynxzii (~464 Elo Casual)
  2. samayraina (~1608 Elo Strong Club)
  3. garythursday (~2307 Elo Candidate Master)
  4. hikaru (~3300 Elo Super GM - 150 new unanalyzed games from existing dataset)

Total: 600 games (1,200 player-game evaluations).
Saves assembled games to backend/.cache/batch5_raw_600_games.json.
"""

import json
import os
import re
import sys
import time
import urllib.request
from typing import Any, Dict, List

HERE = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(HERE)
sys.path.insert(0, BACKEND_DIR)

from app.services.pgn_parser import parse_pgn_game

CACHE_DIR = os.path.join(BACKEND_DIR, ".cache")
FILTERED_DATA_FILE = os.path.join(CACHE_DIR, "chesscom_filtered_games.json")
OUTPUT_BATCH5_FILE = os.path.join(CACHE_DIR, "batch5_raw_600_games.json")

BATCH_FILES = [
    os.path.join(CACHE_DIR, "game_by_game_149_analysis.json"),
    os.path.join(CACHE_DIR, "game_by_game_200_batch2.json"),
    os.path.join(CACHE_DIR, "game_by_game_100_batch3.json"),
    os.path.join(CACHE_DIR, "game_by_game_batch4.json"),
]

HEADERS = {"User-Agent": "ChessReviewCalibration/1.0 (contact: roger@example.com)"}


def fetch_url(url: str, pause: float = 0.15) -> dict:
    time.sleep(pause)
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode("utf-8"))


def download_user_games(username: str, target_count: int = 150) -> List[Dict[str, Any]]:
    print(f"\nFetching archives for {username} (target: {target_count} games)...")
    arch_url = f"https://api.chess.com/pub/player/{username}/games/archives"
    arch_data = fetch_url(arch_url)
    archives = arch_data.get("archives", [])
    print(f"  Found {len(archives)} monthly archives for {username}.")

    valid_games = []
    # Reverse archives so we get the most recent games first
    for arc_url in reversed(archives):
        if len(valid_games) >= target_count:
            break
        try:
            m_data = fetch_url(arc_url)
            games = m_data.get("games", [])
            print(f"    Scanning archive {arc_url.split('/')[-2]}/{arc_url.split('/')[-1]} ({len(games)} games)...")
            
            for g in reversed(games):
                if len(valid_games) >= target_count:
                    break
                if g.get("rules") != "chess":
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

                gid = g.get("url", "").split("/")[-1] or g.get("uuid") or str(len(valid_games) + 1)
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
        except Exception as e:
            print(f"    Warning: error fetching {arc_url}: {e}")

    print(f"  Successfully collected {len(valid_games)} / {target_count} games for {username}.")
    return valid_games[:target_count]


def get_already_evaluated_ids() -> set:
    already = set()
    for bf in BATCH_FILES:
        if os.path.exists(bf):
            with open(bf, "r", encoding="utf-8") as f:
                for g in json.load(f):
                    already.add(str(g["id"]))
    print(f"Already evaluated across Batches 1-4: {len(already)} unique game IDs.")
    return already


def select_hikaru_games(target_count: int = 150) -> List[Dict[str, Any]]:
    already_ids = get_already_evaluated_ids()
    with open(FILTERED_DATA_FILE, "r", encoding="utf-8") as f:
        filtered = json.load(f)

    hikaru_all = filtered.get("hikaru", [])
    unanalyzed = [g for g in hikaru_all if str(g["id"]) not in already_ids]
    print(f"Found {len(unanalyzed)} unanalyzed Hikaru games in existing filtered dataset.")
    selected = unanalyzed[:target_count]
    print(f"Selected {len(selected)} new Hikaru games for Batch 5.")
    return selected


def main():
    t0 = time.time()
    print("=" * 80)
    print("BATCH 5 PREPARATION: 150 GAMES EACH (Jynxzii, SamayRaina, GaryThursday, Hikaru)")
    print("=" * 80)

    # 1. Hikaru (from existing pre-filtered local dataset)
    hikaru_games = select_hikaru_games(150)

    # 2. Jynxzii (~464 Elo)
    jynxzii_games = download_user_games("jynxzii", 150)

    # 3. SamayRaina (~1608 Elo)
    samay_games = download_user_games("samayraina", 150)

    # 4. GaryThursday (~2307 Elo)
    gary_games = download_user_games("garythursday", 150)

    all_batch5 = jynxzii_games + samay_games + gary_games + hikaru_games
    print(f"\nTotal Assembled Batch 5 Games: {len(all_batch5)}")
    print(f"  jynxzii      : {len(jynxzii_games)}")
    print(f"  samayraina   : {len(samay_games)}")
    print(f"  garythursday : {len(gary_games)}")
    print(f"  hikaru       : {len(hikaru_games)}")

    with open(OUTPUT_BATCH5_FILE, "w", encoding="utf-8") as f:
        json.dump(all_batch5, f)

    print(f"Saved Batch 5 games to {OUTPUT_BATCH5_FILE} in {time.time() - t0:.1f}s.")


if __name__ == "__main__":
    main()
