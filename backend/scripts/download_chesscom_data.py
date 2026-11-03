import io
import json
import os
import re
import sys
import time
import urllib.request
import chess.pgn

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from app.services.pgn_parser import parse_pgn_game

CACHE_DIR = os.path.join(os.path.dirname(HERE), ".cache")
RAW_DATA_FILE = os.path.join(CACHE_DIR, "chesscom_raw_games.json")
PARSED_DATA_FILE = os.path.join(CACHE_DIR, "chesscom_filtered_games.json")

HEADERS = {"User-Agent": "ALL-CHESS calibration script"}


def fetch_url(url: str, pause: float = 0.3) -> dict:
    time.sleep(pause)
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))


def download_archives():
    os.makedirs(CACHE_DIR, exist_ok=True)
    if os.path.exists(RAW_DATA_FILE):
        print(f"Loading cached raw games from {RAW_DATA_FILE}...")
        with open(RAW_DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)

    users = {
        "hikaru": {"last_n_months": 3},
        "nickorlando24": {"last_n_months": None},
        "rogeralukka": {"last_n_months": None},
    }

    raw_by_user = {}
    for user, cfg in users.items():
        print(f"Fetching archives for {user}...")
        arch_url = f"https://api.chess.com/pub/player/{user}/games/archives"
        arch_data = fetch_url(arch_url)
        archives = arch_data.get("archives", [])
        if cfg["last_n_months"]:
            archives = archives[-cfg["last_n_months"]:]

        print(f"  Found {len(archives)} monthly archives to download for {user}.")
        all_games = []
        for i, m_url in enumerate(archives):
            print(f"  [{i+1}/{len(archives)}] Fetching {m_url}...")
            m_data = fetch_url(m_url)
            g_list = m_data.get("games", [])
            all_games.extend(g_list)
        raw_by_user[user] = all_games
        print(f"  Total raw games for {user}: {len(all_games)}")

    with open(RAW_DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(raw_by_user, f)
    print(f"Saved raw games to {RAW_DATA_FILE}")
    return raw_by_user


def filter_and_parse_games(raw_by_user: dict):
    filtered_by_user = {}

    for user, games in raw_by_user.items():
        survived = []
        for g in games:
            # 1. rules == "chess"
            if g.get("rules") != "chess":
                continue

            # 2. has accuracies {white, black}
            acc = g.get("accuracies")
            if not acc or "white" not in acc or "black" not in acc:
                continue
            if acc["white"] is None or acc["black"] is None:
                continue

            pgn = g.get("pgn", "")
            if not pgn:
                continue

            # 3. PGN has no [FEN] or [SetUp] / [Setup] header
            if re.search(r'\[(FEN|SetUp|Setup)\s+', pgn, re.IGNORECASE):
                continue

            # 4. Parse with pgn parser & check plies >= 40
            try:
                parsed = parse_pgn_game(pgn, target_user_names=[user], platform="chesscom")
            except Exception:
                continue

            moves = parsed.get("moves", [])
            if len(moves) < 40:
                continue

            game_id = str(g.get("url", "").split("/")[-1] or g.get("uuid", ""))
            survived.append({
                "id": game_id,
                "url": g.get("url"),
                "user": user,
                "time_class": g.get("time_class"),
                "time_control": g.get("time_control"),
                "white_user": g.get("white", {}).get("username"),
                "white_rating": g.get("white", {}).get("rating"),
                "black_user": g.get("black", {}).get("username"),
                "black_rating": g.get("black", {}).get("rating"),
                "cc": {
                    "white": float(acc["white"]),
                    "black": float(acc["black"]),
                },
                "moves": moves,
                "ply_count": len(moves),
            })

        filtered_by_user[user] = survived
        print(f"User {user}: {len(games)} raw games -> {len(survived)} survived filtering (>= 40 plies, standard rules, with accuracies).")

    with open(PARSED_DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(filtered_by_user, f)
    print(f"Saved filtered games to {PARSED_DATA_FILE}")
    return filtered_by_user


if __name__ == "__main__":
    raw = download_archives()
    filtered = filter_and_parse_games(raw)
