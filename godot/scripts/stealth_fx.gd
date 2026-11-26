extends Node3D

## Noir Ljud- & Fotspårsmotor i 3D-staden:
## - Färska fotspår på gatan (15s livslängd, orienterade i löpriktningen — polischefen kan spåra tjuven genom gränderna!)
## - Pulserande ljudringar när man springer/sprintar (hörs genom byggnader!)

var footprints: Array[Dictionary] = [] # { "node": MeshInstance3D, "pos": Vector3, "birth": float, "life": float, "mat": StandardMaterial3D }
var noise_rings: Array[Dictionary] = [] # { "node": MeshInstance3D, "birth": float, "life": float, "max_r": float, "mat": StandardMaterial3D }

func clear_all() -> void:
	for fp in footprints:
		var n: Node = fp["node"]
		if is_instance_valid(n):
			n.queue_free()
	footprints.clear()
	for nr in noise_rings:
		var n2: Node = nr["node"]
		if is_instance_valid(n2):
			n2.queue_free()
	noise_rings.clear()

func spawn_footprint(pos: Vector3, yaw: float, is_thief_print: bool = true) -> void:
	var mi := MeshInstance3D.new()
	var bm := BoxMesh.new()
	bm.size = Vector3(1.15, 0.08, 2.3)
	mi.mesh = bm
	mi.position = Vector3(pos.x, 0.28, pos.z)
	mi.rotation.y = yaw

	var col: Color = Color(1.0, 0.42, 0.34, 0.85) if is_thief_print else Color(0.45, 0.78, 1.0, 0.75)
	var mat := StandardMaterial3D.new()
	mat.albedo_color = col
	mat.emission_enabled = true
	mat.emission = col
	mat.emission_energy_multiplier = 0.9
	mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	mat.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	mi.material_override = mat
	add_child(mi)

	footprints.append({
		"node": mi,
		"pos": Vector3(pos.x, 0.1, pos.z),
		"birth": GameState.elapsed_sec,
		"life": 15.0,
		"mat": mat,
		"base_a": col.a
	})
	if footprints.size() > 75:
		var old: Dictionary = footprints.pop_front()
		if is_instance_valid(old["node"]):
			(old["node"] as Node).queue_free()

func spawn_noise_ring(pos: Vector3, max_radius: float = 42.0, col: Color = Color(1.0, 0.76, 0.32, 0.75)) -> void:
	var mi := MeshInstance3D.new()
	var tor := TorusMesh.new()
	tor.inner_radius = 0.88
	tor.outer_radius = 1.0
	mi.mesh = tor
	mi.position = Vector3(pos.x, 0.42, pos.z)

	var mat := StandardMaterial3D.new()
	mat.albedo_color = col
	mat.emission_enabled = true
	mat.emission = col
	mat.emission_energy_multiplier = 1.4
	mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	mat.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	mi.material_override = mat
	add_child(mi)

	noise_rings.append({
		"node": mi,
		"birth": GameState.elapsed_sec,
		"life": 0.95,
		"max_r": max_radius,
		"mat": mat,
		"base_a": col.a
	})

func get_freshest_footprint_near(pos: Vector3, max_dist: float) -> Vector3:
	var best_pos := Vector3.ZERO
	var best_birth: float = -1.0
	var p2 := Vector2(pos.x, pos.z)
	for fp in footprints:
		var fpos: Vector3 = fp["pos"]
		if p2.distance_to(Vector2(fpos.x, fpos.z)) <= max_dist:
			if float(fp["birth"]) > best_birth:
				best_birth = float(fp["birth"])
				best_pos = fpos
	return best_pos

func _process(_delta: float) -> void:
	var now: float = GameState.elapsed_sec

	var i: int = footprints.size() - 1
	while i >= 0:
		var fp: Dictionary = footprints[i]
		var age: float = now - float(fp["birth"])
		var life: float = float(fp["life"])
		if age >= life or not is_instance_valid(fp["node"]):
			if is_instance_valid(fp["node"]):
				(fp["node"] as Node).queue_free()
			footprints.remove_at(i)
		else:
			var frac: float = 1.0 - clampf(age / life, 0.0, 1.0)
			var mat: StandardMaterial3D = fp["mat"]
			mat.albedo_color.a = float(fp["base_a"]) * frac
		i -= 1

	var j: int = noise_rings.size() - 1
	while j >= 0:
		var nr: Dictionary = noise_rings[j]
		var age2: float = now - float(nr["birth"])
		var life2: float = float(nr["life"])
		if age2 >= life2 or not is_instance_valid(nr["node"]):
			if is_instance_valid(nr["node"]):
				(nr["node"] as Node).queue_free()
			noise_rings.remove_at(j)
		else:
			var frac2: float = clampf(age2 / life2, 0.0, 1.0)
			var r: float = lerpf(2.5, float(nr["max_r"]), frac2)
			var nd: MeshInstance3D = nr["node"]
			nd.scale = Vector3(r, 1.0, r)
			var mat2: StandardMaterial3D = nr["mat"]
			mat2.albedo_color.a = float(nr["base_a"]) * (1.0 - frac2)
		j -= 1
