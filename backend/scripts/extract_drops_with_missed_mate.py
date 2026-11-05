import json
import math
import sys
import os

HERE = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(HERE)
sys.path.insert(0, BACKEND_DIR)

from app.services.engine_service import _run_single_pass_review_sync
from app.services.win_pct import eval_to_win_pct
from scripts.extract_all_626_drops import get_all_needed_fens, load_game_moves_dict

data = json.load(open('backend/.cache/drops_626_games.json', encoding='utf-8'))
moves_dict = load_game_moves_dict()

print(f"Scanning 626 games for missed mate events...")
all_fens = set()
for g in data:
    m_game = moves_dict[str(g['id'])]
    import chess
    b = chess.Board()
    all_fens.add(b.fen())
    for m in m_game.get('moves', []):
        try:
            cm = b.parse_san(m['san'])
        except Exception:
            cm = chess.Move.from_uci(f"{m['from']}{m['to']}{m.get('promotion') or ''}")
        b.push(cm)
        all_fens.add(b.fen())

fen_dict = get_all_needed_fens(list(all_fens))

missed_mate_games = []
corrected_games = []

for idx, g in enumerate(data):
    gid = str(g['id'])
    m_game = moves_dict[gid]
    moves = m_game.get('moves', [])
    
    import chess
    b = chess.Board()
    n_evals = [{'lines': fen_dict.get(b.fen(), [])}]
    for m in moves:
        try:
            cm = b.parse_san(m['san'])
        except Exception:
            cm = chess.Move.from_uci(f"{m['from']}{m['to']}{m.get('promotion') or ''}")
        b.push(cm)
        n_evals.append({'lines': fen_dict.get(b.fen(), [])})
        
    rev = _run_single_pass_review_sync(
        None,
        [dict(m) for m in moves],
        white_rating=g.get('white_rating'),
        black_rating=g.get('black_rating'),
        external_evals=n_evals,
    )
    
    # Process drops with Missed Mate detection
    white_drops, black_drops = [], []
    white_classes, black_classes = [], []
    last_eval, last_mate = 0.2, None
    has_missed_mate = False
    
    for m in rev['moves']:
        color = m.get('color', 'w')
        ev = m.get('eval') or {}
        curr_b = ev.get('evalBefore', last_eval)
        mate_b = ev.get('mateBefore', last_mate)
        curr_a = ev.get('evalAfter', curr_b)
        mate_a = ev.get('mateAfter', mate_b)
        
        # Check missed mate: Player had forced mate and blundered into non-crushing position
        missed_mate = False
        if color == 'w':
            if mate_b is not None and mate_b > 0 and mate_a is None and w_a < 85.0:
                missed_mate = True
        else:
            if mate_b is not None and mate_b < 0 and mate_a is None and w_a > 15.0:
                missed_mate = True

        if missed_mate:
            has_missed_mate = True
            drop = 25.0  # Standard Miss penalty
            cls_ = 'miss'
        else:
            w_b = eval_to_win_pct(curr_b, mate_b)
            w_a = eval_to_win_pct(curr_a, mate_a)
            raw = max(0.0, w_b - w_a if color == 'w' else (100.0 - w_b) - (100.0 - w_a))
            cls_ = m.get('classification') or 'good'
            if cls_ in ('book', 'forced', 'best', 'great'): drop = min(raw, 0.5)
            elif cls_ in ('brilliant', 'excellent'): drop = min(raw, 2.0)
            elif cls_ == 'good': drop = min(max(raw, 0.5), 5.0)
            elif cls_ == 'inaccuracy': drop = min(max(raw, 4.5), 14.0)
            elif cls_ in ('mistake', 'miss'): drop = min(max(raw, 7.0), 25.0)
            elif cls_ == 'blunder': drop = max(raw, 18.0)
            else: drop = raw
            
        if color == 'w':
            white_drops.append(round(drop, 3))
            white_classes.append(cls_)
        else:
            black_drops.append(round(drop, 3))
            black_classes.append(cls_)
            
        last_eval, last_mate = curr_a, mate_a
        
    if has_missed_mate:
        missed_mate_games.append(gid)
        
    corrected_games.append({
        'id': gid,
        'user': g['user'],
        'time_class': g.get('time_class'),
        'white_user': g.get('white_user'),
        'white_rating': g.get('white_rating'),
        'black_user': g.get('black_user'),
        'black_rating': g.get('black_rating'),
        'cc': g['cc'],
        'white_drops': white_drops,
        'black_drops': black_drops,
        'white_classes': white_classes,
        'black_classes': black_classes,
    })

print(f"Found {len(missed_mate_games)} games with missed mate events!")
with open('backend/.cache/drops_626_corrected.json', 'w', encoding='utf-8') as f:
    json.dump(corrected_games, f)
print("Saved corrected dataset to backend/.cache/drops_626_corrected.json.")
