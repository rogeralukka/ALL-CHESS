import json
import sqlite3
import chess

games = json.load(open('backend/.cache/batch5_raw_600_games.json', encoding='utf-8'))
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

conn = sqlite3.connect('backend/.cache/fen_evals.sqlite')
cursor = conn.cursor()
chunk_size = 900
fen_list = list(all_fens)
found_fens = set()
for i in range(0, len(fen_list), chunk_size):
    chunk = fen_list[i : i + chunk_size]
    q = f"SELECT fen FROM fen_evals WHERE fen IN ({','.join(['?']*len(chunk))})"
    for row in cursor.execute(q, chunk).fetchall():
        found_fens.add(row[0])
conn.close()

missing = [f for f in all_fens if f not in found_fens]
print(f"Missing FENs count: {len(missing)}")
for idx, f in enumerate(missing):
    print(f"{idx+1}: {f}")
