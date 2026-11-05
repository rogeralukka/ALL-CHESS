import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(HERE)
sys.path.insert(0, BACKEND_DIR)

import chess
from app.services.engine_service import _run_single_pass_review_sync
from app.services.accuracy import calculate_game_accuracy
from app.services.win_pct import eval_to_win_pct
from scripts.extract_all_626_drops import get_all_needed_fens

filtered = json.load(open('backend/.cache/chesscom_filtered_games.json', encoding='utf-8'))
g = [x for x in filtered['hikaru'] if str(x['id']) == '184752512081'][0]

board = chess.Board()
all_fens = [board.fen()]
for m in g['moves']:
    try:
        cm = board.parse_san(m['san'])
    except Exception:
        cm = chess.Move.from_uci(f"{m['from']}{m['to']}{m.get('promotion') or ''}")
    board.push(cm)
    all_fens.append(board.fen())

fens_dict = get_all_needed_fens(all_fens)

board = chess.Board()
n_evals = [{'lines': fens_dict.get(board.fen(), [])}]
for m in g['moves']:
    try:
        cm = board.parse_san(m['san'])
    except Exception:
        cm = chess.Move.from_uci(f"{m['from']}{m['to']}{m.get('promotion') or ''}")
    board.push(cm)
    n_evals.append({'lines': fens_dict.get(board.fen(), [])})

rev = _run_single_pass_review_sync(
    None,
    [dict(m) for m in g['moves']],
    white_rating=g.get('white_rating'),
    black_rating=g.get('black_rating'),
    external_evals=n_evals,
)

print(f"Game: {g['id']} | Hikaru (W) vs NikFil2013 (B)")
print(f"Target Chess.com: White={g['cc']['white']}, Black={g['cc']['black']}")
print(f"Current Calculated: {calculate_game_accuracy(rev['moves'])}")

print("\nMove-by-move White details:")
for i, m in enumerate(rev['moves']):
    if m['color'] == 'w':
        ev = m.get('eval') or {}
        before = ev.get('evalBefore')
        after = ev.get('evalAfter')
        w_b = eval_to_win_pct(before)
        w_a = eval_to_win_pct(after)
        print(f"Ply {i+1}: {m['san']:6s} | cls={m.get('classification'):12s} | evBefore={before} -> evAfter={after} | wPct={w_b:.1f}% -> {w_a:.1f}% | drop={max(0, w_b - w_a):.2f}")

print("\nDetailed eval dict for plies 42..48:")
for i in [41, 42, 43, 44, 45, 46, 47]:
    m = rev['moves'][i]
    print(f"Ply {i+1}: color={m['color']} san={m['san']} cls={m.get('classification')} eval={m.get('eval')}")
