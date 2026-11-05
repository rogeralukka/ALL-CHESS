import json

data = json.load(open('backend/.cache/drops_626_games.json', encoding='utf-8'))

errs = []
large_errs = []

for g in data:
    for color in ('white', 'black'):
        drops = g[f'{color}_drops']
        if not drops: continue
        cc = g['cc'][color]
        curr = g['current'][color]
        if curr is None: continue
        err = abs(curr - cc)
        errs.append(err)
        if err > 10.0:
            large_errs.append({
                'id': g['id'],
                'user': g['user'],
                'color': color,
                'rating': g.get(f'{color}_rating'),
                'cc': cc,
                'curr': curr,
                'err': round(err, 2),
                'plies': len(drops),
            })

tot = len(errs)
within_2 = sum(1 for e in errs if e <= 2.0)
within_3 = sum(1 for e in errs if e <= 3.0)
within_5 = sum(1 for e in errs if e <= 5.0)
within_8 = sum(1 for e in errs if e <= 8.0)
over_10 = len(large_errs)

print(f"Total Evaluations: {tot}")
print(f"  Within 2.0 pts: {within_2} ({within_2/tot*100:.1f}%)")
print(f"  Within 3.0 pts: {within_3} ({within_3/tot*100:.1f}%)")
print(f"  Within 5.0 pts: {within_5} ({within_5/tot*100:.1f}%)")
print(f"  Within 8.0 pts: {within_8} ({within_8/tot*100:.1f}%)")
print(f"  Outliers (> 10 pts): {over_10} ({over_10/tot*100:.1f}%)")

print(f"\nTop 10 Outliers (> 10 pts):")
large_errs.sort(key=lambda x: x['err'], reverse=True)
for x in large_errs[:10]:
    print(f"  {x['user']:12s} ({x['id']}) {x['color']} (Elo {x['rating']}): CC={x['cc']:.1f}% | Ours={x['curr']:.1f}% | Err={x['err']:.1f}")
