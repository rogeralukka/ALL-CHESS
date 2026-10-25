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

PRO = os.environ.get('UI_STYLE', 'pro') == 'pro'
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
    # AgX instead of Standard: whites roll off instead of clipping (the 'glare' on white pieces)
    # Standard keeps the toy colours saturated; matte materials (soften_materials) stop the clipping
    sc.view_settings.view_transform = os.environ.get('UI_VIEW', 'AgX')
    if sc.view_settings.view_transform == 'AgX':
        sc.view_settings.look = os.environ.get('UI_LOOK', 'AgX - Punchy')
    sc.view_settings.exposure = float(os.environ.get('UI_EXPOSURE', '0.0'))
    world = bpy.data.worlds.new('W')
    sc.world = world
    world.use_nodes = True
    bg = world.node_tree.nodes['Background']
    bg.inputs['Color'].default_value = (0.8, 0.86, 1.0, 1)
    bg.inputs['Strength'].default_value = 1.0

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
    rd.energy = 70
    rd.size = 5
    rd.color = (0.8, 0.88, 1.0)
    ro = bpy.data.objects.new('Rim', rd)
    sc.collection.objects.link(ro)
    ro.location = Vector(cam_target) + (Vector(cam_target) - Vector(cam_loc)).normalized() * 4 + Vector((0, 0, 3))
    ro.rotation_euler = (Vector(cam_target) - ro.location).normalized().to_track_quat('-Z', 'Y').to_euler()

    if catcher:
        bpy.ops.mesh.primitive_plane_add(size=40, location=(0, 0, 0))
        g = bpy.context.active_object
        g.name = 'Catcher'
        g.is_shadow_catcher = True
        # keep the floor out of the ink outline (its far edge would draw a line across the frame)
        noink = bpy.data.collections.new('NoInk')
        sc.collection.children.link(noink)
        sc.collection.objects.unlink(g)
        noink.objects.link(g)

    # thin ink outline: the cartoon look of the roadmap, and keeps white pieces readable
    sc.render.use_freestyle = os.environ.get('UI_STYLE', 'pro') != 'pro'
    bpy.context.view_layer.use_freestyle = sc.render.use_freestyle
    sc.render.line_thickness_mode = 'ABSOLUTE'
    sc.render.line_thickness = max(1.0, res_x / 700)
    fs = bpy.context.view_layer.freestyle_settings
    fs.crease_angle = math.radians(120)
    ls = fs.linesets[0] if fs.linesets else fs.linesets.new('ink')
    ls.select_by_visibility = True
    ls.select_silhouette = True
    ls.select_border = True
    ls.select_crease = False
    if catcher:
        ls.select_by_collection = True
        ls.collection = bpy.data.collections['NoInk']
        ls.collection_negation = 'EXCLUSIVE'
    else:
        ls.select_by_collection = False
    if ls.linestyle is None:
        ls.linestyle = bpy.data.linestyles.new('ink')
    ls.linestyle.color = srgb('#2a1d14')
    ls.linestyle.alpha = 0.85
    ls.linestyle.thickness = 1.0
    if PRO:
        P.studio(cam_loc, cam_target)
    return sc


def soften_materials():
    """Matte toy finish: no hot highlights eating detail (the glare the earlier renders had)."""
    if os.environ.get('UI_STYLE', 'pro') == 'pro':
        return
    for m in bpy.data.materials:
        if not m.use_nodes:
            continue
        p = m.node_tree.nodes.get('Principled BSDF')
        if not p:
            continue
        if p.inputs['Transmission Weight'].default_value > 0.1:
            p.inputs['Roughness'].default_value = 0.25
            continue
        metal = p.inputs['Metallic'].default_value
        p.inputs['Roughness'].default_value = max(p.inputs['Roughness'].default_value, 0.42 if metal > 0.5 else 0.58)
        p.inputs['Metallic'].default_value = min(metal, 0.55)
        p.inputs['Specular IOR Level'].default_value = 0.28


def fit_camera(margin=0.05, iters=10):
    """Move the camera so every visible object sits inside the frame with a margin (no clipped art)."""
    from bpy_extras.object_utils import world_to_camera_view
    sc = bpy.context.scene
    cam = sc.camera
    bpy.context.view_layer.update()
    pts = []
    for o in sc.objects:
        if o.type != 'MESH' or o.name.startswith('Catcher'):
            continue
        pts += [o.matrix_world @ Vector(c) for c in o.bound_box]
    if not pts:
        return
    fwd = cam.matrix_world.to_quaternion() @ Vector((0, 0, -1))
    right = cam.matrix_world.to_quaternion() @ Vector((1, 0, 0))
    up = cam.matrix_world.to_quaternion() @ Vector((0, 1, 0))
    for _ in range(iters):
        bpy.context.view_layer.update()
        ndc = [world_to_camera_view(sc, cam, p) for p in pts]
        xs, ys = [v.x for v in ndc], [v.y for v in ndc]
        cx, cy = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2
        aspect = sc.render.resolution_x / sc.render.resolution_y
        ext = max(max(xs) - min(xs), (max(ys) - min(ys)))
        centre = sum(pts, Vector()) / len(pts)
        dist = (centre - cam.location).dot(fwd)
        if cam.data.type == 'ORTHO':
            w = cam.data.ortho_scale
        else:
            w = dist * cam.data.sensor_width / cam.data.lens
        h = w / aspect if aspect >= 1 else w
        w = w if aspect >= 1 else w * aspect
        cam.location += right * (cx - 0.5) * w + up * (cy - 0.5) * h
        scale = ext / (1 - 2 * margin)
        if cam.data.type == 'ORTHO':
            cam.data.ortho_scale *= scale
        else:
            cam.location += fwd * dist * (1 - scale)


ANIM = os.environ.get('UI_FINISH', 'anim') == 'anim'


def polish_materials():
    """Finish pass. 'anim' (default): satin, painted-toy finish like the reference's 3D icons,
    soft highlights, no clear-coat mirror. 'gloss': lacquered with a clear coat."""
    for m in bpy.data.materials:
        if not m.use_nodes:
            continue
        p = m.node_tree.nodes.get('Principled BSDF')
        if ANIM and p and p.inputs['Transmission Weight'].default_value <= 0.1:
            metal = p.inputs['Metallic'].default_value
            p.inputs['Roughness'].default_value = max(p.inputs['Roughness'].default_value, 0.32 if metal > 0.5 else 0.5)
            p.inputs['Coat Weight'].default_value = min(p.inputs['Coat Weight'].default_value, 0.12)
            p.inputs['Coat Roughness'].default_value = 0.3
            p.inputs['Specular IOR Level'].default_value = min(p.inputs['Specular IOR Level'].default_value, 0.4)
            continue
        if m.get('pro'):
            continue
        p = m.node_tree.nodes.get('Principled BSDF')
        if not p or p.inputs['Transmission Weight'].default_value > 0.1:
            continue
        metal = p.inputs['Metallic'].default_value
        p.inputs['Roughness'].default_value = min(p.inputs['Roughness'].default_value, 0.22 if metal > 0.5 else 0.38)
        if metal > 0.5:
            p.inputs['Metallic'].default_value = 1.0
        p.inputs['Coat Weight'].default_value = 0.35
        p.inputs['Coat Roughness'].default_value = 0.12


def render(name):
    if PRO:
        polish_materials()
    else:
        soften_materials()
    fit_camera(0.04 if name.startswith(('icon_', 'logo_')) else 0.05)
    bpy.context.scene.render.filepath = os.path.join(OUT, name + '_raw.png')
    bpy.ops.render.render(write_still=True)
    print('rendered', name, flush=True)


# ----------------------------------------------------------------------------- chess pieces
WHITE = '#efe6d4'
BLACK = '#45403b'


def piece_mat(color):
    return mat('piece' + color, color, 0.55)


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
    """Lathe base plus a thick, rounded horse head (our own outline) with an eye and a mane."""
    m = piece_mat(color)
    base = lathe([(r * s, z * s) for r, z in BASE + [(0.19, 0.2), (0.0, 0.2)]], (0, 0, 0), m)
    outline = [(-0.21, 0.18), (0.19, 0.18), (0.17, 0.34), (0.09, 0.48), (0.15, 0.55), (0.27, 0.58), (0.34, 0.63),
               (0.36, 0.7), (0.31, 0.77), (0.2, 0.85), (0.11, 0.93), (0.07, 1.02), (0.01, 1.06), (-0.04, 0.97),
               (-0.13, 0.9), (-0.21, 0.78), (-0.26, 0.6), (-0.27, 0.42), (-0.25, 0.28)]
    depth = 0.28
    me = bpy.data.meshes.new('kn')
    bm = bmesh.new()
    vs = [bm.verts.new((x * s, 0, z * s)) for x, z in outline]
    f = bm.faces.new(vs)
    ext = bmesh.ops.extrude_face_region(bm, geom=[f])
    moved = [e for e in ext['geom'] if isinstance(e, bmesh.types.BMVert)]
    bmesh.ops.translate(bm, vec=(0, depth * s, 0), verts=moved)
    bmesh.ops.translate(bm, vec=(0, -depth / 2 * s, 0), verts=bm.verts)
    bm.to_mesh(me)
    bm.free()
    head = bpy.data.objects.new('kn', me)
    bpy.context.scene.collection.objects.link(head)
    bev = head.modifiers.new('b', 'BEVEL')
    bev.width = 0.06 * s
    bev.segments = 4
    bev.limit_method = 'ANGLE'
    smooth(head)
    assign(head, m)
    parts = [base, head]
    # eyes (dark on white pieces, light on dark pieces) and nostril
    eye_c = '#2a2420' if color == WHITE else '#efe6d4'
    em = mat('eye' + eye_c, eye_c, 0.6)
    for side in (-1, 1):
        parts.append(sphere(0.035 * s, (0.13 * s, side * (depth / 2 + 0.005) * s, 0.8 * s), em, scale=(1, 0.5, 1.2)))
        parts.append(sphere(0.022 * s, (0.31 * s, side * (depth / 2 - 0.02) * s, 0.68 * s), em, scale=(1, 0.5, 1)))
    # mane: a ridge of rounded tufts down the back of the neck
    mane_c = '#cbbfa8' if color == WHITE else '#2f2b28'
    mm = mat('mane' + mane_c, mane_c, 0.7)
    for i, (x, z) in enumerate([(-0.06, 0.98), (-0.15, 0.9), (-0.22, 0.79), (-0.27, 0.66), (-0.29, 0.52), (-0.29, 0.38)]):
        parts.append(sphere(0.06 * s, (x * s, 0, z * s), mm, scale=(1, 1.15, 1)))
    bpy.ops.object.empty_add(location=(0, 0, 0))
    root = bpy.context.active_object
    for o in parts:
        o.parent = root
    root.location = loc
    root.rotation_euler.z = facing
    return root


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


# ----------------------------------------------------------------------------- detailed kit
import pro_pieces as P  # noqa: E402
if PRO:
    pawn, rook, bishop, queen, king, knight, board = P.pawn, P.rook, P.bishop, P.queen, P.king, P.knight, P.board  # noqa: F811


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
    # tassel: cord from the button to a corner, then hanging straight down to the tassel
    top = loc[2] + 0.34 * s
    corner = Vector((loc[0] + 0.47 * s, loc[1] - 0.0 * s, top))
    def rod(p0, p1, r):
        d = p1 - p0
        o = cyl(r, d.length, (0, 0, 0), gold, verts=12)
        o.location = (p0 + p1) / 2
        o.rotation_euler = d.normalized().to_track_quat('Z', 'Y').to_euler()
        return o
    rod(Vector((loc[0], loc[1], top)), corner, 0.018 * s)
    rod(corner, corner - Vector((0, 0, 0.3 * s)), 0.018 * s)
    cyl(0.05 * s, 0.18 * s, (corner.x, corner.y, corner.z - 0.46 * s), gold, verts=14, r2=0.025 * s)


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


if PRO:
    trophy = P.trophy  # noqa: F811


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
    knight((0, 0, z), WHITE, 1.05, facing=math.radians(-144))


def icon_puzzles():
    icon_scene()
    # stood up about 50 degrees so the knobs read, like a piece being slotted in
    p = puzzle_piece((0, 0, 0.0), AMBER, 1.0)
    bpy.ops.object.empty_add(location=(0, 0, 0))
    root = bpy.context.active_object
    p.parent = root
    root.rotation_euler = (math.radians(52), 0, math.radians(18))
    root.location = (0, 0, 0.62)


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
    # lifted clear of the floor so no part of the ring sinks below the shadow catcher
    g = gear((0, 0, 0.75), '#a7b1bf', 0.95)
    g.rotation_euler = (math.radians(62), 0, math.radians(20))


def facing_root(z=0.75):
    """Empty whose local XZ plane faces the icon camera, for flat-ish badge icons."""
    bpy.ops.object.empty_add(location=(0, 0, z))
    root = bpy.context.active_object
    to_cam = (Vector(ICON_CAM['cam_loc']) - Vector((0, 0, z))).normalized()
    root.rotation_euler = (-to_cam).to_track_quat('Y', 'Z').to_euler()
    return root


def arc(radius, thick, a0, a1, m, seg=40):
    """Torus segment in the local XZ plane."""
    bpy.ops.mesh.primitive_torus_add(major_radius=radius, minor_radius=thick, major_segments=seg * 2, minor_segments=16,
                                     location=(0, 0, 0), rotation=(math.radians(90), 0, 0))
    o = bpy.context.active_object
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=False)
    bm = bmesh.new()
    bm.from_mesh(o.data)
    kill = []
    for v in bm.verts:
        ang = math.atan2(v.co.z, v.co.x) % math.tau
        lo, hi = a0 % math.tau, a1 % math.tau
        inside = lo <= ang <= hi if lo <= hi else (ang >= lo or ang <= hi)
        if not inside:
            kill.append(v)
    bmesh.ops.delete(bm, geom=kill, context='VERTS')
    bm.to_mesh(o.data)
    bm.free()
    smooth(o)
    return assign(o, m)


def icon_sun():
    icon_scene()
    root = facing_root()
    core = sphere(0.4, (0, 0, 0), mat('sun', '#ffbe2e', 0.55))
    core.scale = (1, 0.7, 1)
    core.parent = root
    ray = mat('ray', '#ff9a1f', 0.55)
    for i in range(8):
        a = i / 8 * math.tau + math.radians(22.5)
        d = Vector((math.cos(a), 0, math.sin(a)))
        c = cyl(0.11, 0.2, (0, 0, 0), ray, verts=20, r2=0.0)
        c.location = d * 0.6
        c.rotation_euler = d.to_track_quat('Z', 'Y').to_euler()
        smooth(c)
        c.parent = root


def icon_moon():
    icon_scene()
    root = facing_root()
    m = mat('moon', '#cfd3ff', 0.6)
    body = sphere(0.5, (0, 0, 0), m)
    cut = sphere(0.47, (0.3, 0, 0.17), m, scale=(1, 2.2, 1))
    mod = body.modifiers.new('c', 'BOOLEAN')
    mod.operation = 'DIFFERENCE'
    mod.object = cut
    bpy.context.view_layer.objects.active = body
    bpy.ops.object.modifier_apply(modifier=mod.name)
    bpy.data.objects.remove(cut, do_unlink=True)
    body.scale = (1, 0.55, 1)
    body.parent = root
    star = mat('star', '#ffd75e', 0.5)
    for x, z, r in [(0.48, 0.42, 0.08), (0.62, -0.05, 0.055)]:
        sphere(r, (x, 0, z), star).parent = root


def icon_sync():
    icon_scene()
    root = facing_root()
    for k, m in ((0, mat('syncA', '#4fb3ff', 0.5)), (1, mat('syncB', '#6cc95b', 0.5))):
        a0 = k * math.pi + math.radians(20)
        a1 = a0 + math.radians(130)
        arc(0.45, 0.1, a0, a1, m).parent = root
        tip = cyl(0.2, 0.26, (0, 0, 0), m, verts=24, r2=0.0)
        pos = Vector((math.cos(a1), 0, math.sin(a1))) * 0.45
        tangent = Vector((-math.sin(a1), 0, math.cos(a1)))
        tip.location = pos + tangent * 0.06
        tip.rotation_euler = tangent.to_track_quat('Z', 'Y').to_euler()
        tip.scale = (1, 0.55, 1)
        tip.parent = root


RANK_COLORS = {'pawn': '#b9c2cf', 'knight': '#7fbf5a', 'bishop': '#4ea3e3', 'rook': '#9b7cf2', 'queen': '#ee6aa7', 'king': '#f2b531'}


def rank_icon(kind):
    """A piece in its tier colour on a round coin pedestal: the profile's rank badge."""
    def job():
        icon_scene()
        col = RANK_COLORS[kind]
        # pedestal in a darker shade of the same colour, so the badge reads as one object
        dark = '#%02x%02x%02x' % tuple(int(int(col[i:i + 2], 16) * 0.62) for i in (1, 3, 5))
        cyl(0.52, 0.14, (0, 0, 0), mat('ped' + kind, dark, 0.55), verts=64)
        cyl(0.47, 0.04, (0, 0, 0.14), mat('pedTop' + kind, col, 0.55), verts=64)
        fn = {'pawn': pawn, 'knight': knight, 'bishop': bishop, 'rook': rook, 'queen': queen, 'king': king}[kind]
        kw = {'facing': math.radians(-144)} if kind == 'knight' else {}
        fn((0, 0, 0.19), col, 1.0, **kw)
    return job


def icon_leaderboard():
    icon_scene()
    for x, h, c in [(-0.42, 0.55, '#c9c8c5'), (0.0, 0.85, '#f7c631'), (0.42, 0.38, '#cd8a3a')]:
        box((0.4, 0.42, h), (x, 0, h / 2), mat('pod' + c, c, 0.5, 0.3), bevel=0.04)
    # crown on the winner's block
    gold = mat('crown', '#ffcf3d', 0.4, 0.6)
    cyl(0.17, 0.09, (0, 0, 0.85), gold, verts=40)
    for i in range(5):
        a = i / 5 * math.tau
        o = cyl(0.045, 0.13, (math.cos(a) * 0.14, math.sin(a) * 0.14, 0.93), gold, verts=12, r2=0.01)
    sphere(0.035, (0, 0, 1.0), mat('ruby', '#e0324a', 0.35))


def logo_king():
    scene(res_x=320, res_y=420, cam_loc=(4.0, -6.5, 2.8), cam_target=(0, 0, 0.62), lens=110, sun_dir=(-0.5, 0.8, -1.3))
    king((0, 0, 0), '#f5b833', 1.0, accent='#fff1c2')


PIECE_S = 0.6   # pieces sit inside their square with room to breathe


def hero_board(pieces, cam=(5.6, -7.8, 6.2), target=(0, 0, 0.3), res=(1400, 820), lens=58, extra=None):
    scene(res_x=res[0], res_y=res[1], cam_loc=cam, cam_target=target, lens=lens, sun_dir=(-0.6, 0.7, -1.2), sun=2.8)
    z = board()
    for fn, f, r, c, kw in pieces:
        fn(sq_pos(f, r, z=z), c, PIECE_S, **kw)
    if extra:
        extra(z)


def hero_home():
    # a calm opening position plus the trophy beside the board (fully in frame)
    hero_board([
        (king, 4, 0, WHITE, {}), (knight, 5, 2, WHITE, {'facing': math.radians(36)}), (pawn, 4, 3, WHITE, {}), (pawn, 3, 1, WHITE, {}),
        (king, 4, 7, BLACK, {}), (knight, 2, 5, BLACK, {'facing': math.radians(-144)}), (pawn, 4, 4, BLACK, {}), (pawn, 5, 6, BLACK, {}),
    ], extra=lambda z: trophy((3.3, 1.0, 0), 1.7))


def hero_scout():
    def extra(z):
        spyglass((2.9, -1.4, 0.25), 1.2)
        bpy.ops.mesh.primitive_torus_add(major_radius=0.22, minor_radius=0.022, location=(*sq_pos(4, 4)[:2], z + 0.03))
        t = bpy.context.active_object
        assign(t, mat('target', '#ff6b4a', 0.5, emission='#ff6b4a', emit_strength=1.2))
    hero_board([
        (king, 4, 4, BLACK, {}), (queen, 3, 6, BLACK, {}), (knight, 5, 5, BLACK, {'facing': math.radians(-144)}),
        (pawn, 2, 5, BLACK, {}), (pawn, 3, 3, WHITE, {}), (knight, 2, 2, WHITE, {'facing': math.radians(36)}), (rook, 0, 0, WHITE, {}),
    ], extra=extra)


def hero_review():
    def extra(z):
        magnifier((0.6, -0.5, z + 1.0), 1.3, tilt=58)
    hero_board([
        (knight, 4, 4, WHITE, {'facing': math.radians(36)}), (king, 6, 0, WHITE, {}), (pawn, 3, 3, WHITE, {}), (queen, 2, 1, WHITE, {}),
        (king, 6, 7, BLACK, {}), (rook, 4, 7, BLACK, {}), (pawn, 4, 5, BLACK, {}), (bishop, 1, 6, BLACK, {}),
    ], extra=extra)


def hero_profile():
    scene(res_x=1400, res_y=820, cam_loc=(4.2, -7.2, 4.0), cam_target=(0, 0, 0.7), lens=60, sun_dir=(-0.6, 0.7, -1.2), sun=2.8)
    plinth = mat('podium', '#5a4c86', 0.6)
    for x, h, c in [(-1.05, 0.55, '#c0c7d1'), (0.0, 0.85, '#ffc93c'), (1.05, 0.4, '#d8955b')]:
        box((1.0, 0.9, h), (x, 0, h / 2), plinth, bevel=0.06)
        box((0.5, 0.05, 0.3), (x, -0.455, h * 0.55), mat('medal' + c, c, 0.45, 0.6), bevel=0.02)
    trophy((0, 0, 0.85), 1.1)
    king((-1.05, 0, 0.55), WHITE, 0.62)
    queen((1.05, 0, 0.4), BLACK, 0.62)
    bar_chart((2.5, 0.7, 0), 0.95)


def hero_play():
    hero_board([
        (king, 4, 0, WHITE, {}), (queen, 3, 0, WHITE, {}), (pawn, 4, 3, WHITE, {}), (knight, 5, 2, WHITE, {'facing': math.radians(36)}),
        (bishop, 2, 3, WHITE, {}),
        (king, 4, 7, BLACK, {}), (queen, 3, 7, BLACK, {}), (pawn, 4, 4, BLACK, {}), (knight, 2, 5, BLACK, {'facing': math.radians(-144)}),
    ])


def hero_404():
    """A knight knocked over beside a small broken board corner, with a big amber question mark."""
    scene(res_x=1200, res_y=820, cam_loc=(4.6, -7.0, 4.6), cam_target=(0, 0, 0.5), lens=60, sun_dir=(-0.6, 0.7, -1.2), sun=2.8)
    lm, dm = mat('sqL', '#e9e2cf', 0.6), mat('sqD', '#7a9e5b', 0.6)
    frame = M.wood_mat('frame', '#6b4a2c', '#4e3420', scale=6, side_dark=0.7)
    sq = 0.62
    for i, j in [(0, 0), (1, 0), (2, 0), (0, 1), (1, 1), (0, 2)]:
        x, y = (i - 1) * sq, (j - 1) * sq
        box((sq, sq, 0.16), (x, y, 0.08), frame, bevel=0.02)
        box((sq * 0.96, sq * 0.96, 0.03), (x, y, 0.175), lm if (i + j) % 2 else dm)
    # knight teetering on the broken edge, looking puzzled at the question mark
    k = knight((0, 0, 0), WHITE, 1.0, facing=math.radians(36))
    k.rotation_euler = (0, math.radians(9), math.radians(36))
    k.location = (0.02, 0.0, 0.215)
    pawn((-0.62, 0.62, 0.19), BLACK, 0.85)
    # question mark from a text object, extruded
    bpy.ops.object.text_add(location=(1.35, 0.35, 0.0))
    t = bpy.context.active_object
    t.data.body = '?'
    t.data.extrude = 0.12
    t.data.bevel_depth = 0.03
    t.data.size = 1.9
    t.data.align_x = 'CENTER'
    t.rotation_euler = (math.radians(90), 0, math.radians(30))
    bpy.ops.object.convert(target='MESH')
    assign(bpy.context.active_object, mat('qm', AMBER, 0.5))


def test_lineup():
    scene(res_x=1400, res_y=600, cam_loc=(0.6, -7.5, 2.4), cam_target=(0, 0, 0.55), lens=70)
    for i, (fn, c) in enumerate([(pawn, WHITE), (knight, WHITE), (bishop, WHITE), (rook, WHITE), (queen, WHITE), (king, WHITE),
                                 (pawn, BLACK), (knight, BLACK), (bishop, BLACK), (rook, BLACK), (queen, BLACK), (king, BLACK)]):
        kw = {'facing': math.radians(-90 + 25)} if fn is knight else {}
        fn(((i - 5.5) * 0.85, 0.4 if i >= 6 else -0.2, 0), c, 1.0, **kw)
    trophy((5.6, 0.2, 0), 1.3)


def pieces_test():
    scene(res_x=1400, res_y=560, cam_loc=(0.0, -9.0, 3.4), cam_target=(0, 0, 0.55), lens=70, sun_dir=(-0.6, 0.7, -1.2), sun=2.8)
    for i, fn in enumerate([pawn, rook, knight, bishop, queen, king]):
        kw = {'facing': math.radians(-90)} if fn is knight else {}
        fn((-2.5 + i * 1.0, 0.45, 0), WHITE, 1.0, **kw)
        fn((-2.5 + i * 1.0, -0.45, 0), BLACK, 1.0, **({'facing': math.radians(-90)} if fn is knight else {}))
    trophy((3.6, 0.0, 0), 1.2)


def knight_test():
    scene(res_x=900, res_y=560, cam_loc=(2.0, -7.5, 2.6), cam_target=(0, 0, 0.6), lens=70, sun_dir=(-0.6, 0.7, -1.2), sun=2.8)
    knight((-0.6, 0, 0), WHITE, 1.0, facing=math.radians(-20))
    knight((0.6, 0.3, 0), BLACK, 1.0, facing=math.radians(200))


JOBS = {
    'knight_test': knight_test,
    'pieces_test': pieces_test,
    'test_lineup': test_lineup,
    'icon_home': icon_home, 'icon_play': icon_play, 'icon_puzzles': icon_puzzles, 'icon_learn': icon_learn,
    'icon_review': icon_review, 'icon_scout': icon_scout, 'icon_profile': icon_profile, 'icon_settings': icon_settings,
    **{f'rank_{k}': rank_icon(k) for k in ('pawn', 'knight', 'bishop', 'rook', 'queen', 'king')},
    'icon_leaderboard': icon_leaderboard,
    'logo_king': logo_king, 'icon_sun': icon_sun, 'icon_moon': icon_moon, 'icon_sync': icon_sync,
    'hero_404': hero_404,
    'hero_home': hero_home, 'hero_scout': hero_scout, 'hero_review': hero_review, 'hero_profile': hero_profile, 'hero_play': hero_play,
}

if __name__ == '__main__':
    only = os.environ.get('UI_ONLY', '').split(',') if os.environ.get('UI_ONLY') else None
    for name, job in JOBS.items():
        if only and name not in only:
            continue
        job()
        render(name)
