extends Node3D

## Levande europeisk Noir-stad:
## - Riktiga bilar med lysande strålkastare & röda baklyktor längs OSM-gatorna
## - Gående fotgängare längs trottoarerna
## - Varma europeiska gjutjärns-gatlyktor med bärnstensljus på gatorna

var cars: Array[Dictionary] = [] # { "node": Node3D, "pts": Array[Vector3], "seg": int, "t": float, "dir": int, "spd": float }
var peds: Array[Dictionary] = [] # { "node": Node3D, "pts": Array[Vector3], "seg": int, "t": float, "dir": int, "spd": float, "phase": float, "side": float }

const CAR_COLORS := [
	Color(0.14, 0.16, 0.20), # Svart/grafit
	Color(0.16, 0.24, 0.36), # Mörkblå
	Color(0.46, 0.16, 0.18), # Vinröd
	Color(0.32, 0.35, 0.38), # Silvergrå
	Color(0.76, 0.62, 0.20), # Klassisk taxi
	Color(0.22, 0.32, 0.26)  # Brittisk racinggrön
]

const COAT_COLORS := [
	Color(0.24, 0.26, 0.32), # Mörkgrå rock
	Color(0.38, 0.32, 0.26), # Brun trenchcoat
	Color(0.18, 0.24, 0.36), # Marinblå
	Color(0.52, 0.46, 0.38), # Beige gabardin
	Color(0.26, 0.34, 0.28)  # Mörkgrön
]

func clear_life() -> void:
	for ch in get_children():
		ch.queue_free()
	cars.clear()
	peds.clear()

func populate_from_roads(roads: Array, city_id: String) -> void:
	clear_life()
	if roads.is_empty():
		return

	var rng := RandomNumberGenerator.new()
	rng.seed = hash(city_id) ^ 991177

	var car_paths: Array = []
	var ped_paths: Array = []
	var lamp_candidates: Array[Vector3] = []

	for r_raw in roads:
		var r: Dictionary = r_raw
		if int(r.get("b", 0)) == 2:
			continue # Hoppa över floder
		var raw_pts: Array = r.get("pts", [])
		if raw_pts.size() < 2:
			continue
		var w: float = float(r.get("w", 6.0))
		var vpts: Array[Vector3] = []
		var total_len: float = 0.0
		for i in range(raw_pts.size()):
			var p := Vector3(float(raw_pts[i][0]), 0.1, float(raw_pts[i][1]))
			if i > 0:
				total_len += vpts[i - 1].distance_to(p)
			vpts.append(p)
		if total_len < 35.0:
			continue
		ped_paths.append(vpts)
		if w >= 6.0 and total_len >= 60.0:
			car_paths.append(vpts)
			for k in range(0, vpts.size(), 2):
				lamp_candidates.append(vpts[k])

	# 1. Varma europeiska gatlyktor längs gatorna (minst 48m mellan varje för ren estetik + 144 FPS!)
	_spawn_streetlamps(lamp_candidates, rng)

	# 2. Bilar med strålkastare & röda baklyktor
	var head_mat := _em_mat(Color(1.0, 0.96, 0.82), 2.2)
	var tail_mat := _em_mat(Color(1.0, 0.16, 0.14), 2.0)
	var glass_mat := _std_mat(Color(0.12, 0.16, 0.22), 0.25)

	var car_count: int = mini(24, car_paths.size())
	for _i in range(car_count):
		var path: Array[Vector3] = car_paths[rng.randi() % car_paths.size()]
		var cnode: Node3D = _make_car(CAR_COLORS[rng.randi() % CAR_COLORS.size()], glass_mat, head_mat, tail_mat)
		add_child(cnode)
		var seg: int = rng.randi() % (path.size() - 1)
		var d: int = 1 if rng.randf() < 0.5 else -1
		cars.append({
			"node": cnode,
			"pts": path,
			"seg": seg,
			"t": rng.randf(),
			"dir": d,
			"spd": rng.randf_range(13.0, 21.0)
		})

	# 3. Gående fotgängare längs trottoarerna
	var skin_mat := _std_mat(Color(0.88, 0.74, 0.62), 0.75)
	var ped_count: int = mini(30, ped_paths.size())
	for _j in range(ped_count):
		var ppath: Array[Vector3] = ped_paths[rng.randi() % ped_paths.size()]
		var pnode: Node3D = _make_ped(COAT_COLORS[rng.randi() % COAT_COLORS.size()], skin_mat)
		add_child(pnode)
		peds.append({
			"node": pnode,
			"pts": ppath,
			"seg": rng.randi() % (ppath.size() - 1),
			"t": rng.randf(),
			"dir": 1 if rng.randf() < 0.5 else -1,
			"spd": rng.randf_range(3.2, 5.2),
			"phase": rng.randf() * TAU,
			"side": 3.4 if rng.randf() < 0.5 else -3.4
		})

func _spawn_streetlamps(candidates: Array[Vector3], rng: RandomNumberGenerator) -> void:
	if candidates.is_empty():
		return
	var pole_mat := _std_mat(Color(0.12, 0.13, 0.15), 0.55)
	var bulb_mat := _em_mat(Color(1.0, 0.84, 0.48), 2.4)
	var pool_mat := StandardMaterial3D.new()
	pool_mat.albedo_color = Color(1.0, 0.80, 0.42, 0.16)
	pool_mat.emission_enabled = true
	pool_mat.emission = Color(1.0, 0.78, 0.38)
	pool_mat.emission_energy_multiplier = 0.7
	pool_mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	pool_mat.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED

	var placed: Array[Vector2] = []
	var max_lamps: int = 58
	var real_lights: int = 0

	for _try in range(candidates.size()):
		if placed.size() >= max_lamps:
			break
		var c: Vector3 = candidates[rng.randi() % candidates.size()]
		var c2 := Vector2(c.x, c.z)
		var ok: bool = true
		for ex in placed:
			if ex.distance_squared_to(c2) < 48.0 * 48.0:
				ok = false
				break
		if not ok:
			continue
		placed.append(c2)

		var lamp := Node3D.new()
		lamp.position = Vector3(c.x + 3.8, 0.0, c.z)

		# Gjutjärnsstolpe
		var pole := MeshInstance3D.new()
		var pm := CylinderMesh.new()
		pm.top_radius = 0.16
		pm.bottom_radius = 0.24
		pm.height = 8.5
		pole.mesh = pm
		pole.position = Vector3(0.0, 4.25, 0.0)
		pole.material_override = pole_mat
		lamp.add_child(pole)

		# Varmt lysande lykthuvud
		var bulb := MeshInstance3D.new()
		var sm := SphereMesh.new()
		sm.radius = 0.65
		sm.height = 1.3
		bulb.mesh = sm
		bulb.position = Vector3(0.0, 8.7, 0.0)
		bulb.material_override = bulb_mat
		lamp.add_child(bulb)

		# Mjuk varm ljuscirkel på den regnvåta gatan under lyktan
		var pool := MeshInstance3D.new()
		var cm := CylinderMesh.new()
		cm.top_radius = 7.5
		cm.bottom_radius = 7.5
		cm.height = 0.06
		pool.mesh = cm
		pool.position = Vector3(0.0, 0.18, 0.0)
		pool.material_override = pool_mat
		lamp.add_child(pool)

		# Några riktiga mjuka punktljus i centrala korsningar för äkta Noir-glans på husen
		if real_lights < 8 and c2.length() < 320.0:
			real_lights += 1
			var ol := OmniLight3D.new()
			ol.position = Vector3(0.0, 9.2, 0.0)
			ol.light_color = Color(1.0, 0.80, 0.45)
			ol.light_energy = 0.9
			ol.omni_range = 32.0
			lamp.add_child(ol)

		add_child(lamp)

func _make_car(col: Color, glass_mat: StandardMaterial3D, head_mat: StandardMaterial3D, tail_mat: StandardMaterial3D) -> Node3D:
	var car := Node3D.new()
	var body_mat := _std_mat(col, 0.45)

	var body := MeshInstance3D.new()
	var bm := BoxMesh.new()
	bm.size = Vector3(2.8, 1.35, 5.8)
	body.mesh = bm
	body.position = Vector3(0.0, 1.0, 0.0)
	body.material_override = body_mat
	car.add_child(body)

	var cabin := MeshInstance3D.new()
	var cm := BoxMesh.new()
	cm.size = Vector3(2.4, 1.05, 3.0)
	cabin.mesh = cm
	cabin.position = Vector3(0.0, 2.05, -0.25)
	cabin.material_override = glass_mat
	car.add_child(cabin)

	# Vita strålkastare fram (+Z) och röda baklyktor (-Z)
	for sx in [-0.95, 0.95]:
		var hl := MeshInstance3D.new()
		var hbm := BoxMesh.new()
		hbm.size = Vector3(0.55, 0.35, 0.2)
		hl.mesh = hbm
		hl.position = Vector3(float(sx), 1.05, 2.95)
		hl.material_override = head_mat
		car.add_child(hl)

		var tl := MeshInstance3D.new()
		var tbm := BoxMesh.new()
		tbm.size = Vector3(0.55, 0.32, 0.2)
		tl.mesh = tbm
		tl.position = Vector3(float(sx), 1.05, -2.95)
		tl.material_override = tail_mat
		car.add_child(tl)

	return car

func _make_ped(coat_col: Color, skin_mat: StandardMaterial3D) -> Node3D:
	var p := Node3D.new()
	var cmat := _std_mat(coat_col, 0.80)

	var torso := MeshInstance3D.new()
	var bm := BoxMesh.new()
	bm.size = Vector3(1.1, 2.8, 0.8)
	torso.mesh = bm
	torso.position = Vector3(0.0, 2.0, 0.0)
	torso.material_override = cmat
	p.add_child(torso)

	var head := MeshInstance3D.new()
	var sm := SphereMesh.new()
	sm.radius = 0.55
	sm.height = 1.1
	head.mesh = sm
	head.position = Vector3(0.0, 3.9, 0.0)
	head.material_override = skin_mat
	p.add_child(head)

	return p

func _std_mat(col: Color, rough: float) -> StandardMaterial3D:
	var m := StandardMaterial3D.new()
	m.albedo_color = col
	m.roughness = rough
	return m

func _em_mat(col: Color, energy: float) -> StandardMaterial3D:
	var m := StandardMaterial3D.new()
	m.albedo_color = col
	m.emission_enabled = true
	m.emission = col
	m.emission_energy_multiplier = energy
	m.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	return m

func _process(delta: float) -> void:
	if not is_visible_in_tree():
		return

	# Uppdatera bilar längs gatorna (högerfil-offset 1.8m)
	for c in cars:
		_step_along_path(c, delta, 1.8, false)

	# Uppdatera gående fotgängare längs trottoarerna
	for p in peds:
		p["phase"] = float(p["phase"]) + delta * 8.0
		_step_along_path(p, delta, float(p["side"]), true)

func _step_along_path(agent: Dictionary, delta: float, lane_offset: float, bob: bool) -> void:
	var pts: Array = agent["pts"]
	var seg: int = int(agent["seg"])
	var dir: int = int(agent["dir"])
	var a: Vector3 = pts[seg]
	var b: Vector3 = pts[seg + 1]
	var seg_len: float = maxf(0.5, a.distance_to(b))
	var t: float = float(agent["t"]) + (float(agent["spd"]) * delta / seg_len) * float(dir)

	if t >= 1.0:
		if seg + 1 < pts.size() - 1:
			seg += 1
			t = 0.0
		else:
			dir = -1
			t = 1.0
	elif t <= 0.0:
		if seg > 0:
			seg -= 1
			t = 1.0
		else:
			dir = 1
			t = 0.0

	agent["seg"] = seg
	agent["dir"] = dir
	agent["t"] = t

	a = pts[seg]
	b = pts[seg + 1]
	var fwd: Vector3 = (b - a).normalized() * float(dir)
	var right := Vector3(-fwd.z, 0.0, fwd.x)
	var pos: Vector3 = a.lerp(b, t) + right * lane_offset
	if bob:
		pos.y = 0.1 + absf(sin(float(agent["phase"]))) * 0.35
	var nd: Node3D = agent["node"]
	nd.position = pos
	nd.rotation.y = atan2(fwd.x, fwd.z)
