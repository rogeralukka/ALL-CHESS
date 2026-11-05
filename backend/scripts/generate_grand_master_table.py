"""Grand Master Comparison Table: 1,226 Games (2,452 Player-Game Evaluations)
Batches 1-5 across 9 distinct chess accounts:
- ishowspeed (~119 Elo Beginner)
- jynxzii (~464 Elo Casual Streamer)
- gyrostomp (~637 Elo Developing)
- rogeralukka (~700-900 Elo HELD-OUT TEST SET)
- nickorlando24 (~1150 Elo Club)
- samayraina (~1608 Elo Strong Club)
- garythursday (~2307 Elo Candidate Master)
- loveandpeach (~2504 Elo Master)
- hikaru (~3300 Elo Super GM)

Side-by-side:
  Chess.com numbers -> Our Current Formula -> Improved Formula
  Both Accuracy (%) and Estimated Performance Rating (Elo)
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
DROPS_626_FILE = os.path.join(CACHE_DIR, "drops_626_corrected.json")
DROPS_BATCH5_FILE = os.path.join(CACHE_DIR, "drops_batch5_600.json")
OUT_ALL_DROPS_FILE = os.path.join(CACHE_DIR, "drops_all_1226_games.json")


def calc_current(drops):
    if not drops:
        return 100.0
    accs = [max(0.0, min(100.0, round(100.0 * math.exp(-((d / 8.0) ** 1.1)), 1))) for d in drops]
    weights = [(1.0 + d / 5.0) ** 0.30 for d in drops]
    return round(sum(w * a for w, a in zip(weights, accs)) / sum(weights), 1)


def calc_improved(drops, classes):
    if not drops:
        return 100.0
    accs = [max(0.0, min(100.0, round(100.0 * math.exp(-((d / 8.0) ** 1.1)), 1))) for d in drops]
    weights = [(1.0 + d / 5.0) ** 0.30 for d in drops]
    base_acc = sum(w * a for w, a in zip(weights, accs)) / sum(weights)

    # Blunder frequency dampener
    n_blunders = sum(1 for cls in classes if cls in ("blunder", "miss"))
    blunder_rate = n_blunders / len(drops)
    if blunder_rate > 0.12:
        reduction = (blunder_rate - 0.12) * 0.50
        return round(max(15.0, base_acc * (1.0 - reduction)), 1)
    return round(base_acc, 1)


def main():
    with open(DROPS_626_FILE, "r", encoding="utf-8") as f:
        d626 = json.load(f)
    with open(DROPS_BATCH5_FILE, "r", encoding="utf-8") as f:
        db5 = json.load(f)

    all_games = d626 + db5
    with open(OUT_ALL_DROPS_FILE, "w", encoding="utf-8") as f:
        json.dump(all_games, f)
    print(f"Merged {len(d626)} + {len(db5)} = {len(all_games)} games saved to {OUT_ALL_DROPS_FILE}.\n")

    account_stats = defaultdict(lambda: {
        "cc_acc": [], "curr_acc": [], "impr_acc": [],
        "cc_rat": [], "curr_rat": [], "impr_rat": [],
        "c_acc_err": [], "i_acc_err": [],
        "c_rat_err": [], "i_rat_err": [],
    })

    band_stats = defaultdict(lambda: {
        "count": 0,
        "cc_acc": [], "curr_acc": [], "impr_acc": [],
        "c_acc_err": [], "i_acc_err": [],
        "c_rat_err": [], "i_rat_err": [],
    })

    all_c_a, all_i_a = [], []
    all_c_r, all_i_r = [], []

    for g in all_games:
        u = g["user"]
        for col in ("white", "black"):
            drops = g[f"{col}_drops"]
            classes = g[f"{col}_classes"]
            if not drops:
                continue

            cc_a = g["cc"][col]
            curr_a = calc_current(drops)
            impr_a = calc_improved(drops, classes)

            cc_r = estimate_game_rating(cc_a) or 1500
            curr_r = estimate_game_rating(curr_a) or 1500
            impr_r = estimate_game_rating(impr_a) or 1500

            c_a_err = abs(curr_a - cc_a)
            i_a_err = abs(impr_a - cc_a)
            c_r_err = abs(curr_r - cc_r)
            i_r_err = abs(impr_r - cc_r)

            s = account_stats[u]
            s["cc_acc"].append(cc_a)
            s["curr_acc"].append(curr_a)
            s["impr_acc"].append(impr_a)
            s["cc_rat"].append(cc_r)
            s["curr_rat"].append(curr_r)
            s["impr_rat"].append(impr_r)
            s["c_acc_err"].append(c_a_err)
            s["i_acc_err"].append(i_a_err)
            s["c_rat_err"].append(c_r_err)
            s["i_rat_err"].append(i_r_err)

            all_c_a.append(c_a_err)
            all_i_a.append(i_a_err)
            all_c_r.append(c_r_err)
            all_i_r.append(i_r_err)

            # Accuracy Band
            if cc_a < 60.0:
                band = "< 60%"
            elif cc_a < 70.0:
                band = "60 - 70%"
            elif cc_a < 80.0:
                band = "70 - 80%"
            elif cc_a < 90.0:
                band = "80 - 90%"
            else:
                band = "90%+"

            b_stat = band_stats[band]
            b_stat["count"] += 1
            b_stat["cc_acc"].append(cc_a)
            b_stat["curr_acc"].append(curr_a)
            b_stat["impr_acc"].append(impr_a)
            b_stat["c_acc_err"].append(c_a_err)
            b_stat["i_acc_err"].append(i_a_err)
            b_stat["c_rat_err"].append(c_r_err)
            b_stat["i_rat_err"].append(i_r_err)

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

    print("=" * 160)
    print("GRAND MASTER SUMMARY: ALL 1,226 GAMES (2,452 EVALUATIONS) ACROSS 9 TIERS")
    print("Side-by-Side: Chess.com Numbers -> Our Current Formula -> Improved Formula")
    print("=" * 160)
    print(f"| {'Account / Tier':<42} | {'Evals':>5} | {'Chess.com Acc':>13} | {'Curr Acc (MAE)':>15} | {'Impr Acc (MAE)':>15} | {'CC Rating':>9} | {'Curr Rating (MAE)':>17} | {'Impr Rating (MAE)':>17} | {'Rating Diff':>11} |")
    print(f"|{'-'*44}|{'-'*7}|{'-'*15}|{'-'*17}|{'-'*17}|{'-'*11}|{'-'*19}|{'-'*19}|{'-'*13}|")

    for u in order:
        s = account_stats[u]
        n = len(s["cc_acc"])
        avg_cc_a = sum(s["cc_acc"]) / n
        avg_curr_a = sum(s["curr_acc"]) / n
        avg_impr_a = sum(s["impr_acc"]) / n
        mae_c_a = sum(s["c_acc_err"]) / n
        mae_i_a = sum(s["i_acc_err"]) / n

        avg_cc_r = int(round(sum(s["cc_rat"]) / n))
        avg_curr_r = int(round(sum(s["curr_rat"]) / n))
        avg_impr_r = int(round(sum(s["impr_rat"]) / n))
        mae_c_r = sum(s["c_rat_err"]) / n
        mae_i_r = sum(s["i_rat_err"]) / n

        r_delta = mae_c_r - mae_i_r
        sign = "-" if r_delta >= 0 else "+"
        better_marker = "[+]" if r_delta > 0.5 else "   "
        print(f"| {display_names[u]:<42} | {n:>5} | {avg_cc_a:>12.1f}% | {avg_curr_a:>6.1f}% ({mae_c_a:5.2f}) | {avg_impr_a:>6.1f}% ({mae_i_a:5.2f}) | {avg_cc_r:>9} | {avg_curr_r:>7} ({mae_c_r:5.1f}) | {avg_impr_r:>7} ({mae_i_r:5.1f}) | {sign}{abs(r_delta):>4.1f} pts {better_marker} |")

    tot_n = len(all_c_a)
    tot_mae_ca = sum(all_c_a) / tot_n
    tot_mae_ia = sum(all_i_a) / tot_n
    tot_mae_cr = sum(all_c_r) / tot_n
    tot_mae_ir = sum(all_i_r) / tot_n
    tot_r_diff = tot_mae_cr - tot_mae_ir

    print(f"| {'TOTAL OVERALL (ALL 1,226 GAMES)':<42} | {tot_n:>5} | {'---':>13} | {tot_mae_ca:>11.2f} MAE | {tot_mae_ia:>11.2f} MAE | {'---':>9} | {tot_mae_cr:>13.1f} MAE | {tot_mae_ir:>13.1f} MAE | -{tot_r_diff:>4.1f} pts [++] |")
    print("=" * 160)

    # Table 2: Accuracy Band Breakdown
    print("\n" + "=" * 135)
    print("ACCURACY BAND BREAKDOWN (ALL 1,226 GAMES): CHESS.COM -> CURRENT -> IMPROVED")
    print("=" * 135)
    print(f"| {'Accuracy Band':<15} | {'Count':>6} | {'Chess.com Acc':>13} | {'Curr Acc (MAE)':>15} | {'Impr Acc (MAE)':>15} | {'Curr Rat MAE':>13} | {'Impr Rat MAE':>13} | {'Improvement':>11} |")
    print(f"|{'-'*17}|{'-'*8}|{'-'*15}|{'-'*17}|{'-'*17}|{'-'*15}|{'-'*15}|{'-'*13}|")

    band_order = ["< 60%", "60 - 70%", "70 - 80%", "80 - 90%", "90%+"]
    for b in band_order:
        bs = band_stats[b]
        cnt = bs["count"]
        if cnt == 0:
            continue
        avg_cc = sum(bs["cc_acc"]) / cnt
        avg_ca = sum(bs["curr_acc"]) / cnt
        avg_ia = sum(bs["impr_acc"]) / cnt
        mae_ca = sum(bs["c_acc_err"]) / cnt
        mae_ia = sum(bs["i_acc_err"]) / cnt
        mae_cr = sum(bs["c_rat_err"]) / cnt
        mae_ir = sum(bs["i_rat_err"]) / cnt
        a_delta = mae_ca - mae_ia
        sign = "-" if a_delta >= 0 else "+"
        marker = "[+]" if a_delta > 0.05 else "   "
        print(f"| {b:<15} | {cnt:>6} | {avg_cc:>12.1f}% | {avg_ca:>6.1f}% ({mae_ca:5.2f}) | {avg_ia:>6.1f}% ({mae_ia:5.2f}) | {mae_cr:>9.1f} Elo | {mae_ir:>9.1f} Elo | {sign}{abs(a_delta):>4.2f} pts {marker} |")

    print("=" * 135)


if __name__ == "__main__":
    main()
