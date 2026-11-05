import json

g = json.load(open('backend/.cache/batch5_raw_600_games.json', encoding='utf-8'))[0]
print("Keys in raw game:")
print(list(g.keys()))
print("White obj:", g.get('white'))
print("Accuracies:", g.get('cc'))
