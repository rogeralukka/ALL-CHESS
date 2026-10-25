"""
Toon coach built in Blender: the same character idea as the painted coach (messy black hair,
black floral shirt, blue shorts, white socks, black sneakers), but as a posable model so we can
render any expression, gesture or animation frame.

Look: Cycles Toon BSDF (two flat tones) + ambient fill + Freestyle ink outline, so it reads as 2D.
Everything is built from primitives in code. The shirt print is generated with PIL.

Run:  python render_coach.py <out_dir>            (needs `pip install bpy==5.2.3 pillow`)
Env:  COACH_ONLY=neutral,wave   COACH_SAMPLES=48
"""
import math
import os
import random
import sys

import bpy
import bmesh
from mathutils import Vector
from PIL import Image, ImageDraw

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import render_map_sprites as M  # noqa: E402

OUT = sys.argv[-1] if len(sys.argv) > 1 and not sys.argv[-1].endswith('.py') else 'coach_out'
os.makedirs(OUT, exist_ok=True)
SAMPLES = int(os.environ.get('COACH_SAMPLES', '48'))
srgb = M.srgb

SKIN = '#f1b98a'
SKIN_SHADE = '#d9966a'
HAIR = '#1b1a1e'
INK = '#1a1414'
SHORTS = '#2f5fa8'
SOCK = '#f4f1ea'
SHOE = '#1f1f24'


# ----------------------------------------------------------------------------- materials
_mats = {}


def toon(name, color, shade=None, fill=0.38):
    """Two-tone cel material: Toon BSDF for the lit/shadow split plus a flat ambient fill."""
    key = (name, color)
    if key in _mats:
        return _mats[key]
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    t = nt.nodes.new('ShaderNodeBsdfToon')
    t.component = 'DIFFUSE'
    t.inputs['Size'].default_value = 0.85
    t.inputs['Smooth'].default_value = 0.03
    t.inputs['Color'].default_value = (*srgb(color), 1)
    e = nt.nodes.new('ShaderNodeEmission')
    e.inputs['Color'].default_value = (*srgb(shade or color), 1)
    e.inputs['Strength'].default_value = fill
    add = nt.nodes.new('ShaderNodeAddShader')
    nt.links.new(t.outputs[0], add.inputs[0])
    nt.links.new(e.outputs[0], add.inputs[1])
    nt.links.new(add.outputs[0], out.inputs[0])
    _mats[key] = m
    return m


def flat(name, color, strength=1.0):
    """Unlit flat colour (eyes, mouth, highlights)."""
    key = ('flat' + name, color)
    if key in _mats:
        return _mats[key]
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    e = nt.nodes.new('ShaderNodeEmission')
    e.inputs['Color'].default_value = (*srgb(color), 1)
    e.inputs['Strength'].default_value = strength
    nt.links.new(e.outputs[0], out.inputs[0])
    _mats[key] = m
    return m


def shirt_texture(path):
    """Black shirt with a scattered flower print (our own pattern)."""
    W, H = 1024, 512
    im = Image.new('RGB', (W, H), (29, 30, 34))
    d = ImageDraw.Draw(im)
    rnd = random.Random(7)
    petals = [(242, 154, 160), (246, 200, 76), (108, 196, 192), (247, 180, 138)]
    for _ in range(70):
        x, y = rnd.randrange(W), rnd.randrange(H)
        # leaves
        for _ in range(2):
            a = rnd.uniform(0, math.tau)
            lx, ly = x + math.cos(a) * 26, y + math.sin(a) * 26
            d.ellipse((lx - 15, ly - 8, lx + 15, ly + 8), fill=(84, 150, 110))
    for _ in range(46):
        x, y = rnd.randrange(W), rnd.randrange(H)
        r = rnd.uniform(17, 28)
        c = rnd.choice(petals)
        a0 = rnd.uniform(0, math.tau)
        for k in range(5):
            a = a0 + k / 5 * math.tau
            px, py = x + math.cos(a) * r * 0.75, y + math.sin(a) * r * 0.75
            d.ellipse((px - r * 0.55, py - r * 0.55, px + r * 0.55, py + r * 0.55), fill=c)
        d.ellipse((x - r * 0.3, y - r * 0.3, x + r * 0.3, y + r * 0.3), fill=(250, 214, 92) if c != (246, 200, 76) else (232, 120, 70))
    im.save(path)
    return path


def textured_toon(name, img_path):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    tex = nt.nodes.new('ShaderNodeTexImage')
    tex.image = bpy.data.images.load(img_path)
    t = nt.nodes.new('ShaderNodeBsdfToon')
    t.inputs['Size'].default_value = 0.72
    t.inputs['Smooth'].default_value = 0.03
    e = nt.nodes.new('ShaderNodeEmission')
    e.inputs['Strength'].default_value = 0.38
    add = nt.nodes.new('ShaderNodeAddShader')
    nt.links.new(tex.outputs['Color'], t.inputs['Color'])
    nt.links.new(tex.outputs['Color'], e.inputs['Color'])
    nt.links.new(t.outputs[0], add.inputs[0])
    nt.links.new(e.outputs[0], add.inputs[1])
    nt.links.new(add.outputs[0], out.inputs[0])
    return m


# ----------------------------------------------------------------------------- mesh helpers
def link(o, parent=None):
    if parent is not None:
        o.parent = parent
    return o


def smooth(o):
    for p in o.data.polygons:
        p.use_smooth = True
    return o


def assign(o, m):
    o.data.materials.clear()
    o.data.materials.append(m)
    return o


def ball(r, loc, m, scale=(1, 1, 1), parent=None, seg=32):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, segments=seg, ring_count=seg // 2, location=loc)
    o = bpy.context.active_object
    o.scale = scale
    smooth(o)
    assign(o, m)
    return link(o, parent)


def capsule(p0, p1, r, m, parent=None):
    """Cylinder with round caps from p0 to p1 (limbs, fingers, eyelash lines)."""
    p0, p1 = Vector(p0), Vector(p1)
    d = p1 - p0
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=max(d.length, 1e-4), vertices=24, location=(p0 + p1) / 2)
    c = bpy.context.active_object
    c.rotation_euler = d.normalized().to_track_quat('Z', 'Y').to_euler()
    smooth(c)
    assign(c, m)
    link(c, parent)
    ball(r, p0, m, parent=parent, seg=24)
    ball(r, p1, m, parent=parent, seg=24)
    return c


def empty(loc, parent=None, rot=(0, 0, 0)):
    bpy.ops.object.empty_add(location=loc)
    e = bpy.context.active_object
    e.rotation_euler = rot
    return link(e, parent)


def lathe_uv(profile, m, seg=48, scale_y=1.0, parent=None):
    me = bpy.data.meshes.new('lathe')
    verts, faces = [], []
    n = len(profile)
    for i in range(seg + 1):
        a = i / seg * math.tau - math.pi / 2
        for (r, z) in profile:
            verts.append((math.cos(a) * r, math.sin(a) * r * scale_y, z))
    for i in range(seg):
        for k in range(n - 1):
            faces.append((i * n + k, (i + 1) * n + k, (i + 1) * n + k + 1, i * n + k + 1))
    me.from_pydata(verts, [], faces)
    uv = me.uv_layers.new()
    zs = [z for _, z in profile]
    z0, z1 = min(zs), max(zs)
    for poly in me.polygons:
        for li in poly.loop_indices:
            vi = me.loops[li].vertex_index
            i, k = divmod(vi, n)
            uv.data[li].uv = (i / seg * 2, (profile[k][1] - z0) / (z1 - z0) * 0.9)
    me.update()
    o = bpy.data.objects.new('lathe', me)
    bpy.context.scene.collection.objects.link(o)
    smooth(o)
    assign(o, m)
    return link(o, parent)


def arc_tube(center, radius, a0, a1, thick, m, plane='xz', parent=None, seg=20):
    """A curved stroke (closed happy eye, smile line, eyebrow) made of a tube along an arc."""
    pts = []
    for i in range(seg + 1):
        a = a0 + (a1 - a0) * i / seg
        if plane == 'xz':
            pts.append(Vector(center) + Vector((math.cos(a) * radius, 0, math.sin(a) * radius)))
    cu = bpy.data.curves.new('arc', 'CURVE')
    cu.dimensions = '3D'
    cu.bevel_depth = thick
    cu.bevel_resolution = 4
    cu.use_fill_caps = True
    sp = cu.splines.new('POLY')
    sp.points.add(len(pts) - 1)
    for p, v in zip(sp.points, pts):
        p.co = (*v, 1)
    o = bpy.data.objects.new('arc', cu)
    bpy.context.scene.collection.objects.link(o)
    o.data.materials.append(m)
    return link(o, parent)


# ----------------------------------------------------------------------------- the character
POSES = {
    #            right arm (shoulder pitch, roll, elbow), left arm, hand R, hand L, head tilt (x, y, z)
    'neutral': dict(R=(4, 3, -8), L=(4, 3, -8), hR='rest', hL='rest', head=(0, 0, 0)),
    'wave': dict(R=(-8, 148, -38), L=(4, 8, -6), hR='open', hL='rest', head=(0, 6, 0)),
    'thumbsup': dict(R=(4, 8, -6), L=(-62, 18, -78), hR='rest', hL='thumb', head=(0, -5, 0)),
    'thinking': dict(R=(-62, 4, -135, -42), L=(8, 4, -12), hR='fist', hL='rest', head=(6, -9, 6)),
    'brilliant': dict(R=(-10, 150, -14), L=(-10, 150, -14), hR='fist', hL='fist', head=(-6, 0, 0)),
    'embarrassed': dict(R=(-30, 2, -100, 45), L=(-30, 2, -100, 45), hR='rest', hL='rest', head=(0, 8, -6)),
}
FACES = {
    'neutral': dict(eyes='lid', brows=(0, 0), mouth='flat'),
    'wave': dict(eyes='happy', brows=(10, 10), mouth='grin'),
    'thumbsup': dict(eyes='open', brows=(6, 6), mouth='smile'),
    'thinking': dict(eyes='up', brows=(16, -6), mouth='side'),
    'brilliant': dict(eyes='happy', brows=(14, 14), mouth='grin'),
    'embarrassed': dict(eyes='open', brows=(-14, -14), mouth='wavy', blush=True),
    'blink': dict(eyes='closed', brows=(0, 0), mouth='flat'),
}


def build_face(head, face):
    """Face features sit on the front of the head (local -Y). Head radius ~0.62."""
    ink = flat('ink', INK)
    white = flat('white', '#ffffff')
    skin = toon('skin', SKIN, SKIN_SHADE)
    fy = -0.545
    for side in (-1, 1):
        x = side * 0.215
        if face['eyes'] in ('open', 'lid', 'up'):
            ball(0.078, (x, fy, -0.03), ink, scale=(1, 0.45, 1.25), parent=head)
            hy = 0.03 if face['eyes'] == 'up' else 0.0
            ball(0.026, (x + 0.025, fy - 0.035, 0.02 + hy), white, scale=(1, 0.5, 1), parent=head)
            if face['eyes'] == 'lid':
                # heavy upper lid: skin cap over the top of the eye, plus a lash line
                ball(0.088, (x, fy - 0.012, 0.035), skin, scale=(1.08, 0.5, 0.62), parent=head)
                capsule((x - 0.085, fy - 0.045, 0.0), (x + 0.085, fy - 0.045, 0.0), 0.012, ink, parent=head)
        elif face['eyes'] == 'happy':
            arc_tube((x, fy - 0.03, -0.06), 0.075, math.radians(20), math.radians(160), 0.017, ink, parent=head)
        elif face['eyes'] == 'closed':
            arc_tube((x, fy - 0.03, 0.04), 0.08, math.radians(200), math.radians(340), 0.015, ink, parent=head)
        # eyebrows: rotation from FACES brows (degrees, + raises the outer end)
        ang = math.radians(face['brows'][0 if side < 0 else 1]) * (-side)
        pivot = empty((x, fy - 0.01, 0.15), parent=head)
        pivot.rotation_euler = (0, ang, 0)
        capsule((-0.09, 0, 0), (0.09, 0, 0), 0.022, flat('hairflat', HAIR), parent=pivot)
    # nose
    ball(0.045, (0, fy - 0.05, -0.12), toon('nose', SKIN_SHADE, SKIN_SHADE), scale=(1, 0.8, 0.9), parent=head)
    my, mz = fy + 0.01, -0.27
    mouth = face['mouth']
    mouth_dark = flat('mouth', '#6b1f22')
    if mouth == 'flat':
        capsule((-0.06, my - 0.02, mz), (0.06, my - 0.02, mz), 0.013, ink, parent=head)
    elif mouth == 'side':
        capsule((-0.02, my - 0.02, mz), (0.09, my - 0.02, mz + 0.02), 0.013, ink, parent=head)
    elif mouth == 'smile':
        arc_tube((0, my - 0.03, mz + 0.07), 0.11, math.radians(235), math.radians(305), 0.015, ink, parent=head)
    elif mouth == 'grin':
        # open D-shaped mouth: dark half-disc with a white teeth strip and a tongue
        g = ball(0.12, (0, my - 0.005, mz + 0.02), mouth_dark, scale=(1, 0.25, 0.8), parent=head)
        ball(0.1, (0, my - 0.03, mz + 0.06), white, scale=(1, 0.2, 0.25), parent=head)
        ball(0.06, (0, my - 0.025, mz - 0.04), flat('tongue', '#e46a6a'), scale=(1, 0.2, 0.5), parent=head)
        # cut the top half of the mouth flat by covering it with skin
        ball(0.13, (0, my + 0.005, mz + 0.115), skin, scale=(1.05, 0.27, 0.45), parent=head)
        g.name = 'mouth'
    elif mouth == 'wavy':
        pts = [(-0.08 + i * 0.032, my - 0.02, mz + (0.012 if i % 2 else -0.012)) for i in range(6)]
        for a, b in zip(pts, pts[1:]):
            capsule(a, b, 0.012, ink, parent=head)
    if face.get('blush'):
        for side in (-1, 1):
            ball(0.07, (side * 0.32, fy + 0.08, -0.15), flat('blush', '#f08a8a', 0.9), scale=(1.2, 0.25, 0.6), parent=head)


def build_hair(head):
    hair = toon('hair', HAIR, '#000000', fill=0.2)
    hl = toon('hairhl', '#3a3842', HAIR, fill=0.3)
    # cap: a sphere with the face cut away (keeps everything above a slanted line)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.665, segments=48, ring_count=24, location=(0, 0.04, 0.06))
    cap = bpy.context.active_object
    cap.scale = (1.05, 1.0, 0.98)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    bm = bmesh.new()
    bm.from_mesh(cap.data)
    kill = []
    for v in bm.verts:
        y = v.co.y
        # front edge sits at the forehead (z ~0.26), back edge drops to the nape
        cut = 0.26 + (y + 0.66) / 1.32 * (-0.62)
        # sideburn bump over the ears
        if abs(v.co.x) > 0.5 and y > -0.25:
            cut -= 0.18
        if v.co.z < cut:
            kill.append(v)
    bmesh.ops.delete(bm, geom=kill, context='VERTS')
    bm.to_mesh(cap.data)
    bm.free()
    smooth(cap)
    assign(cap, hair)
    link(cap, head)
    # messy tufts: lumpy blobs on top and a fringe swept over the forehead
    rnd = random.Random(3)
    tufts = []
    for i in range(22):
        a = rnd.uniform(0, math.tau)
        el = rnd.uniform(math.radians(15), math.radians(80))
        d = Vector((math.cos(a) * math.cos(el), math.sin(a) * math.cos(el) * 0.95, math.sin(el)))
        if d.y < -0.55 and d.z < 0.45:
            continue
        tufts.append((d * 0.6 + Vector((0, 0.04, 0.08)), rnd.uniform(0.09, 0.14)))
    for x, z in [(-0.34, 0.33), (-0.15, 0.4), (0.06, 0.38), (0.26, 0.35), (0.42, 0.25)]:
        tufts.append((Vector((x, -0.5, z)), 0.11))
    for p, r in tufts:
        bpy.ops.mesh.primitive_ico_sphere_add(radius=r, subdivisions=2, location=p)
        o = bpy.context.active_object
        o.scale = (1.15, 1.0, 0.8)
        # point tufts outward, like spiky messy hair
        o.rotation_euler = (rnd.uniform(-0.4, 0.4), rnd.uniform(-0.4, 0.4), rnd.uniform(0, 3))
        sm = o.modifiers.new('s', 'SUBSURF')
        sm.levels = 1
        smooth(o)
        assign(o, hair)
        link(o, head)
    # a few spikes
    spikes = []
    for i in range(16):
        a = i / 16 * math.tau + rnd.uniform(-0.15, 0.15)
        el = math.radians(rnd.uniform(25, 70))
        d = Vector((math.cos(a) * math.cos(el), math.sin(a) * math.cos(el), math.sin(el)))
        if d.y < -0.6:
            continue
        spikes.append((tuple(d * 0.6 + Vector((0, 0.04, 0.12))), tuple(d + Vector((rnd.uniform(-.3, .3), 0, 0.2)))))
    # fringe spikes falling over the forehead
    for x in (-0.3, -0.1, 0.12, 0.32):
        spikes.append(((x, -0.5, 0.36), (x * 0.6 + 0.15, -0.6, -0.55)))
    for p, d in spikes:
        bpy.ops.mesh.primitive_cone_add(radius1=0.1, radius2=0.0, depth=0.3, vertices=16, location=p)
        c = bpy.context.active_object
        c.rotation_euler = Vector(d).normalized().to_track_quat('Z', 'Y').to_euler()
        smooth(c)
        assign(c, hair)
        link(c, head)
    # a soft highlight streak
    ball(0.1, (0.18, -0.25, 0.55), hl, scale=(1.4, 0.6, 0.4), parent=head)


def build_hand(wrist, kind, side):
    skin = toon('skin', SKIN, SKIN_SHADE)
    if kind in ('rest', 'open', 'point'):
        ball(0.115, (0, 0, -0.1), skin, scale=(0.75, 0.55, 1.0), parent=wrist)
        if kind == 'open':
            for i, x in enumerate((-0.06, -0.02, 0.02, 0.06)):
                capsule((x, 0, -0.15), (x * 1.3, 0, -0.27 + abs(i - 1.5) * 0.02), 0.026, skin, parent=wrist)
        if kind == 'point':
            capsule((0.0, -0.02, -0.18), (0.0, -0.04, -0.33), 0.028, skin, parent=wrist)
        capsule((side * 0.07, -0.03, -0.06), (side * 0.13, -0.06, -0.14), 0.03, skin, parent=wrist)
    elif kind in ('fist', 'thumb'):
        ball(0.125, (0, 0, -0.1), skin, scale=(1.0, 0.9, 1.05), parent=wrist)
        ink = flat('ink', INK)
        # curled fingers: three ink creases across the front of the fist
        for z in (-0.06, -0.11, -0.16):
            capsule((-0.07, -0.118, z), (0.07, -0.118, z), 0.006, ink, parent=wrist)
        if kind == 'thumb':
            # a fat thumb rising from the inner top of the fist, tilted out: unmistakably a thumbs-up
            # (the wrist is counter-rotated so local +Z is world up)
            capsule((-side * 0.04, -0.02, -0.02), (-side * 0.02, -0.03, 0.17), 0.05, skin, parent=wrist)
            capsule((-side * 0.06, -0.075, 0.12), (-side * 0.0, -0.075, 0.12), 0.006, ink, parent=wrist)


def build_arm(torso, side, pose, hand):
    skin = toon('skin', SKIN, SKIN_SHADE)
    shirt = bpy.data.materials['shirt']
    sh = empty((side * 0.47, 0, 1.76), parent=torso)
    pitch, roll, elbow = pose[:3]
    yaw = pose[3] if len(pose) > 3 else 0
    # roll raises the arm sideways; mirror it per side so positive numbers mean "outward"
    sh.rotation_euler = (math.radians(pitch), -math.radians(roll) * side, math.radians(yaw) * side)
    # sleeve
    lathe_uv([(0.0, -0.3), (0.14, -0.3), (0.15, -0.16), (0.15, 0.02), (0.0, 0.06)], shirt, seg=24, parent=sh)
    capsule((0, 0, -0.1), (0, 0, -0.46), 0.1, skin, parent=sh)
    el = empty((0, 0, -0.46), parent=sh)
    el.rotation_euler = (math.radians(elbow), 0, 0)
    capsule((0, 0, 0), (0, 0, -0.4), 0.095, skin, parent=el)
    wr = empty((0, 0, -0.42), parent=el)
    if hand in ('thumb', 'fist'):
        # keep fists upright whatever the arm does (thumb points at the sky, knuckles forward)
        wr.rotation_euler = (-math.radians(pitch) - math.radians(elbow), math.radians(roll) * side * 0.0, 0)
    build_hand(wr, hand, side)
    return sh


def build_character(pose_name, face_name):
    pose, face = POSES[pose_name], FACES[face_name]
    root = empty((0, 0, 0))
    # legs, socks, shoes
    skin = toon('skin', SKIN, SKIN_SHADE)
    for side in (-1, 1):
        x = side * 0.2
        capsule((x, 0, 0.3), (x, 0, 0.72), 0.12, skin, parent=root)
        lathe_part = lathe_uv([(0.0, 0.14), (0.135, 0.14), (0.14, 0.42), (0.0, 0.42)], toon('sock', SOCK, '#cfc8bb'), seg=24)
        lathe_part.location = (x, 0, 0)
        link(lathe_part, root)
        shoe = toon('shoe', SHOE, '#000000', fill=0.25)
        sole = toon('sole', '#f2efe8', '#c9c2b6')
        bpy.ops.mesh.primitive_cube_add(size=1, location=(x, -0.08, 0.1))
        s = bpy.context.active_object
        s.scale = (0.3, 0.52, 0.17)
        bev = s.modifiers.new('b', 'BEVEL')
        bev.width = 0.07
        bev.segments = 5
        smooth(s)
        assign(s, shoe)
        link(s, root)
        bpy.ops.mesh.primitive_cube_add(size=1, location=(x, -0.08, 0.03))
        so = bpy.context.active_object
        so.scale = (0.32, 0.55, 0.06)
        b2 = so.modifiers.new('b', 'BEVEL')
        b2.width = 0.025
        b2.segments = 3
        assign(so, sole)
        link(so, root)
        ball(0.06, (x, -0.31, 0.12), sole, scale=(1.6, 0.6, 0.8), parent=root)
    # shorts
    lathe_uv([(0.0, 0.62), (0.44, 0.62), (0.47, 0.82), (0.46, 1.06), (0.0, 1.06)], toon('shorts', SHORTS, '#1f427a'), scale_y=0.72, parent=root)
    for side in (-1, 1):
        o = lathe_uv([(0.0, 0.56), (0.21, 0.56), (0.23, 0.8), (0.0, 0.8)], toon('shorts', SHORTS, '#1f427a'), seg=24)
        o.location = (side * 0.2, 0, 0)
        link(o, root)
    # shirt torso
    tex = shirt_texture(os.path.join(OUT, '_shirt.png'))
    shirt = textured_toon('shirt', tex)
    torso = empty((0, 0, 0), parent=root)
    lathe_uv([(0.0, 0.95), (0.46, 0.95), (0.48, 1.05), (0.49, 1.5), (0.47, 1.72), (0.36, 1.85), (0.16, 1.92), (0.0, 1.93)], shirt, scale_y=0.68, parent=torso)
    # V-neck opening and collar
    ball(0.085, (0, -0.26, 1.82), toon('neckv', SKIN_SHADE, SKIN_SHADE), scale=(0.9, 0.3, 1.1), parent=torso)
    for side in (-1, 1):
        bpy.ops.mesh.primitive_cone_add(radius1=0.1, radius2=0.0, depth=0.03, vertices=3, location=(side * 0.1, -0.29, 1.84))
        c = bpy.context.active_object
        c.rotation_euler = (math.radians(90), math.radians(side * 25), 0)
        assign(c, shirt)
        link(c, torso)
    # neck
    capsule((0, 0, 1.86), (0, 0, 2.02), 0.12, skin, parent=torso)
    # arms
    build_arm(torso, -1, pose['R'], pose['hR'])
    build_arm(torso, 1, pose['L'], pose['hL'])
    # head
    head = empty((0, 0, 2.5), parent=torso)
    head.scale = (0.9, 0.9, 0.9)
    hx, hy, hz = pose['head']
    head.rotation_euler = (math.radians(hx), math.radians(hy), math.radians(hz))
    ball(0.62, (0, 0, 0), skin, scale=(1.0, 0.93, 1.03), parent=head, seg=48)
    for side in (-1, 1):
        ball(0.13, (side * 0.6, 0.02, -0.06), skin, scale=(0.55, 0.6, 1.0), parent=head)
    build_hair(head)
    build_face(head, face)
    return root


# ----------------------------------------------------------------------------- scene and render
def setup_scene(res=(600, 820)):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    _mats.clear()
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'
    sc.cycles.device = 'CPU'
    sc.cycles.samples = SAMPLES
    sc.cycles.use_denoising = True
    sc.render.film_transparent = True
    sc.render.resolution_x, sc.render.resolution_y = res
    sc.view_settings.view_transform = 'Standard'
    sc.render.image_settings.file_format = 'PNG'
    sc.render.image_settings.color_mode = 'RGBA'
    w = bpy.data.worlds.new('W')
    sc.world = w
    w.use_nodes = True
    w.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.0
    cd = bpy.data.cameras.new('C')
    cd.type = 'ORTHO'
    cd.ortho_scale = 3.7
    cam = bpy.data.objects.new('C', cd)
    sc.collection.objects.link(cam)
    cam.location = (0.9, -9, 2.0)
    cam.rotation_euler = (Vector((0, 0, 1.62)) - cam.location).normalized().to_track_quat('-Z', 'Y').to_euler()
    sc.camera = cam
    sd = bpy.data.lights.new('Key', 'SUN')
    sd.energy = 3.2
    sd.angle = math.radians(2)
    so = bpy.data.objects.new('Key', sd)
    sc.collection.objects.link(so)
    so.rotation_euler = Vector((-0.35, 0.8, -0.5)).normalized().to_track_quat('-Z', 'Y').to_euler()
    # ink outlines
    sc.render.use_freestyle = True
    bpy.context.view_layer.use_freestyle = True
    sc.render.line_thickness_mode = 'ABSOLUTE'
    sc.render.line_thickness = res[0] / 260
    fs = bpy.context.view_layer.freestyle_settings
    ls = fs.linesets[0] if fs.linesets else fs.linesets.new('ink')
    ls.select_silhouette = True
    ls.select_border = True
    ls.select_crease = False
    if ls.linestyle is None:
        ls.linestyle = bpy.data.linestyles.new('ink')
    ls.linestyle.color = srgb(INK)
    ls.linestyle.thickness = 1.0
    return sc


def render(name, pose, face):
    setup_scene()
    build_character(pose, face)
    for o in bpy.context.scene.objects:
        o.visible_shadow = False
    bpy.context.scene.render.filepath = os.path.join(OUT, name + '.png')
    bpy.ops.render.render(write_still=True)
    print('rendered', name, flush=True)


SHEET = [('neutral', 'neutral', 'neutral'), ('blink', 'neutral', 'blink'), ('wave', 'wave', 'wave'), ('thumbsup', 'thumbsup', 'thumbsup'),
         ('thinking', 'thinking', 'thinking'), ('brilliant', 'brilliant', 'brilliant'), ('embarrassed', 'embarrassed', 'embarrassed')]

def render_wave_loop(n=12):
    """Animation test: a waving loop with one blink, rendered as numbered frames."""
    for i in range(n):
        t = i / n * math.tau
        POSES['_w'] = dict(POSES['wave'], R=(-8, 150 + 8 * math.sin(t), -30 - 22 * math.sin(t)), head=(0, 6 + 3 * math.sin(t), 0))
        FACES['_w'] = dict(FACES['wave'], eyes='open')
        if i in (7, 8):
            FACES['_w']['eyes'] = 'closed'
        render(f'wave_{i:02d}', '_w', '_w')


if __name__ == '__main__':
    if os.environ.get('COACH_ANIM') == 'wave':
        render_wave_loop()
        sys.exit(0)
    only = os.environ.get('COACH_ONLY', '').split(',') if os.environ.get('COACH_ONLY') else None
    for name, pose, face in SHEET:
        if only and name not in only:
            continue
        render(name, pose, face)
