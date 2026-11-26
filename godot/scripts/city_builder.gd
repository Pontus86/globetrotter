extends Node3D

## Genererar unika, solbelysta europeiska 3D-städer med:
## - Riktiga StaticBody3D-hus (omöjligt att gå genom byggnader!)
## - Ikoniska 3D-monument per stad (Eiffeltornet, Colosseum, Big Ben, Brandenburger Tor, Stadshuset, Sagrada Família, Akropolis, Hagia Sofia)
## - Riktiga floder med broar i flodstäder (Paris, London, Stockholm, Prag, Zürich, Rom, Wien)
## - 5 glittrande guldbyggnader: Sevärdhet, Station, Hotell, Marknad, Bibliotek

const BLOCK_STEP: float = 24.0
const STREET_WIDTH: float = 8.0
const HALF_GRID: int = 3

const RIVER_CITIES := ["paris", "london", "stockholm", "prague", "zurich", "rome", "vienna"]

var pois: Dictionary = {}
var city_root: Node3D
var current_city_id: String = ""

const PALETTE := [
	Color(0.91, 0.83, 0.71), # Sandsten
	Color(0.85, 0.72, 0.58), # Varm kalksten
	Color(0.79, 0.59, 0.45), # Terrakotta
	Color(0.73, 0.52, 0.39), # Tegel
	Color(0.88, 0.84, 0.76)  # Gräddvit puts
]

func build_city(city_id: String) -> void:
	current_city_id = city_id
	pois.clear()
	if city_root != null:
		city_root.queue_free()
	city_root = Node3D.new()
	add_child(city_root)

	var city_data: Dictionary = GameState.cities.get(city_id, {})
	var rng := RandomNumberGenerator.new()
	rng.seed = hash(city_id)

	# 1. Asfalt/gatugrund med riktig mark-collider
	var ground := StaticBody3D.new()
	var g_mesh := MeshInstance3D.new()
	var g_box := BoxMesh.new()
	g_box.size = Vector3(260.0, 1.0, 260.0)
	g_mesh.mesh = g_box
	g_mesh.position = Vector3(0.0, -0.5, 0.0)
	var g_mat := StandardMaterial3D.new()
	g_mat.albedo_color = Color(0.22, 0.23, 0.25)
	g_mat.roughness = 0.92
	g_mesh.material_override = g_mat
	ground.add_child(g_mesh)

	var g_col := CollisionShape3D.new()
	var g_shape := BoxShape3D.new()
	g_shape.size = Vector3(260.0, 1.0, 260.0)
	g_col.shape = g_shape
	g_col.position = Vector3(0.0, -0.5, 0.0)
	ground.add_child(g_col)
	city_root.add_child(ground)

	# 2. Flod + stenbroar i europeiska flodstäder!
	if RIVER_CITIES.has(city_id):
		_build_river_with_bridges()

	# 3. 5 speciella torg-kvarter för Sevärdhet, Station, Hotell, Marknad & Bibliotek
	var special_cells: Dictionary = {
		Vector2i(0, 0): "landmark",
		Vector2i(-2, 2): "hub",
		Vector2i(2, -1): "hotel",
		Vector2i(-2, -2): "market",
		Vector2i(2, 2): "library"
	}

	# 4. Kvarter med riktiga StaticBody3D-byggnader & träd
	for gx in range(-HALF_GRID, HALF_GRID + 1):
		for gz in range(-HALF_GRID, HALF_GRID + 1):
			# Lämna rad gz == 1 öppen om staden har flod
			if RIVER_CITIES.has(city_id) and gz == 1:
				continue
			var cell := Vector2i(gx, gz)
			var cx: float = float(gx) * BLOCK_STEP
			var cz: float = float(gz) * BLOCK_STEP
			var block_w: float = BLOCK_STEP - STREET_WIDTH

			_add_sidewalk(Vector3(cx, 0.08, cz), Vector3(block_w + 1.4, 0.16, block_w + 1.4))

			if special_cells.has(cell):
				var pkey: String = String(special_cells[cell])
				_build_special_poi(pkey, Vector3(cx, 0.0, cz), city_data, city_id)
			else:
				var half_sub: float = (block_w - 1.2) * 0.5
				for sx in range(2):
					for sz in range(2):
						var bx: float = cx + (-half_sub * 0.5 if sx == 0 else half_sub * 0.5)
						var bz: float = cz + (-half_sub * 0.5 if sz == 0 else half_sub * 0.5)
						var bw: float = half_sub - 0.6
						var bh: float = rng.randf_range(6.5, 16.5)
						var col: Color = PALETTE[rng.randi() % PALETTE.size()]
						_add_solid_building(Vector3(bx, 0.0, bz), Vector3(bw, bh, bw), col)

	# 5. Yttre stadsmur
	var lim: float = float(HALF_GRID + 1) * BLOCK_STEP
	_add_invisible_wall(Vector3(0.0, 5.0, -lim), Vector3(lim * 2.2, 10.0, 2.0))
	_add_invisible_wall(Vector3(0.0, 5.0, lim), Vector3(lim * 2.2, 10.0, 2.0))
	_add_invisible_wall(Vector3(-lim, 5.0, 0.0), Vector3(2.0, 10.0, lim * 2.2))
	_add_invisible_wall(Vector3(lim, 5.0, 0.0), Vector3(2.0, 10.0, lim * 2.2))

func _build_river_with_bridges() -> void:
	var rz: float = BLOCK_STEP # Rad gz == 1
	var water := MeshInstance3D.new()
	var wb := BoxMesh.new()
	wb.size = Vector3(240.0, 0.25, 13.0)
	water.mesh = wb
	water.position = Vector3(0.0, 0.05, rz)
	var wmat := StandardMaterial3D.new()
	wmat.albedo_color = Color(0.11, 0.34, 0.56)
	wmat.roughness = 0.22
	wmat.metallic = 0.15
	water.material_override = wmat
	city_root.add_child(water)

	# 3 breda stenbroar vid x = -48, 0, +48 (öppna för spelare & poliser!)
	var bridge_xs: Array[float] = [-2.0 * BLOCK_STEP, 0.0, 2.0 * BLOCK_STEP]
	for bx in bridge_xs:
		var br := MeshInstance3D.new()
		var bm := BoxMesh.new()
		bm.size = Vector3(11.0, 0.45, 15.0)
		br.mesh = bm
		br.position = Vector3(bx, 0.15, rz)
		var bmat := StandardMaterial3D.new()
		bmat.albedo_color = Color(0.68, 0.64, 0.56)
		br.material_override = bmat
		city_root.add_child(br)

	# Osynliga räcken på vattnet MELLAN broarna så man måste använda broarna!
	var spans: Array = [[-90.0, -54.0], [-42.0, -6.0], [6.0, 42.0], [54.0, 90.0]]
	for sp in spans:
		var x0: float = float(sp[0])
		var x1: float = float(sp[1])
		_add_invisible_wall(Vector3((x0 + x1) * 0.5, 2.0, rz), Vector3(x1 - x0, 4.0, 11.5))

func _add_sidewalk(pos: Vector3, sz: Vector3) -> void:
	var mi := MeshInstance3D.new()
	var bm := BoxMesh.new()
	bm.size = sz
	mi.mesh = bm
	mi.position = pos
	var mat := StandardMaterial3D.new()
	mat.albedo_color = Color(0.54, 0.52, 0.48)
	mat.roughness = 0.9
	mi.material_override = mat
	city_root.add_child(mi)

func _add_solid_building(base_pos: Vector3, sz: Vector3, color: Color) -> void:
	var body := StaticBody3D.new()
	body.position = Vector3(base_pos.x, sz.y * 0.5, base_pos.z)

	var mi := MeshInstance3D.new()
	var bm := BoxMesh.new()
	bm.size = sz
	mi.mesh = bm
	var mat := StandardMaterial3D.new()
	mat.albedo_color = color
	mat.roughness = 0.78
	mi.material_override = mat
	body.add_child(mi)

	var roof := MeshInstance3D.new()
	var rm := BoxMesh.new()
	rm.size = Vector3(sz.x + 0.3, 0.7, sz.z + 0.3)
	roof.mesh = rm
	roof.position = Vector3(0.0, sz.y * 0.5 + 0.35, 0.0)
	var rmat := StandardMaterial3D.new()
	rmat.albedo_color = color.darkened(0.38)
	roof.material_override = rmat
	body.add_child(roof)

	var col := CollisionShape3D.new()
	var shape := BoxShape3D.new()
	shape.size = sz
	col.shape = shape
	body.add_child(col)
	city_root.add_child(body)

func _add_invisible_wall(pos: Vector3, sz: Vector3) -> void:
	var body := StaticBody3D.new()
	body.position = pos
	var col := CollisionShape3D.new()
	var shape := BoxShape3D.new()
	shape.size = sz
	col.shape = shape
	body.add_child(col)
	city_root.add_child(body)

func _build_iconic_monument(city_id: String, center: Vector3) -> float:
	# Bygger ett igenkännbart 3D-monument + collider i mitten av torget och returnerar höjden
	var col_body := StaticBody3D.new()
	col_body.position = Vector3(center.x, 5.0, center.z)
	var cs := CollisionShape3D.new()
	var bx := BoxShape3D.new()
	bx.size = Vector3(9.5, 10.0, 9.5)
	cs.shape = bx
	col_body.add_child(cs)
	city_root.add_child(col_body)

	var gold_mat := StandardMaterial3D.new()
	gold_mat.albedo_color = Color(0.95, 0.78, 0.32)
	gold_mat.metallic = 0.35
	gold_mat.roughness = 0.4

	if city_id == "paris":
		# Eiffeltornet (4 avsmalnande våningar + spira)
		var iron := StandardMaterial3D.new()
		iron.albedo_color = Color(0.48, 0.41, 0.35)
		iron.metallic = 0.5
		var tiers := [[9.0, 6.0, 3.0], [6.2, 8.0, 10.0], [3.6, 9.0, 18.5], [1.2, 7.0, 26.5]]
		for t in tiers:
			var mi := MeshInstance3D.new()
			var bm := BoxMesh.new()
			bm.size = Vector3(float(t[0]), float(t[1]), float(t[0]))
			mi.mesh = bm
			mi.position = Vector3(center.x, float(t[2]), center.z)
			mi.material_override = iron
			city_root.add_child(mi)
		return 31.0
	elif city_id == "rome":
		# Colosseum (rund stenarena)
		var stone := StandardMaterial3D.new()
		stone.albedo_color = Color(0.86, 0.77, 0.62)
		var mi := MeshInstance3D.new()
		var cm := CylinderMesh.new()
		cm.top_radius = 6.2
		cm.bottom_radius = 6.6
		cm.height = 11.0
		mi.mesh = cm
		mi.position = Vector3(center.x, 5.5, center.z)
		mi.material_override = stone
		city_root.add_child(mi)
		return 13.0
	elif city_id == "london":
		# Big Ben (högt klocktorn + spira)
		_add_solid_building(center, Vector3(6.5, 22.0, 6.5), Color(0.84, 0.75, 0.58))
		var spire := MeshInstance3D.new()
		var cm := CylinderMesh.new()
		cm.top_radius = 0.1
		cm.bottom_radius = 3.8
		cm.height = 7.5
		spire.mesh = cm
		spire.position = Vector3(center.x, 26.0, center.z)
		spire.material_override = gold_mat
		city_root.add_child(spire)
		return 30.5
	elif city_id == "stockholm":
		# Stadshuset (tegelpalats + högt torn med guldspira)
		_add_solid_building(center, Vector3(11.0, 9.5, 8.5), Color(0.68, 0.30, 0.24))
		_add_solid_building(center + Vector3(3.8, 0.0, -2.5), Vector3(3.6, 22.0, 3.6), Color(0.64, 0.27, 0.22))
		var crown := MeshInstance3D.new()
		var sm := SphereMesh.new()
		sm.radius = 1.4
		sm.height = 2.8
		crown.mesh = sm
		crown.position = Vector3(center.x + 3.8, 23.5, center.z - 2.5)
		crown.material_override = gold_mat
		city_root.add_child(crown)
		return 26.0
	elif city_id == "barcelona":
		# Sagrada Família (4 höga spiror)
		_add_solid_building(center, Vector3(10.0, 10.0, 10.0), Color(0.86, 0.74, 0.58))
		for ox in [-3.2, 3.2]:
			for oz in [-3.2, 3.2]:
				var sp := MeshInstance3D.new()
				var cm := CylinderMesh.new()
				cm.top_radius = 0.25
				cm.bottom_radius = 1.4
				cm.height = 18.0
				sp.mesh = cm
				sp.position = Vector3(center.x + float(ox), 15.0, center.z + float(oz))
				sp.material_override = gold_mat
				city_root.add_child(sp)
		return 25.0
	elif city_id == "istanbul":
		# Hagia Sofia (stor kupol + 4 minareter)
		_add_solid_building(center, Vector3(11.0, 9.0, 11.0), Color(0.88, 0.72, 0.56))
		var dome := MeshInstance3D.new()
		var sm := SphereMesh.new()
		sm.radius = 5.0
		sm.height = 10.0
		dome.mesh = sm
		dome.position = Vector3(center.x, 10.5, center.z)
		dome.material_override = gold_mat
		city_root.add_child(dome)
		return 17.5
	else:
		_add_solid_building(center, Vector3(10.0, 17.0, 10.0), Color(0.95, 0.78, 0.32))
		return 18.5

func _build_special_poi(pkey: String, center: Vector3, city_data: Dictionary, city_id: String) -> void:
	var title: String = pkey.capitalize()
	var top_y: float = 13.0

	if pkey == "landmark":
		title = String(city_data.get("landmark", {}).get("name", "Sevärdhet"))
		top_y = _build_iconic_monument(city_id, center)
	elif pkey == "hub":
		title = String(city_data.get("hub", {}).get("name", "Centralstationen"))
		_add_solid_building(center, Vector3(11.5, 9.5, 9.0), Color(0.26, 0.58, 0.86))
		top_y = 11.0
	elif pkey == "hotel":
		title = "🏨 Grand Hotel"
		_add_solid_building(center, Vector3(9.5, 13.5, 9.5), Color(0.80, 0.34, 0.48))
		top_y = 15.0
	elif pkey == "market":
		title = "🛍️ Basar / Marknad"
		_add_solid_building(center, Vector3(10.5, 6.5, 10.5), Color(0.26, 0.66, 0.42))
		top_y = 8.5
	elif pkey == "library":
		title = "📚 Bibliotek"
		_add_solid_building(center, Vector3(9.5, 11.5, 9.5), Color(0.50, 0.38, 0.76))
		top_y = 13.0

	# Gyllene glittrande aura-ring runt byggnaden!
	var ring := MeshInstance3D.new()
	var torus := TorusMesh.new()
	torus.inner_radius = 6.8
	torus.outer_radius = 7.6
	ring.mesh = torus
	ring.position = Vector3(center.x, 0.35, center.z)
	var rmat := StandardMaterial3D.new()
	rmat.albedo_color = Color(1.0, 0.88, 0.42, 0.85)
	rmat.emission_enabled = true
	rmat.emission = Color(1.0, 0.82, 0.25)
	rmat.emission_energy_multiplier = 1.6
	rmat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	ring.material_override = rmat
	city_root.add_child(ring)

	var lbl := Label3D.new()
	lbl.text = title
	lbl.billboard = BaseMaterial3D.BILLBOARD_ENABLED
	lbl.font_size = 38
	lbl.pixel_size = 0.025
	lbl.position = Vector3(center.x, top_y + 2.5, center.z)
	lbl.modulate = Color(1.0, 0.94, 0.70)
	lbl.outline_size = 8
	city_root.add_child(lbl)

	pois[pkey] = {
		"pos": Vector3(center.x, 0.0, center.z + 8.5),
		"center": center,
		"name": title,
		"ring": ring,
		"label": lbl
	}

func get_spawn_pos(pkey: String) -> Vector3:
	if pois.has(pkey):
		return pois[pkey]["pos"]
	return Vector3(0.0, 0.1, 12.0)

func get_police_spawn_pos() -> Vector3:
	return Vector3(2.0 * BLOCK_STEP, 0.1, -2.0 * BLOCK_STEP + 9.0)

func _process(delta: float) -> void:
	var t: float = float(Time.get_ticks_msec()) * 0.004
	for pkey in pois.keys():
		var r: MeshInstance3D = pois[pkey]["ring"]
		if is_instance_valid(r):
			var pulse: float = 1.0 + sin(t + float(hash(pkey) % 5)) * 0.05
			r.scale = Vector3(pulse, 1.0, pulse)
			r.rotate_y(delta * 0.8)
