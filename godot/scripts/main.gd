extends Node3D

## Huvudorkestrator för Globetrotter: Scotland Yard 3D i Godot 4
## Kopplar ihop 3D-Stad, Spelare, AI-Poliser, 3D-Glob och HUD.

const CityBuilderScript = preload("res://scripts/city_builder.gd")
const PlayerScript = preload("res://scripts/player_controller.gd")
const PoliceScript = preload("res://scripts/police_unit.gd")
const GlobeScript = preload("res://scripts/globe_3d.gd")
const HudScript = preload("res://scripts/hud.gd")

var city_container: Node3D
var city_builder: Node3D
var player: CharacterBody3D
var police_nodes: Dictionary = {}
var globe: Node3D
var hud: CanvasLayer

func _ready() -> void:
	# 1. Varmt europeiskt solljus & himmel
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

	# 2. 3D-Stad + Spelare
	city_container = Node3D.new()
	add_child(city_container)

	city_builder = CityBuilderScript.new()
	city_container.add_child(city_builder)

	player = PlayerScript.new()
	player.city_builder = city_builder
	city_container.add_child(player)

	# 3. 3D-Jordglob (NASA Blue Marble)
	globe = GlobeScript.new()
	globe.visible = false
	add_child(globe)

	# 4. Slimmad 90-tals HUD
	hud = HudScript.new()
	hud.player_ref = player
	add_child(hud)

	GameState.view_changed.connect(_on_view_changed)
	GameState.match_started.connect(_on_match_started)

func _on_match_started() -> void:
	_clear_police_nodes()

func _clear_police_nodes() -> void:
	for pn in police_nodes.values():
		if is_instance_valid(pn):
			pn.queue_free()
	police_nodes.clear()

func _on_view_changed(mode: String, city_id: String) -> void:
	if mode == "city":
		globe.visible = false
		city_container.visible = true
		if city_builder.current_city_id != city_id:
			city_builder.build_city(city_id)
			player.teleport_to(city_builder.get_spawn_pos("hub"))
			_clear_police_nodes()
		player.camera.current = true
	else:
		city_container.visible = false
		globe.visible = true
		globe.camera.current = true

func _process(_delta: float) -> void:
	if not GameState.active or GameState.finished or GameState.view_mode != "city":
		return
	# Synka AI-poliser i aktuell 3D-stad
	for p in GameState.police:
		var pid: String = p["id"]
		var in_city: bool = (p["travel"] == null and p["city"] == GameState.current_city_id)
		if in_city and not police_nodes.has(pid):
			var pn: CharacterBody3D = PoliceScript.new()
			pn.police_data = p
			pn.target_player = player
			pn.city_builder = city_builder
			city_container.add_child(pn)
			pn.global_position = city_builder.get_police_spawn_pos()
			police_nodes[pid] = pn
		elif not in_city and police_nodes.has(pid):
			police_nodes[pid].queue_free()
			police_nodes.erase(pid)
