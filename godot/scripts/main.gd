extends Node3D

## Huvudorkestrator för Globetrotter: Scotland Yard 3D i Godot 4
## Hanterar både Tjuv-läge (AI-poliser i 3D-stad) och Polischef-läge (AI-tjuv i 3D-stad!).

const CityBuilderScript = preload("res://scripts/city_builder.gd")
const PlayerScript = preload("res://scripts/player_controller.gd")
const PoliceScript = preload("res://scripts/police_unit.gd")
const GlobeScript = preload("res://scripts/globe_3d.gd")
const HudScript = preload("res://scripts/hud.gd")

var city_container: Node3D
var city_builder: Node3D
var player: CharacterBody3D
var police_nodes: Dictionary = {}
var ai_thief_node: CharacterBody3D
var globe: Node3D
var hud: CanvasLayer

func _ready() -> void:
	var env := WorldEnvironment.new()
	var e_res := Environment.new()
	e_res.background_mode = Environment.BG_COLOR
	e_res.background_color = Color(0.05, 0.09, 0.16)
	e_res.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
	e_res.ambient_light_color = Color(0.65, 0.62, 0.56)
	e_res.ambient_light_energy = 0.65
	env.environment = e_res
	add_child(env)

	var sun := DirectionalLight3D.new()
	sun.rotation_degrees = Vector3(-48.0, 35.0, 0.0)
	sun.light_color = Color(1.0, 0.94, 0.82)
	sun.light_energy = 1.25
	sun.shadow_enabled = true
	add_child(sun)

	city_container = Node3D.new()
	add_child(city_container)

	city_builder = CityBuilderScript.new()
	city_container.add_child(city_builder)

	player = PlayerScript.new()
	player.city_builder = city_builder
	city_container.add_child(player)

	globe = GlobeScript.new()
	globe.visible = false
	add_child(globe)

	hud = HudScript.new()
	hud.player_ref = player
	add_child(hud)

	GameState.view_changed.connect(_on_view_changed)
	GameState.match_started.connect(_on_match_started)

func _on_match_started() -> void:
	city_builder.current_city_id = ""
	GameState.nearest_police_dist_in_city = 999.0
	_clear_city_bots()

func _clear_city_bots() -> void:
	for pn in police_nodes.values():
		if is_instance_valid(pn):
			pn.queue_free()
	police_nodes.clear()
	if is_instance_valid(ai_thief_node):
		ai_thief_node.queue_free()
	ai_thief_node = null

func _on_view_changed(mode: String, city_id: String) -> void:
	if mode == "city":
		globe.visible = false
		city_container.visible = true
		if city_builder.current_city_id != city_id:
			city_builder.build_city(city_id)
			var spawn_key: String = "hub" if GameState.player_role == "thief" else "landmark"
			player.teleport_to(city_builder.get_spawn_pos(spawn_key))
			_clear_city_bots()
		player.camera.current = true
	else:
		city_container.visible = false
		globe.visible = true
		globe.camera.current = true

func _process(_delta: float) -> void:
	if not GameState.active or GameState.finished:
		return

	if GameState.player_role == "thief":
		var thief_city: String = String(GameState.thief.get("city", ""))
		var in_city_view: bool = (GameState.view_mode == "city" and GameState.thief.get("travel") == null)
		for p in GameState.police:
			var pid: String = String(p["id"])
			var in_city: bool = (in_city_view and p["travel"] == null and String(p["city"]) == thief_city and thief_city == GameState.current_city_id)
			if in_city and not police_nodes.has(pid):
				var pn: CharacterBody3D = PoliceScript.new()
				pn.police_data = p
				pn.target_player = player
				pn.city_builder = city_builder
				city_container.add_child(pn)
				pn.global_position = city_builder.get_police_spawn_pos()
				police_nodes[pid] = pn
			elif not in_city and police_nodes.has(pid):
				if is_instance_valid(police_nodes[pid]):
					police_nodes[pid].queue_free()
				police_nodes.erase(pid)
	else:
		# Polischef-läge: spawna AI-tjuven i 3D-staden om vald polis & tjuv är i samma stad
		var actor: Dictionary = GameState.get_controlled_actor()
		var thief_here: bool = (GameState.view_mode == "city" and actor.get("travel") == null and GameState.thief.get("travel") == null and String(GameState.thief.get("city", "")) == GameState.current_city_id)
		if thief_here and not is_instance_valid(ai_thief_node):
			ai_thief_node = _spawn_ai_thief()
		elif not thief_here and is_instance_valid(ai_thief_node):
			ai_thief_node.queue_free()
			ai_thief_node = null

func _physics_process(_delta: float) -> void:
	if not GameState.active or GameState.finished or GameState.view_mode != "city":
		GameState.nearest_police_dist_in_city = 999.0
		return

	if GameState.player_role == "thief":
		var best_d: float = 999.0
		for pn in police_nodes.values():
			if is_instance_valid(pn):
				var d: float = Vector2(player.global_position.x, player.global_position.z).distance_to(Vector2(pn.global_position.x, pn.global_position.z))
				if d < best_d:
					best_d = d
		GameState.nearest_police_dist_in_city = best_d
	elif is_instance_valid(ai_thief_node):
		# AI-tjuven springer mot stationen!
		var hub_p: Vector3 = city_builder.get_spawn_pos("hub")
		var dir := Vector3(hub_p.x - ai_thief_node.global_position.x, 0.0, hub_p.z - ai_thief_node.global_position.z)
		if dir.length() > 1.0:
			dir = dir.normalized()
			ai_thief_node.velocity = Vector3(dir.x * 16.5, 0.0, dir.z * 16.5)
			ai_thief_node.move_and_slide()
			ai_thief_node.global_position.y = 0.1
		var cap_r: float = GameState.CAPTURE_DIST_M * (2.0 if GameState.elapsed_sec < GameState.hound_until else 1.0)
		var dist: float = Vector2(player.global_position.x, player.global_position.z).distance_to(Vector2(ai_thief_node.global_position.x, ai_thief_node.global_position.z))
		if dist <= cap_r:
			GameState.end_game(true, "Du grep mästertjuven på gatorna i %s!" % GameState.cities[GameState.current_city_id]["name"])

func _spawn_ai_thief() -> CharacterBody3D:
	var th := CharacterBody3D.new()
	var m := MeshInstance3D.new()
	var cap := CapsuleMesh.new()
	cap.radius = 0.78
	cap.height = 2.4
	m.mesh = cap
	m.position = Vector3(0.0, 1.2, 0.0)
	var mat := StandardMaterial3D.new()
	mat.albedo_color = Color(0.95, 0.18, 0.18)
	mat.emission_enabled = true
	mat.emission = Color(0.6, 0.1, 0.1)
	m.material_override = mat
	th.add_child(m)

	var col := CollisionShape3D.new()
	var sh := CapsuleShape3D.new()
	sh.radius = 0.78
	sh.height = 2.4
	col.shape = sh
	col.position = Vector3(0.0, 1.2, 0.0)
	th.add_child(col)

	var lbl := Label3D.new()
	lbl.text = "🕵️ TJUVEN!"
	lbl.billboard = BaseMaterial3D.BILLBOARD_ENABLED
	lbl.font_size = 38
	lbl.pixel_size = 0.025
	lbl.position = Vector3(0.0, 3.6, 0.0)
	lbl.modulate = Color(1.0, 0.4, 0.4)
	th.add_child(lbl)

	city_container.add_child(th)
	th.global_position = city_builder.get_police_spawn_pos()
	return th
