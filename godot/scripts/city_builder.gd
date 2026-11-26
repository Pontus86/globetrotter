extends Node3D

## Riktiga OpenStreetMap 3D-stadskartor för alla 18 europeiska städer!
## - Läser förbakade riktiga OSM-kartor (godot/data/maps/<city_id>.json) med 1:1 meterskala
## - Riktiga 3D-byggnadspolygoner med riktig höjd + ConcavePolygonShape3D-kollision (omöjligt att gå genom hus!)
## - Riktiga gator (boulevarder, lokalgator, broar), gatunamn, parker & floder (Seine, Themsen, Mälaren, Tibern m.fl.)
## - 5 glittrande POI-platser på sina riktiga geografiska platser i staden

var pois: Dictionary = {}
var city_root: Node3D
var current_city_id: String = ""
var city_bounds: Array[float] = [-400.0, 400.0, -400.0, 400.0]
var road_points: Array[Vector3] = []

const PALETTE := [
	Color(0.76, 0.44, 0.31), # Varmt tegelrödbrunt (webbens huvudfärg!)
	Color(0.69, 0.37, 0.26), # Klassiskt europeiskt tegel
	Color(0.81, 0.51, 0.36), # Ljus terrakotta
	Color(0.62, 0.32, 0.23), # Mörkt bränt tegel
	Color(0.73, 0.47, 0.34)  # Varm ockra-terrakotta
]

func build_city(city_id: String) -> void:
	current_city_id = city_id
	pois.clear()
	road_points.clear()
	if city_root != null:
		city_root.queue_free()
	city_root = Node3D.new()
	add_child(city_root)

	var city_data: Dictionary = GameState.cities.get(city_id, {})
	var map_path: String = "res://data/maps/%s.json" % city_id
	if FileAccess.file_exists(map_path):
		var f := FileAccess.open(map_path, FileAccess.READ)
		if f != null:
			var parsed = JSON.parse_string(f.get_as_text())
			if typeof(parsed) == TYPE_DICTIONARY:
				_build_osm_city(city_id, city_data, parsed)
				return

	# Fallback om en kartfil saknas
	_build_fallback_city(city_id, city_data)

func _build_osm_city(city_id: String, city_data: Dictionary, osm: Dictionary) -> void:
	var rng := RandomNumberGenerator.new()
	rng.seed = hash(city_id)

	var bnd: Array = osm.get("bounds", [-400, 400, -400, 400])
	var min_x: float = float(bnd[0])
	var max_x: float = float(bnd[1])
	var min_z: float = float(bnd[2])
	var max_z: float = float(bnd[3])
	city_bounds = [min_x, max_x, min_z, max_z]

	var width: float = (max_x - min_x) + 180.0
	var depth: float = (max_z - min_z) + 180.0
	var cx: float = (min_x + max_x) * 0.5
	var cz: float = (min_z + max_z) * 0.5

	# 1. Kartgrund (varm MapLibre Liberty-stil med mark-collider)
	var ground := StaticBody3D.new()
	var g_mesh := MeshInstance3D.new()
	var g_box := BoxMesh.new()
	g_box.size = Vector3(width, 2.0, depth)
	g_mesh.mesh = g_box
	g_mesh.position = Vector3(cx, -1.0, cz)
	var g_mat := StandardMaterial3D.new()
	g_mat.albedo_color = Color(0.82, 0.78, 0.71)
	g_mat.roughness = 0.96
	g_mesh.material_override = g_mat
	ground.add_child(g_mesh)

	var g_col := CollisionShape3D.new()
	var g_shape := BoxShape3D.new()
	g_shape.size = Vector3(width, 2.0, depth)
	g_col.shape = g_shape
	g_col.position = Vector3(cx, -1.0, cz)
	ground.add_child(g_col)
	city_root.add_child(ground)

	# 2. Riktiga Parker (gröna polygoner + 3D-träd!)
	var parks_arr: Array = osm.get("parks", [])
	if parks_arr.size() > 0:
		_build_flat_polygons(parks_arr, 0.08, Color(0.46, 0.68, 0.42), 0.92)
		_build_park_trees(parks_arr, rng)

	# 3. Riktigt Vatten & Floder (klarblått med havsglans!)
	var waters_arr: Array = osm.get("waters", [])
	if waters_arr.size() > 0:
		_build_flat_polygons(waters_arr, 0.14, Color(0.20, 0.52, 0.78), 0.18)

	# 4. Riktiga Gator, Boulevarder, Broar & Flodband
	var roads_arr: Array = osm.get("roads", [])
	_build_roads(roads_arr)

	# Samla POI-positioner först så vi kan rensa ev. överlappande hus vid spawn
	var osm_pois: Dictionary = osm.get("pois", {})
	var poi_clear_pts: Array[Vector2] = []
	for pk in ["landmark", "hub", "precinct", "hotel", "market", "library"]:
		if osm_pois.has(pk):
			var arr: Array = osm_pois[pk]
			poi_clear_pts.append(Vector2(float(arr[0]), float(arr[1])))

	# 5. Riktiga 3D-byggnader (sammanslagna per färgpalett + 1 snabb ConcavePolygonShape3D)
	var buildings_arr: Array = osm.get("buildings", [])
	_build_osm_buildings(buildings_arr, rng, poi_clear_pts)

	# 6. 5 glittrande POI-platser på sina verkliga koordinater
	var poi_defs := [
		["landmark", String(city_data.get("landmark", {}).get("name", "Sevärdhet")), Color(0.98, 0.80, 0.28)],
		["hub", String(city_data.get("hub", {}).get("name", "Centralstationen")), Color(0.26, 0.64, 0.94)],
		["hotel", "🏨 Grand Hotel", Color(0.86, 0.36, 0.52)],
		["market", "🛍️ Basar / Marknad", Color(0.26, 0.72, 0.46)],
		["library", "📚 Bibliotek", Color(0.56, 0.42, 0.82)]
	]
	for pd in poi_defs:
		var pkey: String = String(pd[0])
		var ptitle: String = String(pd[1])
		var pcol: Color = pd[2]
		var pt_arr: Array = osm_pois.get(pkey, [0.0, 0.0])
		var ppos := Vector3(float(pt_arr[0]), 0.0, float(pt_arr[1]))
		_add_osm_poi_marker(pkey, ptitle, ppos, pcol, city_id)

	# 7. Osynliga stadsmurar vid kartgränsen
	var margin: float = 12.0
	_add_invisible_wall(Vector3(cx, 15.0, min_z - margin), Vector3(width, 30.0, 4.0))
	_add_invisible_wall(Vector3(cx, 15.0, max_z + margin), Vector3(width, 30.0, 4.0))
	_add_invisible_wall(Vector3(min_x - margin, 15.0, cz), Vector3(4.0, 30.0, depth))
	_add_invisible_wall(Vector3(max_x + margin, 15.0, cz), Vector3(4.0, 30.0, depth))

func _build_flat_polygons(polys: Array, y_height: float, color: Color, rough: float) -> void:
	var st := SurfaceTool.new()
	st.begin(Mesh.PRIMITIVE_TRIANGLES)
	for poly_raw in polys:
		var poly: Array = poly_raw
		if poly.size() < 3:
			continue
		var pts2 := PackedVector2Array()
		for p in poly:
			pts2.append(Vector2(float(p[0]), float(p[1])))
		var tris: PackedInt32Array = Geometry2D.triangulate_polygon(pts2)
		if tris.size() < 3:
			continue
		for i in range(0, tris.size(), 3):
			var a: Vector2 = pts2[tris[i]]
			var b: Vector2 = pts2[tris[i + 1]]
			var c: Vector2 = pts2[tris[i + 2]]
			st.set_normal(Vector3.UP)
			st.add_vertex(Vector3(a.x, y_height, a.y))
			st.set_normal(Vector3.UP)
			st.add_vertex(Vector3(b.x, y_height, b.y))
			st.set_normal(Vector3.UP)
			st.add_vertex(Vector3(c.x, y_height, c.y))
	var mesh: ArrayMesh = st.commit()
	if mesh.get_surface_count() > 0:
		var mi := MeshInstance3D.new()
		mi.mesh = mesh
		var mat := StandardMaterial3D.new()
		mat.albedo_color = color
		mat.roughness = rough
		mat.cull_mode = BaseMaterial3D.CULL_DISABLED
		mi.material_override = mat
		city_root.add_child(mi)

func _build_roads(roads: Array) -> void:
	var st_minor := SurfaceTool.new()
	st_minor.begin(Mesh.PRIMITIVE_TRIANGLES)
	var st_major := SurfaceTool.new()
	st_major.begin(Mesh.PRIMITIVE_TRIANGLES)
	var st_bridge := SurfaceTool.new()
	st_bridge.begin(Mesh.PRIMITIVE_TRIANGLES)
	var st_river := SurfaceTool.new()
	st_river.begin(Mesh.PRIMITIVE_TRIANGLES)

	var labeled_names: Dictionary = {}
	var label_count: int = 0

	for r_raw in roads:
		var r: Dictionary = r_raw
		var pts: Array = r.get("pts", [])
		if pts.size() < 2:
			continue
		var w: float = float(r.get("w", 6.0))
		var b_type: int = int(r.get("b", 0))
		var r_name: String = String(r.get("n", ""))

		var target_st: SurfaceTool = st_minor
		var y_h: float = 0.14
		if b_type == 2:
			target_st = st_river
			y_h = 0.10
		elif b_type == 1:
			target_st = st_bridge
			y_h = 0.22
		elif w >= 9.0:
			target_st = st_major
			y_h = 0.17

		var half_w: float = w * 0.5
		for i in range(pts.size() - 1):
			var p0 := Vector2(float(pts[i][0]), float(pts[i][1]))
			var p1 := Vector2(float(pts[i + 1][0]), float(pts[i + 1][1]))
			if b_type != 2 and i == 0:
				road_points.append(Vector3(p0.x, 0.1, p0.y))
			var seg: Vector2 = p1 - p0
			var slen: float = seg.length()
			if slen < 0.2:
				continue
			var dir: Vector2 = seg / slen
			var perp := Vector2(-dir.y, dir.x) * half_w
			var v0 := Vector3(p0.x - perp.x, y_h, p0.y - perp.y)
			var v1 := Vector3(p0.x + perp.x, y_h, p0.y + perp.y)
			var v2 := Vector3(p1.x + perp.x, y_h, p1.y + perp.y)
			var v3 := Vector3(p1.x - perp.x, y_h, p1.y - perp.y)
			target_st.set_normal(Vector3.UP)
			target_st.add_vertex(v0)
			target_st.set_normal(Vector3.UP)
			target_st.add_vertex(v1)
			target_st.set_normal(Vector3.UP)
			target_st.add_vertex(v2)
			target_st.set_normal(Vector3.UP)
			target_st.add_vertex(v0)
			target_st.set_normal(Vector3.UP)
			target_st.add_vertex(v2)
			target_st.set_normal(Vector3.UP)
			target_st.add_vertex(v3)

		# Lägg till snygga gatunamn på större gator (som på webbkartan!)
		if b_type != 2 and r_name != "" and w >= 7.5 and not labeled_names.has(r_name) and label_count < 20:
			labeled_names[r_name] = true
			label_count += 1
			var mid_idx: int = int(pts.size() / 2)
			var mp: Array = pts[mid_idx]
			var slbl := Label3D.new()
			slbl.text = r_name
			slbl.rotation_degrees = Vector3(-90.0, 0.0, 0.0)
			slbl.font_size = 24
			slbl.pixel_size = 0.09
			slbl.position = Vector3(float(mp[0]), 0.45, float(mp[1]))
			slbl.modulate = Color(0.28, 0.24, 0.20, 0.88)
			slbl.outline_size = 4
			slbl.outline_modulate = Color(1.0, 0.98, 0.94, 0.9)
			city_root.add_child(slbl)

	_commit_surface(st_river, Color(0.20, 0.52, 0.78), 0.18)
	_commit_surface(st_minor, Color(0.36, 0.38, 0.42), 0.90)
	_commit_surface(st_major, Color(0.28, 0.30, 0.34), 0.88)
	_commit_surface(st_bridge, Color(0.68, 0.64, 0.58), 0.86)

func _build_park_trees(parks: Array, rng: RandomNumberGenerator) -> void:
	var tree_count: int = 0
	var trunk_mat := StandardMaterial3D.new()
	trunk_mat.albedo_color = Color(0.36, 0.25, 0.16)
	var leaf_mat := StandardMaterial3D.new()
	leaf_mat.albedo_color = Color(0.24, 0.52, 0.25)
	leaf_mat.roughness = 0.85

	for poly_raw in parks:
		if tree_count >= 55:
			break
		var poly: Array = poly_raw
		if poly.size() < 3:
			continue
		var sx: float = 0.0
		var sz: float = 0.0
		for p in poly:
			sx += float(p[0])
			sz += float(p[1])
		var cx: float = sx / float(poly.size())
		var cz: float = sz / float(poly.size())
		for _k in range(2):
			if tree_count >= 55:
				break
			var ox: float = rng.randf_range(-10.0, 10.0)
			var oz: float = rng.randf_range(-10.0, 10.0)
			var crown := MeshInstance3D.new()
			var sm := SphereMesh.new()
			sm.radius = rng.randf_range(3.2, 5.2)
			sm.height = sm.radius * 2.0
			crown.mesh = sm
			crown.position = Vector3(cx + ox, 5.5, cz + oz)
			crown.material_override = leaf_mat
			city_root.add_child(crown)
			tree_count += 1

func _commit_surface(st: SurfaceTool, color: Color, rough: float) -> void:
	var mesh: ArrayMesh = st.commit()
	if mesh.get_surface_count() > 0:
		var mi := MeshInstance3D.new()
		mi.mesh = mesh
		var mat := StandardMaterial3D.new()
		mat.albedo_color = color
		mat.roughness = rough
		mat.cull_mode = BaseMaterial3D.CULL_DISABLED
		mi.material_override = mat
		city_root.add_child(mi)

func _build_osm_buildings(buildings: Array, rng: RandomNumberGenerator, clear_pts: Array[Vector2]) -> void:
	var wall_sts: Array[SurfaceTool] = []
	var roof_sts: Array[SurfaceTool] = []
	for _i in range(PALETTE.size()):
		var ws := SurfaceTool.new()
		ws.begin(Mesh.PRIMITIVE_TRIANGLES)
		wall_sts.append(ws)
		var rs := SurfaceTool.new()
		rs.begin(Mesh.PRIMITIVE_TRIANGLES)
		roof_sts.append(rs)

	var col_faces := PackedVector3Array()

	for b_raw in buildings:
		var b: Dictionary = b_raw
		var pts: Array = b.get("pts", [])
		if pts.size() < 3:
			continue

		# Beräkna centrum och hoppa över byggnad om den ligger rakt på en POI-spawn
		var sx: float = 0.0
		var sz: float = 0.0
		var pts2 := PackedVector2Array()
		for p in pts:
			var vx: float = float(p[0])
			var vz: float = float(p[1])
			sx += vx
			sz += vz
			pts2.append(Vector2(vx, vz))
		var center2 := Vector2(sx / float(pts.size()), sz / float(pts.size()))

		var too_close: bool = false
		for cp in clear_pts:
			if center2.distance_to(cp) < 13.0:
				too_close = true
				break
		if too_close:
			continue

		var h: float = float(b.get("h", 0.0))
		if h <= 0.5:
			h = rng.randf_range(9.5, 20.5)
		var pal_idx: int = rng.randi() % PALETTE.size()
		var ws: SurfaceTool = wall_sts[pal_idx]
		var rs: SurfaceTool = roof_sts[pal_idx]

		# Extrudera väggar + samla kollisionstrianglar
		var n: int = pts2.size()
		for i in range(n):
			var a: Vector2 = pts2[i]
			var c: Vector2 = pts2[(i + 1) % n]
			var edge: Vector2 = c - a
			if edge.length_squared() < 0.04:
				continue
			var norm := Vector3(edge.y, 0.0, -edge.x).normalized()
			var v0 := Vector3(a.x, 0.0, a.y)
			var v1 := Vector3(c.x, 0.0, c.y)
			var v2 := Vector3(c.x, h, c.y)
			var v3 := Vector3(a.x, h, a.y)

			ws.set_normal(norm)
			ws.add_vertex(v0)
			ws.set_normal(norm)
			ws.add_vertex(v1)
			ws.set_normal(norm)
			ws.add_vertex(v2)

			ws.set_normal(norm)
			ws.add_vertex(v0)
			ws.set_normal(norm)
			ws.add_vertex(v2)
			ws.set_normal(norm)
			ws.add_vertex(v3)

			# Kollisionsvägg (höjd 8m räcker för CharacterBody3D!)
			var cv2 := Vector3(c.x, 8.0, c.y)
			var cv3 := Vector3(a.x, 8.0, a.y)
			col_faces.append(v0)
			col_faces.append(v1)
			col_faces.append(cv2)
			col_faces.append(v0)
			col_faces.append(cv2)
			col_faces.append(cv3)

		# Takpolygon
		var tris: PackedInt32Array = Geometry2D.triangulate_polygon(pts2)
		for i in range(0, tris.size(), 3):
			var ta: Vector2 = pts2[tris[i]]
			var tb: Vector2 = pts2[tris[i + 1]]
			var tc: Vector2 = pts2[tris[i + 2]]
			rs.set_normal(Vector3.UP)
			rs.add_vertex(Vector3(ta.x, h, ta.y))
			rs.set_normal(Vector3.UP)
			rs.add_vertex(Vector3(tb.x, h, tb.y))
			rs.set_normal(Vector3.UP)
			rs.add_vertex(Vector3(tc.x, h, tc.y))

	for idx in range(PALETTE.size()):
		var base_col: Color = PALETTE[idx]
		_commit_surface(wall_sts[idx], base_col, 0.80)
		_commit_surface(roof_sts[idx], base_col.darkened(0.28), 0.88)

	# 1 gemensam StaticBody3D med ConcavePolygonShape3D för ALLA hus i staden!
	if col_faces.size() >= 3:
		var sb := StaticBody3D.new()
		var cs := CollisionShape3D.new()
		var shape := ConcavePolygonShape3D.new()
		shape.backface_collision = true
		shape.set_faces(col_faces)
		cs.shape = shape
		sb.add_child(cs)
		city_root.add_child(sb)

func _add_osm_poi_marker(pkey: String, title: String, center: Vector3, col: Color, city_id: String) -> void:
	# Glittrande gyllene aura-ring direkt på gatan/torget!
	var ring := MeshInstance3D.new()
	var torus := TorusMesh.new()
	torus.inner_radius = 10.5
	torus.outer_radius = 12.2
	ring.mesh = torus
	ring.position = Vector3(center.x, 0.55, center.z)
	var rmat := StandardMaterial3D.new()
	rmat.albedo_color = Color(1.0, 0.88, 0.35, 0.90)
	rmat.emission_enabled = true
	rmat.emission = Color(1.0, 0.80, 0.20)
	rmat.emission_energy_multiplier = 1.8
	rmat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	ring.material_override = rmat
	city_root.add_child(ring)

	# Lysande pelare / ikoniskt 3D-monument (utan kollision så spelaren inte fastnar!)
	var top_y: float = 20.0
	if pkey == "landmark":
		top_y = _build_landmark_visual(city_id, center)
	else:
		var beacon := MeshInstance3D.new()
		var cyl := CylinderMesh.new()
		cyl.top_radius = 1.6
		cyl.bottom_radius = 2.8
		cyl.height = 14.0
		beacon.mesh = cyl
		beacon.position = Vector3(center.x, 7.0, center.z)
		var bmat := StandardMaterial3D.new()
		bmat.albedo_color = col
		bmat.emission_enabled = true
		bmat.emission = col * 0.55
		bmat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
		bmat.albedo_color.a = 0.82
		beacon.material_override = bmat
		city_root.add_child(beacon)
		top_y = 16.0

	var lbl := Label3D.new()
	lbl.text = title
	lbl.billboard = BaseMaterial3D.BILLBOARD_ENABLED
	lbl.font_size = 44
	lbl.pixel_size = 0.055
	lbl.position = Vector3(center.x, top_y + 6.0, center.z)
	lbl.modulate = Color(1.0, 0.94, 0.62)
	lbl.outline_size = 10
	city_root.add_child(lbl)

	pois[pkey] = {
		"pos": Vector3(center.x, 0.1, center.z),
		"center": center,
		"name": title,
		"ring": ring,
		"label": lbl
	}

func _build_landmark_visual(city_id: String, center: Vector3) -> float:
	var gold_mat := StandardMaterial3D.new()
	gold_mat.albedo_color = Color(0.98, 0.82, 0.30)
	gold_mat.emission_enabled = true
	gold_mat.emission = Color(0.55, 0.42, 0.10)
	gold_mat.metallic = 0.45
	gold_mat.roughness = 0.35

	if city_id == "paris":
		var iron := StandardMaterial3D.new()
		iron.albedo_color = Color(0.50, 0.42, 0.35)
		iron.metallic = 0.5
		var tiers := [[14.0, 10.0, 5.0], [9.5, 13.0, 16.5], [5.5, 14.0, 30.0], [2.0, 11.0, 42.5]]
		for t in tiers:
			var mi := MeshInstance3D.new()
			var bm := BoxMesh.new()
			bm.size = Vector3(float(t[0]), float(t[1]), float(t[0]))
			mi.mesh = bm
			mi.position = Vector3(center.x, float(t[2]), center.z)
			mi.material_override = iron
			city_root.add_child(mi)
		return 49.0
	elif city_id == "rome":
		var mi := MeshInstance3D.new()
		var cm := CylinderMesh.new()
		cm.top_radius = 10.0
		cm.bottom_radius = 10.8
		cm.height = 16.0
		mi.mesh = cm
		mi.position = Vector3(center.x, 8.0, center.z)
		mi.material_override = gold_mat
		city_root.add_child(mi)
		return 18.0
	else:
		var sp := MeshInstance3D.new()
		var cm := CylinderMesh.new()
		cm.top_radius = 0.6
		cm.bottom_radius = 4.2
		cm.height = 24.0
		sp.mesh = cm
		sp.position = Vector3(center.x, 12.0, center.z)
		sp.material_override = gold_mat
		city_root.add_child(sp)
		return 26.0

func _add_invisible_wall(pos: Vector3, sz: Vector3) -> void:
	var body := StaticBody3D.new()
	body.position = pos
	var col := CollisionShape3D.new()
	var shape := BoxShape3D.new()
	shape.size = sz
	col.shape = shape
	body.add_child(col)
	city_root.add_child(body)

func _build_fallback_city(city_id: String, city_data: Dictionary) -> void:
	var ground := StaticBody3D.new()
	var g_mesh := MeshInstance3D.new()
	var g_box := BoxMesh.new()
	g_box.size = Vector3(500.0, 2.0, 500.0)
	g_mesh.mesh = g_box
	g_mesh.position = Vector3(0.0, -1.0, 0.0)
	var g_mat := StandardMaterial3D.new()
	g_mat.albedo_color = Color(0.84, 0.82, 0.76)
	g_mesh.material_override = g_mat
	ground.add_child(g_mesh)
	var g_col := CollisionShape3D.new()
	var g_shape := BoxShape3D.new()
	g_shape.size = Vector3(500.0, 2.0, 500.0)
	g_col.shape = g_shape
	g_col.position = Vector3(0.0, -1.0, 0.0)
	ground.add_child(g_col)
	city_root.add_child(ground)

	_add_osm_poi_marker("landmark", String(city_data.get("landmark", {}).get("name", "Sevärdhet")), Vector3(0.0, 0.0, 0.0), Color(0.98, 0.80, 0.28), city_id)
	_add_osm_poi_marker("hub", String(city_data.get("hub", {}).get("name", "Centralstationen")), Vector3(-110.0, 0.0, 110.0), Color(0.26, 0.64, 0.94), city_id)
	_add_osm_poi_marker("hotel", "🏨 Grand Hotel", Vector3(110.0, 0.0, -80.0), Color(0.86, 0.36, 0.52), city_id)
	_add_osm_poi_marker("market", "🛍️ Basar / Marknad", Vector3(-110.0, 0.0, -110.0), Color(0.26, 0.72, 0.46), city_id)
	_add_osm_poi_marker("library", "📚 Bibliotek", Vector3(110.0, 0.0, 110.0), Color(0.56, 0.42, 0.82), city_id)

func get_spawn_pos(pkey: String) -> Vector3:
	if pois.has(pkey):
		return pois[pkey]["pos"]
	return Vector3(0.0, 0.1, 0.0)

func get_police_spawn_pos() -> Vector3:
	if pois.has("hotel"):
		return pois["hotel"]["pos"]
	if road_points.size() > 0:
		return road_points[randi() % road_points.size()]
	return Vector3(120.0, 0.1, -120.0)

func _process(delta: float) -> void:
	var t: float = float(Time.get_ticks_msec()) * 0.004
	for pkey in pois.keys():
		var r: MeshInstance3D = pois[pkey]["ring"]
		if is_instance_valid(r):
			var pulse: float = 1.0 + sin(t + float(hash(pkey) % 5)) * 0.06
			r.scale = Vector3(pulse, 1.0, pulse)
			r.rotate_y(delta * 0.8)
