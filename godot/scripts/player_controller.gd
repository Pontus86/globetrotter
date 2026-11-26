extends CharacterBody3D

## Silkesmjuk 60-144 FPS CharacterBody3D-spelare (1:1 meterskala för riktiga OSM-stadskartor!)
## - WASD / Piltangenter (relativt kameravinkeln!)
## - Vänsterklick på gatan för Klicka-och-gå med gyllene gånglinje
## - Högerklick + dra för att rotera kameran, mushjul för att zooma (som MapLibre!)
## - Röd gripanderadie (dubblas med Spårhund) & blå siktring i Polischef-läge

const BASE_SPEED: float = 48.0
const INTERACT_RANGE: float = 36.0
const RunnerFigureScript = preload("res://scripts/runner_figure.gd")

var cam_pivot: Node3D
var camera: Camera3D
var runner_fig: Node3D
var name_label: Label3D
var police_cap_ring: MeshInstance3D
var police_vis_ring: MeshInstance3D
var walk_line_mesh: MeshInstance3D

var nearby_poi_key: String = ""
var nearby_poi_name: String = ""
var city_builder: Node3D
var stealth_fx: Node3D
var ui_blocking_input: bool = false
var footstep_accum: float = 0.0
var footstep_side: float = 1.0
var noise_accum: float = 0.0

var cam_yaw: float = -0.22
var cam_dist: float = 340.0
var rotating_cam: bool = false
var has_click_target: bool = false
var click_target: Vector3 = Vector3.ZERO

func _ready() -> void:
	runner_fig = RunnerFigureScript.new()
	add_child(runner_fig)

	# Varmt litet Noir-gatulyktesken runt spelaren så figuren alltid poppar i skymningen!
	var lamp := OmniLight3D.new()
	lamp.position = Vector3(0.0, 14.0, 0.0)
	lamp.light_color = Color(1.0, 0.82, 0.52)
	lamp.light_energy = 0.65
	lamp.omni_range = 20.0
	add_child(lamp)

	var col := CollisionShape3D.new()
	var shape := CapsuleShape3D.new()
	shape.radius = 1.05
	shape.height = 5.0
	col.shape = shape
	col.position = Vector3(0.0, 2.5, 0.0)
	add_child(col)

	name_label = Label3D.new()
	name_label.billboard = BaseMaterial3D.BILLBOARD_ENABLED
	name_label.font_size = 44
	name_label.pixel_size = 0.085
	name_label.position = Vector3(0.0, 7.0, 0.0)
	name_label.outline_size = 10
	add_child(name_label)

	# Gripande- och siktring för Polischef-läget
	police_cap_ring = MeshInstance3D.new()
	var cyl := CylinderMesh.new()
	cyl.top_radius = GameState.CAPTURE_DIST_M
	cyl.bottom_radius = GameState.CAPTURE_DIST_M
	cyl.height = 0.25
	police_cap_ring.mesh = cyl
	police_cap_ring.position = Vector3(0.0, 0.25, 0.0)
	var cmat := StandardMaterial3D.new()
	cmat.albedo_color = Color(0.95, 0.18, 0.18, 0.24)
	cmat.emission_enabled = true
	cmat.emission = Color(0.95, 0.20, 0.20)
	cmat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	police_cap_ring.material_override = cmat
	add_child(police_cap_ring)

	police_vis_ring = MeshInstance3D.new()
	var tor := TorusMesh.new()
	tor.inner_radius = GameState.VISION_DIST_M - 0.8
	tor.outer_radius = GameState.VISION_DIST_M
	police_vis_ring.mesh = tor
	police_vis_ring.position = Vector3(0.0, 0.35, 0.0)
	var vmat := StandardMaterial3D.new()
	vmat.albedo_color = Color(0.22, 0.74, 0.98, 0.32)
	vmat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	police_vis_ring.material_override = vmat
	add_child(police_vis_ring)

	# Gyllene gånglinje för klicka-och-gå
	walk_line_mesh = MeshInstance3D.new()
	walk_line_mesh.top_level = true
	add_child(walk_line_mesh)

	# Roterbar fågelperspektiv-kamera (MapLibre-känsla, utzoomad som webbversionen!)
	cam_pivot = Node3D.new()
	add_child(cam_pivot)
	camera = Camera3D.new()
	camera.far = 3200.0
	cam_pivot.add_child(camera)
	_update_camera_transform()

	_apply_role_color()
	GameState.match_started.connect(_apply_role_color)

func _update_camera_transform() -> void:
	if cam_pivot == null or camera == null:
		return
	cam_pivot.rotation.y = cam_yaw
	# Låg 3D-vinkel (~34° ner mot marken = motsvarar MapLibre pitch 56° i webbversionen!)
	camera.position = Vector3(0.0, cam_dist * 0.56, cam_dist * 0.82)
	camera.rotation_degrees = Vector3(-34.0, 0.0, 0.0)

func _apply_role_color() -> void:
	if runner_fig == null:
		return
	var is_pol: bool = GameState.player_role == "police"
	runner_fig.setup(is_pol)
	if is_pol:
		name_label.text = "🚓 DU"
		name_label.modulate = Color(0.65, 0.90, 1.0)
		police_cap_ring.visible = true
		police_vis_ring.visible = true
	else:
		name_label.text = "🕵️ DU"
		name_label.modulate = Color(1.0, 0.82, 0.72)
		police_cap_ring.visible = false
		police_vis_ring.visible = false

func teleport_to(pos: Vector3) -> void:
	global_position = Vector3(pos.x, 0.1, pos.z)
	velocity = Vector3.ZERO
	has_click_target = false
	walk_line_mesh.mesh = null

func _is_text_input_focused() -> bool:
	var fo: Control = get_viewport().gui_get_focus_owner()
	return fo is LineEdit or fo is TextEdit

func _physics_process(delta: float) -> void:
	if not is_visible_in_tree() or not GameState.active or GameState.finished:
		velocity = Vector3.ZERO
		return

	# Uppdatera Spårhunds-radie live i Polischef-läge
	if police_cap_ring.visible:
		var s: float = 2.0 if GameState.elapsed_sec < GameState.hound_until else 1.0
		police_cap_ring.scale = Vector3(s, 1.0, s)

	var actor: Dictionary = GameState.get_controlled_actor()
	if ui_blocking_input or _is_text_input_focused() or actor.get("travel") != null:
		velocity = Vector3.ZERO
		has_click_target = false
		walk_line_mesh.mesh = null
		return

	var input_vec := Vector2.ZERO
	if Input.is_action_pressed("move_up"): input_vec.y -= 1.0
	if Input.is_action_pressed("move_down"): input_vec.y += 1.0
	if Input.is_action_pressed("move_left"): input_vec.x -= 1.0
	if Input.is_action_pressed("move_right"): input_vec.x += 1.0

	var move_dir := Vector3.ZERO
	if input_vec.length() > 0.05:
		has_click_target = false
		walk_line_mesh.mesh = null
		input_vec = input_vec.normalized()
		# Rotera styrningen efter kamerans yaw!
		var basis_rot := Basis(Vector3.UP, cam_yaw)
		move_dir = basis_rot * Vector3(input_vec.x, 0.0, input_vec.y)
	elif has_click_target:
		var diff := Vector3(click_target.x - global_position.x, 0.0, click_target.z - global_position.z)
		if diff.length() < 3.5:
			has_click_target = false
			walk_line_mesh.mesh = null
		else:
			move_dir = diff.normalized()
			_draw_walk_line()

	var sneaking: bool = Input.is_key_pressed(KEY_CTRL) or Input.is_key_pressed(KEY_C)
	GameState.player_sneaking = sneaking and GameState.player_role == "thief"

	if move_dir.length() > 0.05:
		if actor.get("boarding") != null:
			GameState.cancel_controlled_boarding()
		var boosted: bool = GameState.player_role == "thief" and GameState.elapsed_sec < GameState.boost_until
		var spd: float = BASE_SPEED * (1.7 if boosted else (0.52 if GameState.player_sneaking else 1.0))
		velocity.x = move_dir.x * spd
		velocity.z = move_dir.z * spd

		# Lämna färska fotspår & ljudringar när tjuven springer (helt tyst vid smygning!)
		if GameState.player_role == "thief" and not GameState.player_sneaking and stealth_fx != null:
			footstep_accum += spd * delta
			if footstep_accum >= 10.5:
				footstep_accum = 0.0
				footstep_side = -footstep_side
				var yaw: float = atan2(velocity.x, velocity.z)
				var side_vec := Vector3(cos(yaw), 0.0, -sin(yaw)) * (0.9 * footstep_side)
				stealth_fx.spawn_footprint(global_position + side_vec, yaw, true)
			if boosted:
				noise_accum += delta
				if noise_accum >= 0.55:
					noise_accum = 0.0
					stealth_fx.spawn_noise_ring(global_position, 52.0, Color(1.0, 0.72, 0.28, 0.80))
					GameState.last_noise_pos = global_position
					GameState.last_noise_time = GameState.elapsed_sec
	else:
		velocity.x = move_toward(velocity.x, 0.0, 220.0 * delta)
		velocity.z = move_toward(velocity.z, 0.0, 220.0 * delta)

	velocity.y = 0.0
	move_and_slide()
	global_position.y = 0.1
	if runner_fig != null:
		runner_fig.update_run(velocity, delta)
	_update_nearby_poi()

func _draw_walk_line() -> void:
	var im := ImmediateMesh.new()
	var mat := StandardMaterial3D.new()
	mat.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	mat.albedo_color = Color(1.0, 0.85, 0.35)
	im.surface_begin(Mesh.PRIMITIVE_LINES)
	im.surface_add_vertex(Vector3(global_position.x, 0.65, global_position.z))
	im.surface_add_vertex(Vector3(click_target.x, 0.65, click_target.z))
	im.surface_end()
	walk_line_mesh.mesh = im
	walk_line_mesh.material_override = mat

func _unhandled_input(event: InputEvent) -> void:
	if not is_visible_in_tree() or not GameState.active or GameState.finished or ui_blocking_input or _is_text_input_focused():
		return

	if event is InputEventMouseButton:
		var mb: InputEventMouseButton = event
		if mb.button_index == MOUSE_BUTTON_WHEEL_UP and mb.pressed:
			cam_dist = clampf(cam_dist - 22.0, 90.0, 380.0)
			_update_camera_transform()
		elif mb.button_index == MOUSE_BUTTON_WHEEL_DOWN and mb.pressed:
			cam_dist = clampf(cam_dist + 22.0, 90.0, 380.0)
			_update_camera_transform()
		elif mb.button_index == MOUSE_BUTTON_RIGHT:
			rotating_cam = mb.pressed
		elif mb.button_index == MOUSE_BUTTON_LEFT and mb.pressed:
			_handle_ground_click(mb.position)
	elif event is InputEventMouseMotion and rotating_cam:
		var mm: InputEventMouseMotion = event
		cam_yaw -= mm.relative.x * 0.006
		_update_camera_transform()
	elif event.is_action_pressed("interact") and nearby_poi_key != "":
		if nearby_poi_key.begins_with("landmark"):
			GameState.challenge_requested.emit(GameState.current_city_id)
		elif nearby_poi_key == "hub":
			GameState.departures_requested.emit(GameState.current_city_id)
		elif nearby_poi_key.begins_with("hotel"):
			GameState.extra_place_requested.emit("hotel", GameState.current_city_id)
		elif nearby_poi_key.begins_with("market"):
			GameState.extra_place_requested.emit("market", GameState.current_city_id)
		elif nearby_poi_key.begins_with("library"):
			GameState.extra_place_requested.emit("library", GameState.current_city_id)
	elif event.is_action_pressed("sprint_boost"):
		GameState.activate_sprint_boost()

func _handle_ground_click(screen_pos: Vector2) -> void:
	var ro: Vector3 = camera.project_ray_origin(screen_pos)
	var rd: Vector3 = camera.project_ray_normal(screen_pos)
	if absf(rd.y) < 0.001:
		return
	var t: float = -ro.y / rd.y
	if t > 0.0 and t < 1200.0:
		click_target = ro + rd * t
		click_target.y = 0.1
		has_click_target = true

func _update_nearby_poi() -> void:
	nearby_poi_key = ""
	nearby_poi_name = ""
	GameState.player_at_hub = false
	if city_builder == null:
		return
	var best_d: float = INTERACT_RANGE
	for pkey in city_builder.pois.keys():
		var pinfo: Dictionary = city_builder.pois[pkey]
		var d: float = Vector2(global_position.x, global_position.z).distance_to(Vector2(pinfo["center"].x, pinfo["center"].z))
		if d < best_d:
			best_d = d
			nearby_poi_key = String(pkey)
			nearby_poi_name = String(pinfo["name"])
	GameState.player_at_hub = (nearby_poi_key == "hub")
