"""
Renders the app's 3D UI art: navigation icons, the logo and page header illustrations.

Same approach as render_map_sprites.py: every model is built from primitives in code, so the art
is ours and reproducible. Output is transparent PNG, cropped by crop_ui_art.py to WebP.

Run:  python render_ui_art.py <out_dir>        (needs `pip install bpy==5.2.3`)
Env:  UI_ONLY=icon_play,hero_home  to render a subset;  UI_SAMPLES=64
"""
import math
import os
import random
import sys

import bpy
import bmesh
from mathutils import Vector

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import render_map_sprites as M  # noqa: E402  (materials and prop builders)

OUT = sys.argv[-1] if len(sys.argv) > 1 and not sys.argv[-1].endswith('.py') else 'ui_out'
os.makedirs(OUT, exist_ok=True)
SAMPLES = int(os.environ.get('UI_SAMPLES', '64'))

mat, srgb, assign, flat, smooth, box, cyl, lumpy_sphere = M.mat, M.srgb, M.assign, M.flat, M.smooth, M.box, M.cyl, M.lumpy_sphere


# ----------------------------------------------------------------------------- scene
def scene(res_x, res_y, cam_loc, cam_target, lens=70, ortho=None, catcher=True, sun_dir=(0.6, 0.9, -1.2), sun=3.0):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    M._mats.clear()
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'
    sc.cycles.device = 'CPU'
    sc.cycles.samples = SAMPLES
    sc.cycles.use_denoising = True
    sc.cycles.max_bounces = 6
    sc.render.film_transparent = True
    sc.render.resolution_x = res_x
    sc.render.resolution_y = res_y
    sc.render.image_settings.file_format = 'PNG'
    sc.render.image_settings.color_mode = 'RGBA'
    sc.view_settings.view_transform = 'Standard'
    world = bpy.data.worlds.new('W')
    sc.world = world
    world.use_nodes = True
    bg = world.node_tree.nodes['Background']
    bg.inputs['Color'].default_value = (0.8, 0.86, 1.0, 1)
    bg.inputs['Strength'].default_value = 0.7

    cd = bpy.data.cameras.new('C')
    if ortho:
        cd.type = 'ORTHO'
        cd.ortho_scale = ortho
    else:
        cd.lens = lens
    cam = bpy.data.objects.new('C', cd)
    sc.collection.objects.link(cam)
    cam.location = Vector(cam_loc)
    d = (Vector(cam_target) - Vector(cam_loc)).normalized()
    cam.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    sc.camera = cam

    sd = bpy.data.lights.new('Sun', 'SUN')
    sd.energy = sun
    sd.angle = math.radians(12)
    sd.color = (1.0, 0.96, 0.9)
    so = bpy.data.objects.new('Sun', sd)
    sc.collection.objects.link(so)
    so.rotation_euler = Vector(sun_dir).normalized().to_track_quat('-Z', 'Y').to_euler()

    # cool rim light from behind so silhouettes pop on dark UI
    rd = bpy.data.lights.new('Rim', 'AREA')
    rd.energy = 260
    rd.size = 3
    rd.color = (0.8, 0.88, 1.0)
    ro = bpy.data.objects.new('Rim', rd)
    sc.collection.objects.link(ro)
    ro.location = Vector(cam_target) + (Vector(cam_target) - Vector(cam_loc)).normalized() * 4 + Vector((0, 0, 3))
    ro.rotation_euler = (Vector(cam_target) - ro.location).normalized().to_track_quat('-Z', 'Y').to_euler()

    if catcher:
        bpy.ops.mesh.primitive_plane_add(size=40, location=(0, 0, 0))
        g = bpy.context.active_object
        g.is_shadow_catcher = True
    return sc


def render(name):
    bpy.context.scene.render.filepath = os.path.join(OUT, name + '_raw.png')
    bpy.ops.render.render(write_still=True)
    print('rendered', name, flush=True)


# ----------------------------------------------------------------------------- chess pieces
WHITE = '#e6dfd2'
BLACK = '#3b3734'


def piece_mat(color):
    return mat('piece' + color, color, 0.32)


def lathe(profile, loc, material, seg=48):
    me = bpy.data.meshes.new('lathe')
    verts, faces = [], []
    n = len(profile)
    for i in range(seg):
        a = i / seg * math.tau
        for (r, z) in profile:
            verts.append((loc[0] + math.cos(a) * r, loc[1] + math.sin(a) * r, loc[2] + z))
    for i in range(seg):
        j = (i + 1) % seg
        for k in range(n - 1):
            faces.append((i * n + k, j * n + k, j * n + k + 1, i * n + k + 1))
    me.from_pydata(verts, [], faces)
    me.update()
    o = bpy.data.objects.new('lathe', me)
    bpy.context.scene.collection.objects.link(o)
    smooth(o)
    return assign(o, material)


def sphere(r, loc, material, scale=(1, 1, 1)):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, segments=32, ring_count=16, location=loc)
    o = bpy.context.active_object
    o.scale = scale
    smooth(o)
    return assign(o, material)


BASE = [(0.0, 0.0), (0.34, 0.0), (0.345, 0.04), (0.33, 0.075), (0.3, 0.1), (0.31, 0.12), (0.26, 0.15), (0.2, 0.18)]


def pawn(loc, color, s=1.0):
    m = piece_mat(color)
    prof = BASE + [(0.15, 0.24), (0.12, 0.42), (0.19, 0.46), (0.19, 0.49), (0.1, 0.52), (0.0, 0.52)]
    lathe([(r * s, z * s) for r, z in prof], loc, m)
    sphere(0.15 * s, (loc[0], loc[1], loc[2] + 0.64 * s), m)


def rook(loc, color, s=1.0):
    m = piece_mat(color)
    prof = BASE + [(0.19, 0.22), (0.17, 0.56), (0.24, 0.6), (0.24, 0.76), (0.0, 0.76)]
    lathe([(r * s, z * s) for r, z in prof], loc, m)
    for i in range(5):
        a = i / 5 * math.tau
        b = box((0.1 * s, 0.08 * s, 0.1 * s), (loc[0] + math.cos(a) * 0.18 * s, loc[1] + math.sin(a) * 0.18 * s, loc[2] + 0.8 * s), m, bevel=0.01)
        b.rotation_euler.z = a


def bishop(loc, color, s=1.0):
    m = piece_mat(color)
    prof = BASE + [(0.15, 0.24), (0.1, 0.5), (0.17, 0.54), (0.17, 0.57), (0.09, 0.6), (0.0, 0.6)]
    lathe([(r * s, z * s) for r, z in prof], loc, m)
    sphere(0.15 * s, (loc[0], loc[1], loc[2] + 0.76 * s), m, scale=(1, 1, 1.35))
    sphere(0.045 * s, (loc[0], loc[1], loc[2] + 0.99 * s), m)


def queen(loc, color, s=1.0):
    m = piece_mat(color)
    prof = BASE + [(0.16, 0.24), (0.11, 0.62), (0.2, 0.68), (0.2, 0.71), (0.14, 0.74), (0.24, 0.9), (0.0, 0.84)]
    lathe([(r * s, z * s) for r, z in prof], loc, m)
    for i in range(8):
        a = i / 8 * math.tau
        sphere(0.045 * s, (loc[0] + math.cos(a) * 0.235 * s, loc[1] + math.sin(a) * 0.235 * s, loc[2] + 0.92 * s), m)
    sphere(0.07 * s, (loc[0], loc[1], loc[2] + 0.93 * s), m)


def king(loc, color, s=1.0, accent=None):
    m = piece_mat(color)
    prof = BASE + [(0.17, 0.24), (0.12, 0.66), (0.21, 0.72), (0.21, 0.75), (0.15, 0.78), (0.23, 0.92), (0.0, 0.92)]
    lathe([(r * s, z * s) for r, z in prof], loc, m)
    cm = mat('gold', accent, 0.25, 0.85) if accent else m
    box((0.07 * s, 0.07 * s, 0.26 * s), (loc[0], loc[1], loc[2] + 1.05 * s), cm, bevel=0.012)
    box((0.2 * s, 0.07 * s, 0.07 * s), (loc[0], loc[1], loc[2] + 1.08 * s), cm, bevel=0.012)


def knight(loc, color, s=1.0, facing=0.0):
    """Lathe base plus an extruded horse-head silhouette (our own outline)."""
    m = piece_mat(color)
    lathe([(r * s, z * s) for r, z in BASE + [(0.18, 0.2), (0.0, 0.2)]], loc, m)
    outline = [(-0.2, 0.18), (0.2, 0.18), (0.18, 0.34), (0.12, 0.5), (0.2, 0.6), (0.28, 0.66), (0.3, 0.74), (0.24, 0.78),
               (0.14, 0.76), (0.06, 0.86), (0.02, 0.94), (-0.04, 0.86), (-0.14, 0.82), (-0.22, 0.7), (-0.25, 0.52), (-0.24, 0.34)]
    me = bpy.data.meshes.new('kn')
    bm = bmesh.new()
    vs = [bm.verts.new((x * s, 0, z * s)) for x, z in outline]
    f = bm.faces.new(vs)
    ext = bmesh.ops.extrude_face_region(bm, geom=[f])
    moved = [e for e in ext['geom'] if isinstance(e, bmesh.types.BMVert)]
    bmesh.ops.translate(bm, vec=(0, 0.22 * s, 0), verts=moved)
    bmesh.ops.translate(bm, vec=(0, -0.11 * s, 0), verts=bm.verts)
    bm.to_mesh(me)
    bm.free()
    o = bpy.data.objects.new('kn', me)
    bpy.context.scene.collection.objects.link(o)
    o.location = loc
    o.rotation_euler.z = facing
    bev = o.modifiers.new('b', 'BEVEL')
    bev.width = 0.03 * s
    bev.segments = 3
    assign(o, m)
    return o


def board(size=8, sq=0.5, loc=(0, 0, 0), light='#e9e2cf', dark='#7a9e5b', frame='#6b4a2c', thickness=0.12):
    """A wooden board: frame slab plus an 8x8 inlay."""
    w = size * sq
    box((w + 0.3, w + 0.3, thickness), (loc[0], loc[1], loc[2] + thickness / 2), M.wood_mat('frame', frame, '#4e3420', scale=6, side_dark=0.7), bevel=0.04)
    lm, dm = mat('sqL', light, 0.45), mat('sqD', dark, 0.5)
    for i in range(size):
        for j in range(size):
            x = loc[0] - w / 2 + sq * (i + 0.5)
            y = loc[1] - w / 2 + sq * (j + 0.5)
            box((sq, sq, 0.02), (x, y, loc[2] + thickness + 0.01), lm if (i + j) % 2 else dm)
    return loc[2] + thickness + 0.02


def sq_pos(file, rank, sq=0.5, size=8, z=0.0):
    w = size * sq
    return (-w / 2 + sq * (file + 0.5), -w / 2 + sq * (rank + 0.5), z)


# ----------------------------------------------------------------------------- icon props
AMBER = '#f5a524'
AMBER_D = '#c97d0f'


def puzzle_piece(loc, color=AMBER, s=1.0):
    m = mat('pz' + color, color, 0.35)
    body = box((0.9 * s, 0.9 * s, 0.24 * s), (loc[0], loc[1], loc[2] + 0.12 * s), m, bevel=0.08 * s, segments=5)
    # knobs out (top, right) and sockets in (left, bottom)
    def knob(x, y):
        bpy.ops.mesh.primitive_cylinder_add(radius=0.17 * s, depth=0.24 * s, vertices=40, location=(loc[0] + x * s, loc[1] + y * s, loc[2] + 0.12 * s))
        return bpy.context.active_object
    for (x, y) in [(0, 0.55), (0.55, 0)]:
        k = knob(x, y)
        mod = body.modifiers.new('u', 'BOOLEAN')
        mod.operation = 'UNION'
        mod.object = k
        bpy.context.view_layer.objects.active = body
        bpy.ops.object.modifier_apply(modifier=mod.name)
        bpy.data.objects.remove(k, do_unlink=True)
    for (x, y) in [(-0.4, 0), (0, -0.4)]:
        k = knob(x, y)
        k.scale = (1, 1, 1.6)
        mod = body.modifiers.new('d', 'BOOLEAN')
        mod.operation = 'DIFFERENCE'
        mod.object = k
        bpy.context.view_layer.objects.active = body
        bpy.ops.object.modifier_apply(modifier=mod.name)
        bpy.data.objects.remove(k, do_unlink=True)
    bev = body.modifiers.new('bv', 'BEVEL')
    bev.width = 0.03 * s
    bev.segments = 3
    bev.limit_method = 'ANGLE'
    try:
        bpy.context.view_layer.objects.active = body
        bpy.ops.object.shade_smooth_by_angle(angle=math.radians(40))
    except Exception:
        pass
    return body


def grad_cap(loc, s=1.0):
    blk = mat('cap', '#2e3a4f', 0.5)
    gold = mat('gold', '#ffc93c', 0.25, 0.9)
    cyl(0.32 * s, 0.26 * s, (loc[0], loc[1], loc[2]), blk, verts=40, r2=0.36 * s)
    b = box((0.95 * s, 0.95 * s, 0.06 * s), (loc[0], loc[1], loc[2] + 0.3 * s), blk, bevel=0.02)
    b.rotation_euler.z = math.radians(45)
    cyl(0.06 * s, 0.05 * s, (loc[0], loc[1], loc[2] + 0.33 * s), gold, verts=20)
    # tassel cord + tassel hanging off one corner
    c = cyl(0.012 * s, 0.45 * s, (0, 0, 0), gold, verts=8)
    c.location = (loc[0] + 0.2 * s, loc[1] - 0.2 * s, loc[2] + 0.36 * s)
    c.rotation_euler = (math.radians(70), 0, math.radians(-45))
    cyl(0.045 * s, 0.16 * s, (loc[0] + 0.5 * s, loc[1] - 0.5 * s, loc[2] + 0.02 * s), gold, verts=12, r2=0.02 * s)


def magnifier(loc, s=1.0, tilt=35):
    rim = mat('rim', '#2f3542', 0.35, 0.6)
    glass = bpy.data.materials.new('glass')
    glass.use_nodes = True
    p = glass.node_tree.nodes['Principled BSDF']
    p.inputs['Base Color'].default_value = (*srgb('#bfe6ff'), 1)
    p.inputs['Roughness'].default_value = 0.05
    p.inputs['Transmission Weight'].default_value = 0.85
    p.inputs['IOR'].default_value = 1.3
    handle = mat('handle', AMBER, 0.4)
    parts = []
    bpy.ops.mesh.primitive_torus_add(major_radius=0.4 * s, minor_radius=0.06 * s, major_segments=64, minor_segments=16, location=(0, 0, 0))
    t = bpy.context.active_object
    smooth(t)
    assign(t, rim)
    parts.append(t)
    g = cyl(0.39 * s, 0.03 * s, (0, 0, -0.015 * s), glass, verts=48)
    parts.append(g)
    h = cyl(0.06 * s, 0.55 * s, (0, 0, 0), handle, verts=20, r2=0.07 * s)
    h.rotation_euler = (math.radians(90), 0, 0)
    h.location = (0, -0.44 * s, 0)
    smooth(h)
    parts.append(h)
    hc = cyl(0.07 * s, 0.1 * s, (0, 0, 0), rim, verts=20)
    hc.rotation_euler = (math.radians(90), 0, 0)
    hc.location = (0, -0.44 * s, 0)
    parts.append(hc)
    bpy.ops.object.empty_add(location=(0, 0, 0))
    root = bpy.context.active_object
    for o in parts:
        o.parent = root
    root.rotation_euler = (math.radians(tilt), 0, math.radians(30))
    root.location = loc
    return root


def spyglass(loc, s=1.0):
    brass = mat('brass', '#d9a441', 0.3, 0.9)
    leather = mat('leather', '#6b3f22', 0.7)
    dark = mat('lens', '#14202b', 0.1)
    bpy.ops.object.empty_add(location=(0, 0, 0))
    root = bpy.context.active_object
    segs = [(0.2, 0.17, 0.0, 0.5, leather), (0.17, 0.14, 0.5, 0.4, brass), (0.14, 0.11, 0.9, 0.35, brass)]
    for r1, r2, z0, h, m in segs:
        o = cyl(r1 * s, h * s, (0, 0, z0 * s), m, verts=40, r2=r2 * s)
        smooth(o)
        o.parent = root
        ring = cyl(r1 * 1.08 * s, 0.05 * s, (0, 0, z0 * s), brass, verts=40)
        ring.parent = root
    cap = cyl(0.21 * s, 0.05 * s, (0, 0, -0.04 * s), brass, verts=40)
    cap.parent = root
    lens = cyl(0.15 * s, 0.01 * s, (0, 0, -0.05 * s), dark, verts=40)
    lens.parent = root
    root.rotation_euler = (math.radians(68), 0, math.radians(-35))
    root.location = loc
    return root


def gear(loc, color='#9aa5b4', s=1.0, teeth=10):
    """Gear as separate parts (ring + teeth + hub); no booleans, so it renders reliably."""
    m = mat('gear' + color, color, 0.3, 0.7)
    bpy.ops.object.empty_add(location=(0, 0, 0))
    root = bpy.context.active_object
    bpy.ops.mesh.primitive_torus_add(major_radius=0.32 * s, minor_radius=0.12 * s, major_segments=64, minor_segments=20, location=(0, 0, 0))
    ring = bpy.context.active_object
    ring.scale = (1, 1, 0.9)
    smooth(ring)
    assign(ring, m)
    ring.parent = root
    for i in range(teeth):
        a = i / teeth * math.tau
        t = box((0.16 * s, 0.15 * s, 0.2 * s), (math.cos(a) * 0.47 * s, math.sin(a) * 0.47 * s, 0), m, bevel=0.025)
        t.rotation_euler.z = a
        t.parent = root
    root.location = loc
    return root


def bar_chart(loc, s=1.0):
    base = mat('chartbase', '#3a4150', 0.5)
    box((1.1 * s, 0.5 * s, 0.08 * s), (loc[0], loc[1], loc[2] + 0.04 * s), base, bevel=0.03)
    for i, (h, c) in enumerate([(0.45, '#5aa9e6'), (0.75, '#7bb661'), (1.05, AMBER)]):
        box((0.26 * s, 0.26 * s, h * s), (loc[0] + (i - 1) * 0.34 * s, loc[1], loc[2] + 0.08 * s + h * s / 2), mat('bar' + c, c, 0.35), bevel=0.04, segments=4)


def trophy(loc, s=1.0):
    gold = mat('gold', '#ffc93c', 0.22, 0.95)
    dark = mat('plinth', '#3b2f2a', 0.5)
    box((0.5 * s, 0.5 * s, 0.16 * s), (loc[0], loc[1], loc[2] + 0.08 * s), dark, bevel=0.03)
    lathe([(r * s, z * s) for r, z in [(0, 0.16), (0.16, 0.16), (0.12, 0.2), (0.05, 0.26), (0.04, 0.42), (0.08, 0.46), (0.26, 0.56), (0.3, 0.78), (0.31, 0.86), (0.0, 0.86)]], loc, gold)
    for side in (-1, 1):
        bpy.ops.mesh.primitive_torus_add(major_radius=0.11 * s, minor_radius=0.025 * s, location=(loc[0] + side * 0.32 * s, loc[1], loc[2] + 0.7 * s))
        t = bpy.context.active_object
        t.rotation_euler = (math.radians(90), 0, 0)
        smooth(t)
        assign(t, gold)


def house(loc, s=1.0):
    walls = mat('walls', '#f1e4cc', 0.6)
    roof = mat('roofr', '#d9573f', 0.45)
    door = mat('doorA', AMBER, 0.4)
    box((0.8 * s, 0.7 * s, 0.55 * s), (loc[0], loc[1], loc[2] + 0.275 * s), walls, bevel=0.03)
    me = bpy.data.meshes.new('r')
    w, d, h, z0 = 0.5 * s, 0.45 * s, 0.38 * s, loc[2] + 0.55 * s
    v = [(-w, -d, z0), (w, -d, z0), (w, d, z0), (-w, d, z0), (-w, 0, z0 + h), (w, 0, z0 + h)]
    me.from_pydata([(x + loc[0], y + loc[1], z) for x, y, z in v], [], [(0, 1, 5, 4), (3, 4, 5, 2), (0, 4, 3), (1, 2, 5), (0, 3, 2, 1)])
    me.update()
    o = bpy.data.objects.new('roof', me)
    bpy.context.scene.collection.objects.link(o)
    sol = o.modifiers.new('s', 'SOLIDIFY')
    sol.thickness = 0.07 * s
    bev = o.modifiers.new('b', 'BEVEL')
    bev.width = 0.02 * s
    assign(o, roof)
    flat(o)
    box((0.025 * s, 0.2 * s, 0.32 * s), (loc[0] + 0.405 * s, loc[1] + 0.1 * s, loc[2] + 0.17 * s), door, bevel=0.01)
    win = mat('win', '#bfe3ff', 0.15, emission='#ffe39a', emit_strength=1.2)
    box((0.025 * s, 0.16 * s, 0.14 * s), (loc[0] + 0.405 * s, loc[1] - 0.17 * s, loc[2] + 0.33 * s), win)
    box((0.12 * s, 0.12 * s, 0.28 * s), (loc[0] - 0.2 * s, loc[1] + 0.18 * s, loc[2] + 0.8 * s), mat('chim', '#9aa0a6', 0.8), bevel=0.02)


def tile(loc, s=1.0, color='#e8b36a'):
    box((0.95 * s, 0.95 * s, 0.14 * s), (loc[0], loc[1], loc[2] + 0.07 * s), M.wood_mat('tl' + color, color, '#cf914c', scale=5, planks=3.3, side_dark=0.62), bevel=0.05)
    return loc[2] + 0.14 * s


# ----------------------------------------------------------------------------- compositions
ICON_CAM = dict(res_x=320, res_y=320, cam_loc=(5.2, -6.2, 4.4), cam_target=(0, 0, 0.42), lens=105)


def icon_scene():
    return scene(**ICON_CAM, sun_dir=(-0.5, 0.8, -1.3))


def icon_home():
    icon_scene()
    house((0, 0, 0), 1.05)


def icon_play():
    icon_scene()
    z = tile((0, 0, 0), 0.9)
    knight((0, 0, z), WHITE, 1.05, facing=math.radians(-120))


def icon_puzzles():
    icon_scene()
    p = puzzle_piece((0, 0, 0.0), AMBER, 1.0)
    p.rotation_euler = (math.radians(0), 0, math.radians(12))


def icon_learn():
    icon_scene()
    grad_cap((0, 0, 0.05), 1.05)


def icon_review():
    icon_scene()
    z = tile((0.1, 0.15, 0), 0.8, '#7ccc5a')
    magnifier((-0.05, -0.1, z + 0.55), 1.05, tilt=60)


def icon_scout():
    icon_scene()
    spyglass((0, 0.1, 0.25), 1.0)


def icon_profile():
    icon_scene()
    bar_chart((0, 0, 0), 0.95)


def icon_settings():
    icon_scene()
    g = gear((0, 0, 0.1), '#a7b1bf', 0.95)
    g.rotation_euler = (math.radians(58), 0, math.radians(20))


def logo_king():
    scene(res_x=320, res_y=420, cam_loc=(4.0, -6.5, 2.8), cam_target=(0, 0, 0.62), lens=110, sun_dir=(-0.5, 0.8, -1.3))
    king((0, 0, 0), '#f5b833', 1.0, accent='#fff1c2')


def hero_board(pieces, cam=(5.6, -7.8, 6.2), target=(0, 0, 0.3), res=(1400, 820), lens=58, extra=None):
    scene(res_x=res[0], res_y=res[1], cam_loc=cam, cam_target=target, lens=lens, sun_dir=(-0.6, 0.7, -1.2), sun=3.2)
    z = board()
    for fn, f, r, c, kw in pieces:
        fn(sq_pos(f, r, z=z), c, 0.82, **kw)
    if extra:
        extra(z)


def hero_home():
    hero_board([
        (king, 6, 0, WHITE, {}), (rook, 5, 0, WHITE, {}), (pawn, 5, 1, WHITE, {}), (pawn, 6, 1, WHITE, {}), (pawn, 7, 1, WHITE, {}),
        (queen, 3, 3, WHITE, {}), (knight, 2, 2, WHITE, {'facing': math.radians(-60)}), (bishop, 4, 3, WHITE, {}),
        (king, 6, 7, BLACK, {}), (pawn, 5, 6, BLACK, {}), (pawn, 6, 5, BLACK, {}), (pawn, 7, 6, BLACK, {}),
        (rook, 0, 7, BLACK, {}), (knight, 2, 5, BLACK, {'facing': math.radians(110)}), (bishop, 4, 6, BLACK, {}),
    ], extra=lambda z: trophy((3.0, 1.6, 0), 1.25))


def hero_scout():
    def extra(z):
        spyglass((2.6, -1.6, 0.25), 1.35)
        # target rings on the scouted square
        for r_, c_ in [(0.24, '#ff6b4a')]:
            bpy.ops.mesh.primitive_torus_add(major_radius=r_, minor_radius=0.025, location=(*sq_pos(4, 4)[:2], z + 0.03))
            t = bpy.context.active_object
            assign(t, mat('target', c_, 0.4, emission=c_, emit_strength=1.5))
    hero_board([
        (king, 4, 4, BLACK, {}), (queen, 3, 6, BLACK, {}), (knight, 5, 5, BLACK, {'facing': math.radians(100)}),
        (pawn, 2, 5, BLACK, {}), (pawn, 6, 6, BLACK, {}), (bishop, 1, 6, BLACK, {}),
        (pawn, 3, 3, WHITE, {}), (knight, 2, 2, WHITE, {'facing': math.radians(-70)}), (rook, 0, 0, WHITE, {}),
    ], extra=extra)


def hero_review():
    def extra(z):
        magnifier((0.55, -0.4, z + 1.25), 1.6, tilt=58)
    hero_board([
        (knight, 4, 4, WHITE, {'facing': math.radians(-60)}), (king, 6, 0, WHITE, {}), (pawn, 3, 3, WHITE, {}),
        (pawn, 5, 2, WHITE, {}), (queen, 2, 1, WHITE, {}),
        (king, 6, 7, BLACK, {}), (rook, 4, 7, BLACK, {}), (pawn, 4, 5, BLACK, {}), (bishop, 1, 6, BLACK, {}),
    ], extra=extra)


def hero_profile():
    scene(res_x=1400, res_y=820, cam_loc=(4.2, -7.2, 4.0), cam_target=(0, 0, 0.7), lens=60, sun_dir=(-0.6, 0.7, -1.2), sun=3.2)
    plinth = mat('podium', '#4a3f6b', 0.5)
    for x, h, c in [(-1.05, 0.55, '#c0c7d1'), (0.0, 0.85, '#ffc93c'), (1.05, 0.4, '#d8955b')]:
        box((1.0, 0.9, h), (x, 0, h / 2), plinth, bevel=0.05)
        box((0.5, 0.05, 0.3), (x, -0.455, h * 0.55), mat('medal' + c, c, 0.25, 0.9), bevel=0.02)
    trophy((0, 0, 0.85), 1.2)
    king((-1.05, 0, 0.55), WHITE, 0.62)
    queen((1.05, 0, 0.4), BLACK, 0.62)
    bar_chart((2.6, 0.6, 0), 1.05)


def hero_play():
    hero_board([
        (king, 4, 0, WHITE, {}), (queen, 3, 0, WHITE, {}), (pawn, 4, 3, WHITE, {}), (pawn, 3, 1, WHITE, {}), (knight, 5, 2, WHITE, {'facing': math.radians(-60)}),
        (bishop, 2, 3, WHITE, {}),
        (king, 4, 7, BLACK, {}), (queen, 3, 7, BLACK, {}), (pawn, 4, 4, BLACK, {}), (pawn, 3, 6, BLACK, {}), (knight, 2, 5, BLACK, {'facing': math.radians(110)}),
    ])


JOBS = {
    'icon_home': icon_home, 'icon_play': icon_play, 'icon_puzzles': icon_puzzles, 'icon_learn': icon_learn,
    'icon_review': icon_review, 'icon_scout': icon_scout, 'icon_profile': icon_profile, 'icon_settings': icon_settings,
    'logo_king': logo_king,
    'hero_home': hero_home, 'hero_scout': hero_scout, 'hero_review': hero_review, 'hero_profile': hero_profile, 'hero_play': hero_play,
}

if __name__ == '__main__':
    only = os.environ.get('UI_ONLY', '').split(',') if os.environ.get('UI_ONLY') else None
    for name, job in JOBS.items():
        if only and name not in only:
            continue
        job()
        render(name)
