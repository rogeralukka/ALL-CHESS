import json
import math
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(HERE)
CACHE_DIR = os.path.join(BACKEND_DIR, ".cache")

games = json.load(open(os.path.join(CACHE_DIR, "drops_all_1226_games.json"), encoding='utf-8'))
print(f"Loaded {len(games)} games for ultimate tuning.")

eval_records = []
for g in games:
    u = g['user']
    for c in ('white', 'black'):
        drops = g[f'{c}_drops']
        classes = g[f'{c}_classes']
        if not drops: continue
        p_elo = g.get(f'{c}_rating') or 1500
        cc_a = g['cc'][c]
        n_blunders = sum(1 for cl in classes if cl in ('blunder', 'miss'))
        eval_records.append({
            'user': u,
            'drops': drops,
            'classes': classes,
            'p_elo': p_elo,
            'cc_a': cc_a,
            'n_blunders': n_blunders,
            'blunder_rate': n_blunders / len(drops),
            'is_held_out': (u == 'rogeralukka'),
        })

print(f"Total player evaluations: {len(eval_records)}")

# 1. Accuracy Model:
# Move acc: 100 * exp(- (d / s) ** p)
# Blunder weight: b_wt for blunder/miss, else (1 + d / 5.0) ** wp
# Blunder rate dampener if blunder_rate > 0.10: (1 - (br - 0.10) * d_fac)
def calc_acc(drops, classes, s, p, wp, b_wt, d_fac):
    accs = [max(0.0, min(100.0, 100.0 * math.exp(-((d / s) ** p)))) for d in drops]
    weights = []
    n_blunders = 0
    for d, c in zip(drops, classes):
        if c in ('blunder', 'miss'):
            weights.append(b_wt)
            n_blunders += 1
        else:
            weights.append((1.0 + d / 5.0) ** wp)
            
    base_a = sum(w * a for w, a in zip(weights, accs)) / sum(weights)
    br = n_blunders / len(drops)
    if br > 0.10:
        pred_a = base_a * (1.0 - (br - 0.10) * d_fac)
    else:
        pred_a = base_a
    return round(max(15.0, min(100.0, pred_a)), 1)

# 2. Performance Rating Model:
# ExpAcc(R) = a_base + a_span * ((R - 100) / 3200) ** pow_r
# PerfRating = R + (Acc - ExpAcc(R)) * slope
def expected_accuracy(r, a_base, a_span, pow_r):
    r_clamped = max(100, min(3500, r))
    return a_base + a_span * ((r_clamped - 100.0) / 3200.0) ** pow_r

def calc_performance_rating(acc, base_r, a_base, a_span, pow_r, slope):
    exp_a = expected_accuracy(base_r, a_base, a_span, pow_r)
    diff = acc - exp_a
    return max(100, min(3800, int(round(base_r + diff * slope))))

# Grid search for the optimal combination
best_a_mae = 999.0
best_a_params = None

print("\n--- Tuning Accuracy Model ---")
for s in [9.5, 10.0, 10.5]:
    for p in [1.10, 1.15, 1.20]:
        for wp in [0.25, 0.30, 0.35]:
            for b_wt in [2.0, 2.5, 3.0]:
                for d_fac in [0.30, 0.40, 0.50]:
                    tot_err = 0.0
                    for r in eval_records:
                        pred_a = calc_acc(r['drops'], r['classes'], s, p, wp, b_wt, d_fac)
                        tot_err += abs(pred_a - r['cc_a'])
                    mae = tot_err / len(eval_records)
                    if mae < best_a_mae:
                        best_a_mae = mae
                        best_a_params = (s, p, wp, b_wt, d_fac)
                        print(f"New Best Acc MAE: {mae:.3f} with params: {best_a_params}")

print(f"\nFinal Best Accuracy Model: MAE = {best_a_mae:.3f} | Params = {best_a_params}")

# Now pre-calculate best accuracy for all records
for r in eval_records:
    r['pred_a'] = calc_acc(r['drops'], r['classes'], *best_a_params)

# Now tune Performance Rating parameters
print("\n--- Tuning Performance Rating Model ---")
best_r_mae = 999.0
best_r_params = None

for a_base in [63.0, 64.0, 65.0]:
    for a_span in [21.0, 22.0, 23.0]:
        for pow_r in [0.70, 0.75, 0.80]:
            for slope in [30.0, 32.0, 35.0, 38.0]:
                tot_r_err = 0.0
                for r in eval_records:
                    pred_r = calc_performance_rating(r['pred_a'], r['p_elo'], a_base, a_span, pow_r, slope)
                    tot_r_err += abs(pred_r - r['p_elo'])
                mae_r = tot_r_err / len(eval_records)
                if mae_r < best_r_mae:
                    best_r_mae = mae_r
                    best_r_params = (a_base, a_span, pow_r, slope)
                    print(f"New Best Rating MAE: {mae_r:.1f} with params: {best_r_params}")

print(f"\nFinal Best Rating Model: MAE = {best_r_mae:.1f} | Params = {best_r_params}")
