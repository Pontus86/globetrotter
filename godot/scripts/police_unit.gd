extends CharacterBody3D

## AI-Polis i 3D-staden med riktig kollision, siktlinje, SÖKER-läge
## samt synlig röd gripanderadie och blå siktlinjering direkt på 3D-gatorna!

const CHASE_SPEED := 16.3 # ~74% av spelarens basfart
const SEARCH_SPEED := 13.0

var police_data: Dictionary = {}
var target_player: CharacterBody3D
var city_builder: Node3D
var alert_state: String = "patrol" # "chasing" | "searching" | "patrol"
var spotted_pos: Vector3 = Vector3.ZERO
var has_spotted_pos: bool = false

func _ready() -> void:
	# Polisens 3D-figur (blå uniform)
	var mesh := MeshInstance3D.new()
	var cap := CapsuleMesh.new()
	cap.radius = 0.78
	cap.height = 2.5
	mesh.mesh = cap
	mesh.position = Vector3(0, 1.25, 0)
	var mat := StandardMaterial3D.new()
	mat.albedo_color = Color(0.10, 0.56, 0.92)
	mat.emission_enabled = true
	mat.emission = Color(0.06, 0.25, 0.55)
	mesh.material_override = mat
	add_child(mesh)

	var col := CollisionShape3D.new()
	var shape := CapsuleShape3D.new()
	shape.radius = 0.78
	shape.height = 2.5
	col.shape = shape
	col.position = Vector3(0, 1.25, 0)
	add_child(col)

	# Synlig RÖD gripanderadie-cirkel direkt på gatan!
	var cap_ring := MeshInstance3D.new()
	var cyl := CylinderMesh.new()
	cyl.top_radius = GameState.CAPTURE_DIST_M
	cyl.bottom_radius = GameState.CAPTURE_DIST_M
	cyl.height = 0.12
	cap_ring.mesh = cyl
	cap_ring.position = Vector3(0, 0.12, 0)
	var cmat := StandardMaterial3D.new()
	cmat.albedo_color = Color(0.95, 0.18, 0.18, 0.28)
	cmat.emission_enabled = true
	cmat.emission = Color(0.95, 0.2, 0.2)
	cmat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	cap_ring.material_override = cmat
	add_child(cap_ring)

	# Synlig BLÅ siktlinjering!
	var vis_ring := MeshInstance3D.new()
	var tor := TorusMesh.new()
	tor.inner_radius = GameState.VISION_DIST_M - 0.35
	tor.outer_radius = GameState.VISION_DIST_M
	vis_ring.mesh = tor
	vis_ring.position = Vector3(0, 0.18, 0)
	var vmat := StandardMaterial3D.new()
	vmat.albedo_color = Color(0.22, 0.74, 0.98, 0.38)
	vmat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	vis_ring.material_override = vmat
	add_child(vis_ring)

func _physics_process(_delta: float) -> void:
	if not is_visible_in_tree() or not GameState.active or GameState.finished or target_player == null:
		velocity = Vector3.ZERO
		return
	if police_data.get("travel") != null or String(police_data.get("city", "")) != GameState.current_city_id or String(GameState.thief.get("city", "")) != GameState.current_city_id:
		velocity = Vector3.ZERO
		return
	if GameState.elapsed_sec < GameState.police_frozen_until:
		velocity = Vector3.ZERO
		return

	var dist := Vector2(global_position.x, global_position.z).distance_to(Vector2(target_player.global_position.x, target_player.global_position.z))
	var thief_hidden := GameState.elapsed_sec < GameState.thief_hidden_until
	var thief_sprinting := GameState.elapsed_sec < GameState.boost_until

	# Gripande!
	if dist <= GameState.CAPTURE_DIST_M and GameState.thief.get("travel") == null:
		GameState.end_game(false, "%s grep dig på gatorna i %s!" % [police_data.get("name", "Polisen"), GameState.cities[GameState.current_city_id]["name"]])
		return

	# Siktlinje-logik
	if not thief_hidden and (dist <= GameState.VISION_DIST_M or thief_sprinting):
		if alert_state != "chasing":
			alert_state = "chasing"
			GameState.add_radio('📻 %s: "Jag har ögonkontakt med tjuven i %s!"' % [police_data.get("short", "Polis"), GameState.cities[GameState.current_city_id]["name"]], "alert")
		spotted_pos = target_player.global_position
		has_spotted_pos = true
	elif alert_state == "chasing" and (dist > GameState.LOSE_SIGHT_DIST_M or thief_hidden):
		alert_state = "searching"
		GameState.add_radio('📻 %s: "Tappade siktlinjen — söker av kvarteren!"' % police_data.get("short", "Polis"), "police")

	var goal := spotted_pos
	if not has_spotted_pos or Vector2(global_position.x, global_position.z).distance_to(Vector2(goal.x, goal.z)) < 3.5:
		alert_state = "searching"
		if city_builder:
			goal = city_builder.get_spawn_pos("hub" if randf() < 0.5 else "landmark")
			spotted_pos = goal
			has_spotted_pos = true

	var dir := Vector3(goal.x - global_position.x, 0.0, goal.z - global_position.z)
	if dir.length() > 0.5:
		dir = dir.normalized()
		var spd := CHASE_SPEED if alert_state == "chasing" else SEARCH_SPEED
		velocity.x = dir.x * spd
		velocity.z = dir.z * spd
	else:
		velocity = Vector3.ZERO
	velocity.y = 0.0
	move_and_slide()
	global_position.y = 0.1
