import os, sys, json
sys.path.insert(0, 'backend')
from app.services.engine_service import _run_single_pass_review_sync
from scripts.extract_all_626_drops import get_all_needed_fens, load_game_moves_dict

moves_dict = load_game_moves_dict()
g = moves_dict['139229175046']
moves = g['moves']

import chess
b = chess.Board()
all_fens = [b.fen()]
for m in moves:
    try: cm = b.parse_san(m['san'])
    except Exception: cm = chess.Move.from_uci(f"{m['from']}{m['to']}{m.get('promotion') or ''}")
    b.push(cm)
    all_fens.append(b.fen())

fen_dict = get_all_needed_fens(all_fens)
b = chess.Board()
n_evals = [{'lines': fen_dict.get(b.fen(), [])}]
for m in moves:
    try: cm = b.parse_san(m['san'])
    except Exception: cm = chess.Move.from_uci(f"{m['from']}{m['to']}{m.get('promotion') or ''}")
    b.push(cm)
    n_evals.append({'lines': fen_dict.get(b.fen(), [])})

rev = _run_single_pass_review_sync(None, [dict(m) for m in moves], external_evals=n_evals)

for i, m in enumerate(rev['moves']):
    ev = m.get('eval') or {}
    if ev.get('mateBefore') is not None or ev.get('mateAfter') is not None:
        print(f"Ply {i+1} ({m['color']}): san={m['san']:6s} cls={m.get('classification'):12s} mateB={ev.get('mateBefore')} mateA={ev.get('mateAfter')} evB={ev.get('evalBefore')} evA={ev.get('evalAfter')}")
