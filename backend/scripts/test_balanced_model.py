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
        n_mistakes = sum(1 for c in classes if c in ('blunder', 'miss', 'mistake', 'inaccuracy'))
        eval_records.append({
            'user': u,
            'drops': drops,
            'classes': classes,
            'cc_a': cc_a,
            'cc_r': cc_r,
            'n_blunders': n_blunders,
            'blunder_rate': n_blunders / len(drops),
            'bad_rate': n_mistakes / len(drops),
            'is_held_out': (u == 'rogeralukka'),
        })

def test_fine_tuned(s_sm, s_lg, thresh, p, wp, bad_coeff):
    tot_a_err = 0.0
    tot_r_err = 0.0
    tier_errors = {}
    acc_thresh = 100.0 * math.exp(-((thresh / s_sm) ** p))
    
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
                a = 100.0 * math.exp(-((d / s_sm) ** p))
            else:
                a = acc_thresh * math.exp(-(((d - thresh) / s_lg) ** p))
            accs.append(max(0.0, min(100.0, a)))
            
        weights = [(1.0 + d / 5.0) ** wp for d in drops]
        base_acc = sum(w * a for w, a in zip(weights, accs)) / sum(weights)
        
        br = r['bad_rate']
        if br > 0.25:
            pred_a = base_acc * (1.0 - (br - 0.25) * bad_coeff)
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

results = []
for bad_c in [0.0, 0.1, 0.15, 0.2, 0.25, 0.3]:
    for s_sm in [10.0, 11.0, 12.0, 13.0]:
        for s_lg in [7.0, 7.5, 8.0]:
            ma_a, ma_r, t_errs = test_fine_tuned(s_sm, s_lg, 2.0, 1.15, 0.35, bad_c)
            jynx_a = t_errs['jynxzii']['a_err'] / t_errs['jynxzii']['cnt']
            hik_a = t_errs['hikaru']['a_err'] / t_errs['hikaru']['cnt']
            results.append((ma_a, ma_r, jynx_a, hik_a, (s_sm, s_lg, bad_c)))

results.sort(key=lambda x: x[0])
print(f"{'Rank':<5} | {'Overall Acc':>11} | {'Overall Rat':>11} | {'Jynxzii Acc':>11} | {'Hikaru Acc':>10} | {'Params (s_sm, s_lg, bad_c)':<28}")
print("-" * 85)
for idx, (ma_a, ma_r, jynx_a, hik_a, pms) in enumerate(results[:10]):
    print(f"{idx+1:<5} | {ma_a:>11.3f} | {ma_r:>11.1f} | {jynx_a:>11.2f} | {hik_a:>10.2f} | {str(pms):<28}")
