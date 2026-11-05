import json
import math
import os
import sys
from collections import defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(HERE)
sys.path.insert(0, BACKEND_DIR)

from app.services.accuracy import estimate_game_rating

CACHE_DIR = os.path.join(BACKEND_DIR, ".cache")
DATA_FILE = os.path.join(CACHE_DIR, "drops_all_1226_games.json")
data = json.load(open(DATA_FILE, encoding='utf-8'))

def calc_current(drops):
    if not drops: return 100.0
    accs = [max(0.0, min(100.0, round(100.0 * math.exp(-((d / 8.0) ** 1.1)), 1))) for d in drops]
    weights = [(1.0 + d / 5.0) ** 0.30 for d in drops]
    return round(sum(w * a for w, a in zip(weights, accs)) / sum(weights), 1)

def calc_upgraded(drops, classes, s_sm=14.0, s_lg=8.0, thresh=2.5, p=1.15, wp=0.40, b_coeff=0.60):
    if not drops: return 100.0
    acc_thresh = 100.0 * math.exp(-((thresh / s_sm) ** p))
    accs = []
    for d in drops:
        if d <= thresh:
            a = 100.0 * math.exp(-((d / s_sm) ** p))
        else:
            a = acc_thresh * math.exp(-(((d - thresh) / s_lg) ** p))
        accs.append(max(0.0, min(100.0, a)))
        
    weights = [(1.0 + d / 5.0) ** wp for d in drops]
    base_acc = sum(w * a for w, a in zip(weights, accs)) / sum(weights)
    
    n_blunders = sum(1 for c in classes if c in ('blunder', 'miss'))
    br = n_blunders / len(drops)
    if br > 0.10:
        pred_a = base_acc * (1.0 - (br - 0.10) * b_coeff)
    else:
        pred_a = base_acc
        
    return round(max(15.0, min(100.0, pred_a)), 1)

def main():
    account_stats = defaultdict(lambda: {
        "cc_acc": [], "curr_acc": [], "upgr_acc": [],
        "cc_rat": [], "curr_rat": [], "upgr_rat": [],
        "c_acc_err": [], "u_acc_err": [],
        "c_rat_err": [], "u_rat_err": [],
    })

    band_stats = defaultdict(lambda: {
        "count": 0,
        "cc_acc": [], "curr_acc": [], "upgr_acc": [],
        "c_acc_err": [], "u_acc_err": [],
        "c_rat_err": [], "u_rat_err": [],
    })

    all_c_a, all_u_a = [], []
    all_c_r, all_u_r = [], []

    for g in data:
        u = g["user"]
        for col in ("white", "black"):
            drops = g[f"{col}_drops"]
            classes = g[f"{col}_classes"]
            if not drops: continue

            cc_a = g["cc"][col]
            curr_a = calc_current(drops)
            upgr_a = calc_upgraded(drops, classes)

            cc_r = estimate_game_rating(cc_a) or 1500
            curr_r = estimate_game_rating(curr_a) or 1500
            upgr_r = estimate_game_rating(upgr_a) or 1500

            c_a_err = abs(curr_a - cc_a)
            u_a_err = abs(upgr_a - cc_a)
            c_r_err = abs(curr_r - cc_r)
            u_r_err = abs(upgr_r - cc_r)

            s = account_stats[u]
            s["cc_acc"].append(cc_a)
            s["curr_acc"].append(curr_a)
            s["upgr_acc"].append(upgr_a)
            s["cc_rat"].append(cc_r)
            s["curr_rat"].append(curr_r)
            s["upgr_rat"].append(upgr_r)
            s["c_acc_err"].append(c_a_err)
            s["u_acc_err"].append(u_a_err)
            s["c_rat_err"].append(c_r_err)
            s["u_rat_err"].append(u_r_err)

            all_c_a.append(c_a_err)
            all_u_a.append(u_a_err)
            all_c_r.append(c_r_err)
            all_u_r.append(u_r_err)

            if cc_a < 60.0: band = "< 60%"
            elif cc_a < 70.0: band = "60 - 70%"
            elif cc_a < 80.0: band = "70 - 80%"
            elif cc_a < 90.0: band = "80 - 90%"
            else: band = "90%+"

            bs = band_stats[band]
            bs["count"] += 1
            bs["cc_acc"].append(cc_a)
            bs["curr_acc"].append(curr_a)
            bs["upgr_acc"].append(upgr_a)
            bs["c_acc_err"].append(c_a_err)
            bs["u_acc_err"].append(u_a_err)
            bs["c_rat_err"].append(c_r_err)
            bs["u_rat_err"].append(u_r_err)

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
        "rogeralukka": "RogerAlukka (~700-900 Elo HELD-OUT TEST)",
        "nickorlando24": "NickOrlando24 (~1150 Elo Club)",
        "samayraina": "SamayRaina (~1608 Elo Strong Club)",
        "garythursday": "GaryThursday (~2307 Elo Candidate Master)",
        "loveandpeach": "LoveAndPeach (~2504 Elo Master)",
        "hikaru": "Hikaru (~3300 Elo Super GM)",
    }

    print("=" * 165)
    print("UPGRADED DUAL-SCALE MASTER SUMMARY: CHESS.COM -> OUR CURRENT -> UPGRADED (ALL 1,226 GAMES)")
    print("Side-by-Side: Accuracy (%) and Estimated Performance Rating (Elo)")
    print("=" * 165)
    print(f"| {'Account / Tier':<42} | {'Evals':>5} | {'Chess.com Acc':>13} | {'Curr Acc (MAE)':>15} | {'Upgr Acc (MAE)':>16} | {'CC Rating':>9} | {'Curr Rating (MAE)':>17} | {'Upgr Rating (MAE)':>18} | {'Rating Diff':>12} |")
    print(f"|{'-'*44}|{'-'*7}|{'-'*15}|{'-'*17}|{'-'*18}|{'-'*11}|{'-'*19}|{'-'*20}|{'-'*14}|")

    for u in order:
        s = account_stats[u]
        n = len(s["cc_acc"])
        avg_cc_a = sum(s["cc_acc"]) / n
        avg_curr_a = sum(s["curr_acc"]) / n
        avg_upgr_a = sum(s["upgr_acc"]) / n
        mae_c_a = sum(s["c_acc_err"]) / n
        mae_u_a = sum(s["u_acc_err"]) / n

        avg_cc_r = int(round(sum(s["cc_rat"]) / n))
        avg_curr_r = int(round(sum(s["curr_rat"]) / n))
        avg_upgr_r = int(round(sum(s["upgr_rat"]) / n))
        mae_c_r = sum(s["c_rat_err"]) / n
        mae_u_r = sum(s["u_rat_err"]) / n

        r_delta = mae_c_r - mae_u_r
        sign = "-" if r_delta >= 0 else "+"
        better_marker = "[+]" if r_delta > 1.0 else "   "
        print(f"| {display_names[u]:<42} | {n:>5} | {avg_cc_a:>12.1f}% | {avg_curr_a:>6.1f}% ({mae_c_a:5.2f}) | {avg_upgr_a:>6.1f}% ({mae_u_a:5.2f}) | {avg_cc_r:>9} | {avg_curr_r:>7} ({mae_c_r:5.1f}) | {avg_upgr_r:>7} ({mae_u_r:5.1f}) | {sign}{abs(r_delta):>5.1f} pts {better_marker} |")

    tot_n = len(all_c_a)
    tot_mae_ca = sum(all_c_a) / tot_n
    tot_mae_ua = sum(all_u_a) / tot_n
    tot_mae_cr = sum(all_c_r) / tot_n
    tot_mae_ur = sum(all_u_r) / tot_n
    tot_r_diff = tot_mae_cr - tot_mae_ur

    print(f"| {'TOTAL OVERALL (ALL 1,226 GAMES)':<42} | {tot_n:>5} | {'---':>13} | {tot_mae_ca:>11.2f} MAE | {tot_mae_ua:>12.2f} MAE | {'---':>9} | {tot_mae_cr:>13.1f} MAE | {tot_mae_ur:>14.1f} MAE | -{tot_r_diff:>5.1f} pts [++] |")
    print("=" * 165)

    # Accuracy Band Breakdown
    print("\n" + "=" * 145)
    print("ACCURACY BAND BREAKDOWN (ALL 1,226 GAMES): CHESS.COM -> CURRENT -> UPGRADED")
    print("=" * 145)
    print(f"| {'Accuracy Band':<15} | {'Count':>6} | {'Chess.com Acc':>13} | {'Curr Acc (MAE)':>15} | {'Upgr Acc (MAE)':>16} | {'Curr Rat MAE':>13} | {'Upgr Rat MAE':>14} | {'Acc Improvement':>15} |")
    print(f"|{'-'*17}|{'-'*8}|{'-'*15}|{'-'*17}|{'-'*18}|{'-'*15}|{'-'*16}|{'-'*17}|")

    band_order = ["< 60%", "60 - 70%", "70 - 80%", "80 - 90%", "90%+"]
    for b in band_order:
        bs = band_stats[b]
        cnt = bs["count"]
        if cnt == 0: continue
        avg_cc = sum(bs["cc_acc"]) / cnt
        avg_ca = sum(bs["curr_acc"]) / cnt
        avg_ua = sum(bs["upgr_acc"]) / cnt
        mae_ca = sum(bs["c_acc_err"]) / cnt
        mae_ua = sum(bs["u_acc_err"]) / cnt
        mae_cr = sum(bs["c_rat_err"]) / cnt
        mae_ur = sum(bs["u_rat_err"]) / cnt
        a_delta = mae_ca - mae_ua
        sign = "-" if a_delta >= 0 else "+"
        marker = "[+]" if a_delta > 0.05 else "   "
        print(f"| {b:<15} | {cnt:>6} | {avg_cc:>12.1f}% | {avg_ca:>6.1f}% ({mae_ca:5.2f}) | {avg_ua:>6.1f}% ({mae_ua:5.2f}) | {mae_cr:>9.1f} Elo | {mae_ur:>10.1f} Elo | {sign}{abs(a_delta):>6.2f} pts {marker} |")

    print("=" * 145)

if __name__ == "__main__":
    main()
