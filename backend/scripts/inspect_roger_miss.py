import json

data_corr = json.load(open('backend/.cache/drops_626_corrected.json', encoding='utf-8'))
data_old = json.load(open('backend/.cache/drops_626_games.json', encoding='utf-8'))

for g_c, g_o in zip(data_corr, data_old):
    if g_c['user'] == 'rogeralukka':
        if g_c['white_drops'] != g_o['white_drops'] or g_c['black_drops'] != g_o['black_drops']:
            diff_w = [i for i, (a, b) in enumerate(zip(g_c['white_drops'], g_o['white_drops'])) if a != b]
            diff_b = [i for i, (a, b) in enumerate(zip(g_c['black_drops'], g_o['black_drops'])) if a != b]
            print(f"Roger Game {g_c['id']}: CC={g_c['cc']}")
            print(f"  Diff White plies: {diff_w}, Diff Black plies: {diff_b}")
            if diff_w:
                for idx in diff_w:
                    print(f"    W ply {idx}: old drop={g_o['white_drops'][idx]} -> new={g_c['white_drops'][idx]}")
            if diff_b:
                for idx in diff_b:
                    print(f"    B ply {idx}: old drop={g_o['black_drops'][idx]} -> new={g_c['black_drops'][idx]}")
            break
