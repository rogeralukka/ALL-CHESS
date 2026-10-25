"""
Renders the loading animation: a piece hops, backflips, and turns into the next piece at the top
of each flip (pawn -> knight -> bishop -> rook -> queen -> king -> pawn). Each piece wears its
rank colour. Output: frames as PNGs, packed into one sprite sheet by pack_loader.py.

Run:  python render_loader.py <out_dir>   (needs `pip install bpy==5.2.3`)
"""
import math
import os
import sys

import bpy
from mathutils import Vector

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import render_ui_art as U  # noqa: E402

OUT = sys.argv[-1] if len(sys.argv) > 1 and not sys.argv[-1].endswith('.py') else 'loader_out'
os.makedirs(OUT, exist_ok=True)
SEG = 16                      # frames per hop
ORDER = ['pawn', 'knight', 'bishop', 'rook', 'queen', 'king']
BUILD = {'pawn': U.pawn, 'knight': U.knight, 'bishop': U.bishop, 'rook': U.rook, 'queen': U.queen, 'king': U.king}

sc = U.scene(res_x=220, res_y=260, cam_loc=(4.2, -6.4, 3.0), cam_target=(0, 0, 1.0), lens=88, sun_dir=(-0.5, 0.8, -1.3))
sc.cycles.samples = int(os.environ.get('UI_SAMPLES', '24'))

roots = {}
for kind in ORDER:
    before = set(bpy.data.objects)
    kw = {'facing': math.radians(-144)} if kind == 'knight' else {}
    BUILD[kind]((0, 0, 0), U.RANK_COLORS[kind], 1.0, **kw)
    made = [o for o in bpy.data.objects if o not in before]
    bpy.ops.object.empty_add(location=(0, 0, 0))
    root = bpy.context.active_object
    for o in made:
        if o.parent is None:
            o.parent = root
    roots[kind] = root

U.soften_materials()


def show(kind):
    for k, r in roots.items():
        hide = k != kind
        for o in [r] + list(r.children_recursive):
            o.hide_render = hide


def ease_out(t):
    return 1 - (1 - t) ** 2


frame = 0
for i, kind in enumerate(ORDER):
    nxt = ORDER[(i + 1) % len(ORDER)]
    for f in range(SEG):
        t = f / SEG
        # 0-0.2 squash, 0.2-0.85 airborne with a full backflip, 0.85-1 land squash
        z, rot, sx, sz = 0.0, 0.0, 1.0, 1.0
        if t < 0.2:
            k = t / 0.2
            sz, sx = 1 - 0.22 * math.sin(k * math.pi / 2), 1 + 0.12 * math.sin(k * math.pi / 2)
        elif t < 0.85:
            k = (t - 0.2) / 0.65
            z = 1.25 * 4 * k * (1 - k)
            rot = -math.tau * ease_out(k)
            sz, sx = 1 + 0.08 * math.sin(k * math.pi), 1 - 0.05 * math.sin(k * math.pi)
        else:
            k = (t - 0.85) / 0.15
            sz, sx = 1 - 0.16 * math.sin(k * math.pi), 1 + 0.1 * math.sin(k * math.pi)
        current = kind if (t < 0.2 or (t < 0.85 and (t - 0.2) / 0.65 < 0.5)) else nxt
        show(current)
        r = roots[current]
        # flip around the piece's middle, so it spins in place rather than swinging
        r.location = Vector((0, 0, z + 0.5 * (1 - math.cos(rot)) * 0 ))
        r.rotation_euler = (rot, 0, 0)
        r.scale = (sx, sx, sz)
        # keep the rotation pivot near the piece's centre of mass
        pivot = Vector((0, 0, 0.45))
        offset = pivot - (r.matrix_basis.to_3x3() @ pivot) if rot else Vector((0, 0, 0))
        r.location = Vector((0, 0, z)) + offset
        sc.render.filepath = os.path.join(OUT, f'f{frame:03d}.png')
        bpy.ops.render.render(write_still=True)
        frame += 1
print('frames', frame, flush=True)
