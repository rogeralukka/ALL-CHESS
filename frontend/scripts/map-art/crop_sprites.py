"""Crops the raw renders to their visible pixels and writes web-ready sprites + a manifest."""
import json, os, sys
from PIL import Image

raw_dir, out_dir, data_json = sys.argv[1], sys.argv[2], sys.argv[3]
os.makedirs(out_dir, exist_ok=True)
raw = json.load(open(os.path.join(raw_dir, 'raw_manifest.json')))
meta = raw.pop('_meta')
out = {'tileWidthPx': round(meta['tile_w_px'], 2), 'sprites': {}}
PAD = 4
for name, a in sorted(raw.items()):
    im = Image.open(os.path.join(raw_dir, name + '_raw.png')).convert('RGBA')
    # the shadow catcher leaves a faint haze (alpha <= ~8) over the whole frame: remove it,
    # keeping real contact shadows, then crop to what is left
    r_, g_, b_, a_ = im.split()
    a_ = a_.point(lambda v: 0 if v <= 8 else round((v - 8) * 255 / 247))
    im = Image.merge('RGBA', (r_, g_, b_, a_))
    l, t, r, b = a_.point(lambda v: 255 if v > 10 else 0).getbbox()
    l, t, r, b = max(0, l - PAD), max(0, t - PAD), min(im.width, r + PAD), min(im.height, b + PAD)
    c = im.crop((l, t, r, b))
    c.save(os.path.join(out_dir, name + '.webp'), 'WEBP', quality=90, method=6)
    out['sprites'][name] = {
        'w': c.width, 'h': c.height,
        'ax': round(a['ax'] - l, 1), 'ay': round(a['ay'] - t, 1),
        'tx': round(a['tx'] - l, 1), 'ty': round(a['ty'] - t, 1),
    }
json.dump(out, open(data_json, 'w'), indent=1)
print('wrote', len(out['sprites']), 'sprites')
