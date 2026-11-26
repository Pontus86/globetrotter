extends CharacterBody3D

## Silkesmjuk 60-144 FPS CharacterBody3D-spelare med riktig move_and_slide()-kollision mot 3D-hus!

const BASE_SPEED := 22.0
const INTERACT_RANGE := 12.5

var camera: Camera3D
var nearby_poi_key: String = ""
var nearby_poi_name: String = ""
var city_builder: Node3D
var ui_blocking_input: bool = false

func _ready() -> void:
	# Spelarens 3D-figur (tjuv i mörk rock + guldhatt!)
	var mesh := MeshInstance3D.new()
	var cap := CapsuleMesh.new()
	cap.radius = 0.75
	cap.height = 2.4
	mesh.mesh = cap
	mesh.position = Vector3(0, 1.2, 0)
	var mat := StandardMaterial3D.new()
	mat.albedo_color = Color(0.85, 0.18, 0.18)
	mat.emission_enabled = true
	mat.emission = Color(0.45, 0.08, 0.08)
	mesh.material_override = mat
	add_child(mesh)

	var col := CollisionShape3D.new()
	var shape := CapsuleShape3D.new()
	shape.radius = 0.75
	shape.height = 2.4
	col.shape = shape
	col.position = Vector3(0, 1.2, 0)
	add_child(col)

	camera = Camera3D.new()
	camera.position = Vector3(0, 34.0, 26.0)
	camera.rotation_degrees = Vector3(-52.0, 0.0, 0.0)
	add_child(camera)

func teleport_to(pos: Vector3) -> void:
	global_position = Vector3(pos.x, 0.1, pos.z)
	velocity = Vector3.ZERO

func _physics_process(delta: float) -> void:
	if not visible or not GameState.active or GameState.finished:
		return
	if ui_blocking_input or GameState.thief.get("travel") != null:
		velocity = Vector3.ZERO
		return

	var input_vec := Vector2.ZERO
	if Input.is_action_pressed("move_up"): input_vec.y -= 1.0
	if Input.is_action_pressed("move_down"): input_vec.y += 1.0
	if Input.is_action_pressed("move_left"): input_vec.x -= 1.0
	if Input.is_action_pressed("move_right"): input_vec.x += 1.0

	if input_vec.length() > 0.05:
		if GameState.thief.get("boarding") != null:
			GameState.cancel_thief_boarding()
		input_vec = input_vec.normalized()
		var boosted := GameState.elapsed_sec < GameState.boost_until
		var spd := BASE_SPEED * (1.7 if boosted else 1.0)
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
	if not visible or not GameState.active or GameState.finished or ui_blocking_input:
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
	var best_d := INTERACT_RANGE
	for pkey in city_builder.pois.keys():
		var pinfo: Dictionary = city_builder.pois[pkey]
		var d := Vector2(global_position.x, global_position.z).distance_to(Vector2(pinfo["center"].x, pinfo["center"].z))
		if d < best_d:
			best_d = d
			nearby_poi_key = pkey
			nearby_poi_name = pinfo["name"]
