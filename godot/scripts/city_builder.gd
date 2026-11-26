extends Node3D

## Genererar en solbelyst europeisk 3D-stad med riktiga StaticBody3D-hus (omöjligt att gå genom!),
## breda gator, torg, samt 5 glittrande guldbyggnader: Sevärdhet, Station, Hotell, Marknad, Bibliotek.

const BLOCK_STEP := 24.0 # Avstånd mellan gatukorsningar (breda, sköna gator att springa & jaga på!)
const STREET_WIDTH := 8.0
const HALF_GRID := 3 # 7x7 kvartersnät (~168x168m)

var pois: Dictionary = {} # key -> { pos: Vector3, name: String, ring: MeshInstance3D, label: Label3D }
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
	if city_root:
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
	g_box.size = Vector3(260, 1, 260)
	g_mesh.mesh = g_box
	g_mesh.position = Vector3(0, -0.5, 0)
	var g_mat := StandardMaterial3D.new()
	g_mat.albedo_color = Color(0.22, 0.23, 0.25)
	g_mat.roughness = 0.92
	g_mesh.material_override = g_mat
	ground.add_child(g_mesh)

	var g_col := CollisionShape3D.new()
	var g_shape := BoxShape3D.new()
	g_shape.size = Vector3(260, 1, 260)
	g_col.shape = g_shape
	g_col.position = Vector3(0, -0.5, 0)
	ground.add_child(g_col)
	city_root.add_child(ground)

	# 2. Bestäm 5 speciella torg-kvarter för Sevärdhet, Station, Hotell, Marknad & Bibliotek
	var special_cells := {
		Vector2i(0, 0): "landmark",
		Vector2i(-2, 2): "hub",
		Vector2i(2, -1): "hotel",
		Vector2i(-2, -2): "market",
		Vector2i(2, 2): "library"
	}

	# 3. Bygg kvarteren med riktiga StaticBody3D-byggnader!
	for gx in range(-HALF_GRID, HALF_GRID + 1):
		for gz in range(-HALF_GRID, HALF_GRID + 1):
			var cell := Vector2i(gx, gz)
			var cx := gx * BLOCK_STEP
			var cz := gz * BLOCK_STEP
			var block_w := BLOCK_STEP - STREET_WIDTH

			# Trottoar/platta runt kvarteret
			_add_sidewalk(Vector3(cx, 0.08, cz), Vector3(block_w + 1.4, 0.16, block_w + 1.4))

			if special_cells.has(cell):
				var pkey: String = special_cells[cell]
				_build_special_poi(pkey, Vector3(cx, 0.0, cz), city_data)
			else:
				# 2-4 riktiga 3D-hus i kvarteret (varje hus har StaticBody3D-kollision!)
				var sub := 2
				var half_sub := (block_w - 1.2) * 0.5
				for sx in range(sub):
					for sz in range(sub):
						var bx := cx + (-half_sub * 0.5 if sx == 0 else half_sub * 0.5)
						var bz := cz + (-half_sub * 0.5 if sz == 0 else half_sub * 0.5)
						var bw := half_sub - 0.6
						var bh := rng.randf_range(6.5, 16.5)
						var col: Color = PALETTE[rng.randi() % PALETTE.size()]
						_add_solid_building(Vector3(bx, 0.0, bz), Vector3(bw, bh, bw), col)

	# 4. Yttre stadsmur så man inte springer ut i tomma intet
	var lim := (HALF_GRID + 1) * BLOCK_STEP
	_add_invisible_wall(Vector3(0, 5, -lim), Vector3(lim * 2.2, 10, 2))
	_add_invisible_wall(Vector3(0, 5, lim), Vector3(lim * 2.2, 10, 2))
	_add_invisible_wall(Vector3(-lim, 5, 0), Vector3(2, 10, lim * 2.2))
	_add_invisible_wall(Vector3(lim, 5, 0), Vector3(2, 10, lim * 2.2))

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

	# Mörkt tak
	var roof := MeshInstance3D.new()
	var rm := BoxMesh.new()
	rm.size = Vector3(sz.x + 0.3, 0.7, sz.z + 0.3)
	roof.mesh = rm
	roof.position = Vector3(0, sz.y * 0.5 + 0.35, 0)
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

func _build_special_poi(pkey: String, center: Vector3, city_data: Dictionary) -> void:
	var title := pkey.capitalize()
	var b_color := Color(0.95, 0.80, 0.35)
	var b_size := Vector3(9.0, 12.0, 9.0)

	match pkey:
		"landmark":
			title = String(city_data.get("landmark", {}).get("name", "Sevärdhet"))
			b_color = Color(0.96, 0.78, 0.30)
			b_size = Vector3(10.0, 18.0, 10.0)
		"hub":
			title = String(city_data.get("hub", {}).get("name", "Centralstationen"))
			b_color = Color(0.28, 0.62, 0.88)
			b_size = Vector3(11.0, 9.5, 9.0)
		"hotel":
			title = "🏨 Grand Hotel"
			b_color = Color(0.82, 0.34, 0.48)
			b_size = Vector3(9.0, 13.0, 9.0)
		"market":
			title = "🛍️ Basar / Marknad"
			b_color = Color(0.26, 0.68, 0.42)
			b_size = Vector3(10.0, 6.5, 10.0)
		"library":
			title = "📚 Bibliotek"
			b_color = Color(0.52, 0.40, 0.78)
			b_size = Vector3(9.5, 11.0, 9.5)

	_add_solid_building(center, b_size, b_color)

	# Gyllene glittrande aura-ring runt byggnaden!
	var ring := MeshInstance3D.new()
	var torus := TorusMesh.new()
	torus.inner_radius = 6.6
	torus.outer_radius = 7.4
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
	lbl.position = Vector3(center.x, b_size.y + 3.2, center.z)
	lbl.modulate = Color(1.0, 0.94, 0.70)
	lbl.outline_size = 8
	city_root.add_child(lbl)

	# Interaktionspunkt precis ute på gatan framför byggnaden
	pois[pkey] = {
		"pos": Vector3(center.x, 0.0, center.z + b_size.z * 0.5 + 3.0),
		"center": center,
		"name": title,
		"ring": ring,
		"label": lbl
	}

func get_spawn_pos(pkey: String) -> Vector3:
	if pois.has(pkey):
		return pois[pkey]["pos"]
	return Vector3(0, 1.0, 12.0)

func get_police_spawn_pos() -> Vector3:
	# Alltid långt från stationen (-2, 2) så inga instagripanden sker vid boarding!
	return Vector3(2.0 * BLOCK_STEP, 1.0, -2.0 * BLOCK_STEP + 9.0)

func _process(delta: float) -> void:
	var t := Time.get_ticks_msec() * 0.004
	for pkey in pois.keys():
		var r: MeshInstance3D = pois[pkey]["ring"]
		if is_instance_valid(r):
			var pulse := 1.0 + sin(t + hash(pkey) % 5) * 0.05
			r.scale = Vector3(pulse, 1.0, pulse)
			r.rotate_y(delta * 0.8)
