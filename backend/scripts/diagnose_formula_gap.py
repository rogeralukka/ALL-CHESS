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

print(f"Loaded {len(data)} games.")

def evaluate_params(s, p, wp, coeff=0.50):
    tot_acc_err = 0.0
    tot_rat_err = 0.0
    count = 0
    
    tier_errors = {}
    
    for g in data:
        u = g['user']
        if u not in tier_errors:
            tier_errors[u] = {'acc_err': 0.0, 'rat_err': 0.0, 'count': 0}
            
        for col in ('white', 'black'):
            drops = g[f'{col}_drops']
            classes = g[f'{col}_classes']
            if not drops: continue
            
            cc_a = g['cc'][col]
            cc_r = estimate_game_rating(cc_a) or 1500
            
            accs = [max(0.0, min(100.0, round(100.0 * math.exp(-((d / s) ** p)), 1))) for d in drops]
            weights = [(1.0 + d / 5.0) ** wp for d in drops]
            base_acc = sum(w * a for w, a in zip(weights, accs)) / sum(weights)
            
            n_blunders = sum(1 for cls in classes if cls in ("blunder", "miss"))
            blunder_rate = n_blunders / len(drops)
            if blunder_rate > 0.12:
                reduction = (blunder_rate - 0.12) * coeff
                pred_a = round(max(15.0, base_acc * (1.0 - reduction)), 1)
            else:
                pred_a = round(base_acc, 1)
                
            pred_r = estimate_game_rating(pred_a) or 1500
            
            a_err = abs(pred_a - cc_a)
            r_err = abs(pred_r - cc_r)
            
            tot_acc_err += a_err
            tot_rat_err += r_err
            count += 1
            
            tier_errors[u]['acc_err'] += a_err
            tier_errors[u]['rat_err'] += r_err
            tier_errors[u]['count'] += 1
            
    mae_a = tot_acc_err / count
    mae_r = tot_rat_err / count
    return mae_a, mae_r, tier_errors

print("Current baseline (s=8.0, p=1.1, wp=0.30):")
base_maea, base_maer, base_tiers = evaluate_params(8.0, 1.1, 0.30, coeff=0.0)
print(f"  Overall Acc MAE: {base_maea:.3f} | Rating MAE: {base_maer:.1f}")

print("\nOption A baseline (s=8.0, p=1.1, wp=0.30, coeff=0.50):")
opt_maea, opt_maer, opt_tiers = evaluate_params(8.0, 1.1, 0.30, coeff=0.50)
print(f"  Overall Acc MAE: {opt_maea:.3f} | Rating MAE: {opt_maer:.1f}")

print("\nTesting wider scales s in [8.5, 9.0, 9.5, 10.0, 10.5, 11.0, 12.0] with coeff=0.50:")
for s_val in [8.5, 9.0, 9.5, 10.0, 10.5, 11.0, 12.0]:
    maea, maer, _ = evaluate_params(s_val, 1.1, 0.30, coeff=0.50)
    print(f"  s={s_val:4.1f}: Acc MAE = {maea:.3f} ({maea - base_maea:+.3f}) | Rating MAE = {maer:5.1f} ({maer - base_maer:+.1f})")
