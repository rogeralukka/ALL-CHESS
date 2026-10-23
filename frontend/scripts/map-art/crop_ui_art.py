"""Crops UI art renders to their visible pixels and writes WebP files into public/assets/ui."""
import os
import sys
from PIL import Image

raw_dir, out_dir = sys.argv[1], sys.argv[2]
os.makedirs(out_dir, exist_ok=True)
for f in sorted(os.listdir(raw_dir)):
    if not f.endswith('_raw.png'):
        continue
    name = f[:-8]
    im = Image.open(os.path.join(raw_dir, f)).convert('RGBA')
    r, g, b, a = im.split()
    # remove the shadow catcher's faint haze, keep contact shadows (softer for icons)
    floor = 10 if name.startswith(('icon_', 'logo_')) else 8
    a = a.point(lambda v: 0 if v <= floor else round((v - floor) * 255 / (255 - floor)))
    im = Image.merge('RGBA', (r, g, b, a))
    # icons: frame the object itself (its soft floor shadow may be clipped); art keeps shadows
    box = a.point(lambda v: 255 if v > (150 if name.startswith(('icon_', 'logo_')) else 14) else 0).getbbox()
    pad = 6
    box = (max(0, box[0] - pad), max(0, box[1] - pad), min(im.width, box[2] + pad), min(im.height, box[3] + pad))
    im = im.crop(box)
    if name.startswith(('icon_', 'logo_')):
        # square canvas so icons line up in the nav
        side = max(im.size)
        sq = Image.new('RGBA', (side, side), (0, 0, 0, 0))
        sq.paste(im, ((side - im.width) // 2, (side - im.height) // 2))
        im = sq.resize((128, 128), Image.LANCZOS) if name.startswith('icon_') else im
        if name.startswith('logo_'):
            im.thumbnail((128, 128), Image.LANCZOS)
    else:
        im.thumbnail((1100, 700), Image.LANCZOS)
    im.save(os.path.join(out_dir, name + '.webp'), 'WEBP', quality=90, method=6)
    print(name, im.size)
