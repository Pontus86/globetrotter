extends Node3D

## 10 realistiska europeiska 90-tals / Noir-takdetaljer som sprids ut på platta tak i laddade chunks:
## 1. Tegelskorsten med stigande rök    6. Hiss-/trappkur (penthouse-huv)
## 2. Parabolantenn                     7. Vattentorn / takcistern
## 3. AC- / ventilationsaggregat        8. Takterrass med gröna blomlådor
## 4. Lysande takfönster (skylight)     9. Röd flyghinderlampa (på höga hus)
## 5. 90-tals TV-/radiomast            10. Plåt-ventilationsrör

var smoke_puffs: Array[Dictionary] = [] # { "node": MeshInstance3D, "base": Vector3, "phase": float, "speed": float }
var beacon_mats: Array[StandardMaterial3D] = []

var mat_brick: StandardMaterial3D
var mat_metal: StandardMaterial3D
var mat_dark_metal: StandardMaterial3D
var mat_dish: StandardMaterial3D
var mat_skylight: StandardMaterial3D
var mat_green: StandardMaterial3D
var mat_smoke: StandardMaterial3D

func _init() -> void:
	mat_brick = _std(Color(0.54, 0.28, 0.22), 0.90)
	mat_metal = _std(Color(0.50, 0.53, 0.56), 0.55)
	mat_dark_metal = _std(Color(0.24, 0.26, 0.30), 0.60)
	mat_dish = _std(Color(0.76, 0.78, 0.80), 0.45)
	mat_green = _std(Color(0.24, 0.46, 0.26), 0.88)

	mat_skylight = StandardMaterial3D.new()
	mat_skylight.albedo_color = Color(0.95, 0.84, 0.58)
	mat_skylight.emission_enabled = true
	mat_skylight.emission = Color(0.95, 0.78, 0.45)
	mat_skylight.emission_energy_multiplier = 0.65
	mat_skylight.roughness = 0.25

	mat_smoke = StandardMaterial3D.new()
	mat_smoke.albedo_color = Color(0.72, 0.76, 0.82, 0.28)
	mat_smoke.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	mat_smoke.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED

func _std(col: Color, rough: float) -> StandardMaterial3D:
	var m := StandardMaterial3D.new()
	m.albedo_color = col
	m.roughness = rough
	return m

func add_random_prop(center: Vector3, bldg_h: float, rng: RandomNumberGenerator, is_pitched: bool = false) -> void:
	var kind: int = 0
	if is_pitched:
		# På lutande tak: skorsten med rök, parabol, takfönster, TV-antenn eller röd hinderlampa (sänkt 0.7m in i nocken så inget svävar!)
		var pitched_choices := [0, 0, 1, 3, 4, 8]
		kind = pitched_choices[rng.randi() % pitched_choices.size()]
		center.y -= 0.75
	else:
		kind = 8 if (bldg_h >= 24.0 and rng.randf() < 0.35) else (rng.randi() % 10)
	var yaw: float = rng.randf() * TAU
	var root := Node3D.new()
	root.position = center
	root.rotation.y = yaw
	add_child(root)

	match kind:
		0: _build_chimney_with_smoke(root, center, rng)
		1: _build_satellite_dish(root)
		2: _build_ac_unit(root)
		3: _build_skylight(root)
		4: _build_tv_antenna(root)
		5: _build_penthouse_box(root)
		6: _build_water_tank(root)
		7: _build_roof_planters(root)
		8: _build_red_beacon(root)
		_: _build_vent_ducts(root)

func _box(parent: Node3D, pos: Vector3, sz: Vector3, mat: StandardMaterial3D, rot_x: float = 0.0) -> MeshInstance3D:
	var mi := MeshInstance3D.new()
	var bm := BoxMesh.new()
	bm.size = sz
	mi.mesh = bm
	mi.position = pos
	mi.rotation.x = rot_x
	mi.material_override = mat
	parent.add_child(mi)
	return mi

func _cyl(parent: Node3D, pos: Vector3, rt: float, rb: float, h: float, mat: StandardMaterial3D, rot_x: float = 0.0) -> MeshInstance3D:
	var mi := MeshInstance3D.new()
	var cm := CylinderMesh.new()
	cm.top_radius = rt
	cm.bottom_radius = rb
	cm.height = h
	mi.mesh = cm
	mi.position = pos
	mi.rotation.x = rot_x
	mi.material_override = mat
	parent.add_child(mi)
	return mi

func _build_chimney_with_smoke(root: Node3D, world_base: Vector3, rng: RandomNumberGenerator) -> void:
	_box(root, Vector3(0.0, 1.3, 0.0), Vector3(1.4, 2.6, 1.4), mat_brick)
	_box(root, Vector3(0.0, 2.7, 0.0), Vector3(1.7, 0.28, 1.7), mat_dark_metal)
	# 2 mjuka rök-puffar som stiger sakta upp i kvällsluften!
	for k in range(2):
		var puff := MeshInstance3D.new()
		var sm := SphereMesh.new()
		sm.radius = 0.85
		sm.height = 1.7
		puff.mesh = sm
		puff.material_override = mat_smoke
		add_child(puff)
		smoke_puffs.append({
			"node": puff,
			"base": world_base + Vector3(0.0, 3.1, 0.0),
			"phase": rng.randf() + float(k) * 0.5,
			"speed": rng.randf_range(0.18, 0.28)
		})

func _build_satellite_dish(root: Node3D) -> void:
	_cyl(root, Vector3(0.0, 0.7, 0.0), 0.14, 0.22, 1.4, mat_dark_metal)
	_cyl(root, Vector3(0.0, 1.5, 0.3), 1.15, 0.35, 0.45, mat_dish, 0.95)

func _build_ac_unit(root: Node3D) -> void:
	_box(root, Vector3(0.0, 0.65, 0.0), Vector3(2.4, 1.3, 1.7), mat_metal)
	_box(root, Vector3(0.0, 0.68, 0.88), Vector3(1.7, 0.85, 0.08), mat_dark_metal)

func _build_skylight(root: Node3D) -> void:
	_box(root, Vector3(0.0, 0.35, 0.0), Vector3(3.2, 0.7, 2.2), mat_dark_metal)
	_box(root, Vector3(0.0, 0.72, 0.0), Vector3(2.8, 0.14, 1.8), mat_skylight)

func _build_tv_antenna(root: Node3D) -> void:
	_cyl(root, Vector3(0.0, 2.4, 0.0), 0.06, 0.10, 4.8, mat_metal)
	_box(root, Vector3(0.0, 4.1, 0.0), Vector3(2.2, 0.08, 0.08), mat_metal)
	_box(root, Vector3(0.0, 3.4, 0.0), Vector3(1.5, 0.08, 0.08), mat_metal)

func _build_penthouse_box(root: Node3D) -> void:
	_box(root, Vector3(0.0, 1.4, 0.0), Vector3(3.6, 2.8, 3.0), mat_metal)
	_box(root, Vector3(0.0, 2.85, 0.0), Vector3(3.9, 0.22, 3.3), mat_dark_metal)
	_box(root, Vector3(0.0, 1.0, 1.54), Vector3(1.0, 2.0, 0.08), mat_dark_metal)

func _build_water_tank(root: Node3D) -> void:
	for lx in [-0.7, 0.7]:
		for lz in [-0.7, 0.7]:
			_cyl(root, Vector3(float(lx), 0.8, float(lz)), 0.10, 0.12, 1.6, mat_dark_metal)
	_cyl(root, Vector3(0.0, 2.5, 0.0), 1.35, 1.35, 2.1, mat_metal)
	_cyl(root, Vector3(0.0, 3.85, 0.0), 0.15, 1.45, 0.65, mat_dark_metal)

func _build_roof_planters(root: Node3D) -> void:
	for ox in [-1.5, 1.5]:
		_box(root, Vector3(float(ox), 0.35, 0.0), Vector3(2.1, 0.7, 0.9), mat_brick)
		_box(root, Vector3(float(ox), 0.90, 0.0), Vector3(1.85, 0.55, 0.72), mat_green)

func _build_red_beacon(root: Node3D) -> void:
	_cyl(root, Vector3(0.0, 2.2, 0.0), 0.08, 0.14, 4.4, mat_dark_metal)
	var bmat := StandardMaterial3D.new()
	bmat.albedo_color = Color(1.0, 0.16, 0.16)
	bmat.emission_enabled = true
	bmat.emission = Color(1.0, 0.12, 0.12)
	bmat.emission_energy_multiplier = 2.6
	bmat.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	var lamp := MeshInstance3D.new()
	var sm := SphereMesh.new()
	sm.radius = 0.42
	sm.height = 0.84
	lamp.mesh = sm
	lamp.position = Vector3(0.0, 4.5, 0.0)
	lamp.material_override = bmat
	root.add_child(lamp)
	beacon_mats.append(bmat)

func _build_vent_ducts(root: Node3D) -> void:
	_box(root, Vector3(0.0, 0.45, 0.0), Vector3(3.4, 0.65, 0.85), mat_metal)
	_cyl(root, Vector3(-1.3, 1.15, 0.0), 0.42, 0.42, 1.1, mat_metal)
	_cyl(root, Vector3(1.3, 1.15, 0.0), 0.36, 0.36, 0.9, mat_dark_metal)

func _process(delta: float) -> void:
	if not is_visible_in_tree():
		return
	for sp in smoke_puffs:
		var nd: MeshInstance3D = sp["node"]
		if not is_instance_valid(nd):
			continue
		var ph: float = fmod(float(sp["phase"]) + delta * float(sp["speed"]), 1.0)
		sp["phase"] = ph
		var base: Vector3 = sp["base"]
		nd.position = base + Vector3(ph * 4.5, ph * 8.5, sin(ph * TAU) * 1.2)
		var sc: float = 0.65 + ph * 1.6
		nd.scale = Vector3(sc, sc * 0.8, sc)

	if not beacon_mats.is_empty():
		var pulse: float = 0.3 + 2.4 * (0.5 + 0.5 * sin(float(Time.get_ticks_msec()) * 0.005))
		for bm in beacon_mats:
			bm.emission_energy_multiplier = pulse
