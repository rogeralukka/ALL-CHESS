"""Packs the loader frames into one WebP sprite sheet (12 columns) for LoadingScreen."""
import glob
import os
import sys
from PIL import Image

src, out = sys.argv[1], sys.argv[2]
COLS, W, H = 12, 176, 208
frames = sorted(glob.glob(os.path.join(src, 'f*.png')))
# crop every frame to the union of their visible pixels, so the piece fills the sprite
box = None
for f in frames:
    b = Image.open(f).getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox()
    if b:
        box = b if box is None else (min(box[0], b[0]), min(box[1], b[1]), max(box[2], b[2]), max(box[3], b[3]))
pad = 6
box = (box[0] - pad, box[1] - pad, box[2] + pad, box[3] + pad)
bw, bh = box[2] - box[0], box[3] - box[1]
W = round(H * bw / bh)
print('crop', box, '->', W, 'x', H)
rows = (len(frames) + COLS - 1) // COLS
sheet = Image.new('RGBA', (COLS * W, rows * H), (0, 0, 0, 0))
for i, f in enumerate(frames):
    im = Image.open(f).convert('RGBA').crop(box)
    r, g, b, a = im.split()
    a = a.point(lambda v: 0 if v <= 8 else round((v - 8) * 255 / 247))
    im = Image.merge('RGBA', (r, g, b, a)).resize((W, H), Image.LANCZOS)
    sheet.paste(im, ((i % COLS) * W, (i // COLS) * H))
sheet.save(out, 'WEBP', quality=86, method=6)
print(len(frames), 'frames ->', out, sheet.size, os.path.getsize(out) // 1024, 'KB')
