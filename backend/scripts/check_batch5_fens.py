import json
import sqlite3
import chess

games = json.load(open('backend/.cache/batch5_raw_600_games.json', encoding='utf-8'))
print(f'Total games loaded: {len(games)}')
by_user = {}
for g in games:
    by_user[g['user']] = by_user.get(g['user'], 0) + 1
print('Games per user:', by_user)

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

print(f'Total unique FENs across Batch 5: {len(all_fens)}')

conn = sqlite3.connect('backend/.cache/fen_evals.sqlite')
cursor = conn.cursor()
cursor.execute('SELECT COUNT(*) FROM fen_evals')
total_db = cursor.fetchone()[0]
print(f'Total FENs currently in DB: {total_db}')

# Check how many are missing
chunk_size = 900
fen_list = list(all_fens)
found = 0
for i in range(0, len(fen_list), chunk_size):
    chunk = fen_list[i : i + chunk_size]
    q = f"SELECT COUNT(*) FROM fen_evals WHERE fen IN ({','.join(['?']*len(chunk))})"
    cursor.execute(q, chunk)
    found += cursor.fetchone()[0]

conn.close()
missing = len(all_fens) - found
print(f'Already cached: {found} FENs ({found / len(all_fens) * 100:.1f}%)')
print(f'Missing from DB: {missing} FENs ({missing / len(all_fens) * 100:.1f}%)')
