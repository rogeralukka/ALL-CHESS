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
        eval_records.append({
            'user': u,
            'drops': drops,
            'classes': classes,
            'cc_a': cc_a,
            'cc_r': cc_r,
        })

def test_clean(s, p, wp, blunder_wt, damp_factor):
    tot_a_err = 0.0
    tot_r_err = 0.0
    tier_errs = {}
    
    for r in eval_records:
        u = r['user']
        if u not in tier_errs: tier_errs[u] = {'a_err': 0.0, 'r_err': 0.0, 'cnt': 0}
        
        drops = r['drops']
        classes = r['classes']
        cc_a = r['cc_a']
        cc_r = r['cc_r']
        
        accs = [max(0.0, min(100.0, 100.0 * math.exp(-((d / s) ** p)))) for d in drops]
        weights = []
        n_blunders = 0
        for d, c in zip(drops, classes):
            if c in ('blunder', 'miss'):
                weights.append(blunder_wt)
                n_blunders += 1
            else:
                weights.append((1.0 + d / 5.0) ** wp)
                
        base_a = sum(w * a for w, a in zip(weights, accs)) / sum(weights)
        
        br = n_blunders / len(drops)
        if br > 0.10:
            pred_a = base_a * (1.0 - (br - 0.10) * damp_factor)
        else:
            pred_a = base_a
            
        pred_a = round(max(15.0, min(100.0, pred_a)), 1)
        pred_r = estimate_game_rating(pred_a) or 1500
        
        a_err = abs(pred_a - cc_a)
        r_err = abs(pred_r - cc_r)
        tot_a_err += a_err
        tot_r_err += r_err
        tier_errs[u]['a_err'] += a_err
        tier_errs[u]['r_err'] += r_err
        tier_errs[u]['cnt'] += 1
        
    mae_a = tot_a_err / len(eval_records)
    mae_r = tot_r_err / len(eval_records)
    return mae_a, mae_r, tier_errs

results = []
for s in [8.5, 9.0, 9.5, 10.0]:
    for p in [1.1, 1.15]:
        for wp in [0.25, 0.30]:
            for b_wt in [1.5, 2.0, 2.5]:
                for d_fac in [0.2, 0.3, 0.4]:
                    ma_a, ma_r, t_errs = test_clean(s, p, wp, b_wt, d_fac)
                    jynx = t_errs['jynxzii']['a_err'] / t_errs['jynxzii']['cnt']
                    hik = t_errs['hikaru']['a_err'] / t_errs['hikaru']['cnt']
                    results.append((ma_a, ma_r, jynx, hik, (s, p, wp, b_wt, d_fac)))

results.sort(key=lambda x: x[0])
print(f"{'Rank':<5} | {'Overall Acc':>11} | {'Overall Rat':>11} | {'Jynxzii':>8} | {'Hikaru':>8} | {'Params (s, p, wp, b_wt, d_fac)':<32}")
print("-" * 85)
for idx, (ma_a, ma_r, jynx, hik, pms) in enumerate(results[:10]):
    print(f"{idx+1:<5} | {ma_a:>11.3f} | {ma_r:>11.1f} | {jynx:>8.2f} | {hik:>8.2f} | {str(pms):<32}")
