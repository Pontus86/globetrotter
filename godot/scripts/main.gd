extends Node3D

## Huvudorkestrator för Globetrotter: Scotland Yard 3D i Godot 4
## Hanterar både Tjuv-läge (AI-poliser i 3D-stad) och Polischef-läge (AI-tjuv i 3D-stad!).

const CityBuilderScript = preload("res://scripts/city_builder.gd")
const PlayerScript = preload("res://scripts/player_controller.gd")
const PoliceScript = preload("res://scripts/police_unit.gd")
const GlobeScript = preload("res://scripts/globe_3d.gd")
const HudScript = preload("res://scripts/hud.gd")
const RunnerFigureScript = preload("res://scripts/runner_figure.gd")
const StealthFxScript = preload("res://scripts/stealth_fx.gd")

var city_container: Node3D
var city_builder: Node3D
var stealth_fx: Node3D
var player: CharacterBody3D
var police_nodes: Dictionary = {}
var ai_thief_node: CharacterBody3D
var ai_thief_step_accum: float = 0.0
var ai_thief_step_side: float = 1.0
var thief_area_marker: MeshInstance3D
var thief_area_timer: float = 0.0
var globe: Node3D
var hud: CanvasLayer

func _ready() -> void:
	var env := WorldEnvironment.new()
	var e_res := Environment.new()
	var sky := Sky.new()
	var psky := ProceduralSkyMaterial.new()
	# Realistisk Film Noir skymningshimmel (mjuk kvällsblå, aldrig kolsvart)
	psky.sky_top_color = Color(0.06, 0.10, 0.18)
	psky.sky_horizon_color = Color(0.20, 0.26, 0.36)
	psky.ground_horizon_color = Color(0.16, 0.18, 0.22)
	sky.sky_material = psky
	e_res.background_mode = Environment.BG_SKY
	e_res.sky = sky
	e_res.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
	e_res.ambient_light_color = Color(0.46, 0.50, 0.58)
	e_res.ambient_light_energy = 0.54
	e_res.tonemap_mode = Environment.TONE_MAPPER_FILMIC
	e_res.tonemap_exposure = 0.94
	e_res.glow_enabled = true
	e_res.glow_intensity = 0.25
	e_res.glow_bloom = 0.08
	e_res.glow_hdr_threshold = 1.05
	e_res.fog_enabled = true
	e_res.fog_light_color = Color(0.18, 0.22, 0.30)
	e_res.fog_density = 0.00042
	env.environment = e_res
	add_child(env)

	var sun := DirectionalLight3D.new()
	sun.rotation_degrees = Vector3(-42.0, 32.0, 0.0)
	sun.light_color = Color(0.86, 0.88, 0.94) # Mjukt europeiskt skymningsljus
	sun.light_energy = 0.68
	sun.shadow_enabled = true
	add_child(sun)

	city_container = Node3D.new()
	add_child(city_container)

	city_builder = CityBuilderScript.new()
	city_container.add_child(city_builder)

	stealth_fx = StealthFxScript.new()
	city_container.add_child(stealth_fx)

	player = PlayerScript.new()
	player.city_builder = city_builder
	player.stealth_fx = stealth_fx
	city_container.add_child(player)
	city_builder.focus_target = player

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
	if stealth_fx != null:
		stealth_fx.clear_all()
	for pn in police_nodes.values():
		if is_instance_valid(pn):
			pn.queue_free()
	police_nodes.clear()
	if is_instance_valid(ai_thief_node):
		ai_thief_node.queue_free()
	ai_thief_node = null
	if is_instance_valid(thief_area_marker):
		thief_area_marker.queue_free()
	thief_area_marker = null

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
				pn.stealth_fx = stealth_fx
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
			thief_area_marker = _spawn_thief_area_marker()
			thief_area_timer = 0.0
		elif not thief_here and is_instance_valid(ai_thief_node):
			ai_thief_node.queue_free()
			ai_thief_node = null
			if is_instance_valid(thief_area_marker):
				thief_area_marker.queue_free()
			thief_area_marker = null

func _physics_process(delta: float) -> void:
	if not GameState.active or GameState.finished or GameState.view_mode != "city":
		GameState.nearest_police_dist_in_city = 999.0
		GameState.nearest_police_chasing = false
		return

	if GameState.player_role == "thief":
		var best_d: float = 999.0
		var any_chasing: bool = false
		for pn in police_nodes.values():
			if is_instance_valid(pn):
				var d: float = Vector2(player.global_position.x, player.global_position.z).distance_to(Vector2(pn.global_position.x, pn.global_position.z))
				if d < best_d:
					best_d = d
				if pn.alert_state == "chasing":
					any_chasing = true
		GameState.nearest_police_dist_in_city = best_d
		GameState.nearest_police_chasing = any_chasing
	elif is_instance_valid(ai_thief_node):
		# AI-tjuven springer mot stationen!
		var hub_p: Vector3 = city_builder.get_spawn_pos("hub")
		var dir := Vector3(hub_p.x - ai_thief_node.global_position.x, 0.0, hub_p.z - ai_thief_node.global_position.z)
		if dir.length() > 2.0:
			dir = dir.normalized()
			ai_thief_node.velocity = Vector3(dir.x * 36.5, 0.0, dir.z * 36.5)
			ai_thief_node.move_and_slide()
			ai_thief_node.global_position.y = 0.1
			# AI-tjuven lämnar färska fotspår i gränderna som polischefen kan följa!
			if stealth_fx != null:
				ai_thief_step_accum += 36.5 * delta
				if ai_thief_step_accum >= 10.5:
					ai_thief_step_accum = 0.0
					ai_thief_step_side = -ai_thief_step_side
					var tyaw: float = atan2(ai_thief_node.velocity.x, ai_thief_node.velocity.z)
					var svec := Vector3(cos(tyaw), 0.0, -sin(tyaw)) * (0.9 * ai_thief_step_side)
					stealth_fx.spawn_footprint(ai_thief_node.global_position + svec, tyaw, true)
		else:
			ai_thief_node.velocity = Vector3.ZERO
		var rf: Node = ai_thief_node.get_node_or_null("RunnerFig")
		if rf != null:
			rf.update_run(ai_thief_node.velocity, delta)

		# Riktig 3D-raycast siktlinje: polischefen ser bara tjuvens modell om inga hus står i vägen!
		var from_p: Vector3 = player.global_position + Vector3(0.0, 3.5, 0.0)
		var to_p: Vector3 = ai_thief_node.global_position + Vector3(0.0, 3.5, 0.0)
		var q := PhysicsRayQueryParameters3D.create(from_p, to_p)
		q.collision_mask = 1
		q.exclude = [player.get_rid(), ai_thief_node.get_rid()]
		var hit: Dictionary = get_world_3d().direct_space_state.intersect_ray(q)
		var dist: float = Vector2(player.global_position.x, player.global_position.z).distance_to(Vector2(ai_thief_node.global_position.x, ai_thief_node.global_position.z))
		var can_see_thief: bool = hit.is_empty() and dist <= GameState.VISION_DIST_M * 1.45

		ai_thief_node.visible = can_see_thief
		if is_instance_valid(thief_area_marker):
			thief_area_marker.visible = not can_see_thief
			thief_area_timer -= delta
			if thief_area_timer <= 0.0:
				thief_area_timer = 2.4
				var jitter := Vector3(randf_range(-16.0, 16.0), 0.35, randf_range(-16.0, 16.0))
				thief_area_marker.global_position = Vector3(ai_thief_node.global_position.x, 0.35, ai_thief_node.global_position.z) + jitter

		var cap_r: float = GameState.CAPTURE_DIST_M * (2.0 if GameState.elapsed_sec < GameState.hound_until else 1.0)
		if dist <= cap_r and hit.is_empty():
			GameState.end_game(true, "Du grep mästertjuven på gatorna i %s!" % GameState.cities[GameState.current_city_id]["name"])

func _spawn_thief_area_marker() -> MeshInstance3D:
	# Ungefärlig sökområdes-cirkel när hus blockerar siktlinjen till tjuven!
	var mi := MeshInstance3D.new()
	var cyl := CylinderMesh.new()
	cyl.top_radius = 36.0
	cyl.bottom_radius = 36.0
	cyl.height = 0.3
	mi.mesh = cyl
	var mat := StandardMaterial3D.new()
	mat.albedo_color = Color(0.95, 0.22, 0.22, 0.22)
	mat.emission_enabled = true
	mat.emission = Color(0.90, 0.18, 0.18)
	mat.emission_energy_multiplier = 0.8
	mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	mi.material_override = mat
	mi.visible = false
	city_container.add_child(mi)
	return mi

func _spawn_ai_thief() -> CharacterBody3D:
	var th := CharacterBody3D.new()
	var rf: Node3D = RunnerFigureScript.new()
	rf.name = "RunnerFig"
	rf.setup(false)
	th.add_child(rf)

	var col := CollisionShape3D.new()
	var sh := CapsuleShape3D.new()
	sh.radius = 1.05
	sh.height = 5.0
	col.shape = sh
	col.position = Vector3(0.0, 2.5, 0.0)
	th.add_child(col)

	var lbl := Label3D.new()
	lbl.text = "🕵️ TJUVEN!"
	lbl.billboard = BaseMaterial3D.BILLBOARD_ENABLED
	lbl.font_size = 44
	lbl.pixel_size = 0.085
	lbl.position = Vector3(0.0, 11.5, 0.0)
	lbl.modulate = Color(1.0, 0.4, 0.4)
	lbl.outline_size = 10
	th.add_child(lbl)

	city_container.add_child(th)
	th.global_position = city_builder.get_police_spawn_pos()
	return th
