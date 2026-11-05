"""Side-by-Side 3-Way Accuracy & Performance Rating Comparison
Format: Chess.com -> Current Formula -> Improved Formula

Evaluated across all 626 real games (51,405 moves) from 6 accounts:
  1. ishowspeed    (~119 Elo)   - 12 games (100% complete)
  2. gyrostomp     (~637 Elo)   - 12 games (100% complete)
  3. rogeralukka   (~700-900 Elo) - 37 games (100% complete, strictly held-out test set)
  4. nickorlando24 (~1150 Elo)  - 322 games (100% complete)
  5. loveandpeach  (~2504 Elo)  - 37 games (100% complete)
  6. hikaru        (~3300 Elo)  - 206 games (100% complete)
"""

import json
import math
import os
import sys
from collections import defaultdict
from typing import Any, Dict, List, Tuple

HERE = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(HERE)
sys.path.insert(0, BACKEND_DIR)

from app.services.accuracy import estimate_game_rating

CACHE_DIR = os.path.join(BACKEND_DIR, ".cache")
DROPS_FILE = os.path.join(CACHE_DIR, "drops_626_games.json")


def current_acc(drops: List[float], scale: float = 8.0, power: float = 1.1, wp: float = 0.30) -> float:
    if not drops:
        return 100.0
    accs = [min(100.0, max(0.0, round(100.0 * math.exp(-((d / scale) ** power)), 1))) for d in drops]
    weights = [(1.0 + d / 5.0) ** wp for d in drops]
    tot_w = sum(weights)
    if tot_w <= 0:
        return 100.0
    return round(min(100.0, max(0.0, sum(w * a for w, a in zip(weights, accs)) / tot_w)), 1)


def improved_acc(drops: List[float], rating: int = 1500, scale: float = 9.0, power: float = 1.30) -> float:
    if not drops:
        return 100.0
    # Rating-adaptive wp: 0.55 at 500 Elo down to 0.22 at 2500+ Elo
    t = (max(500, min(2600, rating)) - 500) / 2100.0
    wp = 0.55 - 0.33 * t

    accs = [max(1.0, min(100.0, round(100.0 * math.exp(-((d / scale) ** power)), 1))) for d in drops]
    weights = [(1.0 + d / 5.0) ** wp for d in drops]
    tot_w = sum(weights)
    if tot_w <= 0:
        return 100.0
    return round(min(100.0, max(0.0, sum(w * a for w, a in zip(weights, accs)) / tot_w)), 1)


def main():
    if not os.path.exists(DROPS_FILE):
        print(f"File not found: {DROPS_FILE}")
        return

    with open(DROPS_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    print("=" * 115)
    print("MASTER 3-WAY COMPARISON TABLE: CHESS.COM -> OUR CURRENT -> IMPROVED FORMULA")
    print("Total Games: 626 (1,252 player-game evaluations across 6 Elo tiers)")
    print("=" * 115)

    account_results = defaultdict(lambda: {"cc": [], "curr": [], "impr": [], "curr_err": [], "impr_err": []})
    band_results = defaultdict(lambda: {"cc": [], "curr": [], "impr": [], "curr_err": [], "impr_err": []})

    all_curr_errs = []
    all_impr_errs = []

    rows = []

    for g in data:
        gid = g["id"]
        user = g["user"]
        tclass = g.get("time_class", "blitz")

        for color in ("white", "black"):
            drops = g[f"{color}_drops"]
            if not drops:
                continue
            cc_val = g["cc"][color]
            r = g.get(f"{color}_rating") or 1500

            c_pred = current_acc(drops)
            i_pred = improved_acc(drops, rating=r)

            c_err = abs(c_pred - cc_val)
            i_err = abs(i_pred - cc_val)

            c_rat = estimate_game_rating(c_pred)
            i_rat = estimate_game_rating(i_pred)
            cc_rat = estimate_game_rating(cc_val)

            account_results[user]["cc"].append(cc_val)
            account_results[user]["curr"].append(c_pred)
            account_results[user]["impr"].append(i_pred)
            account_results[user]["curr_err"].append(c_err)
            account_results[user]["impr_err"].append(i_err)

            # Band
            if cc_val < 60:
                band = "< 60%"
            elif cc_val < 70:
                band = "60 - 70%"
            elif cc_val < 80:
                band = "70 - 80%"
            elif cc_val < 90:
                band = "80 - 90%"
            else:
                band = "90%+"

            band_results[band]["curr_err"].append(c_err)
            band_results[band]["impr_err"].append(i_err)

            all_curr_errs.append(c_err)
            all_impr_errs.append(i_err)

            rows.append({
                "id": gid,
                "user": user,
                "time_class": tclass,
                "player": g.get(f"{color}_user"),
                "color": color,
                "rating": r,
                "cc": cc_val,
                "curr": c_pred,
                "impr": i_pred,
                "c_err": c_err,
                "i_err": i_err,
                "cc_rat": cc_rat,
                "c_rat": c_rat,
                "i_rat": i_rat,
            })

    # Summary Table by Account
    order = ["ishowspeed", "gyrostomp", "rogeralukka", "nickorlando24", "loveandpeach", "hikaru"]
    display_names = {
        "ishowspeed": "IShowSpeed (~119 Elo Beginner)",
        "gyrostomp": "Gyrostomp (~637 Elo Developing)",
        "rogeralukka": "RogerAlukka (~700-900 Elo HELD-OUT TEST)",
        "nickorlando24": "NickOrlando24 (~1150 Elo Club)",
        "loveandpeach": "LoveAndPeach (~2504 Elo Master)",
        "hikaru": "Hikaru (~3300 Elo Super GM)",
    }

    print("\n### 1. SUMMARY BY ACCOUNT (Elo Tiers)")
    print(f"| {'Account / Tier':<40} | {'Evals':>5} | {'Chess.com Acc':>13} | {'Current Acc (MAE)':>18} | {'Improved Acc (MAE)':>19} | {'MAE Improvement':>16} |")
    print(f"|{'-'*42}|{'-'*7}|{'-'*15}|{'-'*20}|{'-'*21}|{'-'*18}|")

    for u in order:
        res = account_results[u]
        count = len(res["cc"])
        avg_cc = sum(res["cc"]) / count
        avg_c = sum(res["curr"]) / count
        avg_i = sum(res["impr"]) / count
        mae_c = sum(res["curr_err"]) / count
        mae_i = sum(res["impr_err"]) / count
        delta = mae_c - mae_i
        sign = "-" if delta > 0 else "+"
        print(f"| {display_names[u]:<40} | {count:>5} | {avg_cc:>12.1f}% | {avg_c:>8.1f}% ({mae_c:.2f}) | {avg_i:>9.1f}% ({mae_i:.2f}) | {sign}{abs(delta):>5.2f} pts {'[+]' if delta > 0.3 else '   '} |")

    # Overall Total
    tot_evals = len(all_curr_errs)
    tot_mae_c = sum(all_curr_errs) / tot_evals
    tot_mae_i = sum(all_impr_errs) / tot_evals
    tot_delta = tot_mae_c - tot_mae_i
    print(f"| {'TOTAL OVERALL (ALL 626 GAMES)':<40} | {tot_evals:>5} | {'---':>13} | {tot_mae_c:>13.2f} MAE | {tot_mae_i:>14.2f} MAE | -{tot_delta:>5.2f} pts [++] |")

    # Summary by Band
    print("\n### 2. SUMMARY BY ACCURACY BAND")
    print(f"| {'Accuracy Band':<15} | {'Count':>6} | {'Current MAE':>12} | {'Improved MAE':>13} | {'Error Reduction':>16} |")
    print(f"|{'-'*17}|{'-'*8}|{'-'*14}|{'-'*15}|{'-'*18}|")
    for b in ["< 60%", "60 - 70%", "70 - 80%", "80 - 90%", "90%+"]:
        res = band_results[b]
        cnt = len(res["curr_err"])
        m_c = sum(res["curr_err"]) / cnt
        m_i = sum(res["impr_err"]) / cnt
        diff = m_c - m_i
        print(f"| {b:<15} | {cnt:>6} | {m_c:>11.2f} | {m_i:>12.2f} | -{diff:>5.2f} pts {'[+]' if diff > 0.3 else '   '} |")

    # Sample Games for each account
    print("\n### 3. SAMPLE GAME-BY-GAME 3-WAY COMPARISONS (Per Account)")
    for u in order:
        u_rows = [r for r in rows if r["user"] == u]
        print(f"\n#### Tier: {display_names[u]} (Sample Games)")
        print(f"| {'Game ID':<12} | {'Elo/Color':<14} | {'Chess.com':>10} | {'Current':>8} | {'Improved':>9} | {'Curr Err':>9} | {'Impr Err':>9} | {'CC Rating':>10} | {'Curr Rating':>12} | {'Impr Rating':>12} |")
        print(f"|{'-'*14}|{'-'*16}|{'-'*12}|{'-'*10}|{'-'*11}|{'-'*11}|{'-'*11}|{'-'*12}|{'-'*14}|{'-'*14}|")
        for r in u_rows[:4]:
            print(f"| {r['id']:<12} | {r['rating']} ({r['color'][0].upper()}){' '*6} | {r['cc']:>9.1f}% | {r['curr']:>7.1f}% | {r['impr']:>8.1f}% | {r['c_err']:>8.2f} | {r['i_err']:>8.2f} | {r['cc_rat']:>10} | {r['c_rat']:>12} | {r['i_rat']:>12} |")


if __name__ == "__main__":
    main()
