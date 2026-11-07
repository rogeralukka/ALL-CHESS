"""Prepares Batch 9: 120 games each from 6 players across all rating tiers:
  1. connor0595 (~239 Elo, Tier < 500)
  2. solyman_jami (~767 Elo, Tier 500 - 800)
  3. battatom (~926 Elo, Tier 800 - 1200)
  4. samayraina (~1608 Elo, Tier 1200 - 1800)
  5. garythursday (~2307 Elo, Tier 1800 - 2400)
  6. hikaru (~3300+ Elo, Tier 2400+)

Total: 720 games (1,440 player evaluations).
Saves assembled games to backend/.cache/batch9_raw_games.json.
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
ROSTER_PAYLOAD_FILE = os.path.join(CACHE_DIR, "tier_roster_games_payload.json")
OUTPUT_BATCH9_FILE = os.path.join(CACHE_DIR, "batch9_raw_games.json")
ALL_EVALUATED_FILE = os.path.join(CACHE_DIR, "drops_all_2123_games.json")

HEADERS = {"User-Agent": "ChessReviewCalibration/1.0 (contact: roger@example.com)"}


def fetch_url(url: str, pause: float = 0.15) -> dict:
    time.sleep(pause)
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=12) as resp:
        return json.loads(resp.read().decode("utf-8"))


def get_already_evaluated_ids() -> set:
    already = set()
    if os.path.exists(ALL_EVALUATED_FILE):
        with open(ALL_EVALUATED_FILE, "r", encoding="utf-8") as f:
            for g in json.load(f):
                already.add(str(g["id"]))
    print(f"Already evaluated across 2,123 games: {len(already)} unique game IDs.")
    return already


def select_local_hikaru(already_ids: set, target_count: int = 120) -> List[Dict[str, Any]]:
    print(f"\nSelecting {target_count} unseen Hikaru games from local pool...")
    with open(FILTERED_DATA_FILE, "r", encoding="utf-8") as f:
        filtered = json.load(f)

    hikaru_all = filtered.get("hikaru", [])
    unanalyzed = [g for g in hikaru_all if str(g["id"]) not in already_ids]
    print(f"  Found {len(unanalyzed)} unanalyzed Hikaru games locally.")
    selected = unanalyzed[:target_count]
    print(f"  Selected {len(selected)} new Hikaru games for Batch 9.")
    return selected


def get_roster_player_games(username: str, already_ids: set, target_count: int = 120) -> List[Dict[str, Any]]:
    print(f"\nFetching {target_count} games for roster player {username}...")
    games = []
    # Check if some are cached in tier_roster_games_payload.json
    if os.path.exists(ROSTER_PAYLOAD_FILE):
        with open(ROSTER_PAYLOAD_FILE, "r", encoding="utf-8") as f:
            payload = json.load(f)
        for tier, players in payload.items():
            for p in players:
                if p["username"] == username:
                    for g in p.get("games", []):
                        if str(g["id"]) not in already_ids and len(games) < target_count:
                            games.append(g)
                            already_ids.add(str(g["id"]))

    if len(games) < target_count:
        # Fetch remaining directly from Chess.com
        arch_url = f"https://api.chess.com/pub/player/{username}/games/archives"
        arch_data = fetch_url(arch_url)
        archives = arch_data.get("archives", [])
        for arc_url in reversed(archives):
            if len(games) >= target_count:
                break
            try:
                m_data = fetch_url(arc_url)
                for g in reversed(m_data.get("games", [])):
                    if len(games) >= target_count:
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
                    g_entry = {
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
                    }
                    games.append(g_entry)
                    already_ids.add(str(gid))
            except Exception:
                continue

    print(f"  Collected {len(games)} / {target_count} games for {username}.")
    return games[:target_count]


def download_api_games(username: str, already_ids: set, target_count: int = 120) -> List[Dict[str, Any]]:
    print(f"\nFetching archives for {username} (target: {target_count} games)...")
    arch_url = f"https://api.chess.com/pub/player/{username}/games/archives"
    arch_data = fetch_url(arch_url)
    archives = arch_data.get("archives", [])

    valid_games = []
    for arc_url in reversed(archives):
        if len(valid_games) >= target_count:
            break
        try:
            m_data = fetch_url(arc_url)
            for g in reversed(m_data.get("games", [])):
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
                already_ids.add(str(gid))
        except Exception:
            continue

    print(f"  Successfully collected {len(valid_games)} / {target_count} new games for {username}.")
    return valid_games[:target_count]


def main():
    t0 = time.time()
    print("=" * 80)
    print("BATCH 9 PREPARATION: 120 GAMES EACH FROM 6 BALANCED TIERS")
    print("=" * 80)

    already_ids = get_already_evaluated_ids()

    # 1. connor0595 (~239 Elo, < 500)
    connor_games = get_roster_player_games("connor0595", already_ids, 120)

    # 2. solyman_jami (~767 Elo, 500 - 800)
    solyman_games = get_roster_player_games("solyman_jami", already_ids, 120)

    # 3. battatom (~926 Elo, 800 - 1200)
    battatom_games = get_roster_player_games("battatom", already_ids, 120)

    # 4. samayraina (~1608 Elo, 1200 - 1800)
    samay_games = download_api_games("samayraina", already_ids, 120)

    # 5. garythursday (~2307 Elo, 1800 - 2400)
    gary_games = download_api_games("garythursday", already_ids, 120)

    # 6. hikaru (~3300+ Elo, 2400+)
    hikaru_games = select_local_hikaru(already_ids, 120)
    for g in hikaru_games:
        already_ids.add(str(g["id"]))

    all_batch9 = connor_games + solyman_games + battatom_games + samay_games + gary_games + hikaru_games

    print(f"\nTotal Assembled Batch 9 Games: {len(all_batch9)}")
    print(f"  connor0595   (< 500)    : {len(connor_games)}")
    print(f"  solyman_jami (500-800)  : {len(solyman_games)}")
    print(f"  battatom     (800-1200) : {len(battatom_games)}")
    print(f"  samayraina   (1200-1800): {len(samay_games)}")
    print(f"  garythursday (1800-2400): {len(gary_games)}")
    print(f"  hikaru       (2400+)    : {len(hikaru_games)}")

    with open(OUTPUT_BATCH9_FILE, "w", encoding="utf-8") as f:
        json.dump(all_batch9, f)

    print(f"\nSaved Batch 9 games to {OUTPUT_BATCH9_FILE} in {time.time() - t0:.1f}s.")


if __name__ == "__main__":
    main()
