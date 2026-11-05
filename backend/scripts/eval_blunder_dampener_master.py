import json
import math
from collections import defaultdict

data = json.load(open('backend/.cache/drops_626_games.json', encoding='utf-8'))

def eval_blunder_dampened(s=8.0, p=1.1, wp=0.30, blunder_coeff=0.35):
    all_curr_errs = []
    all_impr_errs = []
    account_stats = defaultdict(lambda: {"cc": [], "curr": [], "impr": [], "c_err": [], "i_err": []})
    band_stats = defaultdict(lambda: {"c_err": [], "i_err": []})

    for g in data:
        u = g["user"]
        for c in ("white", "black"):
            drops = g[f"{c}_drops"]
            classes = g[f"{c}_classes"]
            if not drops: continue
            cc = g["cc"][c]

            # Current Formula
            accs_curr = [max(0.0, min(100.0, round(100.0 * math.exp(-((d / 8.0) ** 1.1)), 1))) for d in drops]
            w_curr = [(1.0 + d / 5.0) ** 0.30 for d in drops]
            c_pred = round(sum(w * a for w, a in zip(w_curr, accs_curr)) / sum(w_curr), 1)

            # Improved Formula: Same base formula + progressive blunder dampener on high error games
            base_acc = c_pred
            n_blunders = sum(1 for cls in classes if cls in ('blunder', 'miss'))
            blunder_rate = n_blunders / len(drops)

            if blunder_rate > 0.12:
                # Progressive reduction on high blunder games
                reduction = (blunder_rate - 0.12) * blunder_coeff
                i_pred = round(max(15.0, base_acc * (1.0 - reduction)), 1)
            else:
                i_pred = base_acc

            c_err = abs(c_pred - cc)
            i_err = abs(i_pred - cc)

            all_curr_errs.append(c_err)
            all_impr_errs.append(i_err)

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

    return all_curr_errs, all_impr_errs, account_stats, band_stats


all_c, all_i, accts, bands = eval_blunder_dampened(blunder_coeff=0.50)

print("=" * 105)
print("ACCURACY WITH BLUNDER DAMPENER FIX (RATING-INDEPENDENT)")
print("=" * 105)

print("\n### 1. SUMMARY BY ACCOUNT")
order = ["ishowspeed", "gyrostomp", "rogeralukka", "nickorlando24", "loveandpeach", "hikaru"]
display_names = {
    "ishowspeed": "IShowSpeed (~119 Elo Beginner)",
    "gyrostomp": "Gyrostomp (~637 Elo Developing)",
    "rogeralukka": "RogerAlukka (~700-900 Elo HELD-OUT TEST)",
    "nickorlando24": "NickOrlando24 (~1150 Elo Club)",
    "loveandpeach": "LoveAndPeach (~2504 Elo Master)",
    "hikaru": "Hikaru (~3300 Elo Super GM)",
}

for u in order:
    res = accts[u]
    cnt = len(res["cc"])
    avg_cc = sum(res["cc"]) / cnt
    avg_c = sum(res["curr"]) / cnt
    avg_i = sum(res["impr"]) / cnt
    m_c = sum(res["c_err"]) / cnt
    m_i = sum(res["i_err"]) / cnt
    delta = m_c - m_i
    sign = "-" if delta > 0 else "+"
    status = "[BETTER]" if delta > 0.1 else ("[SAME]" if abs(delta) <= 0.1 else "[WORSE]")
    print(f"| {display_names[u]:<40} | {cnt:>5} | {avg_cc:>12.1f}% | {avg_c:>8.1f}% ({m_c:.2f}) | {avg_i:>9.1f}% ({m_i:.2f}) | {sign}{abs(delta):>5.2f} pts {status:<8} |")

tot_c = sum(all_c) / len(all_c)
tot_i = sum(all_i) / len(all_i)
diff = tot_c - tot_i
print(f"| {'TOTAL OVERALL (ALL 626 GAMES)':<40} | {len(all_c):>5} | {'---':>13} | {tot_c:>13.2f} MAE | {tot_i:>14.2f} MAE | -{diff:>5.2f} pts [BETTER] |")

print("\n### 2. SUMMARY BY ACCURACY BAND")
for b in ["< 60%", "60 - 70%", "70 - 80%", "80 - 90%", "90%+"]:
    res = bands[b]
    cnt = len(res["c_err"])
    m_c = sum(res["c_err"]) / cnt
    m_i = sum(res["i_err"]) / cnt
    diff = m_c - m_i
    sign = "-" if diff > 0 else "+"
    status = "[BETTER]" if diff > 0.1 else ("[SAME]" if abs(diff) <= 0.1 else "[WORSE]")
    print(f"| {b:<15} | {cnt:>6} | {m_c:>11.2f} | {m_i:>12.2f} | {sign}{abs(diff):>5.2f} pts {status:<8} |")
