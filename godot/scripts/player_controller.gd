extends CharacterBody3D

## Silkesmjuk 60-144 FPS CharacterBody3D-spelare (fungerar för både Tjuv och Polischef!)

const BASE_SPEED: float = 22.0
const INTERACT_RANGE: float = 12.5

var camera: Camera3D
var body_mesh: MeshInstance3D
var nearby_poi_key: String = ""
var nearby_poi_name: String = ""
var city_builder: Node3D
var ui_blocking_input: bool = false

func _ready() -> void:
	body_mesh = MeshInstance3D.new()
	var cap := CapsuleMesh.new()
	cap.radius = 0.75
	cap.height = 2.4
	body_mesh.mesh = cap
	body_mesh.position = Vector3(0.0, 1.2, 0.0)
	_apply_role_color()
	add_child(body_mesh)

	var col := CollisionShape3D.new()
	var shape := CapsuleShape3D.new()
	shape.radius = 0.75
	shape.height = 2.4
	col.shape = shape
	col.position = Vector3(0.0, 1.2, 0.0)
	add_child(col)

	camera = Camera3D.new()
	camera.position = Vector3(0.0, 34.0, 26.0)
	camera.rotation_degrees = Vector3(-52.0, 0.0, 0.0)
	add_child(camera)

	GameState.match_started.connect(_apply_role_color)

func _apply_role_color() -> void:
	if body_mesh == null:
		return
	var mat := StandardMaterial3D.new()
	if GameState.player_role == "police":
		mat.albedo_color = Color(0.10, 0.56, 0.92)
		mat.emission_enabled = true
		mat.emission = Color(0.06, 0.28, 0.55)
	else:
		mat.albedo_color = Color(0.85, 0.18, 0.18)
		mat.emission_enabled = true
		mat.emission = Color(0.45, 0.08, 0.08)
	body_mesh.material_override = mat

func teleport_to(pos: Vector3) -> void:
	global_position = Vector3(pos.x, 0.1, pos.z)
	velocity = Vector3.ZERO

func _is_text_input_focused() -> bool:
	var fo: Control = get_viewport().gui_get_focus_owner()
	return fo is LineEdit or fo is TextEdit

func _physics_process(delta: float) -> void:
	if not is_visible_in_tree() or not GameState.active or GameState.finished:
		velocity = Vector3.ZERO
		return
	var actor: Dictionary = GameState.get_controlled_actor()
	if ui_blocking_input or _is_text_input_focused() or actor.get("travel") != null:
		velocity = Vector3.ZERO
		return

	var input_vec := Vector2.ZERO
	if Input.is_action_pressed("move_up"): input_vec.y -= 1.0
	if Input.is_action_pressed("move_down"): input_vec.y += 1.0
	if Input.is_action_pressed("move_left"): input_vec.x -= 1.0
	if Input.is_action_pressed("move_right"): input_vec.x += 1.0

	if input_vec.length() > 0.05:
		if actor.get("boarding") != null:
			GameState.cancel_controlled_boarding()
		input_vec = input_vec.normalized()
		var boosted: bool = GameState.player_role == "thief" and GameState.elapsed_sec < GameState.boost_until
		var spd: float = BASE_SPEED * (1.7 if boosted else 1.0)
		velocity.x = input_vec.x * spd
		velocity.z = input_vec.y * spd
	else:
		velocity.x = move_toward(velocity.x, 0.0, 90.0 * delta)
		velocity.z = move_toward(velocity.z, 0.0, 90.0 * delta)

	velocity.y = 0.0
	move_and_slide()
	global_position.y = 0.1
	_update_nearby_poi()

func _unhandled_input(event: InputEvent) -> void:
	if not is_visible_in_tree() or not GameState.active or GameState.finished or ui_blocking_input or _is_text_input_focused():
		return
	if event.is_action_pressed("interact") and nearby_poi_key != "":
		match nearby_poi_key:
			"landmark": GameState.challenge_requested.emit(GameState.current_city_id)
			"hub": GameState.departures_requested.emit(GameState.current_city_id)
			"hotel", "market", "library": GameState.extra_place_requested.emit(nearby_poi_key, GameState.current_city_id)
	elif event.is_action_pressed("sprint_boost"):
		GameState.activate_sprint_boost()

func _update_nearby_poi() -> void:
	nearby_poi_key = ""
	nearby_poi_name = ""
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
