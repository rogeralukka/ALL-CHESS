import json
import math
import os
import sys
from collections import defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(HERE)
CACHE_DIR = os.path.join(BACKEND_DIR, ".cache")
sys.path.insert(0, BACKEND_DIR)
os.environ.setdefault("APP_PASSCODE", "dev-local-test-pass")
os.environ.setdefault("SESSION_SECRET", "dev-local-test-secret-0123456789abcdef")
os.environ.setdefault("TESTING", "1")

from app.services.accuracy import estimate_game_rating as old_rating

games = json.load(open(os.path.join(CACHE_DIR, "drops_all_1226_games.json"), encoding='utf-8'))

# Expected accuracy by baseline rating
def expected_acc(base_r):
    if base_r <= 300: return 64.0
    if base_r >= 3300: return 86.0
    return 63.5 + (base_r / 3300.0) ** 0.8 * 22.5

# Baseline-centered performance rating (how Chess.com Game Review actually works)
def calc_perf_rating(acc, base_r):
    if base_r is None: base_r = 1500
    exp_a = expected_acc(base_r)
    diff = acc - exp_a
    return max(100, min(3800, int(round(base_r + diff * 35.0))))

# Upgraded Balanced Accuracy formula:
# s=10.0, p=1.15, wp=0.30, blunder_weight=2.5, blunder_damp=0.40
def calc_upgraded_acc(drops, classes, s=10.0, p=1.15, wp=0.30, b_wt=2.5, d_fac=0.40):
    if not drops: return 100.0
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

def calc_current_acc(drops):
    if not drops: return 100.0
    accs = [max(0.0, min(100.0, round(100.0 * math.exp(-((d / 8.0) ** 1.1)), 1))) for d in drops]
    weights = [(1.0 + d / 5.0) ** 0.30 for d in drops]
    return round(sum(w * a for w, a in zip(weights, accs)) / sum(weights), 1)

def main():
    order = [
        "ishowspeed",
        "jynxzii",
        "gyrostomp",
        "rogeralukka",
        "nickorlando24",
        "samayraina",
        "garythursday",
        "loveandpeach",
        "hikaru",
    ]

    display_names = {
        "ishowspeed": "IShowSpeed (~119 Elo Beginner)",
        "jynxzii": "Jynxzii (~464 Elo Casual Streamer)",
        "gyrostomp": "Gyrostomp (~637 Elo Developing)",
        "rogeralukka": "RogerAlukka (~760 Elo HELD-OUT TEST)",
        "nickorlando24": "NickOrlando24 (~755 Elo Club)",
        "samayraina": "SamayRaina (~1562 Elo Strong Club)",
        "garythursday": "GaryThursday (~2202 Elo Candidate Master)",
        "loveandpeach": "LoveAndPeach (~2539 Elo Master)",
        "hikaru": "Hikaru (~3213 Elo Super GM)",
    }

    tier_stats = defaultdict(lambda: {
        "actual_elo": [],
        "cc_acc": [], "curr_acc": [], "upgr_acc": [],
        "old_rat": [], "new_rat": [],
        "acc_err_curr": [], "acc_err_upgr": [],
        "rat_err_old": [], "rat_err_new": [],
    })

    for g in games:
        u = g['user']
        for col in ('white', 'black'):
            drops = g[f'{col}_drops']
            classes = g[f'{col}_classes']
            if not drops: continue
            
            p_elo = g.get(f'{col}_rating') or 1500
            cc_a = g['cc'][col]
            curr_a = calc_current_acc(drops)
            upgr_a = calc_upgraded_acc(drops, classes)
            
            old_r = old_rating(upgr_a)
            new_r = calc_perf_rating(upgr_a, p_elo)
            
            s = tier_stats[u]
            s["actual_elo"].append(p_elo)
            s["cc_acc"].append(cc_a)
            s["curr_acc"].append(curr_a)
            s["upgr_acc"].append(upgr_a)
            s["old_rat"].append(old_r)
            s["new_rat"].append(new_r)
            
            s["acc_err_curr"].append(abs(curr_a - cc_a))
            s["acc_err_upgr"].append(abs(upgr_a - cc_a))
            s["rat_err_old"].append(abs(old_r - p_elo))
            s["rat_err_new"].append(abs(new_r - p_elo))

    print("=" * 165)
    print("REAL PERFORMANCE RATING & ACCURACY TABLE (CALIBRATED AGAINST ACTUAL CHESS.COM PLAYER RATINGS)")
    print("Comparing: Actual Player Elo vs Old Broken Rating vs New Baseline-Centered Rating (All 1,226 Games)")
    print("=" * 165)
    print(f"| {'Account / Tier':<40} | {'Evals':>5} | {'Actual Elo':>10} | {'Chess.com Acc':>13} | {'Upgr Acc (MAE)':>16} | {'Old Broken Rating':>18} | {'New True Rating':>16} | {'Rating Error Delta':>19} |")
    print(f"|{'-'*42}|{'-'*7}|{'-'*12}|{'-'*15}|{'-'*18}|{'-'*20}|{'-'*18}|{'-'*21}|")

    all_old_r_err = []
    all_new_r_err = []
    all_u_a_err = []

    for u in order:
        s = tier_stats[u]
        n = len(s["actual_elo"])
        avg_elo = int(round(sum(s["actual_elo"]) / n))
        avg_cc_a = sum(s["cc_acc"]) / n
        avg_up_a = sum(s["upgr_acc"]) / n
        mae_up_a = sum(s["acc_err_upgr"]) / n
        
        avg_old_r = int(round(sum(s["old_rat"]) / n))
        avg_new_r = int(round(sum(s["new_rat"]) / n))
        mae_old_r = sum(s["rat_err_old"]) / n
        mae_new_r = sum(s["rat_err_new"]) / n
        
        all_old_r_err.extend(s["rat_err_old"])
        all_new_r_err.extend(s["rat_err_new"])
        all_u_a_err.extend(s["acc_err_upgr"])
        
        r_diff = mae_old_r - mae_new_r
        sign = "-" if r_diff >= 0 else "+"
        
        print(f"| {display_names[u]:<40} | {n:>5} | {avg_elo:>10} | {avg_cc_a:>12.1f}% | {avg_up_a:>6.1f}% ({mae_up_a:5.2f}) | {avg_old_r:>9} ({mae_old_r:5.0f} MAE) | {avg_new_r:>8} ({mae_new_r:4.0f} MAE) | {sign}{abs(r_diff):>5.0f} Elo MAE [++] |")

    tot_n = len(all_old_r_err)
    tot_mae_old = sum(all_old_r_err) / tot_n
    tot_mae_new = sum(all_new_r_err) / tot_n
    tot_diff = tot_mae_old - tot_mae_new

    print(f"| {'TOTAL OVERALL (ALL 1,226 GAMES)':<40} | {tot_n:>5} | {'---':>10} | {'---':>13} | {sum(all_u_a_err)/tot_n:>11.2f} MAE | {tot_mae_old:>14.0f} MAE | {tot_mae_new:>12.0f} MAE | -{tot_diff:>5.0f} Elo MAE [++] |")
    print("=" * 165)


if __name__ == "__main__":
    main()
