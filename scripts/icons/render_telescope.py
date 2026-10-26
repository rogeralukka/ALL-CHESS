# Renders the Scout telescope icon (frontend/public/assets/ui/icon_scout.webp).
# Run: python render_telescope.py -- out.png   (needs `pip install bpy`), then crop to square and save as 256px webp.
import bpy, math, sys
from mathutils import Vector, Euler
OUT = sys.argv[sys.argv.index('--')+1] if '--' in sys.argv else 'icon_scout_render.png'
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene

def mat(name, col, metal=0.0, rough=0.4, coat=0.0, emis=None):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*col, 1)
    b.inputs['Metallic'].default_value = metal
    b.inputs['Roughness'].default_value = rough
    if coat: b.inputs['Coat Weight'].default_value = coat; b.inputs['Coat Roughness'].default_value = 0.08
    if emis:
        b.inputs['Emission Color'].default_value = (*emis[0], 1); b.inputs['Emission Strength'].default_value = emis[1]
    return m
PAINT = mat('paint', (0.17, 0.018, 0.016), rough=0.28, coat=0.8)
BRASS = mat('brass', (1.0, 0.62, 0.22), metal=1.0, rough=0.22)
DARK  = mat('dark', (0.04, 0.03, 0.03), rough=0.5)
GLASS = mat('glass', (0.25, 0.62, 0.85), rough=0.05, coat=1.0, emis=((0.30,0.70,0.95), 0.6))
WOOD  = mat('wood', (0.48, 0.18, 0.045), rough=0.45, coat=0.3)

scope = bpy.data.objects.new('scope', None); sc.collection.objects.link(scope)
def cyl(r, x0, x1, m, parent=scope, r2=None, z=0.0, verts=64):
    L = x1-x0
    if r2 is None:
        bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=L)
    else:
        bpy.ops.mesh.primitive_cone_add(vertices=verts, radius1=r, radius2=r2, depth=L)
    o = bpy.context.object
    o.rotation_euler = (0, math.radians(90), 0)
    o.location = ((x0+x1)/2, 0, z)
    o.data.materials.append(m); o.parent = parent
    bpy.ops.object.shade_smooth()
    bev = o.modifiers.new('b', 'BEVEL'); bev.width = min(0.012, r*0.15); bev.segments = 3
    return o

# tube: eyepiece (back, -x) -> objective (front, +x), widening
cyl(0.085, -1.62, -1.30, BRASS)            # eyepiece
cyl(0.11,  -1.68, -1.60, BRASS)            # eye cup
cyl(0.16,  -1.32, -0.45, PAINT)
cyl(0.215, -0.47, 0.45, PAINT)
cyl(0.285, 0.43, 1.30, PAINT)
for x, r in [(-1.30, 0.185), (-0.46, 0.24), (0.44, 0.31), (-0.05, 0.245), (0.95, 0.31)]:
    cyl(r, x-0.045, x+0.045, BRASS)
# objective: brass rim, dark inner lip, glass
cyl(0.325, 1.26, 1.40, BRASS)
cyl(0.27, 1.395, 1.405, DARK)
cyl(0.25, 1.36, 1.41, GLASS)
# finder scope on top
cyl(0.055, -1.05, -0.35, PAINT, z=0.36)
cyl(0.075, -0.40, -0.28, BRASS, z=0.36)
cyl(0.06, -0.31, -0.29, GLASS, z=0.36)
cyl(0.04, -1.12, -1.03, BRASS, z=0.36)
for x in (-0.9, -0.55):
    bpy.ops.mesh.primitive_cube_add(size=1); o = bpy.context.object
    o.scale = (0.05, 0.05, 0.22); o.location = (x, 0, 0.25); o.parent = scope; o.data.materials.append(BRASS)

# point the tube up-right and slightly toward the camera
scope.location = (0, 0, 1.55)
scope.rotation_euler = Euler((0, math.radians(-26), math.radians(-28)), 'XYZ')

# mount + tripod
def obj_cyl(r, depth, loc, m, rot=(0,0,0), r2=None, verts=48):
    if r2 is None: bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=depth, location=loc, rotation=rot)
    else: bpy.ops.mesh.primitive_cone_add(vertices=verts, radius1=r, radius2=r2, depth=depth, location=loc, rotation=rot)
    o = bpy.context.object; o.data.materials.append(m); bpy.ops.object.shade_smooth()
    bev = o.modifiers.new('b','BEVEL'); bev.width = 0.015; bev.segments = 3
    return o
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.15, location=(0,0,1.32)); s=bpy.context.object; s.data.materials.append(BRASS); bpy.ops.object.shade_smooth()
obj_cyl(0.09, 0.26, (0,0,1.42), BRASS)
obj_cyl(0.34, 0.09, (0,0,1.17), WOOD)
obj_cyl(0.30, 0.05, (0,0,1.225), BRASS)
top = Vector((0,0,1.12))
for ang in (90+180, 30, 150):
    a = math.radians(ang)
    foot = Vector((1.05*math.cos(a), 1.05*math.sin(a), 0))
    v = foot - top; L = v.length
    o = obj_cyl(0.075, L, (top+foot)/2, WOOD, r2=0.045)
    o.rotation_mode = 'QUATERNION'; o.rotation_quaternion = Vector((0,0,-1)).rotation_difference(v.normalized())
    o.rotation_quaternion = Vector((0,0,1)).rotation_difference(-v.normalized())
    # brass foot tip
    bpy.ops.mesh.primitive_cone_add(vertices=32, radius1=0.05, radius2=0.0, depth=0.12, location=foot + Vector((0,0,-0.02)))
    t=bpy.context.object; t.data.materials.append(BRASS); t.rotation_euler=(math.pi,0,0)
    # brass collar on leg
    mid = top + v*0.45
    c = obj_cyl(0.07, 0.07, mid, BRASS)
    c.rotation_mode = 'QUATERNION'; c.rotation_quaternion = Vector((0,0,1)).rotation_difference(v.normalized())

# lights
def area(name, loc, energy, size, col=(1,1,1)):
    l = bpy.data.lights.new(name, 'AREA'); l.energy = energy; l.size = size; l.color = col
    o = bpy.data.objects.new(name, l); o.location = loc; sc.collection.objects.link(o)
    d = Vector((0,0,1.2)) - Vector(loc); o.rotation_euler = d.to_track_quat('-Z','Y').to_euler()
area('key', (-3.5, -4.5, 6), 1800, 4, (1,0.96,0.9))
area('fill', (5, -4, 2.5), 600, 5, (0.85,0.9,1))
area('rim', (1, 5, 5), 1200, 3)
w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True
w.node_tree.nodes['Background'].inputs['Color'].default_value = (0.5,0.5,0.52,1)
w.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.6

cam_d = bpy.data.cameras.new('cam'); cam_d.lens = 70
cam = bpy.data.objects.new('cam', cam_d); sc.collection.objects.link(cam); sc.camera = cam
cam.location = (0.9, -9.0, 3.0)
cam.rotation_euler = (Vector((0.05,0,1.15)) - cam.location).to_track_quat('-Z','Y').to_euler()

sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = 96; sc.cycles.use_denoising = True
sc.render.film_transparent = True
sc.render.resolution_x = sc.render.resolution_y = 512
sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'None'; sc.view_settings.exposure = -0.35
sc.render.filepath = OUT
bpy.ops.render.render(write_still=True)
print('WROTE', OUT)
