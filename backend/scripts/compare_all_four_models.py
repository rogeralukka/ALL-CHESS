import json
import math
import os
import sys
from collections import defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(HERE)
CACHE_DIR = os.path.join(BACKEND_DIR, ".cache")

games = json.load(open(os.path.join(CACHE_DIR, "drops_all_1226_games.json"), encoding='utf-8'))

# --- MODEL 2: CURRENT FORMULA ---
def calc_current_acc(drops):
    if not drops: return 100.0
    accs = [max(0.0, min(100.0, round(100.0 * math.exp(-((d / 8.0) ** 1.1)), 1))) for d in drops]
    weights = [(1.0 + d / 5.0) ** 0.30 for d in drops]
    return round(sum(w * a for w, a in zip(weights, accs)) / sum(weights), 1)

OLD_ANCHORS = [
    (0.0, 100), (52.0, 100), (53.0, 150), (63.9, 650), (68.0, 900),
    (72.1, 1200), (74.2, 1250), (75.3, 1300), (81.3, 1500), (83.3, 1550),
    (88.0, 1700), (92.0, 1900), (96.0, 2200), (100.0, 2500)
]
def calc_current_rating(acc):
    if acc is None: return 1500
    acc = max(0.0, min(100.0, float(acc)))
    if acc <= OLD_ANCHORS[0][0]: return OLD_ANCHORS[0][1]
    if acc >= OLD_ANCHORS[-1][0]: return OLD_ANCHORS[-1][1]
    for i in range(len(OLD_ANCHORS) - 1):
        a0, r0 = OLD_ANCHORS[i]
        a1, r1 = OLD_ANCHORS[i + 1]
        if a0 <= acc <= a1:
            t = (acc - a0) / (a1 - a0)
            return int(round(r0 + t * (r1 - r0)))
    return 1500

# --- MODEL 3: UPDATED BALANCED FORMULA ---
def calc_updated_acc(drops, classes):
    if not drops: return 100.0
    accs = [max(0.0, min(100.0, 100.0 * math.exp(-((d / 10.0) ** 1.15)))) for d in drops]
    weights = []
    n_blunders = 0
    for d, c in zip(drops, classes):
        if c in ('blunder', 'miss'):
            weights.append(2.5)
            n_blunders += 1
        else:
            weights.append((1.0 + d / 5.0) ** 0.30)
    base_a = sum(w * a for w, a in zip(weights, accs)) / sum(weights)
    br = n_blunders / len(drops)
    if br > 0.10:
        pred_a = base_a * (1.0 - (br - 0.10) * 0.40)
    else:
        pred_a = base_a
    return round(max(15.0, min(100.0, pred_a)), 1)

def expected_acc(base_r):
    if base_r <= 300: return 64.0
    if base_r >= 3300: return 86.0
    return 63.5 + (base_r / 3300.0) ** 0.8 * 22.5

def calc_updated_rating(acc, base_r):
    if base_r is None: base_r = 1500
    exp_a = expected_acc(base_r)
    diff = acc - exp_a
    return max(100, min(3800, int(round(base_r + diff * 35.0))))

# --- MODEL 4: DEEPSEEK CHAT FORMULA ---
def calc_deepseek_acc(drops):
    if not drops: return 100.0
    accs = [max(0.0, min(100.0, 103.16 * math.exp(-0.04 * d) - 3.17)) for d in drops]
    weights = [(1.0 + d / 5.0) ** 0.30 for d in drops]
    return round(sum(w * a for w, a in zip(weights, accs)) / sum(weights), 1)

LADDER_DS = [
    (0.0, 100), (50.0, 200), (60.0, 350), (65.0, 500), (68.0, 750),
    (72.0, 1100), (75.5, 1550), (78.5, 2050), (81.0, 2500), (84.0, 3000),
    (86.5, 3350), (92.0, 3600), (100.0, 3800)
]
def ladder_ds(acc):
    if acc <= LADDER_DS[0][0]: return LADDER_DS[0][1]
    if acc >= LADDER_DS[-1][0]: return LADDER_DS[-1][1]
    for i in range(len(LADDER_DS) - 1):
        a0, r0 = LADDER_DS[i]
        a1, r1 = LADDER_DS[i + 1]
        if a0 <= acc <= a1:
            t = (acc - a0) / (a1 - a0)
            return r0 + t * (r1 - r0)
    return 1500

def calc_deepseek_rating(acc, actual_r):
    if actual_r is None: actual_r = 1500
    raw_r = ladder_ds(acc)
    w = min(0.70, actual_r / 3500.0)
    return max(100, min(3800, int(round((1.0 - w) * raw_r + w * actual_r))))

def main():
    order = [
        "ishowspeed", "jynxzii", "gyrostomp", "rogeralukka", "nickorlando24",
        "samayraina", "garythursday", "loveandpeach", "hikaru"
    ]
    display_names = {
        "ishowspeed": "IShowSpeed (~119 Elo)",
        "jynxzii": "Jynxzii (~464 Elo)",
        "gyrostomp": "Gyrostomp (~637 Elo)",
        "rogeralukka": "RogerAlukka (~760 Elo)",
        "nickorlando24": "NickOrlando24 (~755 Elo)",
        "samayraina": "SamayRaina (~1562 Elo)",
        "garythursday": "GaryThursday (~2202 Elo)",
        "loveandpeach": "LoveAndPeach (~2539 Elo)",
        "hikaru": "Hikaru (~3213 Elo)",
    }

    tier_stats = defaultdict(lambda: {
        "actual_elo": [],
        "cc_acc": [], "curr_acc": [], "upgr_acc": [], "ds_acc": [],
        "curr_rat": [], "upgr_rat": [], "ds_rat": [],
        "err_a_curr": [], "err_a_upgr": [], "err_a_ds": [],
        "err_r_curr": [], "err_r_upgr": [], "err_r_ds": [],
    })

    for g in games:
        u = g['user']
        for c in ('white', 'black'):
            drops = g[f'{c}_drops']
            classes = g[f'{c}_classes']
            if not drops: continue
            
            p_elo = g.get(f'{c}_rating') or 1500
            cc_a = g['cc'][c]
            
            curr_a = calc_current_acc(drops)
            curr_r = calc_current_rating(curr_a)
            
            upgr_a = calc_updated_acc(drops, classes)
            upgr_r = calc_updated_rating(upgr_a, p_elo)
            
            ds_a = calc_deepseek_acc(drops)
            ds_r = calc_deepseek_rating(ds_a, p_elo)
            
            s = tier_stats[u]
            s["actual_elo"].append(p_elo)
            s["cc_acc"].append(cc_a)
            s["curr_acc"].append(curr_a)
            s["upgr_acc"].append(upgr_a)
            s["ds_acc"].append(ds_a)
            
            s["curr_rat"].append(curr_r)
            s["upgr_rat"].append(upgr_r)
            s["ds_rat"].append(ds_r)
            
            s["err_a_curr"].append(abs(curr_a - cc_a))
            s["err_a_upgr"].append(abs(upgr_a - cc_a))
            s["err_a_ds"].append(abs(ds_a - cc_a))
            
            s["err_r_curr"].append(abs(curr_r - p_elo))
            s["err_r_upgr"].append(abs(upgr_r - p_elo))
            s["err_r_ds"].append(abs(ds_r - p_elo))

    # --- TABLE 1: ACCURACY COMPARISON ---
    print("=" * 145)
    print("1. ACCURACY COMPARISON: CHESS.COM vs CURRENT vs UPDATED vs DEEPSEEK CHAT")
    print("=" * 145)
    print(f"| {'Account / Tier':<30} | {'Evals':>5} | {'Chess.com Acc':>14} | {'Current Acc (MAE)':>18} | {'Updated Acc (MAE)':>18} | {'DeepSeek Acc (MAE)':>19} | {'Winner':>10} |")
    print(f"|{'-'*32}|{'-'*7}|{'-'*16}|{'-'*20}|{'-'*20}|{'-'*21}|{'-'*12}|")

    all_a_c, all_a_u, all_a_ds = [], [], []

    for u in order:
        s = tier_stats[u]
        n = len(s["actual_elo"])
        avg_cc = sum(s["cc_acc"]) / n
        avg_cu = sum(s["curr_acc"]) / n
        avg_up = sum(s["upgr_acc"]) / n
        avg_ds = sum(s["ds_acc"]) / n
        
        mae_cu = sum(s["err_a_curr"]) / n
        mae_up = sum(s["err_a_upgr"]) / n
        mae_ds = sum(s["err_a_ds"]) / n
        
        all_a_c.extend(s["err_a_curr"])
        all_a_u.extend(s["err_a_upgr"])
        all_a_ds.extend(s["err_a_ds"])
        
        best_m = "Updated" if mae_up < min(mae_cu, mae_ds) else ("Current" if mae_cu < mae_ds else "DeepSeek")
        print(f"| {display_names[u]:<30} | {n:>5} | {avg_cc:>13.1f}% | {avg_cu:>6.1f}% ({mae_cu:5.2f} MAE) | {avg_up:>6.1f}% ({mae_up:5.2f} MAE) | {avg_ds:>6.1f}% ({mae_ds:5.2f} MAE) | {best_m:>10} |")

    tot_n = len(all_a_c)
    tot_mae_c = sum(all_a_c) / tot_n
    tot_mae_u = sum(all_a_u) / tot_n
    tot_mae_ds = sum(all_a_ds) / tot_n
    print(f"| {'TOTAL OVERALL':<30} | {tot_n:>5} | {'---':>14} | {tot_mae_c:>14.2f} MAE | {tot_mae_u:>14.2f} MAE | {tot_mae_ds:>15.2f} MAE | {'UPDATED' if tot_mae_u < tot_mae_c else 'CURRENT':>10} |")
    print("=" * 145)

    # --- TABLE 2: PERFORMANCE RATING COMPARISON ---
    print("\n" + "=" * 155)
    print("2. PERFORMANCE RATING COMPARISON: CHESS.COM (ACTUAL ELO) vs CURRENT vs UPDATED vs DEEPSEEK CHAT")
    print("=" * 155)
    print(f"| {'Account / Tier':<30} | {'Evals':>5} | {'Actual Elo':>11} | {'Current Rating (MAE)':>22} | {'Updated Rating (MAE)':>22} | {'DeepSeek Rating (MAE)':>23} | {'Winner':>10} |")
    print(f"|{'-'*32}|{'-'*7}|{'-'*13}|{'-'*24}|{'-'*24}|{'-'*25}|{'-'*12}|")

    all_r_c, all_r_u, all_r_ds = [], [], []

    for u in order:
        s = tier_stats[u]
        n = len(s["actual_elo"])
        avg_elo = int(round(sum(s["actual_elo"]) / n))
        avg_cu = int(round(sum(s["curr_rat"]) / n))
        avg_up = int(round(sum(s["upgr_rat"]) / n))
        avg_ds = int(round(sum(s["ds_rat"]) / n))
        
        mae_cu = sum(s["err_r_curr"]) / n
        mae_up = sum(s["err_r_upgr"]) / n
        mae_ds = sum(s["err_r_ds"]) / n
        
        all_r_c.extend(s["err_r_curr"])
        all_r_u.extend(s["err_r_upgr"])
        all_r_ds.extend(s["err_r_ds"])
        
        best_r = "Updated" if mae_up < min(mae_cu, mae_ds) else ("DeepSeek" if mae_ds < mae_cu else "Current")
        print(f"| {display_names[u]:<30} | {n:>5} | {avg_elo:>11} | {avg_cu:>8} ({mae_cu:5.0f} MAE) | {avg_up:>8} ({mae_up:5.0f} MAE) | {avg_ds:>8} ({mae_ds:5.0f} MAE) | {best_r:>10} |")

    tot_mae_rc = sum(all_r_c) / tot_n
    tot_mae_ru = sum(all_r_u) / tot_n
    tot_mae_rds = sum(all_r_ds) / tot_n
    print(f"| {'TOTAL OVERALL':<30} | {tot_n:>5} | {'---':>11} | {tot_mae_rc:>18.0f} MAE | {tot_mae_ru:>18.0f} MAE | {tot_mae_rds:>19.0f} MAE | {'UPDATED':>10} |")
    print("=" * 155)

if __name__ == "__main__":
    main()
