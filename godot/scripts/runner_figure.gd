extends Node3D

## Animerad liten springande 3D-figur för Tjuv (trenchcoat + fedora-hatt) och Polis (uniform + poliskeps)
## Svänger armar & ben i takt med löphastigheten och vänder sig automatiskt i löpriktningen!

var body_pivot: Node3D
var left_leg: Node3D
var right_leg: Node3D
var left_arm: Node3D
var right_arm: Node3D
var run_phase: float = 0.0
var is_police: bool = false

func setup(police_style: bool) -> void:
	is_police = police_style
	for ch in get_children():
		ch.queue_free()

	body_pivot = Node3D.new()
	add_child(body_pivot)

	var coat_col: Color = Color(0.10, 0.32, 0.68) if police_style else Color(0.68, 0.14, 0.14)
	var pants_col: Color = Color(0.08, 0.16, 0.34) if police_style else Color(0.16, 0.14, 0.15)
	var skin_col: Color = Color(0.94, 0.78, 0.64)
	var hat_col: Color = Color(0.08, 0.22, 0.52) if police_style else Color(0.15, 0.12, 0.12)
	var accent_col: Color = Color(1.0, 0.84, 0.30)

	var coat_mat := _mat(coat_col, coat_col * 0.25)
	var pants_mat := _mat(pants_col, Color.BLACK)
	var skin_mat := _mat(skin_col, Color.BLACK)
	var hat_mat := _mat(hat_col, Color.BLACK)
	var acc_mat := _mat(accent_col, accent_col * 0.4)

	# Skala så figuren syns superbra även i utzoomad stadsvy (total höjd ~9.5m)
	var s: float = 1.65
	body_pivot.scale = Vector3(s, s, s)

	# Kropp (trenchcoat / uniform)
	var torso := MeshInstance3D.new()
	var tb := BoxMesh.new()
	tb.size = Vector3(1.5, 2.2, 0.95)
	torso.mesh = tb
	torso.position = Vector3(0.0, 3.0, 0.0)
	torso.material_override = coat_mat
	body_pivot.add_child(torso)

	# Gulddetalj (polisbricka / tjuvscarf)
	var badge := MeshInstance3D.new()
	var bb := BoxMesh.new()
	bb.size = Vector3(1.58, 0.32, 1.02) if not police_style else Vector3(0.38, 0.38, 0.18)
	badge.mesh = bb
	badge.position = Vector3(0.0, 3.95, 0.0) if not police_style else Vector3(0.35, 3.4, 0.52)
	badge.material_override = acc_mat
	body_pivot.add_child(badge)

	# Huvud
	var head := MeshInstance3D.new()
	var hs := SphereMesh.new()
	hs.radius = 0.68
	hs.height = 1.36
	head.mesh = hs
	head.position = Vector3(0.0, 4.75, 0.0)
	head.material_override = skin_mat
	body_pivot.add_child(head)

	# Hatt (Poliskeps med skärm eller Tjuv-fedora med brätte!)
	var hat := MeshInstance3D.new()
	var hc := CylinderMesh.new()
	hc.top_radius = 0.62 if police_style else 0.52
	hc.bottom_radius = 0.70
	hc.height = 0.55
	hat.mesh = hc
	hat.position = Vector3(0.0, 5.45, 0.0)
	hat.material_override = hat_mat
	body_pivot.add_child(hat)

	var brim := MeshInstance3D.new()
	var br_m := CylinderMesh.new()
	br_m.top_radius = 0.78 if police_style else 1.08
	br_m.bottom_radius = 0.78 if police_style else 1.08
	br_m.height = 0.14
	brim.mesh = br_m
	brim.position = Vector3(0.0, 5.22, 0.22 if police_style else 0.0)
	brim.material_override = acc_mat if police_style else hat_mat
	body_pivot.add_child(brim)

	# Ben (svingande från höften)
	left_leg = _make_limb(Vector3(-0.42, 1.9, 0.0), Vector3(0.52, 1.9, 0.55), pants_mat)
	right_leg = _make_limb(Vector3(0.42, 1.9, 0.0), Vector3(0.52, 1.9, 0.55), pants_mat)
	body_pivot.add_child(left_leg)
	body_pivot.add_child(right_leg)

	# Armar (svingande från axeln)
	left_arm = _make_limb(Vector3(-1.02, 3.85, 0.0), Vector3(0.44, 1.75, 0.44), coat_mat)
	right_arm = _make_limb(Vector3(1.02, 3.85, 0.0), Vector3(0.44, 1.75, 0.44), coat_mat)
	body_pivot.add_child(left_arm)
	body_pivot.add_child(right_arm)

func _make_limb(pivot_pos: Vector3, sz: Vector3, mat: StandardMaterial3D) -> Node3D:
	var piv := Node3D.new()
	piv.position = pivot_pos
	var mi := MeshInstance3D.new()
	var bm := BoxMesh.new()
	bm.size = sz
	mi.mesh = bm
	mi.position = Vector3(0.0, -sz.y * 0.5, 0.0)
	mi.material_override = mat
	piv.add_child(mi)
	return piv

func _mat(col: Color, em: Color) -> StandardMaterial3D:
	var m := StandardMaterial3D.new()
	m.albedo_color = col
	if em != Color.BLACK:
		m.emission_enabled = true
		m.emission = em
	m.roughness = 0.65
	return m

func update_run(vel: Vector3, delta: float) -> void:
	if body_pivot == null:
		return
	var horiz := Vector2(vel.x, vel.z)
	var spd: float = horiz.length()
	if spd > 1.5:
		# Vänd figuren mjukt i löpriktningen (+Z är framåt på figuren)
		var target_yaw: float = atan2(vel.x, vel.z)
		body_pivot.rotation.y = lerp_angle(body_pivot.rotation.y, target_yaw, clampf(delta * 14.0, 0.0, 1.0))
		run_phase += delta * clampf(spd * 0.34, 6.0, 22.0)
		var swing: float = sin(run_phase) * 0.85
		left_leg.rotation.x = swing
		right_leg.rotation.x = -swing
		left_arm.rotation.x = -swing * 0.85
		right_arm.rotation.x = swing * 0.85
		body_pivot.position.y = absf(sin(run_phase)) * 0.65
	else:
		left_leg.rotation.x = lerpf(left_leg.rotation.x, 0.0, delta * 10.0)
		right_leg.rotation.x = lerpf(right_leg.rotation.x, 0.0, delta * 10.0)
		left_arm.rotation.x = lerpf(left_arm.rotation.x, 0.0, delta * 10.0)
		right_arm.rotation.x = lerpf(right_arm.rotation.x, 0.0, delta * 10.0)
		body_pivot.position.y = lerpf(body_pivot.position.y, 0.0, delta * 10.0)
