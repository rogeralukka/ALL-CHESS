"""
Renders the isometric level-map sprites (path tiles + scenery) for ALL-CHESS.

Everything here is modelled procedurally from primitives, so the art is our own and the
script is the source of truth: tweak a colour or a shape, re-run, commit the PNG/WebP output.

Run (needs Blender's Python module):  python render_map_sprites.py <out_dir>
  pip install bpy==5.2.3 numpy pillow   (Python 3.13)

Camera: orthographic, 30 degrees above the horizon, rotated 45 degrees, so a 1x1 ground cell
projects to a 2:1 diamond. Every sprite is rendered with the same camera and scale, then
cropped; manifest.json records each sprite's anchor (the pixel where the object's ground
origin lands) and, for tiles, the centre of the top face (where the number goes).
"""
import json
import math
import os
import random
import sys

import bpy
import bmesh
from mathutils import Vector, Matrix

OUT = sys.argv[-1] if len(sys.argv) > 1 and not sys.argv[-1].endswith('.py') else 'out'
if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)

RES = 640          # render size (square)
ORTHO = 4.0        # world units across the frame
PX_PER_UNIT = RES / ORTHO
TILE_W_PX = math.sqrt(2) * PX_PER_UNIT  # width of a 1x1 cell's diamond in the sprite
CAM_TARGET = Vector((0.0, 0.0, 0.55))
SAMPLES = int(os.environ.get('MAP_SAMPLES', '64'))


# ----------------------------------------------------------------------------- scene setup
def reset_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'
    sc.cycles.device = 'CPU'
    sc.cycles.samples = SAMPLES
    sc.cycles.use_denoising = True
    try:
        sc.cycles.denoiser = 'OPENIMAGEDENOISE'
    except Exception:
        pass
    sc.cycles.max_bounces = 6
    sc.render.film_transparent = True
    sc.render.resolution_x = RES
    sc.render.resolution_y = RES
    sc.render.resolution_percentage = 100
    sc.render.image_settings.file_format = 'PNG'
    sc.render.image_settings.color_mode = 'RGBA'
    sc.view_settings.view_transform = 'Standard'
    sc.view_settings.look = 'None'
    sc.view_settings.exposure = 0.0

    world = bpy.data.worlds.new('World')
    sc.world = world
    world.use_nodes = True
    bg = world.node_tree.nodes['Background']
    bg.inputs['Color'].default_value = (0.78, 0.86, 1.0, 1)
    bg.inputs['Strength'].default_value = 0.75

    # camera
    cam_data = bpy.data.cameras.new('Cam')
    cam_data.type = 'ORTHO'
    cam_data.ortho_scale = ORTHO
    cam = bpy.data.objects.new('Cam', cam_data)
    sc.collection.objects.link(cam)
    cam.rotation_euler = (math.radians(60), 0, math.radians(45))
    fwd = cam.rotation_euler.to_matrix() @ Vector((0, 0, -1))
    cam.location = CAM_TARGET - fwd * 20
    sc.camera = cam

    # key light from the upper left of the screen, shadows fall down-right
    sun_data = bpy.data.lights.new('Sun', 'SUN')
    sun_data.energy = 3.6
    sun_data.angle = math.radians(14)
    sun_data.color = (1.0, 0.97, 0.9)
    sun = bpy.data.objects.new('Sun', sun_data)
    sc.collection.objects.link(sun)
    d = Vector((1.0, 0.25, -1.35)).normalized()
    sun.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()

    # shadow catcher ground
    bpy.ops.mesh.primitive_plane_add(size=30, location=(0, 0, 0))
    ground = bpy.context.active_object
    ground.name = 'ShadowCatcher'
    ground.is_shadow_catcher = True
    return sc


def project(p):
    """World point -> pixel (x right, y down) in the uncropped render."""
    sc = bpy.context.scene
    cam = sc.camera
    from bpy_extras.object_utils import world_to_camera_view
    co = world_to_camera_view(sc, cam, Vector(p))
    return co.x * RES, (1 - co.y) * RES


# ----------------------------------------------------------------------------- materials
_mats = {}


def mat(name, color, rough=0.7, metal=0.0, emission=None, emit_strength=0.0, sss=0.0):
    key = (name, tuple(color), rough)
    if key in _mats:
        return _mats[key]
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    p = m.node_tree.nodes['Principled BSDF']
    p.inputs['Base Color'].default_value = (*srgb(color), 1)
    p.inputs['Roughness'].default_value = rough
    p.inputs['Metallic'].default_value = metal
    if emission:
        p.inputs['Emission Color'].default_value = (*srgb(emission), 1)
        p.inputs['Emission Strength'].default_value = emit_strength
    _mats[key] = m
    return m


def srgb(hex_or_tuple):
    if isinstance(hex_or_tuple, str):
        h = hex_or_tuple.lstrip('#')
        c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    else:
        c = list(hex_or_tuple)
    # sRGB -> linear
    return tuple((x / 12.92) if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c)


def wood_mat(name, light, dark, scale=6.0, rings=False, planks=0, side_dark=0.68):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    p = nt.nodes['Principled BSDF']
    p.inputs['Roughness'].default_value = 0.62
    tex = nt.nodes.new('ShaderNodeTexCoord')
    wave = nt.nodes.new('ShaderNodeTexWave')
    wave.wave_type = 'RINGS' if rings else 'BANDS'
    wave.bands_direction = 'X'
    wave.inputs['Scale'].default_value = scale
    wave.inputs['Distortion'].default_value = 3.0
    wave.inputs['Detail'].default_value = 2.0
    wave.inputs['Detail Scale'].default_value = 1.5
    ramp = nt.nodes.new('ShaderNodeValToRGB')
    ramp.color_ramp.elements[0].color = (*srgb(dark), 1)
    ramp.color_ramp.elements[1].color = (*srgb(light), 1)
    ramp.color_ramp.elements[0].position = 0.25
    ramp.color_ramp.elements[1].position = 0.85
    nt.links.new(tex.outputs['Object'], wave.inputs['Vector'])
    nt.links.new(wave.outputs['Fac'], ramp.inputs['Fac'])
    color = ramp.outputs['Color']
    if planks:
        # thin dark grooves between planks running along Y
        sep = nt.nodes.new('ShaderNodeSeparateXYZ')
        nt.links.new(tex.outputs['Object'], sep.inputs['Vector'])
        mul = nt.nodes.new('ShaderNodeMath'); mul.operation = 'MULTIPLY'; mul.inputs[1].default_value = planks
        nt.links.new(sep.outputs['X'], mul.inputs[0])
        frac = nt.nodes.new('ShaderNodeMath'); frac.operation = 'FRACT'
        nt.links.new(mul.outputs[0], frac.inputs[0])
        dist = nt.nodes.new('ShaderNodeMath'); dist.operation = 'PINGPONG'; dist.inputs[1].default_value = 0.5
        nt.links.new(frac.outputs[0], dist.inputs[0])
        groove = nt.nodes.new('ShaderNodeMapRange')
        groove.inputs['From Min'].default_value = 0.0
        groove.inputs['From Max'].default_value = 0.06
        groove.inputs['To Min'].default_value = 0.55
        groove.inputs['To Max'].default_value = 1.0
        groove.clamp = True
        nt.links.new(dist.outputs[0], groove.inputs['Value'])
        mixg = nt.nodes.new('ShaderNodeMix'); mixg.data_type = 'RGBA'; mixg.blend_type = 'MULTIPLY'
        mixg.inputs['Factor'].default_value = 1.0
        nt.links.new(color, mixg.inputs['A'])
        g2c = nt.nodes.new('ShaderNodeCombineColor')
        for k in ('Red', 'Green', 'Blue'):
            nt.links.new(groove.outputs['Result'], g2c.inputs[k])
        nt.links.new(g2c.outputs['Color'], mixg.inputs['B'])
        color = mixg.outputs['Result']
    if side_dark < 1.0:
        # faces that do not point up are darker, so slabs read as solid blocks
        geo = nt.nodes.new('ShaderNodeNewGeometry')
        sep2 = nt.nodes.new('ShaderNodeSeparateXYZ')
        nt.links.new(geo.outputs['Normal'], sep2.inputs['Vector'])
        rng = nt.nodes.new('ShaderNodeMapRange')
        rng.inputs['From Min'].default_value = 0.5
        rng.inputs['From Max'].default_value = 0.9
        rng.inputs['To Min'].default_value = side_dark
        rng.inputs['To Max'].default_value = 1.0
        rng.clamp = True
        nt.links.new(sep2.outputs['Z'], rng.inputs['Value'])
        mixs = nt.nodes.new('ShaderNodeMix'); mixs.data_type = 'RGBA'; mixs.blend_type = 'MULTIPLY'
        mixs.inputs['Factor'].default_value = 1.0
        nt.links.new(color, mixs.inputs['A'])
        s2c = nt.nodes.new('ShaderNodeCombineColor')
        for k in ('Red', 'Green', 'Blue'):
            nt.links.new(rng.outputs['Result'], s2c.inputs[k])
        nt.links.new(s2c.outputs['Color'], mixs.inputs['B'])
        color = mixs.outputs['Result']
    nt.links.new(color, p.inputs['Base Color'])
    return m


def checker_mat(name, a, b, scale):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    p = nt.nodes['Principled BSDF']
    p.inputs['Roughness'].default_value = 0.5
    tc = nt.nodes.new('ShaderNodeTexCoord')
    ck = nt.nodes.new('ShaderNodeTexChecker')
    ck.inputs['Color1'].default_value = (*srgb(a), 1)
    ck.inputs['Color2'].default_value = (*srgb(b), 1)
    ck.inputs['Scale'].default_value = scale
    nt.links.new(tc.outputs['Generated'], ck.inputs['Vector'])
    nt.links.new(ck.outputs['Color'], p.inputs['Base Color'])
    return m


# ----------------------------------------------------------------------------- primitives
def assign(obj, material):
    obj.data.materials.clear()
    obj.data.materials.append(material)
    return obj


def flat(obj):
    for poly in obj.data.polygons:
        poly.use_smooth = False
    return obj


def smooth(obj):
    for poly in obj.data.polygons:
        poly.use_smooth = True
    return obj


def box(size, loc, material, bevel=0.0, segments=3):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    o = bpy.context.active_object
    o.scale = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel > 0:
        b = o.modifiers.new('bevel', 'BEVEL')
        b.width = bevel
        b.segments = segments
        b.limit_method = 'ANGLE'
        bpy.ops.object.modifier_apply(modifier='bevel')
    try:
        bpy.ops.object.shade_smooth_by_angle(angle=math.radians(35))
    except Exception:
        flat(o)
    return assign(o, material)


def cyl(r, h, loc, material, verts=16, r2=None):
    if r2 is None:
        bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=h, vertices=verts, location=(loc[0], loc[1], loc[2] + h / 2))
    else:
        bpy.ops.mesh.primitive_cone_add(radius1=r, radius2=r2, depth=h, vertices=verts, location=(loc[0], loc[1], loc[2] + h / 2))
    o = bpy.context.active_object
    return assign(o, material)


def lumpy_sphere(r, loc, material, seed, amount=0.12, subdiv=2, squash=1.0):
    bpy.ops.mesh.primitive_ico_sphere_add(radius=r, subdivisions=subdiv, location=loc)
    o = bpy.context.active_object
    rnd = random.Random(seed)
    bm = bmesh.new()
    bm.from_mesh(o.data)
    for v in bm.verts:
        n = v.co.normalized()
        v.co += n * (rnd.uniform(-amount, amount) * r)
        v.co.z *= squash
    bm.to_mesh(o.data)
    bm.free()
    flat(o)
    return assign(o, material)


def join(objs, name):
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.join()
    o = bpy.context.active_object
    o.name = name
    return o


def clear_props():
    for o in list(bpy.context.scene.objects):
        if o.type == 'MESH' and o.name != 'ShadowCatcher':
            bpy.data.objects.remove(o, do_unlink=True)


# ----------------------------------------------------------------------------- props
TILE = 0.9
TILE_H = 0.27


def tile(top_light, top_dark, side, name, rim=None):
    wood = wood_mat(name + '_wood', top_light, top_dark, scale=5.0, planks=3.3, side_dark=0.62)
    body = box((TILE, TILE, TILE_H), (0, 0, TILE_H / 2), wood, bevel=0.06, segments=4)
    parts = [body]
    if rim:
        # thin darker plinth under the slab so it sits on the grass
        parts.append(box((TILE * 0.96, TILE * 0.96, 0.05), (0, 0, 0.025), mat(name + '_rim', rim, 0.8), bevel=0.02))
    _ = side
    return {'top': (0, 0, TILE_H)}


def tree_round(seed, scale=1.0, greens=('#4f9d3a', '#5fb345', '#6ec653')):
    rnd = random.Random(seed)
    trunk_m = mat('trunk', '#7b4d2a', 0.85)
    cyl(0.08 * scale, 0.42 * scale, (0, 0, 0), trunk_m, verts=8, r2=0.06 * scale)
    blobs = [((0, 0, 0.74), 0.42), ((0.24, 0.1, 0.6), 0.3), ((-0.22, -0.08, 0.62), 0.31), ((0.06, -0.22, 0.66), 0.28), ((-0.08, 0.2, 0.64), 0.27), ((0.02, 0.0, 1.02), 0.27)]
    for i, (p, r) in enumerate(blobs):
        g = greens[rnd.randrange(len(greens))]
        lumpy_sphere(r * scale, (p[0] * scale, p[1] * scale, p[2] * scale), mat('leaf' + g, g, 0.75), seed * 31 + i, amount=0.08)


def tree_pine(seed, scale=1.0):
    trunk_m = mat('trunk', '#6d4325', 0.85)
    cyl(0.06 * scale, 0.3 * scale, (0, 0, 0), trunk_m, verts=8)
    tiers = [(0.42, 0.2, 0.46), (0.34, 0.44, 0.42), (0.25, 0.66, 0.36), (0.15, 0.86, 0.3)]
    cols = ['#2f7d43', '#348a4a', '#3a9651', '#43a35a']
    for i, (r, z, h) in enumerate(tiers):
        o = cyl(r * scale, h * scale, (0, 0, z * scale), mat('pine' + cols[i], cols[i], 0.8), verts=9, r2=0.0)
        o.rotation_euler.z = random.Random(seed + i).uniform(0, 1)
        flat(o)


def bush(seed, flowers=True):
    rnd = random.Random(seed)
    for i in range(3):
        g = ['#4a9a3c', '#57ab45', '#3f8d36'][i]
        lumpy_sphere(rnd.uniform(0.13, 0.18), (rnd.uniform(-0.12, 0.12), rnd.uniform(-0.12, 0.12), 0.11), mat('bush' + g, g, 0.8), seed + i, amount=0.14, squash=0.85)
    if flowers:
        for i in range(7):
            c = ['#ff7aa8', '#ffd25c', '#ffffff'][i % 3]
            a = rnd.uniform(0, math.tau)
            bpy.ops.mesh.primitive_uv_sphere_add(radius=0.028, segments=8, ring_count=6, location=(math.cos(a) * 0.15, math.sin(a) * 0.15, rnd.uniform(0.16, 0.26)))
            assign(bpy.context.active_object, mat('fl' + c, c, 0.5))


def rocks(seed):
    rnd = random.Random(seed)
    for i in range(3):
        g = ['#9aa1a8', '#b4bac0', '#878e95'][i]
        r = [0.17, 0.12, 0.09][i]
        lumpy_sphere(r, (rnd.uniform(-0.15, 0.15), rnd.uniform(-0.15, 0.15), r * 0.45), mat('rock' + g, g, 0.9), seed + i, amount=0.2, subdiv=1, squash=0.6)


def flowers(seed):
    rnd = random.Random(seed)
    stem = mat('stem', '#3f8d36', 0.8)
    for i in range(11):
        x, y = rnd.uniform(-0.3, 0.3), rnd.uniform(-0.3, 0.3)
        h = rnd.uniform(0.08, 0.16)
        cyl(0.008, h, (x, y, 0), stem, verts=5)
        c = ['#ff6f9c', '#ffd23f', '#ffffff', '#c08bff'][i % 4]
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.03, segments=8, ring_count=6, location=(x, y, h + 0.01))
        assign(bpy.context.active_object, mat('pet' + c, c, 0.45))
    for i in range(5):
        lumpy_sphere(0.06, (rnd.uniform(-0.3, 0.3), rnd.uniform(-0.3, 0.3), 0.02), mat('tuft', '#54a843', 0.8), seed + 50 + i, amount=0.2, subdiv=1, squash=0.6)


def pond(seed):
    rnd = random.Random(seed)
    water = mat('water', '#3aa3ec', 0.12)
    shallow = mat('shallow', '#7fd0ff', 0.25)
    o = cyl(0.82, 0.03, (0, 0, 0.0), shallow, verts=40)
    o.scale = (1, 0.72, 1)
    o = cyl(0.72, 0.045, (0, 0, 0.0), water, verts=40)
    o.scale = (1, 0.66, 1)
    stone_cols = ['#a7adb3', '#c2c7cc', '#8e959c']
    for i in range(22):
        a = i / 22 * math.tau + rnd.uniform(-0.08, 0.08)
        rx, ry = 0.86, 0.66
        lumpy_sphere(rnd.uniform(0.06, 0.1), (math.cos(a) * rx, math.sin(a) * ry, 0.03), mat('pst' + str(i % 3), stone_cols[i % 3], 0.9), seed + i, amount=0.25, subdiv=1, squash=0.55)
    pad = mat('pad', '#5cb84a', 0.6)
    for i, (x, y, r) in enumerate([(0.25, 0.1, 0.13), (-0.2, -0.15, 0.11), (0.05, -0.28, 0.09), (-0.32, 0.18, 0.1)]):
        o = cyl(r, 0.012, (x, y, 0.045), pad, verts=16)
        o.rotation_euler.z = rnd.uniform(0, math.tau)
    for (x, y) in [(0.25, 0.1), (-0.32, 0.18)]:
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.045, segments=10, ring_count=6, location=(x, y, 0.08))
        assign(bpy.context.active_object, mat('lotus', '#ff7fae', 0.4))


def bench_board(seed):
    wood = wood_mat('bench_wood', '#b07a45', '#8a5a2f', scale=10)
    iron = mat('iron', '#3b3b3f', 0.5, 0.6)
    box((0.7, 0.24, 0.05), (0, 0, 0.26), wood, bevel=0.01)
    box((0.7, 0.04, 0.2), (0, 0.13, 0.42), wood, bevel=0.01)
    for x in (-0.3, 0.3):
        box((0.04, 0.26, 0.26), (x, 0, 0.13), iron)
        box((0.04, 0.04, 0.3), (x, 0.13, 0.4), iron)
    board = box((0.26, 0.2, 0.025), (0.08, -0.01, 0.295), checker_mat('mini_board', '#f0ead6', '#5b8c4a', 8.0))
    board.rotation_euler.z = math.radians(8)
    # two tiny pieces on the board
    for (x, y, c) in [(0.02, 0.02, '#f4f1ea'), (0.14, -0.04, '#2b2927')]:
        cyl(0.018, 0.05, (x, y, 0.31), mat('mini' + c, c, 0.5), verts=10, r2=0.012)
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.017, segments=8, ring_count=6, location=(x, y, 0.37))
        assign(bpy.context.active_object, mat('mini' + c, c, 0.5))


def cabin(seed):
    logs = wood_mat('logs', '#a4683a', '#7a4724', scale=3.0)
    logs.node_tree.nodes['Wave Texture'].bands_direction = 'Z'
    roof = wood_mat('roof', '#c3573f', '#9c3f2d', scale=9.0)
    stone = mat('stone', '#9aa0a6', 0.9)
    box((1.1, 0.9, 0.08), (0, 0, 0.04), stone, bevel=0.02)
    box((1.0, 0.8, 0.62), (0, 0, 0.39), logs, bevel=0.03)
    # pitched roof: a triangular prism built from a mesh
    me = bpy.data.meshes.new('roof')
    w, d, h, z0 = 0.62, 0.52, 0.42, 0.68
    v = [(-w, -d, z0), (w, -d, z0), (w, d, z0), (-w, d, z0), (-w, 0, z0 + h), (w, 0, z0 + h)]
    f = [(0, 1, 5, 4), (3, 4, 5, 2), (0, 4, 3), (1, 2, 5), (0, 3, 2, 1)]
    me.from_pydata(v, [], f)
    me.update()
    o = bpy.data.objects.new('roof', me)
    bpy.context.scene.collection.objects.link(o)
    sol = o.modifiers.new('s', 'SOLIDIFY')
    sol.thickness = 0.06
    assign(o, roof)
    flat(o)
    # gable fill
    me2 = bpy.data.meshes.new('gable')
    g = 0.5
    v2 = [(-g, -0.4, z0), (-g, 0.4, z0), (-g, 0, z0 + h - 0.04), (g, -0.4, z0), (g, 0.4, z0), (g, 0, z0 + h - 0.04)]
    me2.from_pydata(v2, [], [(0, 1, 2), (3, 5, 4)])
    me2.update()
    o2 = bpy.data.objects.new('gable', me2)
    bpy.context.scene.collection.objects.link(o2)
    assign(o2, logs)
    door = mat('door', '#5a3519', 0.7)
    box((0.02, 0.22, 0.36), (0.505, 0.15, 0.26), door)
    glow = mat('window', '#ffe7a3', 0.3, emission='#ffd66e', emit_strength=2.5)
    frame = mat('frame', '#f2e6cf', 0.6)
    for y in (-0.22,):
        box((0.025, 0.2, 0.18), (0.505, y, 0.42), frame)
        box((0.03, 0.16, 0.14), (0.508, y, 0.42), glow)
    box((0.18, 0.025, 0.18), (-0.15, -0.405, 0.42), frame)
    box((0.14, 0.03, 0.14), (-0.15, -0.408, 0.42), glow)
    box((0.14, 0.14, 0.4), (-0.25, 0.22, 0.98), stone, bevel=0.02)
    # little lantern on a post next to the door
    cyl(0.015, 0.36, (0.62, 0.36, 0), mat('iron', '#3b3b3f', 0.5, 0.6), verts=8)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.04, location=(0.62, 0.36, 0.4))
    assign(bpy.context.active_object, glow)


def rook_statue(seed):
    marble = mat('marble', '#efeae0', 0.35)
    plinth = mat('plinth', '#a9aeb3', 0.85)
    box((0.62, 0.62, 0.12), (0, 0, 0.06), plinth, bevel=0.025)
    box((0.5, 0.5, 0.06), (0, 0, 0.15), plinth, bevel=0.02)
    # lathe profile (radius, z) for our rook
    prof = [(0.0, 0.18), (0.24, 0.18), (0.24, 0.22), (0.2, 0.25), (0.2, 0.28), (0.16, 0.32), (0.13, 0.42), (0.12, 0.62), (0.14, 0.68), (0.19, 0.72), (0.19, 0.84), (0.0, 0.84)]
    me = bpy.data.meshes.new('rook')
    seg = 32
    verts, faces = [], []
    for i in range(seg):
        a = i / seg * math.tau
        for (r, z) in prof:
            verts.append((math.cos(a) * r, math.sin(a) * r, z))
    n = len(prof)
    for i in range(seg):
        j = (i + 1) % seg
        for k in range(n - 1):
            faces.append((i * n + k, j * n + k, j * n + k + 1, i * n + k + 1))
    me.from_pydata(verts, [], faces)
    me.update()
    o = bpy.data.objects.new('rook', me)
    bpy.context.scene.collection.objects.link(o)
    smooth(o)
    assign(o, marble)
    # crenellations
    for i in range(5):
        a = i / 5 * math.tau + 0.3
        b = box((0.09, 0.07, 0.09), (math.cos(a) * 0.15, math.sin(a) * 0.15, 0.885), marble, bevel=0.012)
        b.rotation_euler.z = a


def lamp(seed):
    iron = mat('iron', '#2f3034', 0.45, 0.7)
    glow = mat('lampglow', '#fff2c2', 0.2, emission='#ffd77a', emit_strength=4)
    cyl(0.05, 0.05, (0, 0, 0), iron, verts=12)
    cyl(0.018, 0.75, (0, 0, 0.04), iron, verts=8)
    cyl(0.07, 0.03, (0, 0, 0.78), iron, verts=12)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.065, location=(0, 0, 0.86))
    assign(bpy.context.active_object, glow)
    cyl(0.05, 0.05, (0, 0, 0.92), iron, verts=12, r2=0.0)


def stump(seed):
    bark = mat('bark', '#6e4425', 0.9)
    rings = wood_mat('rings', '#e2b57b', '#c18a52', scale=14, rings=True)
    cyl(0.17, 0.16, (0, 0, 0), bark, verts=14, r2=0.15)
    o = cyl(0.148, 0.012, (0, 0, 0.16), rings, verts=14)
    # a mushroom beside it
    cyl(0.02, 0.08, (0.19, 0.08, 0), mat('mstem', '#f3ead8', 0.6), verts=8)
    lumpy_sphere(0.055, (0.19, 0.08, 0.085), mat('mcap', '#e2483b', 0.5), seed, amount=0.02, squash=0.55)


def fence(seed):
    wood = wood_mat('fence_wood', '#c08a50', '#99683a', scale=12)
    for x in (-0.36, 0.0, 0.36):
        box((0.06, 0.06, 0.34), (x, 0, 0.17), wood, bevel=0.012)
    for z in (0.12, 0.25):
        box((0.82, 0.03, 0.05), (0, 0.035, z), wood, bevel=0.01)


def chest(seed):
    wood = wood_mat('chest_wood', '#b8793f', '#8d5a2c', scale=9)
    gold = mat('gold', '#ffc93c', 0.3, 0.9)
    box((0.42, 0.3, 0.22), (0, 0, 0.11), wood, bevel=0.02)
    o = cyl(0.15, 0.42, (0, 0, 0), wood, verts=16)
    o.rotation_euler = (0, math.radians(90), 0)
    o.location = (-0.21, 0, 0.22)
    o.scale = (1, 1, 1)
    box((0.44, 0.05, 0.36), (0, 0, 0.2), gold)
    box((0.07, 0.04, 0.08), (0, -0.165, 0.2), gold)


def grass_tufts(seed):
    rnd = random.Random(seed)
    cols = ['#4f9f3f', '#5db34b', '#459137']
    for i in range(6):
        x, y = rnd.uniform(-0.12, 0.12), rnd.uniform(-0.12, 0.12)
        o = cyl(0.02, rnd.uniform(0.08, 0.14), (x, y, 0), mat('blade' + str(i % 3), cols[i % 3], 0.8), verts=4, r2=0.0)
        o.rotation_euler = (rnd.uniform(-0.3, 0.3), rnd.uniform(-0.3, 0.3), 0)


# ----------------------------------------------------------------------------- render loop
SPRITES = {
    # path tiles
    'tile_oak': lambda s: tile('#e8b36a', '#cf914c', None, 'oak', rim='#6b4a2a'),
    'tile_walnut': lambda s: tile('#b97a45', '#965c31', None, 'walnut', rim='#5a3a20'),
    'tile_done': lambda s: tile('#7ccc5a', '#5fae43', None, 'done', rim='#3d6e2d'),
    'tile_current': lambda s: tile('#ffd256', '#f3ad2b', None, 'current', rim='#8a5a16'),
    'tile_locked': lambda s: tile('#b6a99a', '#9a8c7d', None, 'locked', rim='#5d544b'),
    # scenery
    'tree_round_a': lambda s: tree_round(1),
    'tree_round_b': lambda s: tree_round(7, scale=0.82, greens=('#5aa944', '#6bbd50', '#7ccd5d')),
    'tree_round_c': lambda s: tree_round(13, scale=1.12, greens=('#3f8f37', '#4c9f3f', '#58ad47')),
    'tree_pine_a': lambda s: tree_pine(3),
    'tree_pine_b': lambda s: tree_pine(9, scale=0.8),
    'bush_a': lambda s: bush(21),
    'bush_b': lambda s: bush(27, flowers=False),
    'rocks': lambda s: rocks(33),
    'flowers': lambda s: flowers(41),
    'pond': lambda s: pond(51),
    'bench_board': lambda s: bench_board(61),
    'cabin': lambda s: cabin(71),
    'rook_statue': lambda s: rook_statue(81),
    'lamp': lambda s: lamp(91),
    'stump': lambda s: stump(101),
    'fence': lambda s: fence(111),
    'chest': lambda s: chest(121),
    'tufts': lambda s: grass_tufts(131),
}


def main():
    only = os.environ.get('MAP_ONLY', '').split(',') if os.environ.get('MAP_ONLY') else None
    manifest_path = os.path.join(OUT, 'raw_manifest.json')
    manifest = json.load(open(manifest_path)) if os.path.exists(manifest_path) else {}
    reset_scene()
    for name, build in SPRITES.items():
        if only and name not in only:
            continue
        clear_props()
        build(None)
        bpy.context.scene.render.filepath = os.path.join(OUT, name + '_raw.png')
        bpy.ops.render.render(write_still=True)
        ax, ay = project((0, 0, 0))
        tx, ty = project((0, 0, TILE_H)) if name.startswith('tile_') else (ax, ay)
        manifest[name] = {'ax': ax, 'ay': ay, 'tx': tx, 'ty': ty}
        print('rendered', name, flush=True)
    manifest['_meta'] = {'res': RES, 'tile_w_px': TILE_W_PX, 'px_per_unit': PX_PER_UNIT}
    json.dump(manifest, open(manifest_path, 'w'), indent=1)


if __name__ == '__main__':
    main()
