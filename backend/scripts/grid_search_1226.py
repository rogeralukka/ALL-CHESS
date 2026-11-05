import json
import math
import sys
import os

HERE = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(HERE)
sys.path.insert(0, BACKEND_DIR)

from app.services.accuracy import estimate_game_rating

CACHE_DIR = os.path.join(BACKEND_DIR, ".cache")
DATA_FILE = os.path.join(CACHE_DIR, "drops_all_1226_games.json")
data = json.load(open(DATA_FILE, encoding='utf-8'))

# Fast pre-parsed data
games_evals = []
for g in data:
    u = g['user']
    for col in ('white', 'black'):
        drops = g[f'{col}_drops']
        classes = g[f'{col}_classes']
        if not drops: continue
        cc_a = g['cc'][col]
        cc_r = estimate_game_rating(cc_a) or 1500
        n_blunders = sum(1 for cls in classes if cls in ("blunder", "miss"))
        blunder_rate = n_blunders / len(drops)
        is_held_out = (u == 'rogeralukka')
        games_evals.append((u, drops, blunder_rate, cc_a, cc_r, is_held_out))

print(f"Loaded {len(games_evals)} player-game evaluations.")

best_overall = (999.0, None)
best_held_out = (999.0, None)

results = []

for s in [8.5, 9.0, 9.2, 9.5, 9.7, 10.0]:
    for p in [1.0, 1.05, 1.10, 1.15]:
        for wp in [0.20, 0.25, 0.30, 0.35]:
            for coeff in [0.40, 0.50, 0.60]:
                tot_a_err = 0.0
                tot_r_err = 0.0
                h_a_err = 0.0
                h_r_err = 0.0
                h_cnt = 0
                
                for u, drops, blunder_rate, cc_a, cc_r, is_held_out in games_evals:
                    accs = [max(0.0, min(100.0, 100.0 * math.exp(-((d / s) ** p)))) for d in drops]
                    weights = [(1.0 + d / 5.0) ** wp for d in drops]
                    base_acc = sum(w * a for w, a in zip(weights, accs)) / sum(weights)
                    
                    if blunder_rate > 0.12:
                        reduction = (blunder_rate - 0.12) * coeff
                        pred_a = round(max(15.0, base_acc * (1.0 - reduction)), 1)
                    else:
                        pred_a = round(base_acc, 1)
                        
                    pred_r = estimate_game_rating(pred_a) or 1500
                    
                    a_err = abs(pred_a - cc_a)
                    r_err = abs(pred_r - cc_r)
                    
                    tot_a_err += a_err
                    tot_r_err += r_err
                    
                    if is_held_out:
                        h_a_err += a_err
                        h_r_err += r_err
                        h_cnt += 1
                        
                mae_a = tot_a_err / len(games_evals)
                mae_r = tot_r_err / len(games_evals)
                h_mae_a = h_a_err / h_cnt
                h_mae_r = h_r_err / h_cnt
                
                results.append((mae_a, mae_r, h_mae_a, h_mae_r, (s, p, wp, coeff)))

results.sort(key=lambda x: x[0])

print("\n--- TOP 10 PARAMETER SETS BY OVERALL ACCURACY MAE ---")
print(f"{'Rank':<5} | {'Acc MAE':>8} | {'Rat MAE':>8} | {'Held-out Acc':>12} | {'Held-out Rat':>12} | {'Params (s, p, wp, coeff)':<25}")
print("-" * 80)
for idx, (mae_a, mae_r, h_mae_a, h_mae_r, params) in enumerate(results[:10]):
    print(f"{idx+1:<5} | {mae_a:>8.3f} | {mae_r:>8.1f} | {h_mae_a:>12.3f} | {h_mae_r:>12.1f} | {str(params):<25}")
