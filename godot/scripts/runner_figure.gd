extends Node3D

## Human proportions in a deliberately enlarged tactical silhouette (about 5.6 m).
## Geometry is authored in metres; elbows/knees articulate independently.
const DISPLAY_SCALE := 3.0
var body_pivot: Node3D
var left_leg: Node3D
var right_leg: Node3D
var left_arm: Node3D
var right_arm: Node3D
var knees: Array[Node3D] = []
var elbows: Array[Node3D] = []
var coat_tails: Array[Node3D] = []
var run_phase := 0.0
var is_police := false

func setup(police_style: bool) -> void:
	is_police = police_style
	for child in get_children():
		remove_child(child)
		child.queue_free()
	knees.clear()
	elbows.clear()
	coat_tails.clear()
	body_pivot = Node3D.new()
	body_pivot.scale = Vector3.ONE * DISPLAY_SCALE
	add_child(body_pivot)
	var cloth := _mat(Color("202c3b") if police_style else Color("514c40"), 0.95)
	var dark := _mat(Color("18202a") if police_style else Color("262725"), 0.93)
	var leather := _mat(Color("161715"), 0.42)
	var skin := _mat(Color("b78d70"), 0.82)
	var brass := _mat(Color("b29a68"), 0.32, 0.65)
	var shirt := _mat(Color("c6c2ae"), 0.95)
	var hair := _mat(Color("302820"), 0.94)
	# Tailored torso with waist, chest and sloping shoulders.
	_profile(body_pivot, Vector3(0, 0.91, 0), [Vector3(0.17,0,0.115), Vector3(0.16,0.15,0.105), Vector3(0.205,0.40,0.13), Vector3(0.22,0.46,0.12), Vector3(0.11,0.53,0.09)], cloth)
	_ellipsoid(body_pivot, Vector3(0,0.91,0), Vector3(0.175,0.14,0.115), dark)
	_ellipsoid(body_pivot, Vector3(0,1.47,0), Vector3(0.063,0.09,0.065), skin)
	_ellipsoid(body_pivot, Vector3(0,1.64,0), Vector3(0.096,0.13,0.092), skin)
	_ellipsoid(body_pivot, Vector3(0,1.70,-0.018), Vector3(0.098,0.087,0.085), hair)
	# Jaw, nose and ears; restrained detail for a medium-distance game character.
	_ellipsoid(body_pivot, Vector3(0,1.57,0.018), Vector3(0.078,0.055,0.073), skin)
	_ellipsoid(body_pivot, Vector3(0,1.635,0.094), Vector3(0.018,0.032,0.026), skin)
	for side in [-1.0,1.0]:
		_ellipsoid(body_pivot, Vector3(side*0.098,1.64,0), Vector3(0.015,0.032,0.021), skin)
		_ellipsoid(body_pivot, Vector3(side*0.036,1.665,0.084), Vector3(0.012,0.006,0.006), dark)
	# Shirt triangle and two cloth lapels.
	_triangle(body_pivot, Vector3(-0.08,1.43,0.112), Vector3(0.08,1.43,0.112), Vector3(0,1.20,0.14), shirt)
	_triangle(body_pivot, Vector3(-0.10,1.44,0.13), Vector3(-0.20,1.34,0.14), Vector3(0,1.17,0.145), dark)
	_triangle(body_pivot, Vector3(0.10,1.44,0.13), Vector3(0.20,1.34,0.14), Vector3(0,1.17,0.145), cloth)
	_profile(body_pivot, Vector3(0,1.015,0), [Vector3(0.171,0,0.12),Vector3(0.17,0.035,0.12)], leather)
	_box(body_pivot, Vector3(0,1.033,0.126), Vector3(0.045,0.036,0.009), brass)
	for y in [1.12,1.22,1.32]:
		_ellipsoid(body_pivot, Vector3(0.045,y,0.14), Vector3(0.009,0.009,0.004), brass)
	if police_style:
		# Peaked cap, dark leather visor, badge, epaulettes and duty pouches.
		_profile(body_pivot, Vector3(0,1.745,0), [Vector3(0.10,0,0.095),Vector3(0.12,0.04,0.105),Vector3(0.105,0.075,0.09)], cloth)
		_ellipsoid(body_pivot, Vector3(0,1.752,0.09), Vector3(0.105,0.012,0.075), leather)
		_ellipsoid(body_pivot, Vector3(0,1.785,0.104), Vector3(0.018,0.024,0.006), brass)
		_ellipsoid(body_pivot, Vector3(-0.11,1.33,0.14), Vector3(0.025,0.033,0.006), brass)
		for side in [-1.0,1.0]:
			_box(body_pivot, Vector3(side*0.19,1.415,0), Vector3(0.08,0.015,0.095), dark)
			_box(body_pivot, Vector3(side*0.17,0.99,0.04), Vector3(0.075,0.10,0.07), leather)
	else:
		# Felt fedora with flattened brim and grosgrain band.
		_ellipsoid(body_pivot, Vector3(0,1.755,0), Vector3(0.17,0.012,0.145), dark)
		_profile(body_pivot, Vector3(0,1.755,0), [Vector3(0.108,0,0.10),Vector3(0.103,0.055,0.095),Vector3(0.078,0.10,0.077)], dark)
		_profile(body_pivot, Vector3(0,1.766,0), [Vector3(0.109,0,0.101),Vector3(0.107,0.02,0.100)], leather)
		# Split coat skirts move independently, leaving the legs visible.
		for side in [-1.0,1.0]:
			var tail := Node3D.new()
			tail.position = Vector3(side*0.10,1.015,-0.025)
			body_pivot.add_child(tail)
			_profile(tail, Vector3.ZERO, [Vector3(0.105,0,0.105),Vector3(0.12,-0.22,0.13),Vector3(0.13,-0.43,0.145)], cloth)
			coat_tails.append(tail)
		_box(body_pivot, Vector3(0.17,1.15,-0.15),Vector3(0.14,0.19,0.06),leather)
	for side in [-1.0,1.0]:
		var leg := Node3D.new()
		leg.position = Vector3(side*0.10,0.91,0)
		body_pivot.add_child(leg)
		_segment(leg,0.43,0.078,0.063,dark)
		var knee := Node3D.new()
		knee.position.y = -0.43
		leg.add_child(knee)
		_segment(knee,0.39,0.061,0.043,dark)
		_ellipsoid(knee,Vector3(0,-0.405,0.055),Vector3(0.060,0.050,0.12),leather)
		knees.append(knee)
		var arm := Node3D.new()
		arm.position = Vector3(side*0.235,1.365,0)
		arm.rotation.z = side*0.06
		body_pivot.add_child(arm)
		_segment(arm,0.29,0.065,0.049,cloth)
		var elbow := Node3D.new()
		elbow.position.y = -0.29
		arm.add_child(elbow)
		_segment(elbow,0.25,0.049,0.036,cloth)
		_ellipsoid(elbow,Vector3(0,-0.285,0.012),Vector3(0.035,0.06,0.025),skin)
		elbows.append(elbow)
		if side < 0:
			left_leg = leg
			left_arm = arm
		else:
			right_leg = leg
			right_arm = arm

func _mat(color: Color, roughness: float, metallic: float = 0.0) -> StandardMaterial3D:
	var material := StandardMaterial3D.new()
	material.albedo_color = color
	material.roughness = roughness
	material.metallic = metallic
	return material

func _ellipsoid(parent: Node3D, pos: Vector3, radii: Vector3, material: Material) -> void:
	var mesh := SphereMesh.new()
	mesh.radius = 1.0
	mesh.height = 2.0
	mesh.radial_segments = 16
	mesh.rings = 8
	var node := MeshInstance3D.new()
	node.mesh = mesh
	node.position = pos
	node.scale = radii
	node.material_override = material
	parent.add_child(node)

func _box(parent: Node3D, pos: Vector3, dimensions: Vector3, material: Material) -> void:
	var mesh := BoxMesh.new()
	mesh.size = dimensions
	var node := MeshInstance3D.new()
	node.mesh = mesh
	node.position = pos
	node.material_override = material
	parent.add_child(node)

func _segment(parent: Node3D, length: float, upper: float, lower: float, material: Material) -> void:
	_profile(parent,Vector3.ZERO,[Vector3(upper,0,upper),Vector3(upper,-0.06,upper),Vector3(lower,-length,lower)],material)
	_ellipsoid(parent,Vector3.ZERO,Vector3(upper,upper,upper),material)

func _triangle(parent: Node3D, a: Vector3, b: Vector3, c: Vector3, material: Material) -> void:
	var surface := SurfaceTool.new()
	surface.begin(Mesh.PRIMITIVE_TRIANGLES)
	for v in [a,b,c]:
		surface.set_normal(Vector3.FORWARD)
		surface.add_vertex(v)
	var node := MeshInstance3D.new()
	node.mesh = surface.commit()
	var double_sided = material.duplicate()
	double_sided.cull_mode = BaseMaterial3D.CULL_DISABLED
	node.material_override = double_sided
	parent.add_child(node)

func _profile(parent: Node3D, pos: Vector3, rings: Array, material: Material) -> void:
	var surface := SurfaceTool.new()
	surface.begin(Mesh.PRIMITIVE_TRIANGLES)
	for row in range(rings.size()-1):
		for i in range(16):
			for corner in [[row,i],[row+1,i],[row+1,i+1],[row,i],[row+1,i+1],[row,i+1]]:
				var ring: Vector3 = rings[corner[0]]
				var angle: float = float(corner[1])*TAU/16.0
				surface.set_normal(Vector3(cos(angle),0,sin(angle)))
				surface.add_vertex(Vector3(cos(angle)*ring.x,ring.y,sin(angle)*ring.z))
	var node := MeshInstance3D.new()
	node.mesh = surface.commit()
	node.position = pos
	var double_sided = material.duplicate()
	double_sided.cull_mode = BaseMaterial3D.CULL_DISABLED
	node.material_override = double_sided
	parent.add_child(node)

func update_run(vel: Vector3, delta: float) -> void:
	if body_pivot == null:
		return
	var speed := Vector2(vel.x,vel.z).length()
	var blend := clampf(delta*12.0,0,1)
	var running := speed > 1.5
	if running:
		body_pivot.rotation.y = lerp_angle(body_pivot.rotation.y,atan2(vel.x,vel.z),blend)
		run_phase += delta*clampf(speed*0.22,5.0,11.0)
	var swing: float = sin(run_phase)*0.65 if running else 0.0
	left_leg.rotation.x = lerpf(left_leg.rotation.x,swing,blend)
	right_leg.rotation.x = lerpf(right_leg.rotation.x,-swing,blend)
	left_arm.rotation.x = lerpf(left_arm.rotation.x,-swing*0.75,blend)
	right_arm.rotation.x = lerpf(right_arm.rotation.x,swing*0.75,blend)
	for i in range(2):
		var phase: float = run_phase + float(i)*PI
		knees[i].rotation.x = lerpf(knees[i].rotation.x,-maxf(0,sin(phase))*1.1 if running else 0.03,blend)
		elbows[i].rotation.x = lerpf(elbows[i].rotation.x,0.85 if running else 0.12,blend)
		if not coat_tails.is_empty():
			coat_tails[i].rotation.x = lerpf(coat_tails[i].rotation.x,sin(phase)*0.15 if running else 0.0,blend)
	body_pivot.position.y = lerpf(body_pivot.position.y,absf(sin(run_phase*2))*0.10 if running else 0.0,blend)
