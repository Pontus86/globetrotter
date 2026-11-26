extends CharacterBody3D

## AI-Polis i 3D-staden (1:1 meterskala för riktiga OSM-kartor!)
## - Riktig byggnadskollision + glidstyrning runt hörn
## - Synlig röd gripanderadie & blå siktlinjering direkt på 3D-gatorna
## - Flytande namnskylt ("🚓 Holm" / "🚓 Vega" / "🚓 Lind")

const CHASE_SPEED: float = 35.5
const SEARCH_SPEED: float = 28.0
const RunnerFigureScript = preload("res://scripts/runner_figure.gd")

var police_data: Dictionary = {}
var target_player: CharacterBody3D
var city_builder: Node3D
var stealth_fx: Node3D
var runner_fig: Node3D
var alert_state: String = "patrol" # "chasing" | "searching" | "patrol"
var spotted_pos: Vector3 = Vector3.ZERO
var has_spotted_pos: bool = false
var last_heard_time: float = -999.0
var stuck_timer: float = 0.0
var detour_sign: float = 1.0

func _ready() -> void:
	# Animerad springande 3D-polisfigur (blå uniform + poliskeps!)
	runner_fig = RunnerFigureScript.new()
	runner_fig.setup(true)
	add_child(runner_fig)

	var col := CollisionShape3D.new()
	var shape := CapsuleShape3D.new()
	shape.radius = 1.05
	shape.height = 5.0
	col.shape = shape
	col.position = Vector3(0.0, 2.5, 0.0)
	add_child(col)

	var lbl := Label3D.new()
	lbl.text = "🚓 " + String(police_data.get("short", "Polis"))
	lbl.billboard = BaseMaterial3D.BILLBOARD_ENABLED
	lbl.font_size = 44
	lbl.pixel_size = 0.085
	lbl.position = Vector3(0.0, 11.5, 0.0)
	lbl.modulate = Color(0.65, 0.90, 1.0)
	lbl.outline_size = 10
	add_child(lbl)

	# Synlig RÖD gripanderadie-cirkel direkt på gatan!
	var cap_ring := MeshInstance3D.new()
	var cyl := CylinderMesh.new()
	cyl.top_radius = GameState.CAPTURE_DIST_M
	cyl.bottom_radius = GameState.CAPTURE_DIST_M
	cyl.height = 0.25
	cap_ring.mesh = cyl
	cap_ring.position = Vector3(0.0, 0.25, 0.0)
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
	tor.inner_radius = GameState.VISION_DIST_M - 0.9
	tor.outer_radius = GameState.VISION_DIST_M
	vis_ring.mesh = tor
	vis_ring.position = Vector3(0.0, 0.35, 0.0)
	var vmat := StandardMaterial3D.new()
	vmat.albedo_color = Color(0.22, 0.74, 0.98, 0.34)
	vmat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	vis_ring.material_override = vmat
	add_child(vis_ring)

func _has_line_of_sight_to_player() -> bool:
	if target_player == null:
		return false
	var from_p: Vector3 = global_position + Vector3(0.0, 3.5, 0.0)
	var to_p: Vector3 = target_player.global_position + Vector3(0.0, 3.5, 0.0)
	var query := PhysicsRayQueryParameters3D.create(from_p, to_p)
	query.collision_mask = 1
	query.exclude = [get_rid(), target_player.get_rid()]
	var hit: Dictionary = get_world_3d().direct_space_state.intersect_ray(query)
	return hit.is_empty()

func _physics_process(delta: float) -> void:
	if not is_visible_in_tree() or not GameState.active or GameState.finished or target_player == null:
		velocity = Vector3.ZERO
		return
	if police_data.get("travel") != null or String(police_data.get("city", "")) != GameState.current_city_id or String(GameState.thief.get("city", "")) != GameState.current_city_id:
		velocity = Vector3.ZERO
		return
	if GameState.elapsed_sec < GameState.police_frozen_until:
		velocity = Vector3.ZERO
		return

	var dist: float = Vector2(global_position.x, global_position.z).distance_to(Vector2(target_player.global_position.x, target_player.global_position.z))
	var thief_hidden: bool = GameState.elapsed_sec < GameState.thief_hidden_until
	var thief_sprinting: bool = GameState.elapsed_sec < GameState.boost_until
	var eff_vision: float = GameState.VISION_DIST_M * (0.55 if GameState.player_sneaking else 1.0)
	var has_los: bool = (dist <= GameState.LOSE_SIGHT_DIST_M * 1.4) and _has_line_of_sight_to_player()

	# Gripande! (kräver avstånd <= CAPTURE_DIST_M och ingen husvägg emellan)
	if dist <= GameState.CAPTURE_DIST_M and has_los and GameState.thief.get("travel") == null:
		GameState.end_game(false, "%s grep dig på gatorna i %s!" % [police_data.get("name", "Polisen"), GameState.cities[GameState.current_city_id]["name"]])
		return

	# Riktig 3D-siktlinje + hörsel (sprintljud genom väggar!) + fotspår!
	if thief_hidden:
		if alert_state == "chasing":
			alert_state = "searching"
			has_spotted_pos = false
	elif has_los and (dist <= eff_vision or thief_sprinting):
		if alert_state != "chasing":
			alert_state = "chasing"
			GameState.add_radio('📻 %s: "Ögonkontakt i %s!"' % [police_data.get("short", "Polis"), GameState.cities[GameState.current_city_id]["name"]], "alert")
		spotted_pos = target_player.global_position
		has_spotted_pos = true
	else:
		if alert_state == "chasing":
			alert_state = "searching"
			GameState.add_radio('📻 %s: "Tappade siktlinjen bakom kvarteret."' % police_data.get("short", "Polis"), "police")
		# Hörsel: sprintljud hörs genom hus upp till 95m!
		if GameState.last_noise_time > last_heard_time and (GameState.elapsed_sec - GameState.last_noise_time) < 2.0:
			var nd: float = Vector2(global_position.x, global_position.z).distance_to(Vector2(GameState.last_noise_pos.x, GameState.last_noise_pos.z))
			if nd <= 95.0:
				last_heard_time = GameState.last_noise_time
				spotted_pos = GameState.last_noise_pos
				has_spotted_pos = true
				alert_state = "searching"
				GameState.add_radio('📻 %s: "Hörde snabba fotsteg i närheten!"' % police_data.get("short", "Polis"), "police")
		# Fotspår: plocka upp färska fotspår inom 18m!
		elif stealth_fx != null and not has_spotted_pos:
			var fp_pos: Vector3 = stealth_fx.get_freshest_footprint_near(global_position, 18.0)
			if fp_pos != Vector3.ZERO:
				spotted_pos = fp_pos
				has_spotted_pos = true
				alert_state = "searching"

	var goal: Vector3 = spotted_pos
	if not has_spotted_pos or Vector2(global_position.x, global_position.z).distance_to(Vector2(goal.x, goal.z)) < 8.0:
		alert_state = "searching"
		if city_builder != null:
			var rkeys := ["hub", "landmark", "hotel", "market", "library"]
			goal = city_builder.get_spawn_pos(rkeys[randi() % rkeys.size()])
			spotted_pos = goal
			has_spotted_pos = true

	var dir := Vector3(goal.x - global_position.x, 0.0, goal.z - global_position.z)
	if dir.length() > 1.0:
		dir = dir.normalized()
		if stuck_timer > 0.0:
			stuck_timer -= delta
			dir = Vector3(-dir.z * detour_sign, 0.0, dir.x * detour_sign)
		var spd: float = CHASE_SPEED if alert_state == "chasing" else SEARCH_SPEED
		velocity.x = dir.x * spd
		velocity.z = dir.z * spd
	else:
		velocity = Vector3.ZERO

	velocity.y = 0.0
	var prev_pos := global_position
	move_and_slide()
	global_position.y = 0.1
	if runner_fig != null:
		runner_fig.update_run(velocity, delta)

	# Om polisen skrapar mot ett verkligt OSM-hus, styr smidigt runt hörnet!
	if get_slide_collision_count() > 0 and prev_pos.distance_to(global_position) < 0.15:
		if stuck_timer <= 0.0:
			detour_sign = -detour_sign
			stuck_timer = 0.65
