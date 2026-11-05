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

eval_records = []
for g in data:
    u = g['user']
    for col in ('white', 'black'):
        drops = g[f'{col}_drops']
        classes = g[f'{col}_classes']
        if not drops: continue
        cc_a = g['cc'][col]
        cc_r = estimate_game_rating(cc_a) or 1500
        n_blunders = sum(1 for c in classes if c in ('blunder', 'miss'))
        eval_records.append({
            'user': u,
            'drops': drops,
            'classes': classes,
            'cc_a': cc_a,
            'cc_r': cc_r,
            'n_blunders': n_blunders,
            'blunder_rate': n_blunders / len(drops),
            'is_held_out': (u == 'rogeralukka'),
        })

print(f"Loaded {len(eval_records)} evaluations.")

# Dual-scale formula:
# If d <= threshold: decay with s_small
# If d > threshold: decay from acc(threshold) with s_large
def eval_dual_scale(s_small, s_large, thresh, p, wp, blunder_coeff):
    tot_a_err = 0.0
    tot_r_err = 0.0
    
    tier_errors = {}
    
    acc_thresh = 100.0 * math.exp(-((thresh / s_small) ** p))
    
    for r in eval_records:
        u = r['user']
        if u not in tier_errors:
            tier_errors[u] = {'a_err': 0.0, 'r_err': 0.0, 'cnt': 0}
            
        drops = r['drops']
        cc_a = r['cc_a']
        cc_r = r['cc_r']
        
        accs = []
        for d in drops:
            if d <= thresh:
                a = 100.0 * math.exp(-((d / s_small) ** p))
            else:
                a = acc_thresh * math.exp(-(((d - thresh) / s_large) ** p))
            accs.append(max(0.0, min(100.0, a)))
            
        weights = [(1.0 + d / 5.0) ** wp for d in drops]
        base_acc = sum(w * a for w, a in zip(weights, accs)) / sum(weights)
        
        br = r['blunder_rate']
        if br > 0.10:
            pred_a = base_acc * (1.0 - (br - 0.10) * blunder_coeff)
        else:
            pred_a = base_acc
            
        pred_a = round(max(15.0, min(100.0, pred_a)), 1)
        pred_r = estimate_game_rating(pred_a) or 1500
        
        a_err = abs(pred_a - cc_a)
        r_err = abs(pred_r - cc_r)
        
        tot_a_err += a_err
        tot_r_err += r_err
        
        tier_errors[u]['a_err'] += a_err
        tier_errors[u]['r_err'] += r_err
        tier_errors[u]['cnt'] += 1
        
    mae_a = tot_a_err / len(eval_records)
    mae_r = tot_r_err / len(eval_records)
    return mae_a, mae_r, tier_errors

# Current baseline
from scripts.compare_three_formulas_1226 import calc_current
c_a_err, c_r_err = 0.0, 0.0
for r in eval_records:
    c_a = calc_current(r['drops'])
    c_r = estimate_game_rating(c_a) or 1500
    c_a_err += abs(c_a - r['cc_a'])
    c_r_err += abs(c_r - r['cc_r'])
print(f"Current Formula Baseline: Acc MAE = {c_a_err / len(eval_records):.3f} | Rating MAE = {c_r_err / len(eval_records):.1f}")

best = (999.0, None)
candidates = []

for s_small in [10.0, 11.0, 12.0, 13.0, 14.0]:
    for s_large in [6.5, 7.0, 7.5, 8.0]:
        for thresh in [1.5, 2.0, 2.5, 3.0]:
            for p in [1.05, 1.10, 1.15]:
                for wp in [0.30, 0.35, 0.40]:
                    for b_coeff in [0.4, 0.5, 0.6]:
                        ma_a, ma_r, t_errs = eval_dual_scale(s_small, s_large, thresh, p, wp, b_coeff)
                        candidates.append((ma_a, ma_r, (s_small, s_large, thresh, p, wp, b_coeff), t_errs))

candidates.sort(key=lambda x: x[0])

print("\n--- TOP 10 DUAL-SCALE PARAMETER SETS ---")
print(f"{'Rank':<5} | {'Acc MAE':>8} | {'Rat MAE':>8} | {'Params (s_sm, s_lg, thr, p, wp, b_c)':<35}")
print("-" * 75)
for idx, (ma_a, ma_r, pms, _) in enumerate(candidates[:10]):
    print(f"{idx+1:<5} | {ma_a:>8.3f} | {ma_r:>8.1f} | {str(pms):<35}")
