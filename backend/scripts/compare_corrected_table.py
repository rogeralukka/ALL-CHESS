"""Master 3-Way Accuracy & Performance Rating Comparison
Using the Corrected Dataset (Missed Checkmates properly classified as Misses + Pure Rating-Independent Calibration).

Format: Chess.com -> Current Formula -> Improved Formula
"""

import json
import math
import os
import sys
from collections import defaultdict
from typing import Any, Dict, List

HERE = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(HERE)
sys.path.insert(0, BACKEND_DIR)

from app.services.accuracy import estimate_game_rating

CACHE_DIR = os.path.join(BACKEND_DIR, ".cache")
CORRECTED_DROPS_FILE = os.path.join(CACHE_DIR, "drops_626_corrected.json")
OLD_DROPS_FILE = os.path.join(CACHE_DIR, "drops_626_games.json")


def current_acc(drops: List[float], scale: float = 8.0, power: float = 1.10, wp: float = 0.30) -> float:
    if not drops:
        return 100.0
    accs = [max(0.0, min(100.0, round(100.0 * math.exp(-((d / scale) ** power)), 1))) for d in drops]
    weights = [(1.0 + d / 5.0) ** wp for d in drops]
    tot_w = sum(weights)
    if tot_w <= 0:
        return 100.0
    return round(sum(w * a for w, a in zip(weights, accs)) / tot_w, 1)


def improved_acc(drops: List[float], classes: List[str] = None, scale: float = 8.5, power: float = 1.15, wp: float = 0.35) -> float:
    """Tuned Pure Formula:
    - scale=8.5, power=1.15: Gently rewards near-best moves without inflating medium errors.
    - wp=0.35: Stronger blunder accountability without needing artificial rating scaling.
    - 100% rating-independent (pure game moves).
    """
    if not drops:
        return 100.0
    accs = [max(0.0, min(100.0, round(100.0 * math.exp(-((d / scale) ** power)), 1))) for d in drops]
    weights = [(1.0 + d / 5.0) ** wp for d in drops]
    tot_w = sum(weights)
    if tot_w <= 0:
        return 100.0
    return round(sum(w * a for w, a in zip(weights, accs)) / tot_w, 1)


def main():
    target_file = CORRECTED_DROPS_FILE if os.path.exists(CORRECTED_DROPS_FILE) else OLD_DROPS_FILE
    print(f"Loading data from {os.path.basename(target_file)}...")
    with open(target_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Check old drops for baseline comparison if available
    old_data_dict = {}
    if os.path.exists(OLD_DROPS_FILE):
        with open(OLD_DROPS_FILE, "r", encoding="utf-8") as f:
            for g in json.load(f):
                old_data_dict[str(g["id"])] = g

    account_results = defaultdict(lambda: {"cc": [], "curr": [], "impr": [], "curr_err": [], "impr_err": []})
    band_results = defaultdict(lambda: {"curr_err": [], "impr_err": []})
    all_curr_errs = []
    all_impr_errs = []
    rows = []

    for g in data:
        gid = str(g["id"])
        user = g["user"]
        old_g = old_data_dict.get(gid, g)

        for color in ("white", "black"):
            drops_corr = g[f"{color}_drops"]
            classes_corr = g.get(f"{color}_classes", [])
            drops_old = old_g[f"{color}_drops"]
            if not drops_corr:
                continue

            cc_val = g["cc"][color]
            r = g.get(f"{color}_rating") or 1500

            # Current baseline on uncorrected drops
            c_pred = current_acc(drops_old)
            # Improved on corrected drops (with missed mate fix + tuned parameters)
            i_pred = improved_acc(drops_corr, classes_corr)

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

    order = ["ishowspeed", "gyrostomp", "rogeralukka", "nickorlando24", "loveandpeach", "hikaru"]
    display_names = {
        "ishowspeed": "IShowSpeed (~119 Elo Beginner)",
        "gyrostomp": "Gyrostomp (~637 Elo Developing)",
        "rogeralukka": "RogerAlukka (~700-900 Elo HELD-OUT TEST)",
        "nickorlando24": "NickOrlando24 (~1150 Elo Club)",
        "loveandpeach": "LoveAndPeach (~2504 Elo Master)",
        "hikaru": "Hikaru (~3300 Elo Super GM)",
    }

    print("\n" + "=" * 115)
    print("MASTER 3-WAY COMPARISON (WITH MISSED MATE FIX & RATING-INDEPENDENT TUNING)")
    print("=" * 115)

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
        marker = "[+]" if delta > 0.1 else ("   " if abs(delta) <= 0.1 else "[-]")
        print(f"| {display_names[u]:<40} | {count:>5} | {avg_cc:>12.1f}% | {avg_c:>8.1f}% ({mae_c:.2f}) | {avg_i:>9.1f}% ({mae_i:.2f}) | {sign}{abs(delta):>5.2f} pts {marker} |")

    tot_evals = len(all_curr_errs)
    tot_mae_c = sum(all_curr_errs) / tot_evals
    tot_mae_i = sum(all_impr_errs) / tot_evals
    tot_delta = tot_mae_c - tot_mae_i
    print(f"| {'TOTAL OVERALL (ALL 626 GAMES)':<40} | {tot_evals:>5} | {'---':>13} | {tot_mae_c:>13.2f} MAE | {tot_mae_i:>14.2f} MAE | -{tot_delta:>5.2f} pts [++] |")

    print("\n### 2. SUMMARY BY ACCURACY BAND")
    print(f"| {'Accuracy Band':<15} | {'Count':>6} | {'Current MAE':>12} | {'Improved MAE':>13} | {'Error Reduction':>16} |")
    print(f"|{'-'*17}|{'-'*8}|{'-'*14}|{'-'*15}|{'-'*18}|")
    for b in ["< 60%", "60 - 70%", "70 - 80%", "80 - 90%", "90%+"]:
        res = band_results[b]
        cnt = len(res["curr_err"])
        m_c = sum(res["curr_err"]) / cnt
        m_i = sum(res["impr_err"]) / cnt
        diff = m_c - m_i
        marker = "[+]" if diff > 0.1 else ("   " if abs(diff) <= 0.1 else "[-]")
        print(f"| {b:<15} | {cnt:>6} | {m_c:>11.2f} | {m_i:>12.2f} | -{diff:>5.2f} pts {marker} |")

    # Target outlier games inspection
    print("\n### 3. TARGET BENCHMARK GAMES (Before vs After Fix)")
    target_ids = ['184752512081', '77621514773', '139277051974', '181983501641']
    print(f"| {'Game ID':<12} | {'Account / Color':<22} | {'Chess.com':>10} | {'Current':>8} | {'Improved':>9} | {'Curr Err':>9} | {'Impr Err':>9} | {'Result':>10} |")
    print(f"|{'-'*14}|{'-'*24}|{'-'*12}|{'-'*10}|{'-'*11}|{'-'*11}|{'-'*11}|{'-'*12}|")
    for r in rows:
        if r["id"] in target_ids:
            res_str = "FIXED!" if r["i_err"] < r["c_err"] else "STABLE"
            print(f"| {r['id']:<12} | {r['user']:<14} ({r['color'][0].upper()}) | {r['cc']:>9.1f}% | {r['curr']:>7.1f}% | {r['impr']:>8.1f}% | {r['c_err']:>8.2f} | {r['i_err']:>8.2f} | {res_str:>10} |")


if __name__ == "__main__":
    main()
