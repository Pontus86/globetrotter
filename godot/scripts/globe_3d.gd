extends Node3D

## Interaktiv 3D-Jordglob (NASA Blue Marble) med 3D-stadsmarkörer, ruttbågar och rörliga aktörer

const GLOBE_RADIUS := 10.0

var globe_pivot: Node3D
var camera: Camera3D
var markers_root: Node3D
var thief_marker: MeshInstance3D
var police_markers: Dictionary = {}
var ping_marker: MeshInstance3D

var rot_y := -0.2
var rot_x := 0.82
var zoom_dist := 18.5
var dragging := false

func _ready() -> void:
	globe_pivot = Node3D.new()
	add_child(globe_pivot)

	# Jordklotet med NASA Blue Marble-texturen
	var sphere_inst := MeshInstance3D.new()
	var sm := SphereMesh.new()
	sm.radius = GLOBE_RADIUS
	sm.height = GLOBE_RADIUS * 2.0
	sm.radial_segments = 64
	sm.rings = 32
	sphere_inst.mesh = sm

	var mat := StandardMaterial3D.new()
	var tex = load("res://assets/globe/earth_day.jpg")
	if tex:
		mat.albedo_texture = tex
	else:
		mat.albedo_color = Color(0.14, 0.36, 0.56)
	mat.roughness = 0.72
	sphere_inst.material_override = mat
	globe_pivot.add_child(sphere_inst)

	markers_root = Node3D.new()
	globe_pivot.add_child(markers_root)

	camera = Camera3D.new()
	camera.position = Vector3(0, 0, zoom_dist)
	add_child(camera)

	GameState.match_started.connect(_rebuild_markers)
	_rebuild_markers()

func _lat_lon_to_vec3(lon_deg: float, lat_deg: float, radius: float = GLOBE_RADIUS + 0.12) -> Vector3:
	var lat := deg_to_rad(lat_deg)
	var lon := deg_to_rad(lon_deg)
	# Matchar standard equirectangular UV-mappning på SphereMesh i Godot 4
	var x := radius * cos(lat) * sin(lon + PI * 0.5)
	var y := radius * sin(lat)
	var z := radius * cos(lat) * cos(lon + PI * 0.5)
	return Vector3(x, y, z)

func _rebuild_markers() -> void:
	for c in markers_root.get_children():
		c.queue_free()
	police_markers.clear()

	# Stadsmarkörer
	for cid in GameState.cities.keys():
		var c: Dictionary = GameState.cities[cid]
		var pos := _lat_lon_to_vec3(float(c["center"][0]), float(c["center"][1]))
		var is_target := GameState.real_targets.has(cid) and not GameState.collected_targets.has(cid)
		var dot := _make_sphere(0.18 if is_target else 0.12, Color(0.98, 0.80, 0.25) if is_target else Color(0.92, 0.90, 0.82))
		dot.position = pos
		markers_root.add_child(dot)

		var lbl := Label3D.new()
		lbl.text = String(c["name"])
		lbl.billboard = BaseMaterial3D.BILLBOARD_ENABLED
		lbl.font_size = 24
		lbl.pixel_size = 0.008
		lbl.position = pos * 1.035
		lbl.modulate = Color(1.0, 0.92, 0.55) if is_target else Color(0.95, 0.95, 0.95)
		markers_root.add_child(lbl)

	# Tjuvmarkör (röd/guld)
	thief_marker = _make_sphere(0.28, Color(0.95, 0.22, 0.22))
	markers_root.add_child(thief_marker)

	# Polismarkörer (blå)
	for p in GameState.police:
		var pm := _make_sphere(0.25, Color(0.22, 0.72, 0.98))
		markers_root.add_child(pm)
		police_markers[p["id"]] = pm

	# Senaste radarping (pulserande röd ring)
	ping_marker = _make_sphere(0.36, Color(1.0, 0.3, 0.3, 0.55))
	ping_marker.visible = false
	markers_root.add_child(ping_marker)

func _make_sphere(r: float, col: Color) -> MeshInstance3D:
	var mi := MeshInstance3D.new()
	var s := SphereMesh.new()
	s.radius = r
	s.height = r * 2.0
	mi.mesh = s
	var m := StandardMaterial3D.new()
	m.albedo_color = col
	m.emission_enabled = true
	m.emission = col * 0.45
	mi.material_override = m
	return mi

func _unhandled_input(event: InputEvent) -> void:
	if not visible:
		return
	if event is InputEventMouseButton:
		if event.button_index == MOUSE_BUTTON_LEFT:
			dragging = event.pressed
		elif event.button_index == MOUSE_BUTTON_WHEEL_UP:
			zoom_dist = clampf(zoom_dist - 1.2, 12.2, 26.0)
		elif event.button_index == MOUSE_BUTTON_WHEEL_DOWN:
			zoom_dist = clampf(zoom_dist + 1.2, 12.2, 26.0)
	elif event is InputEventMouseMotion and dragging:
		rot_y += event.relative.x * 0.007
		rot_x = clampf(rot_x + event.relative.y * 0.007, -1.2, 1.35)

func _process(_delta: float) -> void:
	if not visible or not GameState.active:
		return
	globe_pivot.rotation = Vector3(rot_x, rot_y, 0.0)
	camera.position.z = lerpf(camera.position.z, zoom_dist, 0.15)

	if thief_marker and not GameState.thief.is_empty():
		thief_marker.position = _actor_globe_pos(GameState.thief, GLOBE_RADIUS + 0.25)

	for p in GameState.police:
		if police_markers.has(p["id"]):
			police_markers[p["id"]].position = _actor_globe_pos(p, GLOBE_RADIUS + 0.24)

	if ping_marker:
		if not GameState.last_ping.is_empty():
			var pc: Dictionary = GameState.cities[GameState.last_ping["city_id"]]
			ping_marker.visible = true
			ping_marker.position = _lat_lon_to_vec3(float(pc["center"][0]), float(pc["center"][1]), GLOBE_RADIUS + 0.22)
		else:
			ping_marker.visible = false

func _actor_globe_pos(actor: Dictionary, radius: float) -> Vector3:
	if actor["travel"] != null:
		var t: Dictionary = actor["travel"]
		var frac := clampf((GameState.elapsed_sec - float(t["start_sec"])) / float(t["duration_sec"]), 0.0, 1.0)
		var a: Array = GameState.cities[t["from"]]["center"]
		var b: Array = GameState.cities[t["to"]]["center"]
		var va := _lat_lon_to_vec3(float(a[0]), float(a[1]), radius).normalized()
		var vb := _lat_lon_to_vec3(float(b[0]), float(b[1]), radius).normalized()
		return va.slerp(vb, frac) * (radius + sin(frac * PI) * 0.45)
	var c: Dictionary = GameState.cities[actor["city"]]
	return _lat_lon_to_vec3(float(c["center"][0]), float(c["center"][1]), radius)
