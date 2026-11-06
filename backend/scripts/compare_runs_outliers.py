import json
import math
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(HERE)
sys.path.insert(0, BACKEND_DIR)

from app.services.accuracy import (
    estimate_game_rating,
    move_accuracy,
)
from scripts.accuracy_v2_candidate import (
    calculate_player_accuracy_v2,
    estimate_game_rating_v2,
    move_accuracy_v2,
)

CACHE_DIR = os.path.join(BACKEND_DIR, ".cache")


def calc_current_acc_from_drops(drops):
    if not drops:
        return 100.0
    m_accs = [move_accuracy(d, method="chesscom", level="standard") for d in drops]
    weights = [(1.0 + d / 5.0) ** 0.30 for d in drops]
    return round(sum(w * a for w, a in zip(weights, m_accs)) / sum(weights), 1)


def calc_upgraded_acc_from_drops(drops, classes):
    if not drops:
        return 100.0
    m_accs = [move_accuracy_v2(d) for d in drops]
    return calculate_player_accuracy_v2(m_accs, drops, classes) or 100.0


def analyze_dataset(drops_data, name=""):
    records = []
    for g in drops_data:
        gid = g.get("id")
        user = g.get("user")
        cc_w = g["cc"]["white"]
        cc_b = g["cc"]["black"]

        w_drops = g.get("white_drops", [])
        b_drops = g.get("black_drops", [])
        w_classes = g.get("white_classes", ["good"] * len(w_drops))
        b_classes = g.get("black_classes", ["good"] * len(b_drops))

        # Current formula
        curr_w = calc_current_acc_from_drops(w_drops)
        curr_b = calc_current_acc_from_drops(b_drops)
        curr_r_w = estimate_game_rating(curr_w) or 1500
        curr_r_b = estimate_game_rating(curr_b) or 1500

        # Upgraded formula
        impr_w = calc_upgraded_acc_from_drops(w_drops, w_classes)
        impr_b = calc_upgraded_acc_from_drops(b_drops, b_classes)
        impr_r_w = estimate_game_rating_v2(impr_w) or 1500
        impr_r_b = estimate_game_rating_v2(impr_b) or 1500

        # Chess.com rating
        cc_r_w = estimate_game_rating(cc_w) or 1500
        cc_r_b = estimate_game_rating(cc_b) or 1500

        records.append({
            "gid": gid, "user": user, "color": "white",
            "cc_a": cc_w, "curr_a": curr_w, "impr_a": impr_w,
            "cc_r": cc_r_w, "curr_r": curr_r_w, "impr_r": impr_r_w,
            "c_acc_err": abs(curr_w - cc_w), "i_acc_err": abs(impr_w - cc_w),
            "c_rat_err": abs(curr_r_w - cc_r_w), "i_rat_err": abs(impr_r_w - cc_r_w),
        })
        records.append({
            "gid": gid, "user": user, "color": "black",
            "cc_a": cc_b, "curr_a": curr_b, "impr_a": impr_b,
            "cc_r": cc_r_b, "curr_r": curr_r_b, "impr_r": impr_r_b,
            "c_acc_err": abs(curr_b - cc_b), "i_acc_err": abs(impr_b - cc_b),
            "c_rat_err": abs(curr_r_b - cc_r_b), "i_rat_err": abs(impr_r_b - cc_r_b),
        })

    def get_stats(errors):
        s_err = sorted(errors)
        n = len(s_err)
        avg = sum(s_err) / n
        med = s_err[n // 2]
        p90 = s_err[int(n * 0.90)]
        p95 = s_err[int(n * 0.95)]
        p99 = s_err[int(n * 0.99)]
        mx = s_err[-1]
        std = math.sqrt(sum((x - avg) ** 2 for x in s_err) / n)
        return {"avg": avg, "med": med, "std": std, "p90": p90, "p95": p95, "p99": p99, "max": mx}

    c_acc_errs = [r["c_acc_err"] for r in records]
    i_acc_errs = [r["i_acc_err"] for r in records]
    c_rat_errs = [r["c_rat_err"] for r in records]
    i_rat_errs = [r["i_rat_err"] for r in records]

    # Find worst outliers
    worst_c_acc = sorted(records, key=lambda x: -x["c_acc_err"])[:3]
    worst_i_acc = sorted(records, key=lambda x: -x["i_acc_err"])[:3]
    worst_c_rat = sorted(records, key=lambda x: -x["c_rat_err"])[:3]
    worst_i_rat = sorted(records, key=lambda x: -x["i_rat_err"])[:3]

    n = len(records)
    print(f"\n{'='*90}")
    print(f"ANALYSIS FOR: {name} ({len(drops_data)} games, {n} evaluations)")
    print(f"{'='*90}")

    st_c_a = get_stats(c_acc_errs)
    st_i_a = get_stats(i_acc_errs)
    st_c_r = get_stats(c_rat_errs)
    st_i_r = get_stats(i_rat_errs)

    print("\n--- ACCURACY ERROR (%) ---")
    print(f"  Metric       | Current Formula | Upgraded Formula | Improvement")
    print(f"  -------------+-----------------+------------------+------------------")
    print(f"  Average MAE  | {st_c_a['avg']:6.2f}%         | {st_i_a['avg']:6.2f}%          | {st_c_a['avg'] - st_i_a['avg']:+5.2f}% ({(st_c_a['avg']-st_i_a['avg'])/st_c_a['avg']*100:+.1f}%)")
    print(f"  Median       | {st_c_a['med']:6.2f}%         | {st_i_a['med']:6.2f}%          | {st_c_a['med'] - st_i_a['med']:+5.2f}%")
    print(f"  Std Dev      | {st_c_a['std']:6.2f}%         | {st_i_a['std']:6.2f}%          | {st_c_a['std'] - st_i_a['std']:+5.2f}%")
    print(f"  90th %-ile   | {st_c_a['p90']:6.2f}%         | {st_i_a['p90']:6.2f}%          | {st_c_a['p90'] - st_i_a['p90']:+5.2f}%")
    print(f"  95th %-ile   | {st_c_a['p95']:6.2f}%         | {st_i_a['p95']:6.2f}%          | {st_c_a['p95'] - st_i_a['p95']:+5.2f}%")
    print(f"  99th %-ile   | {st_c_a['p99']:6.2f}%         | {st_i_a['p99']:6.2f}%          | {st_c_a['p99'] - st_i_a['p99']:+5.2f}%")
    print(f"  Max Outlier  | {st_c_a['max']:6.2f}%         | {st_i_a['max']:6.2f}%          | {st_c_a['max'] - st_i_a['max']:+5.2f}%")

    # Accuracy match buckets
    c_w2 = sum(1 for e in c_acc_errs if e <= 2.0) / n * 100
    i_w2 = sum(1 for e in i_acc_errs if e <= 2.0) / n * 100
    c_w5 = sum(1 for e in c_acc_errs if e <= 5.0) / n * 100
    i_w5 = sum(1 for e in i_acc_errs if e <= 5.0) / n * 100
    print(f"  Within 2.0%  | {c_w2:5.1f}%          | {i_w2:5.1f}%           | {i_w2 - c_w2:+5.1f}%")
    print(f"  Within 5.0%  | {c_w5:5.1f}%          | {i_w5:5.1f}%           | {i_w5 - c_w5:+5.1f}%")

    print("\n--- PERFORMANCE RATING ERROR (Elo pts) ---")
    print(f"  Metric       | Current Formula | Upgraded Formula | Improvement")
    print(f"  -------------+-----------------+------------------+------------------")
    print(f"  Average MAE  | {st_c_r['avg']:6.1f} pts      | {st_i_r['avg']:6.1f} pts       | {st_c_r['avg'] - st_i_r['avg']:+5.1f} pts ({(st_c_r['avg']-st_i_r['avg'])/st_c_r['avg']*100:+.1f}%)")
    print(f"  Median       | {st_c_r['med']:6.1f} pts      | {st_i_r['med']:6.1f} pts       | {st_c_r['med'] - st_i_r['med']:+5.1f} pts")
    print(f"  Std Dev      | {st_c_r['std']:6.1f} pts      | {st_i_r['std']:6.1f} pts       | {st_c_r['std'] - st_i_r['std']:+5.1f} pts")
    print(f"  90th %-ile   | {st_c_r['p90']:6.1f} pts      | {st_i_r['p90']:6.1f} pts       | {st_c_r['p90'] - st_i_r['p90']:+5.1f} pts")
    print(f"  95th %-ile   | {st_c_r['p95']:6.1f} pts      | {st_i_r['p95']:6.1f} pts       | {st_c_r['p95'] - st_i_r['p95']:+5.1f} pts")
    print(f"  99th %-ile   | {st_c_r['p99']:6.1f} pts      | {st_i_r['p99']:6.1f} pts       | {st_c_r['p99'] - st_i_r['p99']:+5.1f} pts")
    print(f"  Max Outlier  | {st_c_r['max']:6.1f} pts      | {st_i_r['max']:6.1f} pts       | {st_c_r['max'] - st_i_r['max']:+5.1f} pts")

    # Rating match buckets
    c_r50 = sum(1 for e in c_rat_errs if e <= 50) / n * 100
    i_r50 = sum(1 for e in i_rat_errs if e <= 50) / n * 100
    c_r100 = sum(1 for e in c_rat_errs if e <= 100) / n * 100
    i_r100 = sum(1 for e in i_rat_errs if e <= 100) / n * 100
    c_r200 = sum(1 for e in c_rat_errs if e > 200) / n * 100
    i_r200 = sum(1 for e in i_rat_errs if e > 200) / n * 100
    c_r300 = sum(1 for e in c_rat_errs if e > 300) / n * 100
    i_r300 = sum(1 for e in i_rat_errs if e > 300) / n * 100

    print(f"  <= 50 pts    | {c_r50:5.1f}%          | {i_r50:5.1f}%           | {i_r50 - c_r50:+5.1f}%")
    print(f"  <= 100 pts   | {c_r100:5.1f}%          | {i_r100:5.1f}%           | {i_r100 - c_r100:+5.1f}%")
    print(f"  > 200 pts    | {c_r200:5.1f}% (bad)    | {i_r200:5.1f}% (bad)     | {i_r200 - c_r200:+5.1f}%")
    print(f"  > 300 pts    | {c_r300:5.1f}% (severe) | {i_r300:5.1f}% (severe)  | {i_r300 - c_r300:+5.1f}%")

    print("\n--- TOP OUTLIERS ---")
    print("  Worst Rating Outliers (Current Formula):")
    for r in worst_c_rat:
        print(f"    Game {r['gid']} ({r['user']}, {r['color']}): CC={r['cc_r']} vs Curr={r['curr_r']} (err {r['c_rat_err']}) | Impr={r['impr_r']} (err {r['i_rat_err']})")
    print("  Worst Rating Outliers (Upgraded Formula):")
    for r in worst_i_rat:
        print(f"    Game {r['gid']} ({r['user']}, {r['color']}): CC={r['cc_r']} vs Impr={r['impr_r']} (err {r['i_rat_err']}) | Curr={r['curr_r']} (err {r['c_rat_err']})")

    return {
        "st_c_a": st_c_a, "st_i_a": st_i_a,
        "st_c_r": st_c_r, "st_i_r": st_i_r,
        "c_w2": c_w2, "i_w2": i_w2,
        "c_w5": c_w5, "i_w5": i_w5,
        "c_r50": c_r50, "i_r50": i_r50,
        "c_r100": c_r100, "i_r100": i_r100,
        "c_r200": c_r200, "i_r200": i_r200,
        "c_r300": c_r300, "i_r300": i_r300,
        "records": records,
    }


def main():
    # Load Batch 5
    with open(os.path.join(CACHE_DIR, "drops_batch5_600.json"), "r", encoding="utf-8") as f:
        drops_b5 = json.load(f)

    # Load Batch 6
    with open(os.path.join(CACHE_DIR, "drops_batch6_400.json"), "r", encoding="utf-8") as f:
        drops_b6 = json.load(f)

    # Load All 1626
    with open(os.path.join(CACHE_DIR, "drops_all_1626_games.json"), "r", encoding="utf-8") as f:
        drops_all = json.load(f)

    res_b5 = analyze_dataset(drops_b5, "PREVIOUS RUN: BATCH 5 (600 Games / 1,200 Evals)")
    res_b6 = analyze_dataset(drops_b6, "CURRENT RUN: BATCH 6 (400 Games / 800 Evals)")
    res_all = analyze_dataset(drops_all, "CUMULATIVE DATASET (1,626 Games / 3,252 Evals)")

    print(f"\n{'='*90}")
    print("HEAD-TO-HEAD COMPARISON: PREVIOUS RUN (BATCH 5) vs CURRENT RUN (BATCH 6)")
    print(f"{'='*90}")
    print(f"Metric                        | Previous Run (Batch 5) | Current Run (Batch 6) | Delta")
    print(f"------------------------------+------------------------+-----------------------+-------")
    print(f"Current Acc MAE               | {res_b5['st_c_a']['avg']:6.2f}%                | {res_b6['st_c_a']['avg']:6.2f}%               | {res_b6['st_c_a']['avg'] - res_b5['st_c_a']['avg']:+5.2f}%")
    print(f"Upgraded Acc MAE              | {res_b5['st_i_a']['avg']:6.2f}%                | {res_b6['st_i_a']['avg']:6.2f}%               | {res_b6['st_i_a']['avg'] - res_b5['st_i_a']['avg']:+5.2f}%")
    print(f"Acc MAE Improvement           | {res_b5['st_c_a']['avg'] - res_b5['st_i_a']['avg']:+5.2f}%                | {res_b6['st_c_a']['avg'] - res_b6['st_i_a']['avg']:+5.2f}%               |")
    print(f"------------------------------+------------------------+-----------------------+-------")
    print(f"Current Rating MAE            | {res_b5['st_c_r']['avg']:6.1f} pts             | {res_b6['st_c_r']['avg']:6.1f} pts            | {res_b6['st_c_r']['avg'] - res_b5['st_c_r']['avg']:+5.1f} pts")
    print(f"Upgraded Rating MAE           | {res_b5['st_i_r']['avg']:6.1f} pts             | {res_b6['st_i_r']['avg']:6.1f} pts            | {res_b6['st_i_r']['avg'] - res_b5['st_i_r']['avg']:+5.1f} pts")
    print(f"Rating MAE Improvement        | {res_b5['st_c_r']['avg'] - res_b5['st_i_r']['avg']:+5.1f} pts             | {res_b6['st_c_r']['avg'] - res_b6['st_i_r']['avg']:+5.1f} pts            |")
    print(f"------------------------------+------------------------+-----------------------+-------")
    print(f"Upgraded Rating Median Error  | {res_b5['st_i_r']['med']:6.1f} pts             | {res_b6['st_i_r']['med']:6.1f} pts            | {res_b6['st_i_r']['med'] - res_b5['st_i_r']['med']:+5.1f} pts")
    print(f"Upgraded Rating 90th %-ile    | {res_b5['st_i_r']['p90']:6.1f} pts             | {res_b6['st_i_r']['p90']:6.1f} pts            | {res_b6['st_i_r']['p90'] - res_b5['st_i_r']['p90']:+5.1f} pts")
    print(f"Upgraded Rating 95th %-ile    | {res_b5['st_i_r']['p95']:6.1f} pts             | {res_b6['st_i_r']['p95']:6.1f} pts            | {res_b6['st_i_r']['p95'] - res_b5['st_i_r']['p95']:+5.1f} pts")
    print(f"Upgraded Rating Max Outlier   | {res_b5['st_i_r']['max']:6.1f} pts             | {res_b6['st_i_r']['max']:6.1f} pts            | {res_b6['st_i_r']['max'] - res_b5['st_i_r']['max']:+5.1f} pts")
    print(f"Ratings <= 100 pts Error      | {res_b5['i_r100']:5.1f}%                 | {res_b6['i_r100']:5.1f}%                | {res_b6['i_r100'] - res_b5['i_r100']:+5.1f}%")
    print(f"Severe Outliers (> 300 pts)   | {res_b5['i_r300']:5.1f}%                 | {res_b6['i_r300']:5.1f}%                | {res_b6['i_r300'] - res_b5['i_r300']:+5.1f}%")


if __name__ == "__main__":
    main()
