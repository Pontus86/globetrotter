extends Node3D

## Fullständig 3D-Jordglob (NASA Blue Marble + 3D-berg via normalmap + molnlager + 3D-ruttbågar + klickbara städer)

const GLOBE_RADIUS: float = 10.0

var globe_pivot: Node3D
var clouds_mesh: MeshInstance3D
var camera: Camera3D
var markers_root: Node3D
var routes_mesh: MeshInstance3D
var active_routes_mesh: MeshInstance3D

var thief_marker: Node3D
var thief_label: Label3D
var police_markers: Dictionary = {}
var police_hitboxes: Dictionary = {} # StaticBody3D -> police_id
var ping_marker: Node3D
var ping_label: Label3D
var city_hitboxes: Dictionary = {} # StaticBody3D -> city_id

var rot_y: float = PI + 0.18
var rot_x: float = 0.82
var target_rot_y: float = PI + 0.18
var target_rot_x: float = 0.82
var auto_center_active: bool = true
var zoom_dist: float = 16.0
var dragging: bool = false
var drag_moved: float = 0.0

func _ready() -> void:
	globe_pivot = Node3D.new()
	add_child(globe_pivot)

	# 1. Jordklot med NASA Blue Marble + Normalmap (berg!) + Roughness (havsblänk!)
	var sphere_inst := MeshInstance3D.new()
	var sm := SphereMesh.new()
	sm.radius = GLOBE_RADIUS
	sm.height = GLOBE_RADIUS * 2.0
	sm.radial_segments = 72
	sm.rings = 36
	sphere_inst.mesh = sm

	var mat := StandardMaterial3D.new()
	var tex_day: Texture2D = load("res://assets/globe/earth_day.jpg") as Texture2D
	var tex_norm: Texture2D = load("res://assets/globe/earth_normal.jpg") as Texture2D
	var tex_spec: Texture2D = load("res://assets/globe/earth_spec.jpg") as Texture2D
	if tex_day != null:
		mat.albedo_texture = tex_day
		mat.albedo_color = Color(1.0, 1.0, 1.0) # Ljus, vacker dagtid-jordglob!
	else:
		mat.albedo_color = Color(0.18, 0.46, 0.72)
	if tex_norm != null:
		mat.normal_enabled = true
		mat.normal_texture = tex_norm
		mat.normal_scale = 2.2
	if tex_spec != null:
		mat.roughness_texture = tex_spec
		mat.roughness = 0.65
		mat.metallic = 0.12
	sphere_inst.material_override = mat
	globe_pivot.add_child(sphere_inst)

	# 2. Sakta roterande 3D-molnlager
	var tex_clouds: Texture2D = load("res://assets/globe/earth_clouds.png") as Texture2D
	if tex_clouds != null:
		clouds_mesh = MeshInstance3D.new()
		var cm := SphereMesh.new()
		cm.radius = GLOBE_RADIUS + 0.08
		cm.height = (GLOBE_RADIUS + 0.08) * 2.0
		cm.radial_segments = 48
		cm.rings = 24
		clouds_mesh.mesh = cm
		var cmat := StandardMaterial3D.new()
		cmat.albedo_texture = tex_clouds
		cmat.albedo_color = Color(1.0, 1.0, 1.0, 0.32)
		cmat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
		cmat.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
		clouds_mesh.material_override = cmat
		globe_pivot.add_child(clouds_mesh)

	# 3. Atmosfärglöd
	var atmo := MeshInstance3D.new()
	var am := SphereMesh.new()
	am.radius = GLOBE_RADIUS + 0.32
	am.height = (GLOBE_RADIUS + 0.32) * 2.0
	atmo.mesh = am
	var amat := StandardMaterial3D.new()
	amat.albedo_color = Color(0.28, 0.62, 1.0, 0.08)
	amat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	amat.cull_mode = BaseMaterial3D.CULL_FRONT
	amat.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	atmo.material_override = amat
	globe_pivot.add_child(atmo)

	# 4. Statiska 3D-ruttlinjer (tåg + flyg) och aktiva reslinjer
	routes_mesh = MeshInstance3D.new()
	globe_pivot.add_child(routes_mesh)

	active_routes_mesh = MeshInstance3D.new()
	globe_pivot.add_child(active_routes_mesh)

	markers_root = Node3D.new()
	globe_pivot.add_child(markers_root)

	camera = Camera3D.new()
	camera.position = Vector3(0.0, 0.0, zoom_dist)
	add_child(camera)

	GameState.match_started.connect(func():
		_rebuild_all()
		_focus_on_actor(true)
	)
	GameState.target_updated.connect(_rebuild_all)
	GameState.city_arrived.connect(func(_cid):
		_rebuild_markers()
		_focus_on_actor(false)
	)
	GameState.view_changed.connect(func(mode, _c):
		_rebuild_markers()
		if mode == "globe":
			_focus_on_actor(false)
	)
	_rebuild_all()

func _focus_on_lon_lat(lon_deg: float, lat_deg: float, snap: bool = false) -> void:
	target_rot_y = PI - deg_to_rad(lon_deg)
	target_rot_x = clampf(deg_to_rad(lat_deg), -1.15, 1.25)
	auto_center_active = true
	if snap:
		rot_y = target_rot_y
		rot_x = target_rot_x

func _focus_on_actor(snap: bool = false) -> void:
	var actor: Dictionary = GameState.get_controlled_actor()
	if actor.is_empty():
		_focus_on_lon_lat(10.0, 48.0, snap)
		return
	if actor.get("travel") != null:
		var t: Dictionary = actor["travel"]
		var frac: float = clampf((GameState.elapsed_sec - float(t["start_sec"])) / float(t["duration_sec"]), 0.0, 1.0)
		var a: Array = GameState.cities[t["from"]]["center"]
		var b: Array = GameState.cities[t["to"]]["center"]
		_focus_on_lon_lat(lerpf(float(a[0]), float(b[0]), frac), lerpf(float(a[1]), float(b[1]), frac), snap)
	else:
		var cid: String = String(actor.get("city", ""))
		if GameState.cities.has(cid):
			var c: Array = GameState.cities[cid]["center"]
			_focus_on_lon_lat(float(c[0]), float(c[1]), snap)
		else:
			_focus_on_lon_lat(10.0, 48.0, snap)

func _lat_lon_to_vec3(lon_deg: float, lat_deg: float, radius: float = GLOBE_RADIUS + 0.14) -> Vector3:
	var lat: float = deg_to_rad(lat_deg)
	var lon: float = deg_to_rad(lon_deg)
	var angle: float = lon + PI
	var x: float = radius * cos(lat) * sin(angle)
	var y: float = radius * sin(lat)
	var z: float = radius * cos(lat) * cos(angle)
	return Vector3(x, y, z)

func _rebuild_all() -> void:
	_rebuild_static_routes()
	_rebuild_markers()

func _rebuild_static_routes() -> void:
	var im := ImmediateMesh.new()
	var mat := StandardMaterial3D.new()
	mat.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	mat.vertex_color_use_as_albedo = true
	routes_mesh.mesh = im
	routes_mesh.material_override = mat

	var seen: Dictionary = {}
	im.surface_begin(Mesh.PRIMITIVE_LINES)
	for cid in GameState.cities.keys():
		var c: Dictionary = GameState.cities[cid]
		var a: Vector3 = _lat_lon_to_vec3(float(c["center"][0]), float(c["center"][1]), GLOBE_RADIUS + 0.11).normalized()
		for t in c["trains"]:
			var tid: String = String(t)
			var k: String = ("%s--%s:t" % [cid, tid]) if String(cid) < tid else ("%s--%s:t" % [tid, cid])
			if seen.has(k) or not GameState.cities.has(tid):
				continue
			seen[k] = true
			var b: Vector3 = _lat_lon_to_vec3(float(GameState.cities[tid]["center"][0]), float(GameState.cities[tid]["center"][1]), GLOBE_RADIUS + 0.11).normalized()
			_draw_arc_lines(im, a, b, GLOBE_RADIUS + 0.12, 0.12, Color(0.22, 0.85, 0.58), 10)
		for f in c["flights"]:
			var fid: String = String(f)
			var k2: String = ("%s--%s:f" % [cid, fid]) if String(cid) < fid else ("%s--%s:f" % [fid, cid])
			if seen.has(k2) or not GameState.cities.has(fid):
				continue
			seen[k2] = true
			var b2: Vector3 = _lat_lon_to_vec3(float(GameState.cities[fid]["center"][0]), float(GameState.cities[fid]["center"][1]), GLOBE_RADIUS + 0.11).normalized()
			_draw_arc_lines(im, a, b2, GLOBE_RADIUS + 0.12, 0.35, Color(0.95, 0.78, 0.32), 12)
	im.surface_end()

func _draw_arc_lines(im: ImmediateMesh, va: Vector3, vb: Vector3, base_r: float, lift: float, col: Color, steps: int) -> void:
	for i in range(steps):
		var t0: float = float(i) / float(steps)
		var t1: float = float(i + 1) / float(steps)
		var p0: Vector3 = va.slerp(vb, t0) * (base_r + sin(t0 * PI) * lift)
		var p1: Vector3 = va.slerp(vb, t1) * (base_r + sin(t1 * PI) * lift)
		im.surface_set_color(col)
		im.surface_add_vertex(p0)
		im.surface_set_color(col)
		im.surface_add_vertex(p1)

func _rebuild_markers() -> void:
	for ch in markers_root.get_children():
		ch.queue_free()
	police_markers.clear()
	police_hitboxes.clear()
	city_hitboxes.clear()

	var actor: Dictionary = GameState.get_controlled_actor()
	var cur_cid: String = String(actor.get("city", ""))

	for cid in GameState.cities.keys():
		var c: Dictionary = GameState.cities[cid]
		var pos: Vector3 = _lat_lon_to_vec3(float(c["center"][0]), float(c["center"][1]))
		var is_cur: bool = String(cid) == cur_cid
		var is_target: bool = false
		if GameState.player_role == "thief":
			is_target = GameState.real_targets.has(cid) and not GameState.collected_targets.has(cid)
		else:
			is_target = GameState.suspect_pool.has(cid) and not GameState.cleared_suspects.has(cid)

		var dot_col: Color = Color(0.28, 0.90, 0.62) if is_cur else (Color(0.98, 0.78, 0.28) if is_target else Color(0.76, 0.74, 0.68))
		var dot_r: float = 0.095 if is_cur else (0.085 if is_target else 0.055)
		var dot := _make_sphere(dot_r, dot_col)
		dot.position = pos
		markers_root.add_child(dot)

		# Klickbar hitbox på globen (lager 2 så dolda stadshus aldrig blockerar!)
		var sb := StaticBody3D.new()
		sb.collision_layer = 2
		sb.collision_mask = 0
		sb.position = pos
		var cs := CollisionShape3D.new()
		var sp := SphereShape3D.new()
		sp.radius = 0.36
		cs.shape = sp
		sb.add_child(cs)
		markers_root.add_child(sb)
		city_hitboxes[sb] = String(cid)

		var lbl := Label3D.new()
		var art_icon: String = String(c.get("landmark", {}).get("icon", "🎯"))
		var prefix: String = ((art_icon + " ") if GameState.player_role == "thief" else "❓ ") if is_target else ""
		lbl.text = prefix + String(c["name"])
		lbl.billboard = BaseMaterial3D.BILLBOARD_ENABLED
		lbl.font_size = 24
		lbl.pixel_size = 0.0085
		lbl.position = pos * 1.036
		lbl.modulate = Color(0.45, 1.0, 0.72) if is_cur else (Color(1.0, 0.92, 0.55) if is_target else Color(0.95, 0.95, 0.95))
		lbl.outline_size = 6
		markers_root.add_child(lbl)

	# Diskret Noir-tjuvmarkör (liten glödande nål + ikon, ingen stor klumpig boll!)
	thief_marker = Node3D.new()
	thief_marker.add_child(_make_sphere(0.11, Color(0.95, 0.24, 0.24)))
	thief_label = Label3D.new()
	thief_label.text = "🕵️"
	thief_label.billboard = BaseMaterial3D.BILLBOARD_ENABLED
	thief_label.font_size = 34
	thief_label.pixel_size = 0.0095
	thief_label.position = Vector3(0.0, 0.28, 0.0)
	thief_label.outline_size = 6
	thief_marker.add_child(thief_label)
	markers_root.add_child(thief_marker)

	# Diskreta Noir-polismarkörer (klickbara i Polischef-läge!)
	for p in GameState.police:
		var pn := Node3D.new()
		pn.add_child(_make_sphere(0.10, Color(0.28, 0.76, 1.0)))
		var psb := StaticBody3D.new()
		psb.collision_layer = 2
		psb.collision_mask = 0
		var pcs := CollisionShape3D.new()
		var psp := SphereShape3D.new()
		psp.radius = 0.34
		pcs.shape = psp
		psb.add_child(pcs)
		pn.add_child(psb)
		police_hitboxes[psb] = String(p["id"])

		var pl := Label3D.new()
		pl.text = "🚓 " + String(p["short"])
		pl.billboard = BaseMaterial3D.BILLBOARD_ENABLED
		pl.font_size = 24
		pl.pixel_size = 0.0085
		pl.position = Vector3(0.0, 0.26, 0.0)
		pl.modulate = Color(0.68, 0.90, 1.0)
		pl.outline_size = 6
		pn.add_child(pl)
		markers_root.add_child(pn)
		police_markers[p["id"]] = { "node": pn, "label": pl }

	# Senaste radarping: tunn pulserande röd skanner-ring istället för stor boll!
	ping_marker = Node3D.new()
	var pring := MeshInstance3D.new()
	var ptor := TorusMesh.new()
	ptor.inner_radius = 0.16
	ptor.outer_radius = 0.21
	pring.mesh = ptor
	var pmat := StandardMaterial3D.new()
	pmat.albedo_color = Color(1.0, 0.26, 0.28, 0.85)
	pmat.emission_enabled = true
	pmat.emission = Color(1.0, 0.22, 0.24)
	pmat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	pring.material_override = pmat
	ping_marker.add_child(pring)
	ping_label = Label3D.new()
	ping_label.text = "📡"
	ping_label.billboard = BaseMaterial3D.BILLBOARD_ENABLED
	ping_label.font_size = 24
	ping_label.pixel_size = 0.0085
	ping_label.position = Vector3(0.0, 0.34, 0.0)
	ping_label.modulate = Color(1.0, 0.45, 0.45)
	ping_label.outline_size = 6
	ping_marker.add_child(ping_label)
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
	if col.a < 0.99:
		m.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	mi.material_override = m
	return mi

func _unhandled_input(event: InputEvent) -> void:
	if not visible:
		return
	if event is InputEventMouseButton:
		var mb: InputEventMouseButton = event
		if mb.button_index == MOUSE_BUTTON_LEFT:
			if mb.pressed:
				dragging = true
				drag_moved = 0.0
			else:
				dragging = false
				if drag_moved < 8.0:
					_try_click_city(mb.position)
		elif mb.button_index == MOUSE_BUTTON_WHEEL_UP:
			zoom_dist = clampf(zoom_dist - 1.2, 12.2, 26.0)
		elif mb.button_index == MOUSE_BUTTON_WHEEL_DOWN:
			zoom_dist = clampf(zoom_dist + 1.2, 12.2, 26.0)
	elif event is InputEventMouseMotion and dragging:
		var mm: InputEventMouseMotion = event
		drag_moved += mm.relative.length()
		auto_center_active = false
		rot_y += mm.relative.x * 0.007
		rot_x = clampf(rot_x + mm.relative.y * 0.007, -1.2, 1.35)

func _try_click_city(screen_pos: Vector2) -> void:
	if not GameState.active or GameState.finished:
		return
	var from: Vector3 = camera.project_ray_origin(screen_pos)
	var to: Vector3 = from + camera.project_ray_normal(screen_pos) * 60.0
	var query := PhysicsRayQueryParameters3D.create(from, to)
	query.collision_mask = 2
	var hit: Dictionary = get_world_3d().direct_space_state.intersect_ray(query)
	if not hit.is_empty():
		if GameState.player_role == "police" and police_hitboxes.has(hit["collider"]):
			var pid: String = police_hitboxes[hit["collider"]]
			GameState.select_police(pid)
			return
		if city_hitboxes.has(hit["collider"]):
			var cid: String = city_hitboxes[hit["collider"]]
			GameState.handle_globe_city_click(cid)

func _process(delta: float) -> void:
	if not visible or not GameState.active:
		return
	var ctrl_actor: Dictionary = GameState.get_controlled_actor()
	if not dragging and ctrl_actor.get("travel") != null:
		_focus_on_actor(false)
	if auto_center_active and not dragging:
		rot_y = lerp_angle(rot_y, target_rot_y, clampf(delta * 4.5, 0.0, 1.0))
		rot_x = lerpf(rot_x, target_rot_x, clampf(delta * 4.5, 0.0, 1.0))
	# Applicera alltid Y-rotation (longitud) FÖRST, sedan X-rotation (latitud) så Europa & spelaren alltid hamnar mitt framför kameran!
	globe_pivot.transform.basis = Basis(Vector3.RIGHT, rot_x) * Basis(Vector3.UP, rot_y)
	camera.position.z = lerpf(camera.position.z, zoom_dist, 0.15)
	if clouds_mesh != null:
		clouds_mesh.rotate_y(delta * 0.012)

	# Tjuvmarkör (synlig för tjuven alltid; för polischef bara om polis i samma stad)
	var police_with_thief: bool = false
	for p in GameState.police:
		if p["travel"] == null and GameState.thief.get("travel") == null and p["city"] == GameState.thief.get("city"):
			police_with_thief = true
	var show_thief: bool = GameState.player_role == "thief" or police_with_thief
	if thief_marker != null and not GameState.thief.is_empty():
		thief_marker.visible = show_thief
		if show_thief:
			thief_marker.position = _actor_globe_pos(GameState.thief, GLOBE_RADIUS + 0.25)
			thief_label.text = GameState.get_actor_icon(GameState.thief, "🕵️")

	for p in GameState.police:
		if police_markers.has(p["id"]):
			var entry: Dictionary = police_markers[p["id"]]
			var pn: Node3D = entry["node"]
			var pl: Label3D = entry["label"]
			pn.position = _actor_globe_pos(p, GLOBE_RADIUS + 0.24)
			pl.text = "%s %s" % [GameState.get_actor_icon(p, "🚓"), String(p["short"])]

	if ping_marker != null:
		if not GameState.last_ping.is_empty():
			var pc: Dictionary = GameState.cities[GameState.last_ping["city_id"]]
			ping_marker.visible = true
			var pulse: float = 1.0 + sin(Time.get_ticks_msec() * 0.008) * 0.22
			ping_marker.scale = Vector3(pulse, pulse, pulse)
			ping_marker.position = _lat_lon_to_vec3(float(pc["center"][0]), float(pc["center"][1]), GLOBE_RADIUS + 0.22)
			if ping_label != null:
				ping_label.text = "📡 Spår D%d %s:%s" % [int(GameState.last_ping["day"]), GameState.last_ping["hh"], GameState.last_ping["mm"]]
		else:
			ping_marker.visible = false

	_update_active_route_arcs(show_thief)

func _update_active_route_arcs(show_thief: bool) -> void:
	var im := ImmediateMesh.new()
	var mat := StandardMaterial3D.new()
	mat.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	mat.vertex_color_use_as_albedo = true
	var has_any: bool = false

	if show_thief and not GameState.thief.is_empty() and GameState.thief.get("travel") != null:
		var t: Dictionary = GameState.thief["travel"]
		var a: Array = GameState.cities[t["from"]]["center"]
		var b: Array = GameState.cities[t["to"]]["center"]
		var va: Vector3 = _lat_lon_to_vec3(float(a[0]), float(a[1]), GLOBE_RADIUS + 0.16).normalized()
		var vb: Vector3 = _lat_lon_to_vec3(float(b[0]), float(b[1]), GLOBE_RADIUS + 0.16).normalized()
		var lift: float = 0.52 if String(t["mode"]) == "flight" else 0.16
		if not has_any:
			im.surface_begin(Mesh.PRIMITIVE_LINES)
			has_any = true
		_draw_arc_lines(im, va, vb, GLOBE_RADIUS + 0.18, lift, Color(0.96, 0.78, 0.34), 14)

	for p in GameState.police:
		if p.get("travel") != null:
			var pt: Dictionary = p["travel"]
			var pa: Array = GameState.cities[pt["from"]]["center"]
			var pb: Array = GameState.cities[pt["to"]]["center"]
			var pva: Vector3 = _lat_lon_to_vec3(float(pa[0]), float(pa[1]), GLOBE_RADIUS + 0.16).normalized()
			var pvb: Vector3 = _lat_lon_to_vec3(float(pb[0]), float(pb[1]), GLOBE_RADIUS + 0.16).normalized()
			var plift: float = 0.52 if String(pt["mode"]) == "flight" else 0.16
			if not has_any:
				im.surface_begin(Mesh.PRIMITIVE_LINES)
				has_any = true
			_draw_arc_lines(im, pva, pvb, GLOBE_RADIUS + 0.18, plift, Color(0.25, 0.80, 1.0), 14)

	if has_any:
		im.surface_end()
		active_routes_mesh.mesh = im
		active_routes_mesh.material_override = mat
	else:
		active_routes_mesh.mesh = null

func _actor_globe_pos(actor: Dictionary, radius: float) -> Vector3:
	if actor["travel"] != null:
		var t: Dictionary = actor["travel"]
		var frac: float = clampf((GameState.elapsed_sec - float(t["start_sec"])) / float(t["duration_sec"]), 0.0, 1.0)
		var a: Array = GameState.cities[t["from"]]["center"]
		var b: Array = GameState.cities[t["to"]]["center"]
		var va: Vector3 = _lat_lon_to_vec3(float(a[0]), float(a[1]), radius).normalized()
		var vb: Vector3 = _lat_lon_to_vec3(float(b[0]), float(b[1]), radius).normalized()
		var lift: float = 0.52 if String(t["mode"]) == "flight" else 0.16
		return va.slerp(vb, frac) * (radius + sin(frac * PI) * lift)
	var c: Dictionary = GameState.cities[actor["city"]]
	return _lat_lon_to_vec3(float(c["center"][0]), float(c["center"][1]), radius)
