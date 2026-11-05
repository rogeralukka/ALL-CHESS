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
DATA_FILE = os.path.join(CACHE_DIR, "drops_626_games.json")

data = json.load(open(DATA_FILE, encoding='utf-8'))


def calc_pred(drops, classes, s=8.0, p=1.10, wp=0.30, coeff=0.50):
    if not drops: return 100.0
    accs = [max(0.0, min(100.0, round(100.0 * math.exp(-((d / s) ** p)), 1))) for d in drops]
    weights = [(1.0 + d / 5.0) ** wp for d in drops]
    base_acc = sum(w * a for w, a in zip(weights, accs)) / sum(weights)
    n_blunders = sum(1 for cls in classes if cls in ('blunder', 'miss'))
    blunder_rate = n_blunders / len(drops)
    if blunder_rate > 0.12:
        reduction = (blunder_rate - 0.12) * coeff
        return round(max(15.0, base_acc * (1.0 - reduction)), 1)
    return round(base_acc, 1)


def main():
    account_stats = defaultdict(lambda: {
        "cc_acc": [], "curr_acc": [], "impr_acc": [],
        "cc_rat": [], "curr_rat": [], "impr_rat": [],
        "c_acc_err": [], "i_acc_err": [],
        "c_rat_err": [], "i_rat_err": [],
    })

    rows = []

    for g in data:
        gid = str(g["id"])
        u = g["user"]

        for c in ("white", "black"):
            drops = g[f"{c}_drops"]
            classes = g[f"{c}_classes"]
            if not drops: continue

            cc_a = g["cc"][c]
            curr_a = g["current"][c]
            impr_a = calc_pred(drops, classes)

            cc_r = estimate_game_rating(cc_a)
            curr_r = estimate_game_rating(curr_a)
            impr_r = estimate_game_rating(impr_a)

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

            player_elo = g.get(f"{c}_rating", 1500)
            rows.append({
                "id": gid,
                "user": u,
                "color": c,
                "player_elo": player_elo,
                "cc_a": cc_a,
                "curr_a": curr_a,
                "impr_a": impr_a,
                "c_a_err": c_a_err,
                "i_a_err": i_a_err,
                "cc_r": cc_r,
                "curr_r": curr_r,
                "impr_r": impr_r,
                "c_r_err": c_r_err,
                "i_r_err": i_r_err,
            })

    order = ["ishowspeed", "gyrostomp", "rogeralukka", "nickorlando24", "loveandpeach", "hikaru"]
    display_names = {
        "ishowspeed": "IShowSpeed (~119 Elo Beginner)",
        "gyrostomp": "Gyrostomp (~637 Elo Developing)",
        "rogeralukka": "RogerAlukka (~700-900 Elo HELD-OUT TEST)",
        "nickorlando24": "NickOrlando24 (~1150 Elo Club)",
        "loveandpeach": "LoveAndPeach (~2504 Elo Master)",
        "hikaru": "Hikaru (~3300 Elo Super GM)",
    }

    print("=" * 140)
    print("MASTER SUMMARY: ACCURACY & PERFORMANCE RATING COMPARISON BY ACCOUNT")
    print("=" * 140)
    print(f"| {'Account / Tier':<40} | {'Evals':>5} | {'Chess.com Acc':>13} | {'Curr Acc (MAE)':>14} | {'Impr Acc (MAE)':>14} | {'CC Rating':>9} | {'Curr Rating (MAE)':>17} | {'Impr Rating (MAE)':>17} | {'Rating Diff':>11} |")
    print(f"|{'-'*42}|{'-'*7}|{'-'*15}|{'-'*16}|{'-'*16}|{'-'*11}|{'-'*19}|{'-'*19}|{'-'*13}|")

    all_c_a, all_i_a = [], []
    all_c_r, all_i_r = [], []

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

        all_c_a.extend(s["c_acc_err"])
        all_i_a.extend(s["i_acc_err"])
        all_c_r.extend(s["c_rat_err"])
        all_i_r.extend(s["i_rat_err"])

        print(f"| {display_names[u]:<40} | {n:>5} | {avg_cc_a:>12.1f}% | {avg_curr_a:>6.1f}% ({mae_c_a:.2f}) | {avg_impr_a:>6.1f}% ({mae_i_a:.2f}) | {avg_cc_r:>9} | {avg_curr_r:>7} ({mae_c_r:5.1f}) | {avg_impr_r:>7} ({mae_i_r:5.1f}) | {sign}{abs(r_delta):>4.1f} pts {'[+]' if r_delta > 0.5 else '   '} |")

    tot_n = len(all_c_a)
    tot_mae_ca = sum(all_c_a) / tot_n
    tot_mae_ia = sum(all_i_a) / tot_n
    tot_mae_cr = sum(all_c_r) / tot_n
    tot_mae_ir = sum(all_i_r) / tot_n
    tot_r_diff = tot_mae_cr - tot_mae_ir

    print(f"| {'TOTAL OVERALL (ALL 626 GAMES)':<40} | {tot_n:>5} | {'---':>13} | {tot_mae_ca:>10.2f} MAE | {tot_mae_ia:>10.2f} MAE | {'---':>9} | {tot_mae_cr:>13.1f} MAE | {tot_mae_ir:>13.1f} MAE | -{tot_r_diff:>4.1f} pts [++] |")

    print("\n" + "=" * 140)
    print("SAMPLE GAMES PER ACCOUNT: ACCURACY & ESTIMATED PERFORMANCE RATING")
    print("=" * 140)

    for u in order:
        u_rows = [r for r in rows if r["user"] == u]
        print(f"\n#### Tier: {display_names[u]}")
        print(f"| {'Game ID':<12} | {'Color (Elo)':<14} | {'CC Acc':>8} | {'Curr Acc':>8} | {'Impr Acc':>8} | {'CC Rating':>9} | {'Curr Rating':>11} | {'Impr Rating':>11} | {'Acc Err (C->I)':>14} | {'Rat Err (C->I)':>14} |")
        print(f"|{'-'*14}|{'-'*16}|{'-'*10}|{'-'*10}|{'-'*10}|{'-'*11}|{'-'*13}|{'-'*13}|{'-'*16}|{'-'*16}|")
        for r in u_rows[:4]:
            acc_chg = f"{r['c_a_err']:.1f} -> {r['i_a_err']:.1f}"
            rat_chg = f"{r['c_r_err']} -> {r['i_r_err']}"
            print(f"| {r['id']:<12} | {r['color'].capitalize():<5} ({r['player_elo']:<4}) | {r['cc_a']:>7.1f}% | {r['curr_a']:>7.1f}% | {r['impr_a']:>7.1f}% | {r['cc_r']:>9} | {r['curr_r']:>11} | {r['impr_r']:>11} | {acc_chg:>14} | {rat_chg:>14} |")


if __name__ == "__main__":
    main()
