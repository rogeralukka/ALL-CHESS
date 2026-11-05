import json
import sqlite3
import sys
import os
import time
import chess
import chess.engine

HERE = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(HERE)
CACHE_DIR = os.path.join(BACKEND_DIR, ".cache")
DB_CACHE_FILE = os.path.join(CACHE_DIR, "fen_evals.sqlite")
STOCKFISH_PATH = os.path.join(BACKEND_DIR, "bin", "stockfish.exe")

# Load missing FENs
games = json.load(open(os.path.join(CACHE_DIR, "batch5_raw_600_games.json"), encoding='utf-8'))
all_fens = set()
for g in games:
    b = chess.Board()
    all_fens.add(b.fen())
    for m in g['moves']:
        try:
            cm = b.parse_san(m['san'])
        except Exception:
            cm = chess.Move.from_uci(f"{m['from']}{m['to']}{m.get('promotion') or ''}")
        b.push(cm)
        all_fens.add(b.fen())

conn = sqlite3.connect(DB_CACHE_FILE)
cursor = conn.cursor()
chunk_size = 900
fen_list = list(all_fens)
found_fens = set()
for i in range(0, len(fen_list), chunk_size):
    chunk = fen_list[i : i + chunk_size]
    q = f"SELECT fen FROM fen_evals WHERE fen IN ({','.join(['?']*len(chunk))})"
    for row in cursor.execute(q, chunk).fetchall():
        found_fens.add(row[0])

missing = [f for f in all_fens if f not in found_fens]
print(f"Missing FENs to evaluate: {len(missing)}")

if not missing:
    print("All FENs are already evaluated!")
    sys.exit(0)

engine = chess.engine.SimpleEngine.popen_uci(STOCKFISH_PATH)
engine.configure({"Threads": 1, "Hash": 16})

results = []
try:
    for idx, fen in enumerate(missing):
        t0 = time.time()
        board = chess.Board(fen)
        if board.is_checkmate() or board.is_stalemate() or board.is_insufficient_material():
            results.append((fen, []))
            continue
        # Limit to depth 18 OR max 3.0 seconds per position
        infos = engine.analyse(board, limit=chess.engine.Limit(depth=18, time=3.0), multipv=3)
        lines = []
        for info in infos:
            sc = info.get("score")
            pv = [mv.uci() for mv in info.get("pv", [])]
            if not sc or not pv:
                continue
            rel = sc.relative
            lines.append({
                "pv": pv,
                "cp": rel.score() if not rel.is_mate() else None,
                "mate": rel.mate() if rel.is_mate() else None,
                "depth": info.get("depth", 18),
            })
        results.append((fen, lines))
        print(f"[{idx+1}/{len(missing)}] Evaluated in {time.time()-t0:.2f}s: {fen[:40]}...")
finally:
    engine.quit()

rows = [(fen, json.dumps(lines)) for fen, lines in results]
cursor.executemany("INSERT OR REPLACE INTO fen_evals (fen, lines_json) VALUES (?, ?)", rows)
conn.commit()
conn.close()
print(f"Successfully inserted all {len(results)} FENs into fen_evals.sqlite!")
