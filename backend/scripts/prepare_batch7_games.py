"""Prepares 25 games each from the players with remaining games:
  1. hikaru (~3300+ Super GM): 25 games (from local unanalyzed pool)
  2. jynxzii (~464 Casual Streamer): 25 games (from Chess.com API)
  3. samayraina (~1608 Strong Club): 25 games (from Chess.com API)
  4. garythursday (~2307 Candidate Master): 25 games (from Chess.com API)
  5. loveandpeach (~2504 Master): 11 games (all remaining to hit 100% completion)

Total: 111 new games (222 player evaluations).
Saves assembled games to backend/.cache/batch7_raw_games.json.
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
TIER_DATA_FILE = os.path.join(CACHE_DIR, "tier_games_cache.json")
OUTPUT_BATCH7_FILE = os.path.join(CACHE_DIR, "batch7_raw_games.json")
ALL_EVALUATED_FILE = os.path.join(CACHE_DIR, "drops_all_1626_games.json")

HEADERS = {"User-Agent": "ChessReviewCalibration/1.0 (contact: roger@example.com)"}


def fetch_url(url: str, pause: float = 0.15) -> dict:
    time.sleep(pause)
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode("utf-8"))


def get_already_evaluated_ids() -> set:
    already = set()
    if os.path.exists(ALL_EVALUATED_FILE):
        with open(ALL_EVALUATED_FILE, "r", encoding="utf-8") as f:
            for g in json.load(f):
                already.add(str(g["id"]))
    print(f"Already evaluated across 1,626 games: {len(already)} unique game IDs.")
    return already


def select_local_hikaru(already_ids: set, target_count: int = 25) -> List[Dict[str, Any]]:
    print(f"\nSelecting {target_count} unseen Hikaru games from local pool...")
    with open(FILTERED_DATA_FILE, "r", encoding="utf-8") as f:
        filtered = json.load(f)

    hikaru_all = filtered.get("hikaru", [])
    unanalyzed = [g for g in hikaru_all if str(g["id"]) not in already_ids]
    print(f"  Found {len(unanalyzed)} unanalyzed Hikaru games locally.")
    selected = unanalyzed[:target_count]
    print(f"  Selected {len(selected)} new Hikaru games for Batch 7.")
    return selected


def select_local_loveandpeach(already_ids: set) -> List[Dict[str, Any]]:
    print("\nSelecting all remaining unseen LoveAndPeach games from local pool...")
    with open(TIER_DATA_FILE, "r", encoding="utf-8") as f:
        tg = json.load(f)

    lap_all = tg.get("loveandpeach", [])
    selected = [
        g for g in lap_all
        if str(g.get("id")) not in already_ids
        and len(g.get("moves", [])) >= 40
        and g.get("cc")
    ]
    print(f"  Selected {len(selected)} remaining LoveAndPeach games.")
    return selected


def download_user_games(username: str, already_ids: set, target_count: int = 25) -> List[Dict[str, Any]]:
    print(f"\nFetching archives for {username} (target: {target_count} games)...")
    arch_url = f"https://api.chess.com/pub/player/{username}/games/archives"
    arch_data = fetch_url(arch_url)
    archives = arch_data.get("archives", [])
    print(f"  Found {len(archives)} monthly archives for {username}.")

    valid_games = []
    for arc_url in reversed(archives):
        if len(valid_games) >= target_count:
            break
        try:
            m_data = fetch_url(arc_url)
            games = m_data.get("games", [])
            print(f"    Scanning {arc_url.split('/')[-2]}/{arc_url.split('/')[-1]} ({len(games)} games)...")

            for g in reversed(games):
                if len(valid_games) >= target_count:
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
        except Exception as e:
            print(f"    Warning: error fetching {arc_url}: {e}")

    print(f"  Successfully collected {len(valid_games)} / {target_count} new games for {username}.")
    return valid_games[:target_count]


def main():
    t0 = time.time()
    print("=" * 80)
    print("BATCH 7 PREPARATION: 25 GAMES FROM EACH PLAYER WITH REMAINING GAMES")
    print("=" * 80)

    already_ids = get_already_evaluated_ids()

    # 1. Hikaru (25 games)
    hikaru_games = select_local_hikaru(already_ids, 25)
    for g in hikaru_games:
        already_ids.add(str(g["id"]))

    # 2. LoveAndPeach (11 remaining games)
    lap_games = select_local_loveandpeach(already_ids)
    for g in lap_games:
        already_ids.add(str(g["id"]))

    # 3. Jynxzii (25 games)
    jynxzii_games = download_user_games("jynxzii", already_ids, 25)
    for g in jynxzii_games:
        already_ids.add(str(g["id"]))

    # 4. SamayRaina (25 games)
    samay_games = download_user_games("samayraina", already_ids, 25)
    for g in samay_games:
        already_ids.add(str(g["id"]))

    # 5. GaryThursday (25 games)
    gary_games = download_user_games("garythursday", already_ids, 25)
    for g in gary_games:
        already_ids.add(str(g["id"]))

    all_batch7 = hikaru_games + lap_games + jynxzii_games + samay_games + gary_games
    print(f"\nTotal Assembled Batch 7 Games: {len(all_batch7)}")
    print(f"  hikaru       : {len(hikaru_games)}")
    print(f"  loveandpeach : {len(lap_games)}")
    print(f"  jynxzii      : {len(jynxzii_games)}")
    print(f"  samayraina   : {len(samay_games)}")
    print(f"  garythursday : {len(gary_games)}")

    with open(OUTPUT_BATCH7_FILE, "w", encoding="utf-8") as f:
        json.dump(all_batch7, f)

    print(f"\nSaved Batch 7 games to {OUTPUT_BATCH7_FILE} in {time.time() - t0:.1f}s.")


if __name__ == "__main__":
    main()
