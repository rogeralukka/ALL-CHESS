"""Comprehensive Comparison: Chess.com vs Current Formula vs Recalibrated Formula
Evaluated on all 1,226 games (2,452 player-game evaluations) across 9 Elo tiers:
- ishowspeed (~119 Elo)
- jynxzii (~464 Elo)
- gyrostomp (~637 Elo)
- rogeralukka (~700-900 Elo HELD-OUT TEST)
- nickorlando24 (~1150 Elo)
- samayraina (~1608 Elo)
- garythursday (~2307 Elo)
- loveandpeach (~2504 Elo)
- hikaru (~3300 Elo)
"""

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


def calc_recalibrated(drops, classes, s=9.5, p=1.15, wp=0.35, coeff=0.50):
    if not drops: return 100.0
    accs = [max(0.0, min(100.0, 100.0 * math.exp(-((d / s) ** p)))) for d in drops]
    weights = [(1.0 + d / 5.0) ** wp for d in drops]
    base_acc = sum(w * a for w, a in zip(weights, accs)) / sum(weights)
    n_blunders = sum(1 for cls in classes if cls in ("blunder", "miss"))
    blunder_rate = n_blunders / len(drops)
    if blunder_rate > 0.12:
        reduction = (blunder_rate - 0.12) * coeff
        return round(max(15.0, base_acc * (1.0 - reduction)), 1)
    return round(base_acc, 1)


def main():
    account_stats = defaultdict(lambda: {
        "cc_acc": [], "curr_acc": [], "recal_acc": [],
        "cc_rat": [], "curr_rat": [], "recal_rat": [],
        "c_acc_err": [], "r_acc_err": [],
        "c_rat_err": [], "r_rat_err": [],
    })

    band_stats = defaultdict(lambda: {
        "count": 0,
        "cc_acc": [], "curr_acc": [], "recal_acc": [],
        "c_acc_err": [], "r_acc_err": [],
        "c_rat_err": [], "r_rat_err": [],
    })

    all_c_a, all_r_a = [], []
    all_c_r, all_r_r = [], []

    for g in data:
        u = g["user"]
        for col in ("white", "black"):
            drops = g[f"{col}_drops"]
            classes = g[f"{col}_classes"]
            if not drops: continue

            cc_a = g["cc"][col]
            curr_a = calc_current(drops)
            recal_a = calc_recalibrated(drops, classes)

            cc_r = estimate_game_rating(cc_a) or 1500
            curr_r = estimate_game_rating(curr_a) or 1500
            recal_r = estimate_game_rating(recal_a) or 1500

            c_a_err = abs(curr_a - cc_a)
            r_a_err = abs(recal_a - cc_a)
            c_r_err = abs(curr_r - cc_r)
            r_r_err = abs(recal_r - cc_r)

            s = account_stats[u]
            s["cc_acc"].append(cc_a)
            s["curr_acc"].append(curr_a)
            s["recal_acc"].append(recal_a)
            s["cc_rat"].append(cc_r)
            s["curr_rat"].append(curr_r)
            s["recal_rat"].append(recal_r)
            s["c_acc_err"].append(c_a_err)
            s["r_acc_err"].append(r_a_err)
            s["c_rat_err"].append(c_r_err)
            s["r_rat_err"].append(r_r_err)

            all_c_a.append(c_a_err)
            all_r_a.append(r_a_err)
            all_c_r.append(c_r_err)
            all_r_r.append(r_r_err)

            if cc_a < 60.0: band = "< 60%"
            elif cc_a < 70.0: band = "60 - 70%"
            elif cc_a < 80.0: band = "70 - 80%"
            elif cc_a < 90.0: band = "80 - 90%"
            else: band = "90%+"

            bs = band_stats[band]
            bs["count"] += 1
            bs["cc_acc"].append(cc_a)
            bs["curr_acc"].append(curr_a)
            bs["recal_acc"].append(recal_a)
            bs["c_acc_err"].append(c_a_err)
            bs["r_acc_err"].append(r_a_err)
            bs["c_rat_err"].append(c_r_err)
            bs["r_rat_err"].append(r_r_err)

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
    print("MASTER SUMMARY: CHESS.COM -> OUR CURRENT -> RECALIBRATED FORMULA (ALL 1,226 GAMES)")
    print("Side-by-Side: Accuracy (%) and Performance Rating (Elo)")
    print("=" * 165)
    print(f"| {'Account / Tier':<42} | {'Evals':>5} | {'Chess.com Acc':>13} | {'Curr Acc (MAE)':>15} | {'Recal Acc (MAE)':>16} | {'CC Rating':>9} | {'Curr Rating (MAE)':>17} | {'Recal Rating (MAE)':>18} | {'Rating Diff':>12} |")
    print(f"|{'-'*44}|{'-'*7}|{'-'*15}|{'-'*17}|{'-'*18}|{'-'*11}|{'-'*19}|{'-'*20}|{'-'*14}|")

    for u in order:
        s = account_stats[u]
        n = len(s["cc_acc"])
        avg_cc_a = sum(s["cc_acc"]) / n
        avg_curr_a = sum(s["curr_acc"]) / n
        avg_recal_a = sum(s["recal_acc"]) / n
        mae_c_a = sum(s["c_acc_err"]) / n
        mae_r_a = sum(s["r_acc_err"]) / n

        avg_cc_r = int(round(sum(s["cc_rat"]) / n))
        avg_curr_r = int(round(sum(s["curr_rat"]) / n))
        avg_recal_r = int(round(sum(s["recal_rat"]) / n))
        mae_c_r = sum(s["c_rat_err"]) / n
        mae_r_r = sum(s["r_rat_err"]) / n

        r_delta = mae_c_r - mae_r_r
        sign = "-" if r_delta >= 0 else "+"
        better_marker = "[+]" if r_delta > 1.0 else "   "
        print(f"| {display_names[u]:<42} | {n:>5} | {avg_cc_a:>12.1f}% | {avg_curr_a:>6.1f}% ({mae_c_a:5.2f}) | {avg_recal_a:>6.1f}% ({mae_r_a:5.2f}) | {avg_cc_r:>9} | {avg_curr_r:>7} ({mae_c_r:5.1f}) | {avg_recal_r:>7} ({mae_r_r:5.1f}) | {sign}{abs(r_delta):>5.1f} pts {better_marker} |")

    tot_n = len(all_c_a)
    tot_mae_ca = sum(all_c_a) / tot_n
    tot_mae_ra = sum(all_r_a) / tot_n
    tot_mae_cr = sum(all_c_r) / tot_n
    tot_mae_rr = sum(all_r_r) / tot_n
    tot_r_diff = tot_mae_cr - tot_mae_rr

    print(f"| {'TOTAL OVERALL (ALL 1,226 GAMES)':<42} | {tot_n:>5} | {'---':>13} | {tot_mae_ca:>11.2f} MAE | {tot_mae_ra:>12.2f} MAE | {'---':>9} | {tot_mae_cr:>13.1f} MAE | {tot_mae_rr:>14.1f} MAE | -{tot_r_diff:>5.1f} pts [++] |")
    print("=" * 165)


if __name__ == "__main__":
    main()
