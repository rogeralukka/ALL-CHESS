"""
"Pro game" art kit: detailed Staunton-style pieces, a sculpted knight, an ornate trophy and a
lacquered board, with glossy coated materials and a studio light rig. Used by render_ui_art.py
(imported last so these builders replace the earlier simple ones).

Everything is generated from code: lathe profiles are smoothed with Catmull-Rom so curves stay
round, and sharp edges are kept where a point is listed twice.
"""
import math

import bpy
import bmesh
from mathutils import Vector

import render_map_sprites as M

srgb = M.srgb

# ----------------------------------------------------------------------------- materials
_cache = {}


def pmat(name, color, rough=0.28, metal=0.0, coat=0.6, coat_rough=0.06, sss=0.0, spec=0.5):
    key = (name, color, rough, metal, coat)
    if key in _cache:
        try:
            if _cache[key].name in bpy.data.materials:
                return _cache[key]
        except ReferenceError:  # scene was reset since this material was made
            pass
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    p = m.node_tree.nodes['Principled BSDF']
    p.inputs['Base Color'].default_value = (*srgb(color), 1)
    p.inputs['Roughness'].default_value = rough
    p.inputs['Metallic'].default_value = metal
    p.inputs['Specular IOR Level'].default_value = spec
    p.inputs['Coat Weight'].default_value = coat
    p.inputs['Coat Roughness'].default_value = coat_rough
    if sss:
        p.inputs['Subsurface Weight'].default_value = sss
        p.inputs['Subsurface Radius'].default_value = (0.05, 0.03, 0.02)
        p.inputs['Subsurface Scale'].default_value = 0.05
    m['pro'] = True
    _cache[key] = m
    return m


IVORY = '#f4ead6'
EBONY = '#2b2522'
WHITE_KEYS = ('#efe6d4', '#f4ead6', IVORY)


def piece_material(color):
    if color in WHITE_KEYS:
        return pmat('ivory', IVORY, 0.26, coat=0.75, sss=0.12)
    if color in ('#45403b', EBONY):
        return pmat('ebony', EBONY, 0.3, coat=0.85)
    return pmat('lacquer' + color, color, 0.27, coat=0.8)


def accent_material(color):
    """Contrasting detail colour (knight eye, mane grooves)."""
    return pmat('acc' + color, '#1d1916' if color in WHITE_KEYS else '#d9cdb6', 0.35, coat=0.4)


GOLD = lambda: pmat('gold', '#f5bf3f', 0.18, metal=1.0, coat=0.3)  # noqa: E731
GOLD_DARK = lambda: pmat('golddark', '#c98a1c', 0.25, metal=1.0, coat=0.2)  # noqa: E731


# ----------------------------------------------------------------------------- geometry helpers
def smooth_obj(o):
    for p in o.data.polygons:
        p.use_smooth = True
    return o


def assign(o, m):
    o.data.materials.clear()
    o.data.materials.append(m)
    return o


def catmull(points, steps=6):
    """Densify a (r, z) profile with Catmull-Rom; a point listed twice stays a hard corner."""
    out = []
    n = len(points)
    for i in range(n - 1):
        p0 = Vector(points[max(i - 1, 0)])
        p1 = Vector(points[i])
        p2 = Vector(points[i + 1])
        p3 = Vector(points[min(i + 2, n - 1)])
        if p1 == p2:
            continue
        if points[max(i - 1, 0)] == points[i]:
            p0 = p1
        if i + 2 < n and points[i + 2] == points[i + 1]:
            p3 = p2
        for k in range(steps):
            t = k / steps
            t2, t3 = t * t, t * t * t
            v = 0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
            out.append((max(0.0, v.x), v.y))
    out.append(tuple(points[-1]))
    return out


def lathe(profile, loc, material, seg=72, steps=6):
    prof = catmull(profile, steps)
    me = bpy.data.meshes.new('lathe')
    verts, faces = [], []
    n = len(prof)
    for i in range(seg):
        a = i / seg * math.tau
        for (r, z) in prof:
            verts.append((loc[0] + math.cos(a) * r, loc[1] + math.sin(a) * r, loc[2] + z))
    for i in range(seg):
        j = (i + 1) % seg
        for k in range(n - 1):
            faces.append((i * n + k, j * n + k, j * n + k + 1, i * n + k + 1))
    me.from_pydata(verts, [], faces)
    me.update()
    o = bpy.data.objects.new('lathe', me)
    bpy.context.scene.collection.objects.link(o)
    smooth_obj(o)
    try:
        o.modifiers.new('wn', 'WEIGHTED_NORMAL')
    except Exception:
        pass
    return assign(o, material)


def ball(r, loc, m, scale=(1, 1, 1)):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, segments=48, ring_count=24, location=loc)
    o = bpy.context.active_object
    o.scale = scale
    smooth_obj(o)
    return assign(o, m)


def rbox(size, loc, m, bevel=0.02, segs=4, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=rot)
    o = bpy.context.active_object
    o.scale = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    b = o.modifiers.new('b', 'BEVEL')
    b.width = bevel
    b.segments = segs
    smooth_obj(o)
    return assign(o, m)


def cut(target, cutter):
    mod = target.modifiers.new('cut', 'BOOLEAN')
    mod.operation = 'DIFFERENCE'
    mod.object = cutter
    mod.solver = 'EXACT'
    bpy.context.view_layer.objects.active = target
    bpy.ops.object.modifier_apply(modifier=mod.name)
    bpy.data.objects.remove(cutter, do_unlink=True)


def group(parts, loc, rot_z=0.0):
    bpy.ops.object.empty_add(location=(0, 0, 0))
    root = bpy.context.active_object
    for o in parts:
        o.parent = root
    root.location = loc
    root.rotation_euler.z = rot_z
    return root


def track(o, d):
    o.rotation_euler = Vector(d).normalized().to_track_quat('Z', 'Y').to_euler()


# ----------------------------------------------------------------------------- Staunton profiles
# (radius, height). Every piece shares the turned foot: plinth, cove, bead.
FOOT = [(0.0, 0.0), (0.37, 0.0), (0.37, 0.0), (0.378, 0.02), (0.37, 0.05), (0.352, 0.066), (0.352, 0.066),
        (0.325, 0.085), (0.318, 0.1), (0.338, 0.116), (0.33, 0.134), (0.33, 0.134), (0.29, 0.16), (0.25, 0.185)]


def collar(z, r):
    """A crisp double-ring collar at height z."""
    return [(r * 0.62, z - 0.02), (r * 0.66, z - 0.01), (r, z), (r, z), (r * 1.02, z + 0.02), (r, z + 0.04), (r, z + 0.04),
            (r * 0.82, z + 0.05), (r * 0.86, z + 0.065), (r * 0.82, z + 0.08), (r * 0.82, z + 0.08), (r * 0.62, z + 0.09)]


def pawn(loc, color, s=1.0):
    m = piece_material(color)
    prof = FOOT + [(0.2, 0.22), (0.16, 0.28), (0.135, 0.36), (0.124, 0.42)] + collar(0.45, 0.205) + [(0.1, 0.55), (0.0, 0.55)]
    parts = [lathe([(r * s, z * s) for r, z in prof], (0, 0, 0), m), ball(0.158 * s, (0, 0, 0.69 * s), m)]
    return group(parts, loc)


def rook(loc, color, s=1.0):
    m = piece_material(color)
    prof = FOOT + [(0.25, 0.21), (0.215, 0.3), (0.2, 0.42), (0.2, 0.5)] + collar(0.53, 0.25) + [
        (0.215, 0.62), (0.235, 0.68), (0.262, 0.7), (0.262, 0.7), (0.268, 0.86), (0.268, 0.86), (0.2, 0.86), (0.2, 0.86), (0.2, 0.79), (0.0, 0.79)]
    body = lathe([(r * s, z * s) for r, z in prof], (0, 0, 0), m)
    # crenellations: five notches cut through the battlement ring
    for i in range(5):
        a = i / 5 * math.tau + 0.3
        bpy.ops.mesh.primitive_cube_add(size=1, location=(math.cos(a) * 0.24 * s, math.sin(a) * 0.24 * s, 0.85 * s), rotation=(0, 0, a))
        c = bpy.context.active_object
        c.scale = (0.18 * s, 0.075 * s, 0.11 * s)
        cut(body, c)
    smooth_obj(body)
    return group([body], loc)


def bishop(loc, color, s=1.0):
    m = piece_material(color)
    prof = FOOT + [(0.22, 0.22), (0.16, 0.32), (0.128, 0.44), (0.118, 0.52)] + collar(0.55, 0.205) + [(0.12, 0.65), (0.0, 0.65)]
    parts = [lathe([(r * s, z * s) for r, z in prof], (0, 0, 0), m)]
    mitre = lathe([(r * s, z * s) for r, z in [(0.0, 0.63), (0.12, 0.64), (0.168, 0.7), (0.178, 0.77), (0.158, 0.86), (0.11, 0.94), (0.05, 0.985), (0.0, 1.0)]], (0, 0, 0), m)
    # the bishop's diagonal slit
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0.1 * s, 0, 0.86 * s), rotation=(0, math.radians(-38), 0))
    c = bpy.context.active_object
    c.scale = (0.26 * s, 0.6 * s, 0.035 * s)
    c.location.y = 0
    cut(mitre, c)
    smooth_obj(mitre)
    parts.append(mitre)
    parts.append(lathe([(r * s, z * s) for r, z in [(0.0, 0.99), (0.03, 0.995), (0.02, 1.02), (0.0, 1.02)]], (0, 0, 0), m))
    parts.append(ball(0.048 * s, (0, 0, 1.06 * s), m))
    return group(parts, loc)


def queen(loc, color, s=1.0):
    m = piece_material(color)
    prof = FOOT + [(0.23, 0.22), (0.165, 0.34), (0.13, 0.5), (0.118, 0.62)] + collar(0.65, 0.225) + [
        (0.15, 0.76), (0.19, 0.84), (0.245, 0.9), (0.25, 0.92), (0.25, 0.92), (0.2, 0.93), (0.12, 0.96), (0.06, 0.985), (0.0, 0.99)]
    parts = [lathe([(r * s, z * s) for r, z in prof], (0, 0, 0), m)]
    gold = GOLD()
    for i in range(9):
        a = i / 9 * math.tau
        parts.append(ball(0.042 * s, (math.cos(a) * 0.238 * s, math.sin(a) * 0.238 * s, 0.945 * s), m))
    parts.append(lathe([(r * s, z * s) for r, z in [(0.0, 0.98), (0.045, 0.99), (0.03, 1.02), (0.0, 1.03)]], (0, 0, 0), m))
    parts.append(ball(0.06 * s, (0, 0, 1.07 * s), m if color in WHITE_KEYS or color == '#45403b' else gold))
    return group(parts, loc)


def king(loc, color, s=1.0, accent=None):
    m = piece_material(color)
    prof = FOOT + [(0.235, 0.22), (0.17, 0.34), (0.135, 0.52), (0.122, 0.66)] + collar(0.69, 0.23) + [
        (0.15, 0.8), (0.2, 0.9), (0.225, 0.955), (0.225, 0.955), (0.17, 0.97), (0.1, 0.99), (0.0, 1.0)]
    parts = [lathe([(r * s, z * s) for r, z in prof], (0, 0, 0), m)]
    cm = pmat('kingacc' + accent, accent, 0.2, metal=1.0, coat=0.3) if accent else m
    parts.append(lathe([(r * s, z * s) for r, z in [(0.0, 0.99), (0.06, 1.0), (0.05, 1.03), (0.0, 1.04)]], (0, 0, 0), cm))
    parts.append(rbox((0.07 * s, 0.065 * s, 0.25 * s), (0, 0, 1.15 * s), cm, bevel=0.015 * s))
    parts.append(rbox((0.21 * s, 0.065 * s, 0.07 * s), (0, 0, 1.17 * s), cm, bevel=0.015 * s))
    return group(parts, loc)


def knight(loc, color, s=1.0, facing=0.0):
    """Sculpted horse head on the turned foot.

    The head is lofted from a side outline into stacked slices whose thickness tapers toward the
    muzzle and ears, voxel-remeshed and smoothed into one clean surface, then given carved eyes,
    nostrils, ears and a ridged mane.
    """
    m = piece_material(color)
    acc = accent_material(color)
    parts = [lathe([(r * s, z * s) for r, z in FOOT + [(0.22, 0.21), (0.2, 0.24), (0.0, 0.24)]], (0, 0, 0), m)]
    outline = [(-0.23, 0.2), (0.2, 0.2), (0.2, 0.3), (0.16, 0.4), (0.1, 0.5), (0.12, 0.56), (0.2, 0.585), (0.3, 0.605),
               (0.37, 0.64), (0.405, 0.695), (0.39, 0.75), (0.33, 0.79), (0.23, 0.86), (0.15, 0.94), (0.1, 1.0),
               (0.03, 1.03), (-0.05, 1.0), (-0.13, 0.95), (-0.21, 0.86), (-0.27, 0.72), (-0.3, 0.56), (-0.3, 0.4), (-0.27, 0.29)]

    def thick(x, z):
        return max(0.1, 0.34 - 0.13 * max(0.0, (x - 0.05) / 0.36) - 0.06 * max(0.0, (z - 0.92) / 0.12))

    slices = 9
    me = bpy.data.meshes.new('kn')
    bm = bmesh.new()
    rings = []
    for j in range(slices):
        t = j / (slices - 1)
        u = (t - 0.5) * 2                      # -1 .. 1 across the thickness
        round_ = math.sqrt(max(0.0, 1 - u * u * 0.55))  # rounder edges than a flat slab
        ring = []
        for x, z in outline:
            # pull the outline in near the side faces so the cross-section is rounded
            cx, cz = 0.02, 0.62
            px = cx + (x - cx) * (0.86 + 0.14 * round_)
            pz = cz + (z - cz) * (0.92 + 0.08 * round_)
            ring.append(bm.verts.new((px * s, u * thick(x, z) / 2 * s, pz * s)))
        rings.append(ring)
    n = len(outline)
    for j in range(slices - 1):
        for i in range(n):
            bm.faces.new((rings[j][i], rings[j][(i + 1) % n], rings[j + 1][(i + 1) % n], rings[j + 1][i]))
    for ring, rev in ((rings[0], True), (rings[-1], False)):
        c = bm.verts.new((sum(v.co.x for v in ring) / n, ring[0].co.y, sum(v.co.z for v in ring) / n))
        for i in range(n):
            a, b = ring[i], ring[(i + 1) % n]
            bm.faces.new((c, b, a) if rev else (c, a, b))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    bm.to_mesh(me)
    bm.free()
    head = bpy.data.objects.new('kn', me)
    bpy.context.scene.collection.objects.link(head)
    bpy.context.view_layer.objects.active = head
    rm = head.modifiers.new('r', 'REMESH')
    rm.mode = 'VOXEL'
    rm.voxel_size = 0.009 * s
    bpy.ops.object.modifier_apply(modifier=rm.name)
    sm = head.modifiers.new('sm', 'CORRECTIVE_SMOOTH')
    sm.iterations = 25
    sm.factor = 0.6
    sub = head.modifiers.new('s', 'SUBSURF')
    sub.levels = 1
    sub.render_levels = 1
    smooth_obj(head)
    assign(head, m)
    parts.append(head)

    def surf(x, z, inset=0.006):
        return thick(x, z) / 2 * 0.98 - inset

    for side in (-1, 1):
        # ears: slim cones leaning back
        bpy.ops.mesh.primitive_cone_add(radius1=0.05 * s, radius2=0.006 * s, depth=0.15 * s, vertices=24,
                                        location=(-0.01 * s, side * 0.055 * s, 1.07 * s))
        e = bpy.context.active_object
        track(e, (-0.2, side * 0.18, 1))
        e.scale = (1, 0.65, 1)
        smooth_obj(e)
        parts.append(assign(e, m))
        # carved eye with a glint, nostril
        ex, ez = 0.17, 0.83
        parts.append(ball(0.036 * s, (ex * s, side * surf(ex, ez) * s, ez * s), acc, scale=(1.25, 0.45, 0.85)))
        parts.append(ball(0.011 * s, ((ex + 0.012) * s, side * (surf(ex, ez) + 0.012) * s, (ez + 0.012) * s), pmat('glint', '#ffffff', 0.2), scale=(1, 0.5, 1)))
        nx, nz = 0.37, 0.7
        parts.append(ball(0.022 * s, (nx * s, side * surf(nx, nz, 0.01) * s, nz * s), acc, scale=(1.1, 0.45, 1.3)))
    # ridged mane locks down the back of the neck
    mane = [(-0.05, 0.99), (-0.13, 0.94), (-0.2, 0.86), (-0.255, 0.76), (-0.29, 0.65), (-0.305, 0.54), (-0.305, 0.43), (-0.29, 0.32)]
    for i, (x, z) in enumerate(mane):
        lock = ball(0.052 * s, (x * s, 0, z * s), m, scale=(1.15, 1.5, 0.82))
        lock.rotation_euler.y = math.radians(-40 + i * 10)
        parts.append(lock)
    return group(parts, loc, facing)


# ----------------------------------------------------------------------------- props
def trophy(loc, s=1.0):
    """Ornate gold cup: rolled lip, deep bowl with a star emblem, knopped stem, scrolled handles, two-tier plinth."""
    gold, dark = GOLD(), GOLD_DARK()
    marble = pmat('plinth', '#2a2230', 0.22, coat=0.9)
    plate = pmat('plate', '#f2d27a', 0.2, metal=1.0)
    parts = []
    parts.append(rbox((0.62 * s, 0.62 * s, 0.12 * s), (0, 0, 0.06 * s), marble, bevel=0.02 * s))
    parts.append(rbox((0.5 * s, 0.5 * s, 0.12 * s), (0, 0, 0.18 * s), marble, bevel=0.02 * s))
    parts.append(rbox((0.26 * s, 0.012 * s, 0.07 * s), (0, -0.252 * s, 0.18 * s), plate, bevel=0.004 * s))
    cup = [(0.0, 0.24), (0.16, 0.24), (0.16, 0.24), (0.17, 0.26), (0.15, 0.28), (0.1, 0.31), (0.07, 0.34), (0.055, 0.38),
           (0.085, 0.41), (0.09, 0.43), (0.06, 0.46), (0.05, 0.5), (0.07, 0.53), (0.13, 0.56), (0.21, 0.6), (0.27, 0.67),
           (0.3, 0.76), (0.31, 0.85), (0.335, 0.88), (0.335, 0.88), (0.34, 0.9), (0.32, 0.91), (0.3, 0.9), (0.28, 0.86), (0.0, 0.86)]
    parts.append(lathe([(r * s, z * s) for r, z in cup], (0, 0, 0), gold))
    # decorative band and star emblem
    bpy.ops.mesh.primitive_torus_add(major_radius=0.297 * s, minor_radius=0.012 * s, major_segments=96, minor_segments=12, location=(0, 0, 0.78 * s))
    band = bpy.context.active_object
    smooth_obj(band)
    parts.append(assign(band, dark))
    star = bpy.data.meshes.new('star')
    pts = []
    for i in range(10):
        a = math.pi / 2 + i * math.pi / 5
        r = (0.09 if i % 2 == 0 else 0.038) * s
        pts.append((math.cos(a) * r, 0, math.sin(a) * r))
    bm = bmesh.new()
    vs = [bm.verts.new(p) for p in pts]
    fc = bm.faces.new(vs)
    ex = bmesh.ops.extrude_face_region(bm, geom=[fc])
    bmesh.ops.translate(bm, vec=(0, -0.03 * s, 0), verts=[e for e in ex['geom'] if isinstance(e, bmesh.types.BMVert)])
    bm.to_mesh(star)
    bm.free()
    so = bpy.data.objects.new('star', star)
    bpy.context.scene.collection.objects.link(so)
    so.location = (0, -0.285 * s, 0.68 * s)
    so.rotation_euler.x = math.radians(-8)
    bv = so.modifiers.new('b', 'BEVEL')
    bv.width = 0.008 * s
    bv.segments = 3
    parts.append(assign(so, pmat('ruby', '#e0324a', 0.12, coat=1.0)))
    # scrolled handles: bezier tubes
    for side in (-1, 1):
        cu = bpy.data.curves.new('h', 'CURVE')
        cu.dimensions = '3D'
        cu.bevel_depth = 0.022 * s
        cu.bevel_resolution = 6
        sp = cu.splines.new('BEZIER')
        sp.bezier_points.add(2)
        ctrl = [(0.29, 0.83), (0.47, 0.8), (0.24, 0.6)]
        for bp, (x, z) in zip(sp.bezier_points, ctrl):
            bp.co = (side * x * s, 0, z * s)
            bp.handle_left_type = bp.handle_right_type = 'AUTO'
        ho = bpy.data.objects.new('handle', cu)
        bpy.context.scene.collection.objects.link(ho)
        ho.data.materials.append(gold)
        parts.append(ho)
        parts.append(ball(0.03 * s, (side * 0.24 * s, 0, 0.6 * s), gold))
    root = group(parts, loc)
    return root


def board(size=8, sq=0.5, loc=(0, 0, 0), light='#f1e5c6', dark='#6e9f4c', frame='#7a4f2a', thickness=0.14):
    """Lacquered board: rounded walnut frame with gold corner inlays and slightly raised, bevelled squares."""
    w = size * sq
    wood = M.wood_mat('frame', frame, '#4a2c16', scale=6, side_dark=0.72)
    rbox((w + 0.34, w + 0.34, thickness), (loc[0], loc[1], loc[2] + thickness / 2), wood, bevel=0.05)
    for cx in (-1, 1):
        for cy in (-1, 1):
            rbox((0.12, 0.12, 0.012), (loc[0] + cx * (w / 2 + 0.085), loc[1] + cy * (w / 2 + 0.085), loc[2] + thickness + 0.004), GOLD(), bevel=0.01)
    # satin squares: a soft sheen, no mirror streaks across the board
    lm = pmat('sqL', light, 0.55, coat=0.12, coat_rough=0.35, spec=0.3)
    dm = pmat('sqD', dark, 0.55, coat=0.12, coat_rough=0.35, spec=0.3)
    for i in range(size):
        for j in range(size):
            x = loc[0] - w / 2 + sq * (i + 0.5)
            y = loc[1] - w / 2 + sq * (j + 0.5)
            rbox((sq * 0.985, sq * 0.985, 0.03), (x, y, loc[2] + thickness + 0.012), lm if (i + j) % 2 else dm, bevel=0.008, segs=2)
    return loc[2] + thickness + 0.027


# ----------------------------------------------------------------------------- studio
def studio(cam_loc, cam_target, key=1.0):
    """Key / rim / top softbox rig plus a dim gradient world, so lacquer and gold have something to reflect."""
    sc = bpy.context.scene
    for o in [o for o in sc.objects if o.type == 'LIGHT']:
        bpy.data.objects.remove(o, do_unlink=True)
    import os
    # Standard keeps the colours saturated; lights are balanced so lacquer highlights don't clip
    sc.view_settings.view_transform = os.environ.get('UI_VIEW', 'Standard')
    if sc.view_settings.view_transform == 'AgX':
        sc.view_settings.look = 'AgX - Punchy'
    sc.view_settings.exposure = float(os.environ.get('UI_EXPOSURE', '-0.55'))
    sc.render.use_freestyle = False
    w = sc.world
    nt = w.node_tree
    nt.nodes.clear()
    out = nt.nodes.new('ShaderNodeOutputWorld')
    bg = nt.nodes.new('ShaderNodeBackground')
    grad = nt.nodes.new('ShaderNodeTexGradient')
    tc = nt.nodes.new('ShaderNodeTexCoord')
    mp = nt.nodes.new('ShaderNodeMapping')
    mp.inputs['Rotation'].default_value = (0, math.radians(-90), 0)
    ramp = nt.nodes.new('ShaderNodeValToRGB')
    ramp.color_ramp.elements[0].color = (*srgb('#3a3530'), 1)
    ramp.color_ramp.elements[1].color = (*srgb('#cfd8ec'), 1)
    nt.links.new(tc.outputs['Generated'], mp.inputs['Vector'])
    nt.links.new(mp.outputs['Vector'], grad.inputs['Vector'])
    nt.links.new(grad.outputs['Fac'], ramp.inputs['Fac'])
    nt.links.new(ramp.outputs['Color'], bg.inputs['Color'])
    bg.inputs['Strength'].default_value = 0.55
    nt.links.new(bg.outputs['Background'], out.inputs['Surface'])

    target = Vector(cam_target)
    view = (target - Vector(cam_loc)).normalized()
    side = view.cross(Vector((0, 0, 1))).normalized()

    def area(name, energy, size, color, pos):
        d = bpy.data.lights.new(name, 'AREA')
        d.energy = energy * key
        d.size = size
        d.color = color
        o = bpy.data.objects.new(name, d)
        sc.collection.objects.link(o)
        o.location = pos
        o.rotation_euler = (target - pos).normalized().to_track_quat('-Z', 'Y').to_euler()
        return o

    dist = (target - Vector(cam_loc)).length
    area('Key', 650 * (dist / 9) ** 2, 4.5, (1.0, 0.93, 0.84), target - view * dist * 0.6 - side * dist * 0.45 + Vector((0, 0, dist * 0.55)))
    area('Fill', 160 * (dist / 9) ** 2, 6.0, (0.85, 0.9, 1.0), target - view * dist * 0.5 + side * dist * 0.6 + Vector((0, 0, dist * 0.15)))
    area('Rim', 520 * (dist / 9) ** 2, 3.0, (0.75, 0.85, 1.0), target + view * dist * 0.55 + side * dist * 0.2 + Vector((0, 0, dist * 0.45)))
    area('Top', 110 * (dist / 9) ** 2, 7.0, (1.0, 1.0, 1.0), target + Vector((0, 0, dist * 0.9)))
