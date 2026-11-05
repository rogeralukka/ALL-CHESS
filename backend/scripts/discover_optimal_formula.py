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
            'n_moves': len(drops),
            'blunder_rate': n_blunders / len(drops),
            'is_held_out': (u == 'rogeralukka'),
        })

print(f"Loaded {len(eval_records)} evaluations across {len(data)} games.")

# Test Model Architectures
# Architecture A: Soft Move Curve + Stronger Blunder Weighting + Non-linear Game Aggregation
def test_model(s, p, w_base, w_pow, blunder_damp=0.0):
    tot_a_err = 0.0
    tot_r_err = 0.0
    
    tier_errors = {}
    
    for r in eval_records:
        u = r['user']
        if u not in tier_errors:
            tier_errors[u] = {'a_err': 0.0, 'r_err': 0.0, 'cnt': 0}
            
        drops = r['drops']
        cc_a = r['cc_a']
        cc_r = r['cc_r']
        
        # Soft move curve (rewards good moves, doesn't crush at 2%)
        accs = [max(0.0, min(100.0, 100.0 * math.exp(-((d / s) ** p)))) for d in drops]
        
        # Progressive weight: small drops get weight ~1.0, blunders get much higher weight
        weights = [1.0 + (d / w_base) ** w_pow for d in drops]
        
        pred_a = sum(w * a for w, a in zip(weights, accs)) / sum(weights)
        
        if blunder_damp > 0 and r['blunder_rate'] > 0.10:
            pred_a = pred_a * (1.0 - (r['blunder_rate'] - 0.10) * blunder_damp)
            
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
base_a, base_r, base_tiers = test_model(8.0, 1.1, 5.0, 0.30, blunder_damp=0.0)
print(f"Current Baseline: Overall Acc MAE = {base_a:.3f} | Rating MAE = {base_r:.1f}")

best = (999.0, 999.0, None)
all_candidates = []

for s in [10.0, 11.0, 12.0, 13.0, 14.0]:
    for p in [1.0, 1.1, 1.2]:
        for w_base in [4.0, 5.0, 6.0]:
            for w_pow in [1.0, 1.2, 1.5, 1.8]:
                for b_damp in [0.0, 0.2, 0.4, 0.6]:
                    ma_a, ma_r, t_errs = test_model(s, p, w_base, w_pow, b_damp)
                    all_candidates.append((ma_a, ma_r, (s, p, w_base, w_pow, b_damp), t_errs))

all_candidates.sort(key=lambda x: x[0])

print("\n--- TOP 10 MODELS BY ACCURACY MAE ---")
print(f"{'Rank':<5} | {'Acc MAE':>8} | {'Rat MAE':>8} | {'Params (s, p, w_base, w_pow, b_damp)':<35}")
print("-" * 70)
for idx, (ma_a, ma_r, pms, _) in enumerate(all_candidates[:10]):
    print(f"{idx+1:<5} | {ma_a:>8.3f} | {ma_r:>8.1f} | {str(pms):<35}")
