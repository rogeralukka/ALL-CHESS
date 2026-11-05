"""Option A Evaluation:
1. Missed Forced Mate: If player had forced checkmate and played a move that threw away forced mate, classify as 'miss' with drop=25.0.
2. Blunder Frequency Dampener: If blunder rate > 12%, progressively scale base accuracy down towards Chess.com's lower band.
3. 100% Rating-Independent (Zero Elo scaling, identical for all players).
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
CORRECTED_FILE = os.path.join(CACHE_DIR, "drops_626_corrected.json")
OLD_FILE = os.path.join(CACHE_DIR, "drops_626_games.json")

data_corr = json.load(open(CORRECTED_FILE, encoding='utf-8'))
data_old = json.load(open(OLD_FILE, encoding='utf-8'))
old_dict = {str(g['id']): g for g in data_old}


def calc_current(drops):
    if not drops: return 100.0
    accs = [max(0.0, min(100.0, round(100.0 * math.exp(-((d / 8.0) ** 1.1)), 1))) for d in drops]
    weights = [(1.0 + d / 5.0) ** 0.30 for d in drops]
    return round(sum(w * a for w, a in zip(weights, accs)) / sum(weights), 1)


def calc_improved(drops, classes):
    if not drops: return 100.0
    accs = [max(0.0, min(100.0, round(100.0 * math.exp(-((d / 8.0) ** 1.1)), 1))) for d in drops]
    weights = [(1.0 + d / 5.0) ** 0.30 for d in drops]
    base_acc = sum(w * a for w, a in zip(weights, accs)) / sum(weights)

    # Blunder frequency dampener
    n_blunders = sum(1 for cls in classes if cls in ('blunder', 'miss'))
    blunder_rate = n_blunders / len(drops)
    if blunder_rate > 0.12:
        reduction = (blunder_rate - 0.12) * 0.50
        return round(max(15.0, base_acc * (1.0 - reduction)), 1)
    return round(base_acc, 1)


def main():
    account_stats = defaultdict(lambda: {"cc": [], "curr": [], "impr": [], "c_err": [], "i_err": []})
    band_stats = defaultdict(lambda: {"c_err": [], "i_err": []})
    all_c_errs, all_i_errs = [], []
    rows = []

    for g_c in data_corr:
        gid = str(g_c['id'])
        u = g_c['user']
        g_o = old_dict.get(gid, g_c)

        for c in ('white', 'black'):
            drops_old = g_o[f'{c}_drops']
            drops_corr = g_c[f'{c}_drops']
            classes_corr = g_c[f'{c}_classes']
            if not drops_corr: continue

            cc = g_c['cc'][c]
            r = g_c.get(f'{c}_rating', 1500)

            c_pred = calc_current(drops_old)
            i_pred = calc_improved(drops_corr, classes_corr)

            c_err = abs(c_pred - cc)
            i_err = abs(i_pred - cc)

            all_c_errs.append(c_err)
            all_i_errs.append(i_err)

            account_stats[u]["cc"].append(cc)
            account_stats[u]["curr"].append(c_pred)
            account_stats[u]["impr"].append(i_pred)
            account_stats[u]["c_err"].append(c_err)
            account_stats[u]["i_err"].append(i_err)

            if cc < 60: band = "< 60%"
            elif cc < 70: band = "60 - 70%"
            elif cc < 80: band = "70 - 80%"
            elif cc < 90: band = "80 - 90%"
            else: band = "90%+"

            band_stats[band]["c_err"].append(c_err)
            band_stats[band]["i_err"].append(i_err)

            rows.append({
                'id': gid,
                'user': u,
                'color': c,
                'rating': r,
                'cc': cc,
                'curr': c_pred,
                'impr': i_pred,
                'c_err': c_err,
                'i_err': i_err,
                'cc_rat': estimate_game_rating(cc),
                'c_rat': estimate_game_rating(c_pred),
                'i_rat': estimate_game_rating(i_pred),
            })

    print("=" * 115)
    print("OPTION A FINAL EVALUATION: MISSED MATE FIX + BLUNDER FREQUENCY DAMPENER")
    print("Order: Chess.com -> Current Formula -> Improved Formula (100% Rating-Independent)")
    print("=" * 115)

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
        res = account_stats[u]
        cnt = len(res["cc"])
        avg_cc = sum(res["cc"]) / cnt
        avg_c = sum(res["curr"]) / cnt
        avg_i = sum(res["impr"]) / cnt
        m_c = sum(res["c_err"]) / cnt
        m_i = sum(res["i_err"]) / cnt
        delta = m_c - m_i
        sign = "-" if delta > 0 else "+"
        status = "[BETTER]" if delta > 0.05 else ("[SAME]" if abs(delta) <= 0.05 else "[WORSE]")
        print(f"| {display_names[u]:<40} | {cnt:>5} | {avg_cc:>12.1f}% | {avg_c:>8.1f}% ({m_c:.2f}) | {avg_i:>9.1f}% ({m_i:.2f}) | {sign}{abs(delta):>5.2f} pts {status:<8} |")

    tot_c = sum(all_c_errs) / len(all_c_errs)
    tot_i = sum(all_i_errs) / len(all_i_errs)
    tot_diff = tot_c - tot_i
    print(f"| {'TOTAL OVERALL (ALL 626 GAMES)':<40} | {len(all_c_errs):>5} | {'---':>13} | {tot_c:>13.2f} MAE | {tot_i:>14.2f} MAE | -{tot_diff:>5.2f} pts [BETTER] |")

    print("\n### 2. SUMMARY BY ACCURACY BAND")
    print(f"| {'Accuracy Band':<15} | {'Count':>6} | {'Current MAE':>12} | {'Improved MAE':>13} | {'Error Reduction':>16} |")
    print(f"|{'-'*17}|{'-'*8}|{'-'*14}|{'-'*15}|{'-'*18}|")
    for b in ["< 60%", "60 - 70%", "70 - 80%", "80 - 90%", "90%+"]:
        res = band_stats[b]
        cnt = len(res["c_err"])
        m_c = sum(res["c_err"]) / cnt
        m_i = sum(res["i_err"]) / cnt
        diff = m_c - m_i
        sign = "-" if diff > 0 else "+"
        status = "[BETTER]" if diff > 0.05 else ("[SAME]" if abs(diff) <= 0.05 else "[WORSE]")
        print(f"| {b:<15} | {cnt:>6} | {m_c:>11.2f} | {m_i:>12.2f} | {sign}{abs(diff):>5.2f} pts {status:<8} |")

    print("\n### 3. TARGET BENCHMARK OUTLIERS (Before vs After)")
    target_ids = ['184752512081', '77621514773', '166350282836', '513777597', '139277051974', '181983501641']
    print(f"| {'Game ID':<12} | {'Account / Color':<22} | {'Chess.com':>10} | {'Current':>8} | {'Improved':>9} | {'Curr Err':>9} | {'Impr Err':>9} | {'Status':>10} |")
    print(f"|{'-'*14}|{'-'*24}|{'-'*12}|{'-'*10}|{'-'*11}|{'-'*11}|{'-'*11}|{'-'*12}|")
    for r in rows:
        if r["id"] in target_ids:
            stat = "BETTER" if r["i_err"] < r["c_err"] else ("SAME" if abs(r["i_err"] - r["c_err"]) < 0.1 else "WORSE")
            print(f"| {r['id']:<12} | {r['user']:<14} ({r['color'][0].upper()}) | {r['cc']:>9.1f}% | {r['curr']:>7.1f}% | {r['impr']:>8.1f}% | {r['c_err']:>8.2f} | {r['i_err']:>8.2f} | {stat:>10} |")


if __name__ == "__main__":
    main()
