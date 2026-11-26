extends Node3D

## Riktiga OpenStreetMap 3D-stadskartor för alla 18 europeiska städer!
## - Läser förbakade riktiga OSM-kartor (godot/data/maps/<city_id>.json) med 1:1 meterskala
## - Riktiga 3D-byggnadspolygoner med riktig höjd + ConcavePolygonShape3D-kollision (omöjligt att gå genom hus!)
## - Riktiga gator (boulevarder, lokalgator, broar), gatunamn, parker & floder (Seine, Themsen, Mälaren, Tibern m.fl.)
## - 5 glittrande POI-platser på sina riktiga geografiska platser i staden

const CHUNK_SIZE: float = 180.0
const CHUNK_LOAD_RADIUS: int = 2   # 5x5 chunks = 900x900m synfält runt spelaren!
const CHUNK_UNLOAD_RADIUS: int = 3 # Avlasta chunks >540m bort för 144 FPS
const CityLifeScript = preload("res://scripts/city_life.gd")

var pois: Dictionary = {}
var city_root: Node3D
var current_city_id: String = ""
var city_bounds: Array[float] = [-400.0, 400.0, -400.0, 400.0]
var road_points: Array[Vector3] = []
var wide_road_points: Array[Vector3] = []
var focus_target: Node3D
var chunk_data: Dictionary = {}      # Vector2i -> Array[Dictionary] (råa hus i chunken)
var loaded_chunks: Dictionary = {}   # Vector2i -> Node3D (byggd mesh + hitbox)
var chunk_clear_pts: Array[Vector2] = []
var building_polys_2d: Array[PackedVector2Array] = []
var chunk_seed: int = 0
var light_budget_elapsed: float = 0.0
var noir_facades: Array[Texture2D] = []
var facade_albedo_tex: Texture2D
var facade_emit_tex: Texture2D
var roof_tex: Texture2D
var fog_cloud_plane: MeshInstance3D

func _ready() -> void:
	_generate_noir_textures()
	for key in ["facade_brick", "facade_stone"]:
		var path: String = "res://assets/noir/" + key + ".png"
		if ResourceLoader.exists(path):
			noir_facades.append(load(path))
	if ResourceLoader.exists("res://assets/noir/roof_slate.png"):
		roof_tex = load("res://assets/noir/roof_slate.png")

func _generate_noir_textures() -> void:
	# 1. Realistisk europeisk sten-/tegelfasad (128x128px = ~16x16m): mörka glasfönster + få diskreta tända fönster!
	var img_a := Image.create(128, 128, false, Image.FORMAT_RGBA8)
	var img_e := Image.create(128, 128, false, Image.FORMAT_RGBA8)
	var trng := RandomNumberGenerator.new()
	trng.seed = 424242

	# Bas: realistisk sten-/putsstruktur med diskreta våningsskiften
	for y in range(128):
		var floor_band: bool = (y % 32) < 3
		var brick_line: bool = (y % 8) == 0
		for x in range(128):
			var n: float = trng.randf_range(-0.035, 0.035)
			var v: float = (0.80 if floor_band else (0.88 if brick_line else 0.94)) + n
			img_a.set_pixel(x, y, Color(v, v * 0.98, v * 0.96, 1.0))
			img_e.set_pixel(x, y, Color(0.0, 0.0, 0.0, 1.0))

	# 4 våningar x 4 realistiska fönster (mestadels mörkt glas, ~18% diskret varm belysning!)
	for row in range(4):
		for col in range(4):
			var lit: bool = trng.randf() < 0.18
			var warm: Color = Color(0.95, 0.84, 0.64) if trng.randf() < 0.8 else Color(0.80, 0.88, 0.96)
			var wx0: int = col * 32 + 10
			var wy0: int = row * 32 + 8
			for wy in range(wy0, wy0 + 15):
				for wx in range(wx0, wx0 + 12):
					if wy == wy0 or wy == wy0 + 14 or wx == wx0 or wx == wx0 + 11:
						img_a.set_pixel(wx, wy, Color(0.62, 0.60, 0.58, 1.0)) # Ljus stenkarm
					elif wy == wy0 + 7 or wx == wx0 + 6:
						img_a.set_pixel(wx, wy, Color(0.45, 0.44, 0.43, 1.0)) # Fönsterspröjs
					elif lit:
						img_a.set_pixel(wx, wy, Color(0.86, 0.78, 0.64, 1.0))
						img_e.set_pixel(wx, wy, warm * 0.45)
					else:
						img_a.set_pixel(wx, wy, Color(0.24, 0.28, 0.34, 1.0)) # Mörkt speglande glas

	img_a.generate_mipmaps()
	img_e.generate_mipmaps()
	facade_albedo_tex = ImageTexture.create_from_image(img_a)
	facade_emit_tex = ImageTexture.create_from_image(img_e)

	# 2. Realistisk europeisk taktegel-/zinkplåt-textur (ljus & tydlig, aldrig svart!)
	var img_r := Image.create(64, 64, false, Image.FORMAT_RGBA8)
	for y in range(64):
		var row_shade: float = 0.90 if (y % 8 < 2) else 1.0
		for x in range(64):
			var seam: float = 0.92 if (x % 12 == 0) else 1.0
			var rn: float = trng.randf_range(-0.03, 0.03)
			var rv: float = clampf(row_shade * seam + rn, 0.78, 1.0)
			img_r.set_pixel(x, y, Color(rv, rv * 0.96, rv * 0.94, 1.0))
	img_r.generate_mipmaps()
	roof_tex = ImageTexture.create_from_image(img_r)

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
	wide_road_points.clear()
	chunk_data.clear()
	loaded_chunks.clear()
	chunk_clear_pts.clear()
	building_polys_2d.clear()
	chunk_seed = hash(city_id)
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

	# 1. Kartgrund med RIKTIG högupplöst OpenStreetMap / Carto Voyager-karttextur!
	var ground := StaticBody3D.new()
	var g_col := CollisionShape3D.new()
	var g_shape := BoxShape3D.new()
	g_shape.size = Vector3(width + 300.0, 2.0, depth + 300.0)
	g_col.shape = g_shape
	g_col.position = Vector3(cx, -1.0, cz)
	ground.add_child(g_col)
	city_root.add_child(ground)

	var map_tex: Texture2D = _load_city_map_texture(city_id)
	if map_tex != null and osm.has("tile_bounds"):
		var tb: Array = osm["tile_bounds"]
		var tb_w: float = float(tb[1]) - float(tb[0])
		var tb_d: float = float(tb[3]) - float(tb[2])
		var tb_cx: float = (float(tb[0]) + float(tb[1])) * 0.5
		var tb_cz: float = (float(tb[2]) + float(tb[3])) * 0.5
		var plane_mi := MeshInstance3D.new()
		var pm := PlaneMesh.new()
		pm.size = Vector2(tb_w, tb_d)
		plane_mi.mesh = pm
		plane_mi.position = Vector3(tb_cx, 0.02, tb_cz)
		var pmat := StandardMaterial3D.new()
		pmat.shading_mode = BaseMaterial3D.SHADING_MODE_PER_PIXEL
		pmat.albedo_texture = map_tex
		# Film Noir skymningston på stadskartan (behaglig regntung kvällsblå)
		pmat.albedo_color = Color(0.32, 0.36, 0.38)
		pmat.roughness = 0.72
		pmat.texture_filter = BaseMaterial3D.TEXTURE_FILTER_LINEAR_WITH_MIPMAPS_ANISOTROPIC
		plane_mi.material_override = pmat
		city_root.add_child(plane_mi)

		# Samla road_points (särskilt breda gator w >= 7.0!) så man aldrig spawnar i hus eller trånga gränder!
		for r_raw in osm.get("roads", []):
			var r: Dictionary = r_raw
			var pts: Array = r.get("pts", [])
			var rw: float = float(r.get("w", 6.0))
			if int(r.get("b", 0)) != 2:
				for pt in pts:
					var vp := Vector3(float(pt[0]), 0.1, float(pt[1]))
					road_points.append(vp)
					if rw >= 7.0:
						wide_road_points.append(vp)
	else:
		# Fallback utan kartbild: rita vektorlager
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
		var parks_arr: Array = osm.get("parks", [])
		if parks_arr.size() > 0:
			_build_flat_polygons(parks_arr, 0.08, Color(0.46, 0.68, 0.42), 0.92)
		var waters_arr: Array = osm.get("waters", [])
		if waters_arr.size() > 0:
			_build_flat_polygons(waters_arr, 0.14, Color(0.20, 0.52, 0.78), 0.18)
		_build_roads(osm.get("roads", []))

	# Behåll ALLA riktiga OSM 3D-monument & building:part orörda (ingen rensning under landmark!)
	var osm_pois: Dictionary = osm.get("pois", {})
	var poi_clear_pts: Array[Vector2] = []

	# 5. Riktiga 3D-byggnader + building:part + relation-multipolygoner (Chunk-streamade 180x180m)
	var buildings_arr: Array = osm.get("buildings", [])
	_build_osm_buildings(buildings_arr, rng, poi_clear_pts)

	# 6. Alla 5 POI-platser kopplas till VERKLIGA 3D-byggnader / riktiga OSM-monument på kartan!
	var poi_defs := [
		["landmark", String(city_data.get("landmark", {}).get("name", "Sevärdhet")), Color(0.98, 0.80, 0.28)],
		["hub", String(city_data.get("hub", {}).get("name", "Centralstationen")), Color(0.35, 0.72, 0.98)],
		["hotel", "🏨 Grand Hotel", Color(0.92, 0.42, 0.54)],
		["market", "🛍️ Basar / Marknad", Color(0.32, 0.78, 0.50)],
		["library", "📚 Bibliotek", Color(0.66, 0.52, 0.92)]
	]
	var used_bldg_indices: Dictionary = {}
	for pd in poi_defs:
		var pkey: String = String(pd[0])
		var ptitle: String = String(pd[1])
		var pcol: Color = pd[2]
		var pt_arr: Array = osm_pois.get(pkey, [0.0, 0.0])
		var target_pos := Vector3(float(pt_arr[0]), 0.0, float(pt_arr[1]))
		var picked: Dictionary = _pick_nearest_real_building(target_pos, buildings_arr, used_bldg_indices)
		if not picked.is_empty():
			var bc: Vector2 = picked["center"]
			_add_osm_poi_marker(pkey, ptitle, Vector3(bc.x, 0.0, bc.y), pcol, city_id, picked)
		else:
			_add_osm_poi_marker(pkey, ptitle, target_pos, pcol, city_id, {})

	# 7. Osynliga stadsmurar vid kartgränsen
	var margin: float = 12.0
	_add_invisible_wall(Vector3(cx, 15.0, min_z - margin), Vector3(width, 30.0, 4.0))
	_add_invisible_wall(Vector3(cx, 15.0, max_z + margin), Vector3(width, 30.0, 4.0))
	_add_invisible_wall(Vector3(min_x - margin, 15.0, cz), Vector3(4.0, 30.0, depth))
	_add_invisible_wall(Vector3(max_x + margin, 15.0, cz), Vector3(4.0, 30.0, depth))

	# 8. Drivande Noir Fog-of-War-moln utanför de inladdade hus-chunksen!
	_build_fog_of_war_clouds()

	# 9. Levande stad: bilar med strålkastare, gående fotgängare och varma europeiska gatlyktor!
	var life: Node3D = CityLifeScript.new()
	city_root.add_child(life)
	life.populate_from_roads(osm.get("roads", []), city_id)

func _build_fog_of_war_clouds() -> void:
	fog_cloud_plane = MeshInstance3D.new()
	var pm := PlaneMesh.new()
	pm.size = Vector2(2400.0, 2400.0)
	fog_cloud_plane.mesh = pm
	fog_cloud_plane.position = Vector3(0.0, 28.0, 0.0)

	var sh := Shader.new()
	sh.code = """
shader_type spatial;
render_mode unshaded, blend_mix, depth_draw_never, cull_disabled;

uniform vec3 fog_color : source_color = vec3(0.10, 0.13, 0.20);
uniform float inner_radius = 290.0;
uniform float outer_radius = 520.0;

float cloud_noise(vec2 p, float t) {
	float n = sin(p.x * 0.012 + t * 0.18) * cos(p.y * 0.014 - t * 0.14);
	n += 0.5 * sin(p.x * 0.029 - t * 0.22 + p.y * 0.021);
	n += 0.25 * cos(p.x * 0.055 + p.y * 0.048 + t * 0.30);
	return n * 0.5 + 0.5;
}

void fragment() {
	vec2 local_xz = (UV - vec2(0.5)) * 2400.0;
	float dist = length(local_xz);
	float c = cloud_noise(local_xz, TIME);
	float noisy_dist = dist + (c - 0.5) * 95.0;
	float alpha = smoothstep(inner_radius, outer_radius, noisy_dist);
	ALBEDO = mix(fog_color * 0.85, fog_color * 1.25, c);
	ALPHA = clamp(alpha * 0.94, 0.0, 0.94);
}
"""
	var smat := ShaderMaterial.new()
	smat.shader = sh
	fog_cloud_plane.material_override = smat
	city_root.add_child(fog_cloud_plane)

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

func _load_city_map_texture(city_id: String) -> Texture2D:
	var res_path: String = "res://assets/maps/%s.jpg" % city_id
	if ResourceLoader.exists(res_path):
		var tex: Texture2D = load(res_path) as Texture2D
		if tex != null:
			return tex
	if FileAccess.file_exists(res_path):
		var img := Image.new()
		var err: Error = img.load(ProjectSettings.globalize_path(res_path))
		if err == OK:
			return ImageTexture.create_from_image(img)
	return null

func _commit_surface(st: SurfaceTool, color: Color, rough: float, use_vertex_color: bool = false) -> void:
	var mesh: ArrayMesh = st.commit()
	if mesh.get_surface_count() > 0:
		var mi := MeshInstance3D.new()
		mi.mesh = mesh
		var mat := StandardMaterial3D.new()
		if use_vertex_color:
			mat.vertex_color_use_as_albedo = true
		else:
			mat.albedo_color = color
		mat.roughness = rough
		mat.cull_mode = BaseMaterial3D.CULL_DISABLED
		mi.material_override = mat
		city_root.add_child(mi)

func _height_to_color(h: float) -> Color:
	# Realistisk europeisk sten- & tegelpalett i skymnings-noir (högre hus = mörkare sten/tegel!)
	var c0 := Color.html("#9c9082")  # 0m: varm kalksten
	var c10 := Color.html("#8c7968") # 10m: europeisk sandsten
	var c22 := Color.html("#7b6052") # 22m: klassiskt tegelrödbrunt
	var c40 := Color.html("#644e46") # 40m: mörkt rödbrunt tegel
	var c75 := Color.html("#4d5664") # 75m+: skiffergrå sten
	if h <= 10.0:
		return c0.lerp(c10, clampf(h / 10.0, 0.0, 1.0))
	elif h <= 22.0:
		return c10.lerp(c22, clampf((h - 10.0) / 12.0, 0.0, 1.0))
	elif h <= 40.0:
		return c22.lerp(c40, clampf((h - 22.0) / 18.0, 0.0, 1.0))
	else:
		return c40.lerp(c75, clampf((h - 40.0) / 35.0, 0.0, 1.0))

func _build_osm_buildings(buildings: Array, _rng: RandomNumberGenerator, clear_pts: Array[Vector2]) -> void:
	# Sortera in ALLA hus i 180x180m chunks så bara husen som syns runt spelaren byggs & renderas!
	chunk_data.clear()
	loaded_chunks.clear()
	building_polys_2d.clear()
	chunk_clear_pts = clear_pts.duplicate()

	for b_raw in buildings:
		var b: Dictionary = b_raw
		var pts: Array = b.get("pts", [])
		if pts.size() < 3:
			continue
		var poly2 := PackedVector2Array()
		for p in pts:
			poly2.append(Vector2(float(p[0]), float(p[1])))
		building_polys_2d.append(poly2)
		var fx: float = float(pts[0][0])
		var fz: float = float(pts[0][1])
		var ck := Vector2i(int(floorf(fx / CHUNK_SIZE)), int(floorf(fz / CHUNK_SIZE)))
		if not chunk_data.has(ck):
			chunk_data[ck] = []
		(chunk_data[ck] as Array).append(b)

	# Ladda direkt in de närmaste chunks runt startpunkten (0,0) så staden aldrig startar tom
	_update_building_chunks(Vector3.ZERO, 99)

func _build_single_chunk(ck: Vector2i) -> Node3D:
	var chunk_node := Node3D.new()
	var b_list: Array = chunk_data.get(ck, [])
	if b_list.is_empty():
		return chunk_node

	var rng := RandomNumberGenerator.new()
	rng.seed = chunk_seed ^ (ck.x * 73856093) ^ (ck.y * 19349663)

	var wall_surfaces: Array[SurfaceTool] = []
	var wall_counts: Array[int] = []
	for variant in range(maxi(1, noir_facades.size())):
		var surface := SurfaceTool.new()
		surface.begin(Mesh.PRIMITIVE_TRIANGLES)
		wall_surfaces.append(surface)
		wall_counts.append(0)
	var rs := SurfaceTool.new()
	rs.begin(Mesh.PRIMITIVE_TRIANGLES)
	var col_faces := PackedVector3Array()
	var entrance_count: int = 0

	for b_raw in b_list:
		var b: Dictionary = b_raw
		var pts: Array = b.get("pts", [])
		if pts.size() < 3:
			continue

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
		for cp in chunk_clear_pts:
			if center2.distance_to(cp) < 15.0 or Geometry2D.is_point_in_polygon(cp, pts2):
				too_close = true
				break
		if too_close:
			continue

		var min_h: float = float(b.get("mh", 0.0))
		var h: float = float(b.get("h", 0.0))
		if h <= min_h + 0.5:
			h = min_h + rng.randf_range(10.0, 24.0)
		var wall_variant: int = rng.randi_range(0, wall_surfaces.size() - 1)
		var ws: SurfaceTool = wall_surfaces[wall_variant]
		var building_seed: float = fposmod(center2.x * 0.1031 + center2.y * 0.11369, 1.0)
		ws.set_uv2(Vector2(building_seed, 0.0))
		var base_col: Color = _height_to_color(h)
		if not noir_facades.is_empty():
			base_col = Color.WHITE.darkened(rng.randf_range(0.0, 0.12))
		var col_bot: Color = base_col.darkened(0.24)
		var col_top: Color = base_col
		# Realistiska europeiska tak: varmt tegelrött eller patinerad zink/skiffer (aldrig kolsvart!)
		var roof_tint: Color = Color(0.56, 0.34, 0.27) if rng.randf() < 0.65 else Color(0.42, 0.45, 0.49)
		var col_roof: Color = base_col.lerp(roof_tint, 0.55)

		var n: int = pts2.size()
		for i in range(n):
			var a: Vector2 = pts2[i]
			var c: Vector2 = pts2[(i + 1) % n]
			var edge: Vector2 = c - a
			if edge.length_squared() < 0.04:
				continue
			var edge_len: float = edge.length()
			var u_rep: float = edge_len / 16.0
			var v_rep: float = (h - min_h) / 16.0
			var norm := Vector3(edge.y, 0.0, -edge.x).normalized()
			var v0 := Vector3(a.x, min_h, a.y)
			var v1 := Vector3(c.x, min_h, c.y)
			var v2 := Vector3(c.x, h, c.y)
			var v3 := Vector3(a.x, h, a.y)
			if entrance_count < 2 and i == 0 and min_h < 0.5 and edge_len > 8.0 and building_seed < 0.30:
				var midpoint := (a + c) * 0.5
				var outside: Vector3 = norm
				if Geometry2D.is_point_in_polygon(midpoint + Vector2(norm.x,norm.z), pts2):
					outside = -norm
				_add_noir_entrance(chunk_node, Vector3(midpoint.x, 3.2, midpoint.y) + outside * 0.8)
				entrance_count += 1

			wall_counts[wall_variant] += 3
			ws.set_normal(norm); ws.set_color(col_bot); ws.set_uv(Vector2(0.0, v_rep)); ws.add_vertex(v0)
			ws.set_normal(norm); ws.set_color(col_bot); ws.set_uv(Vector2(u_rep, v_rep)); ws.add_vertex(v1)
			ws.set_normal(norm); ws.set_color(col_top); ws.set_uv(Vector2(u_rep, 0.0)); ws.add_vertex(v2)

			wall_counts[wall_variant] += 3
			ws.set_normal(norm); ws.set_color(col_bot); ws.set_uv(Vector2(0.0, v_rep)); ws.add_vertex(v0)
			ws.set_normal(norm); ws.set_color(col_top); ws.set_uv(Vector2(u_rep, 0.0)); ws.add_vertex(v2)
			ws.set_normal(norm); ws.set_color(col_top); ws.set_uv(Vector2(0.0, 0.0)); ws.add_vertex(v3)

			# Lägg bara kollision på delar som når ner till marknivå (så man kan gå under brovalv & Eiffeltornets valv!)
			if min_h < 4.5:
				var cv0 := Vector3(a.x, 0.0, a.y)
				var cv1 := Vector3(c.x, 0.0, c.y)
				var cv2 := Vector3(c.x, 8.0, c.y)
				var cv3 := Vector3(a.x, 8.0, a.y)
				col_faces.append(cv0); col_faces.append(cv1); col_faces.append(cv2)
				col_faces.append(cv0); col_faces.append(cv2); col_faces.append(cv3)

		_build_noir_roof(rs, pts2, h, col_roof, building_seed)

	for variant in range(wall_surfaces.size()):
		if wall_counts[variant] == 0:
			continue
		var wmesh: ArrayMesh = wall_surfaces[variant].commit()
		if wmesh.get_surface_count() > 0:
			var wmi := MeshInstance3D.new()
			wmi.mesh = wmesh
			var wmat := StandardMaterial3D.new()
			wmat.vertex_color_use_as_albedo = true
			if not noir_facades.is_empty():
				wmat.albedo_texture = noir_facades[variant]
			elif facade_albedo_tex != null:
				wmat.albedo_texture = facade_albedo_tex
			if noir_facades.is_empty() and facade_emit_tex != null:
				wmat.emission_enabled = true
				wmat.emission_texture = facade_emit_tex
				wmat.emission = Color(0.96, 0.84, 0.62)
				wmat.emission_energy_multiplier = 0.48
			wmat.roughness = 0.84
			wmat.texture_filter = BaseMaterial3D.TEXTURE_FILTER_LINEAR_WITH_MIPMAPS_ANISOTROPIC
			wmat.cull_mode = BaseMaterial3D.CULL_DISABLED
			if not noir_facades.is_empty():
				var night_mat := ShaderMaterial.new()
				night_mat.shader = preload("res://assets/noir/window_lights.gdshader")
				night_mat.set_shader_parameter("facade", noir_facades[variant])
				wmi.material_override = night_mat
			else:
				wmi.material_override = wmat
			chunk_node.add_child(wmi)

	var rmesh: ArrayMesh = rs.commit()
	if rmesh.get_surface_count() > 0:
		var rmi := MeshInstance3D.new()
		rmi.mesh = rmesh
		var rmat := StandardMaterial3D.new()
		rmat.vertex_color_use_as_albedo = true
		if roof_tex != null:
			rmat.albedo_texture = roof_tex
		rmat.roughness = 0.88
		rmat.cull_mode = BaseMaterial3D.CULL_DISABLED
		rmi.material_override = rmat
		chunk_node.add_child(rmi)

	if col_faces.size() >= 3:
		var sb := StaticBody3D.new()
		var cs := CollisionShape3D.new()
		var shape := ConcavePolygonShape3D.new()
		shape.backface_collision = true
		shape.set_faces(col_faces)
		cs.shape = shape
		sb.add_child(cs)
		chunk_node.add_child(sb)

	return chunk_node

func _build_noir_roof(surface: SurfaceTool, footprint: PackedVector2Array, height: float, tint: Color, seed: float) -> void:
	# A raised inner ridge on convex footprints gives true hip roofs, no false
	# triangles across courtyards. Tall blocks/complex outlines retain flat roofs.
	# Ignore tiny facade recesses for the roof outline; deep courtyards remain flat.
	var hull := Geometry2D.convex_hull(footprint)
	if hull.size() > 1 and hull[0].is_equal_approx(hull[-1]):
		hull.remove_at(hull.size()-1)
	var original_area := _outline_area(footprint)
	var hull_area := _outline_area(hull)
	if hull_area > 0.0 and original_area / hull_area > 0.94:
		footprint = hull
	var convex := true
	var direction: float = 0.0
	var center := Vector2.ZERO
	var longest := Vector2.RIGHT
	var longest_length := 0.0
	for i in range(footprint.size()):
		center += footprint[i]
		var edge := footprint[(i+1)%footprint.size()] - footprint[i]
		var next := footprint[(i+2)%footprint.size()] - footprint[(i+1)%footprint.size()]
		var cross: float = edge.cross(next)
		if absf(cross) > 0.01:
			if direction != 0.0 and signf(cross) != direction:
				convex = false
			direction = signf(cross)
		if edge.length() > longest_length:
			longest_length = edge.length()
			longest = edge.normalized()
	center /= float(footprint.size())
	var half_width := 10000.0
	var half_length := 0.0
	for i in range(footprint.size()):
		var a := footprint[i]
		var b := footprint[(i+1)%footprint.size()]
		half_width = minf(half_width, center.distance_to(Geometry2D.get_closest_point_to_segment(center,a,b)))
		half_length = maxf(half_length, absf((a-center).dot(longest)))
	if convex and footprint.size() <= 16 and height < 48.0 and half_width > 2.5 and seed < 0.84:
		var rise := clampf(half_width * 0.65, 1.8, 7.0)
		var ridge_half := maxf(0.0, half_length - half_width * 1.3) * 0.5
		# Two clipped ridge endpoints stay inside the footprint.
		var end_a := center - longest * ridge_half
		var end_b := center + longest * ridge_half
		if not Geometry2D.is_point_in_polygon(end_a, footprint) or not Geometry2D.is_point_in_polygon(end_b, footprint):
			end_a = center
			end_b = center
		for i in range(footprint.size()):
			var a := footprint[i]
			var b := footprint[(i+1)%footprint.size()]
			var ra := end_a if (a-center).dot(longest) < 0 else end_b
			var rb := end_a if (b-center).dot(longest) < 0 else end_b
			_roof_triangle(surface, Vector3(a.x,height,a.y), Vector3(b.x,height,b.y), Vector3(rb.x,height+rise,rb.y), tint)
			if ra.distance_squared_to(rb) > 0.01:
				_roof_triangle(surface, Vector3(a.x,height,a.y), Vector3(rb.x,height+rise,rb.y), Vector3(ra.x,height+rise,ra.y), tint)
	else:
		var triangles := Geometry2D.triangulate_polygon(footprint)
		for i in range(0,triangles.size(),3):
			var a := footprint[triangles[i]]
			var b := footprint[triangles[i+1]]
			var c := footprint[triangles[i+2]]
			_roof_triangle(surface,Vector3(a.x,height,a.y),Vector3(b.x,height,b.y),Vector3(c.x,height,c.y),tint)

func _outline_area(points: PackedVector2Array) -> float:
	var area := 0.0
	for index in range(points.size()):
		area += points[index].cross(points[(index+1)%points.size()])
	return absf(area) * 0.5

func _roof_triangle(surface: SurfaceTool, a: Vector3, b: Vector3, c: Vector3, tint: Color) -> void:
	var normal := (b-a).cross(c-a).normalized()
	if normal.y < 0:
		normal = -normal
	for point in [a,b,c]:
		surface.set_normal(normal)
		surface.set_color(tint)
		surface.set_uv(Vector2(point.x, point.z) / 5.0)
		surface.add_vertex(point)

func _add_noir_entrance(parent: Node3D, position: Vector3) -> void:
	var light := OmniLight3D.new()
	light.position = position
	light.light_color = Color(1.0, 0.69, 0.34)
	light.light_energy = 2.2
	light.omni_range = 13.0
	light.shadow_enabled = false
	light.distance_fade_enabled = true
	light.distance_fade_begin = 90.0
	light.distance_fade_length = 50.0
	parent.add_child(light)
	light.add_to_group("noir_entrance_lights")
	var fixture := MeshInstance3D.new()
	var bulb := SphereMesh.new()
	bulb.radius = 0.18
	bulb.height = 0.36
	fixture.mesh = bulb
	fixture.position = position
	var material := StandardMaterial3D.new()
	material.albedo_color = Color(0.9,0.65,0.3)
	material.emission_enabled = true
	material.emission = Color(1.0,0.60,0.20)
	material.emission_energy_multiplier = 1.7
	fixture.material_override = material
	parent.add_child(fixture)

func _update_noir_light_budget() -> void:
	if not is_instance_valid(focus_target):
		return
	var lights: Array[Node] = get_tree().get_nodes_in_group("noir_entrance_lights")
	lights.sort_custom(func(a, b): return a.global_position.distance_squared_to(focus_target.global_position) < b.global_position.distance_squared_to(focus_target.global_position))
	for index in range(lights.size()):
		lights[index].visible = index < 8 and lights[index].global_position.distance_squared_to(focus_target.global_position) < 19600.0

func _update_building_chunks(center_pos: Vector3, max_build_per_frame: int = 2) -> void:
	if chunk_data.is_empty() or city_root == null:
		return
	var pc := Vector2i(int(floorf(center_pos.x / CHUNK_SIZE)), int(floorf(center_pos.z / CHUNK_SIZE)))

	# Avlasta chunks som hamnat långt utanför synfältet
	var to_unload: Array[Vector2i] = []
	for ck_raw in loaded_chunks.keys():
		var ck: Vector2i = ck_raw
		if absi(ck.x - pc.x) > CHUNK_UNLOAD_RADIUS or absi(ck.y - pc.y) > CHUNK_UNLOAD_RADIUS:
			to_unload.append(ck)
	for ck in to_unload:
		var nd: Node3D = loaded_chunks[ck]
		if is_instance_valid(nd):
			nd.queue_free()
		loaded_chunks.erase(ck)

	# Ladda in synliga chunks runt spelaren (max 2/frame för 0 lagg!)
	var built_now: int = 0
	for dx in range(-CHUNK_LOAD_RADIUS, CHUNK_LOAD_RADIUS + 1):
		for dz in range(-CHUNK_LOAD_RADIUS, CHUNK_LOAD_RADIUS + 1):
			var ck := Vector2i(pc.x + dx, pc.y + dz)
			if chunk_data.has(ck) and not loaded_chunks.has(ck):
				var nd: Node3D = _build_single_chunk(ck)
				city_root.add_child(nd)
				loaded_chunks[ck] = nd
				built_now += 1
				if built_now >= max_build_per_frame:
					return

func _pick_nearest_real_building(target: Vector3, buildings: Array, used: Dictionary) -> Dictionary:
	var t2 := Vector2(target.x, target.z)
	var best_idx: int = -1
	var best_d: float = 1e12
	var best_center := Vector2.ZERO
	var best_h: float = 18.0
	var best_pts: Array = []

	for i in range(buildings.size()):
		if used.has(i):
			continue
		var b: Dictionary = buildings[i]
		var pts: Array = b.get("pts", [])
		if pts.size() < 3:
			continue
		var sx: float = 0.0
		var sz: float = 0.0
		for p in pts:
			sx += float(p[0])
			sz += float(p[1])
		var c2 := Vector2(sx / float(pts.size()), sz / float(pts.size()))
		var d: float = t2.distance_squared_to(c2)
		if d < best_d:
			best_d = d
			best_idx = i
			best_center = c2
			best_h = float(b.get("h", 0.0))
			if best_h <= 0.5:
				best_h = 18.0
			best_pts = pts

	if best_idx >= 0 and best_d < 220.0 * 220.0:
		used[best_idx] = true
		return { "idx": best_idx, "center": best_center, "h": best_h, "pts": best_pts }
	return {}

func _highlight_real_poi_building(pts: Array, h: float, col: Color) -> void:
	# Lägg en snygg gyllene/färgad skymnings-glödram runt det verkliga 3D-husets takkant så det tydligt syns som Hotell/Bibliotek/Marknad/Station!
	var st := SurfaceTool.new()
	st.begin(Mesh.PRIMITIVE_TRIANGLES)
	var n: int = pts.size()
	var y_bot: float = maxf(0.4, h - 1.4)
	var y_top: float = h + 0.55
	for i in range(n):
		var a := Vector2(float(pts[i][0]), float(pts[i][1]))
		var c := Vector2(float(pts[(i + 1) % n][0]), float(pts[(i + 1) % n][1]))
		var edge: Vector2 = c - a
		if edge.length_squared() < 0.04:
			continue
		var norm := Vector3(edge.y, 0.0, -edge.x).normalized()
		var off: Vector3 = norm * 0.25
		var v0 := Vector3(a.x, y_bot, a.y) + off
		var v1 := Vector3(c.x, y_bot, c.y) + off
		var v2 := Vector3(c.x, y_top, c.y) + off
		var v3 := Vector3(a.x, y_top, a.y) + off
		st.set_normal(norm); st.add_vertex(v0)
		st.set_normal(norm); st.add_vertex(v1)
		st.set_normal(norm); st.add_vertex(v2)
		st.set_normal(norm); st.add_vertex(v0)
		st.set_normal(norm); st.add_vertex(v2)
		st.set_normal(norm); st.add_vertex(v3)
	var m: ArrayMesh = st.commit()
	if m.get_surface_count() > 0:
		var mi := MeshInstance3D.new()
		mi.mesh = m
		var mat := StandardMaterial3D.new()
		mat.albedo_color = col
		mat.emission_enabled = true
		mat.emission = col
		mat.emission_energy_multiplier = 1.4
		mat.cull_mode = BaseMaterial3D.CULL_DISABLED
		mi.material_override = mat
		city_root.add_child(mi)

func _add_osm_poi_marker(pkey: String, title: String, center: Vector3, col: Color, city_id: String, real_bldg: Dictionary = {}) -> void:
	# Diskret glittrande gyllene markring runt själva byggnaden
	var ring := MeshInstance3D.new()
	var torus := TorusMesh.new()
	torus.inner_radius = 13.0
	torus.outer_radius = 14.5
	ring.mesh = torus
	ring.position = Vector3(center.x, 0.55, center.z)
	var rmat := StandardMaterial3D.new()
	rmat.albedo_color = Color(col.r, col.g, col.b, 0.78)
	rmat.emission_enabled = true
	rmat.emission = col
	rmat.emission_energy_multiplier = 1.3
	rmat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	ring.material_override = rmat
	city_root.add_child(ring)

	var top_y: float = 22.0
	if not real_bldg.is_empty():
		# Använd det VERKLIGA OSM 3D-monumentet / 3D-huset (Colosseum, Sagrada Família, Stadshuset, Hotell, Bibliotek...)!
		top_y = float(real_bldg["h"]) + 4.0
		_highlight_real_poi_building(real_bldg["pts"], float(real_bldg["h"]), col)
	elif pkey == "landmark":
		top_y = _build_landmark_visual(city_id, center)
	else:
		if pkey == "hub":
			top_y = _build_station_building(center)
		elif pkey == "hotel":
			top_y = _build_hotel_building(center)
		elif pkey == "market":
			top_y = _build_market_building(center)
		elif pkey == "library":
			top_y = _build_library_building(center)

	# Varmt kvällsljus som lyser upp landmärket/byggnaden i Noir-skymningen
	var poi_light := OmniLight3D.new()
	poi_light.position = Vector3(center.x, top_y + 4.0, center.z)
	poi_light.light_color = Color(1.0, 0.86, 0.55)
	poi_light.light_energy = 1.4
	poi_light.omni_range = 44.0
	city_root.add_child(poi_light)

	var lbl := Label3D.new()
	lbl.text = NoirVisuals.clean(title)
	lbl.billboard = BaseMaterial3D.BILLBOARD_ENABLED
	lbl.font_size = 44
	lbl.pixel_size = 0.055
	lbl.position = Vector3(center.x, top_y + 8.0, center.z)
	lbl.modulate = Color(1.0, 0.94, 0.62)
	lbl.outline_size = 10
	city_root.add_child(lbl)
	var symbol := Sprite3D.new()
	symbol.texture = NoirVisuals.icon(pkey)
	symbol.billboard = BaseMaterial3D.BILLBOARD_ENABLED
	symbol.pixel_size = 0.10
	symbol.position = Vector3(center.x, top_y + 14.0, center.z)
	symbol.modulate = Color("d2be8b")
	city_root.add_child(symbol)

	pois[pkey] = {
		"pos": Vector3(center.x, 0.1, center.z),
		"center": center,
		"name": title,
		"ring": ring,
		"label": lbl
	}

func _poi_mat(col: Color, emit: Color = Color.BLACK, rough: float = 0.7) -> StandardMaterial3D:
	var m := StandardMaterial3D.new()
	m.albedo_color = col
	m.roughness = rough
	if emit != Color.BLACK:
		m.emission_enabled = true
		m.emission = emit
		m.emission_energy_multiplier = 1.3
	return m

func _add_box(pos: Vector3, sz: Vector3, mat: StandardMaterial3D) -> void:
	var mi := MeshInstance3D.new()
	var bm := BoxMesh.new()
	bm.size = sz
	mi.mesh = bm
	mi.position = pos
	mi.material_override = mat
	city_root.add_child(mi)

func _add_cyl(pos: Vector3, r_top: float, r_bot: float, h: float, mat: StandardMaterial3D) -> void:
	var mi := MeshInstance3D.new()
	var cm := CylinderMesh.new()
	cm.top_radius = r_top
	cm.bottom_radius = r_bot
	cm.height = h
	mi.mesh = cm
	mi.position = pos
	mi.material_override = mat
	city_root.add_child(mi)

func _build_station_building(c: Vector3) -> float:
	# Europeisk Centralstation med välvd hall, klocktorn & lysande fönster
	var stone := _poi_mat(Color(0.45, 0.42, 0.40))
	var glass := _poi_mat(Color(0.32, 0.56, 0.72), Color(0.45, 0.72, 0.95) * 0.45, 0.25)
	var gold := _poi_mat(Color(0.95, 0.80, 0.35), Color(0.85, 0.68, 0.25) * 0.5, 0.4)
	_add_box(c + Vector3(0.0, 5.5, 0.0), Vector3(18.0, 11.0, 12.0), stone)
	_add_cyl(c + Vector3(0.0, 11.2, 0.0), 5.6, 5.6, 17.0, glass) # Välvt glastak (stående som takkupol)
	_add_box(c + Vector3(-6.5, 11.0, 4.5), Vector3(4.5, 22.0, 4.5), stone) # Klocktorn
	_add_box(c + Vector3(-6.5, 18.0, 6.85), Vector3(2.4, 2.4, 0.3), gold) # Lysande stationsklocka
	return 23.0

func _build_hotel_building(c: Vector3) -> float:
	# Ståtligt Grand Hotel med mörkröd baldakin, lysande fönster & takkupol
	var wall := _poi_mat(Color(0.62, 0.48, 0.42))
	var win := _poi_mat(Color(1.0, 0.86, 0.50), Color(1.0, 0.78, 0.35) * 0.75)
	var roof := _poi_mat(Color(0.18, 0.28, 0.30))
	var canopy := _poi_mat(Color(0.68, 0.14, 0.20), Color(0.45, 0.08, 0.12))
	_add_box(c + Vector3(0.0, 9.0, 0.0), Vector3(15.0, 18.0, 13.0), wall)
	_add_box(c + Vector3(0.0, 19.2, 0.0), Vector3(15.8, 2.6, 13.8), roof)
	_add_cyl(c + Vector3(0.0, 22.0, 0.0), 1.5, 4.2, 4.0, roof)
	_add_box(c + Vector3(0.0, 3.0, 7.6), Vector3(6.0, 1.2, 3.0), canopy) # Entrébaldakin
	for fy in [6.0, 10.5, 15.0]:
		for fx in [-4.5, 0.0, 4.5]:
			_add_box(c + Vector3(float(fx), float(fy), 6.65), Vector3(2.0, 2.2, 0.2), win)
	return 25.0

func _build_market_building(c: Vector3) -> float:
	# Basar / Marknadstorg med flera färgglada stånd & varma lyktor
	var base := _poi_mat(Color(0.35, 0.32, 0.28))
	var tent1 := _poi_mat(Color(0.76, 0.24, 0.20))
	var tent2 := _poi_mat(Color(0.18, 0.55, 0.38))
	var tent3 := _poi_mat(Color(0.84, 0.62, 0.22))
	var lamp := _poi_mat(Color(1.0, 0.88, 0.48), Color(1.0, 0.80, 0.32))
	_add_box(c + Vector3(0.0, 0.5, 0.0), Vector3(18.0, 1.0, 16.0), base)
	var stalls := [[-5.0, -4.0, tent1], [5.0, -4.0, tent2], [-5.0, 4.0, tent3], [5.0, 4.0, tent1]]
	for st in stalls:
		var sx: float = float(st[0])
		var sz: float = float(st[1])
		_add_box(c + Vector3(sx, 2.5, sz), Vector3(6.5, 3.5, 5.2), base)
		_add_cyl(c + Vector3(sx, 6.0, sz), 0.6, 4.8, 3.5, st[2])
		_add_box(c + Vector3(sx, 4.3, sz + 2.7), Vector3(1.2, 0.8, 0.4), lamp)
	return 11.0

func _build_library_building(c: Vector3) -> float:
	# Neoklassiskt Bibliotek med kolonner, tempelgavel & varmt läsljus
	var marble := _poi_mat(Color(0.72, 0.68, 0.62))
	var glow := _poi_mat(Color(1.0, 0.86, 0.54), Color(0.95, 0.76, 0.38) * 0.65)
	_add_box(c + Vector3(0.0, 1.0, 0.0), Vector3(18.0, 2.0, 14.0), marble) # Trappa
	_add_box(c + Vector3(0.0, 7.5, -1.0), Vector3(15.5, 11.0, 10.0), marble)
	_add_box(c + Vector3(0.0, 7.0, 4.1), Vector3(9.0, 7.0, 0.3), glow) # Varmt ljus inifrån
	for cx in [-6.5, -3.2, 0.0, 3.2, 6.5]:
		_add_cyl(c + Vector3(float(cx), 7.5, 5.6), 0.75, 0.85, 11.0, marble) # Kolonner
	_add_box(c + Vector3(0.0, 14.0, 1.0), Vector3(17.5, 2.2, 13.0), marble)
	_add_cyl(c + Vector3(0.0, 17.5, -0.5), 1.0, 5.2, 5.0, _poi_mat(Color(0.28, 0.44, 0.42))) # Kuppeltak
	return 21.0

func _build_landmark_visual(city_id: String, center: Vector3) -> float:
	var gold := _poi_mat(Color(0.96, 0.80, 0.32), Color(0.70, 0.52, 0.14), 0.35)
	var stone := _poi_mat(Color(0.74, 0.66, 0.56))
	var dark_stone := _poi_mat(Color(0.46, 0.40, 0.36))
	var warm_glow := _poi_mat(Color(1.0, 0.86, 0.48), Color(1.0, 0.78, 0.32) * 0.85)

	if city_id == "barcelona":
		# SAGRADA FAMÍLIA: katedralbas + 4 höga ikoniska tornspiror + högsta centraltornet med gyllene topp!
		var sand := _poi_mat(Color(0.76, 0.62, 0.46))
		_add_box(center + Vector3(0.0, 8.0, 0.0), Vector3(20.0, 16.0, 16.0), sand)
		_add_box(center + Vector3(0.0, 6.5, 8.1), Vector3(6.0, 9.0, 0.4), warm_glow) # Upplyst portal
		# 4 ikoniska fasadtorn + 4 bakre torn
		for ox in [-7.2, -2.8, 2.8, 7.2]:
			_add_cyl(center + Vector3(float(ox), 24.0, 5.2), 0.55, 2.1, 32.0, sand)
			_add_cyl(center + Vector3(float(ox), 41.2, 5.2), 0.2, 0.9, 2.8, gold)
		for ox2 in [-5.8, 5.8]:
			_add_cyl(center + Vector3(float(ox2), 21.0, -5.2), 0.55, 2.0, 26.0, sand)
		# Högsta centrala Jesus-tornet med lysande kors
		_add_cyl(center + Vector3(0.0, 28.0, 0.0), 1.0, 4.2, 42.0, sand)
		_add_box(center + Vector3(0.0, 51.0, 0.0), Vector3(1.2, 5.0, 1.2), gold)
		_add_box(center + Vector3(0.0, 52.0, 0.0), Vector3(3.8, 1.1, 1.1), gold)
		return 55.0
	elif city_id == "paris":
		# EIFFELTORNET: 4 ben, 3 plattformar & hög spira
		var iron := _poi_mat(Color(0.42, 0.36, 0.31), Color(0.28, 0.20, 0.08), 0.45)
		for lx in [-6.0, 6.0]:
			for lz in [-6.0, 6.0]:
				_add_box(center + Vector3(float(lx), 6.0, float(lz)), Vector3(3.4, 12.0, 3.4), iron)
		_add_box(center + Vector3(0.0, 13.0, 0.0), Vector3(15.5, 2.5, 15.5), iron)
		_add_cyl(center + Vector3(0.0, 22.0, 0.0), 4.2, 7.2, 16.0, iron)
		_add_box(center + Vector3(0.0, 30.5, 0.0), Vector3(9.5, 2.0, 9.5), iron)
		_add_cyl(center + Vector3(0.0, 44.0, 0.0), 1.1, 4.0, 26.0, iron)
		_add_cyl(center + Vector3(0.0, 60.0, 0.0), 0.2, 0.6, 8.0, gold)
		return 65.0
	elif city_id == "rome":
		# COLOSSEUM: stor rund flervånings-stenarena med varmt ljus inifrån
		_add_cyl(center + Vector3(0.0, 8.0, 0.0), 13.5, 14.2, 16.0, stone)
		_add_cyl(center + Vector3(0.0, 16.5, 0.0), 13.2, 13.5, 2.0, dark_stone)
		_add_cyl(center + Vector3(0.0, 8.5, 0.0), 9.5, 9.5, 16.6, warm_glow)
		return 20.0
	elif city_id == "london":
		# BIG BEN (Elizabeth Tower): gotiskt klocktorn + 4 lysande urtavlor + spira
		_add_box(center + Vector3(0.0, 18.0, 0.0), Vector3(9.0, 36.0, 9.0), stone)
		_add_box(center + Vector3(0.0, 31.0, 4.65), Vector3(4.8, 4.8, 0.3), warm_glow)
		_add_box(center + Vector3(0.0, 31.0, -4.65), Vector3(4.8, 4.8, 0.3), warm_glow)
		_add_box(center + Vector3(4.65, 31.0, 0.0), Vector3(0.3, 4.8, 4.8), warm_glow)
		_add_box(center + Vector3(-4.65, 31.0, 0.0), Vector3(0.3, 4.8, 4.8), warm_glow)
		_add_cyl(center + Vector3(0.0, 43.0, 0.0), 0.3, 5.8, 14.0, dark_stone)
		_add_cyl(center + Vector3(0.0, 51.5, 0.0), 0.15, 0.5, 4.0, gold)
		return 54.0
	elif city_id == "stockholm":
		# STOCKHOLMS STADSHUS: rött tegelpalats + högt torn med gyllene Tre Kronor!
		var brick := _poi_mat(Color(0.58, 0.24, 0.19))
		_add_box(center + Vector3(0.0, 7.0, 0.0), Vector3(20.0, 14.0, 14.0), brick)
		_add_box(center + Vector3(7.5, 21.0, -4.5), Vector3(5.8, 42.0, 5.8), brick)
		_add_cyl(center + Vector3(7.5, 44.0, -4.5), 1.8, 2.2, 4.5, gold)
		var crown := MeshInstance3D.new()
		var sm := SphereMesh.new()
		sm.radius = 2.0
		sm.height = 4.0
		crown.mesh = sm
		crown.position = center + Vector3(7.5, 47.5, -4.5)
		crown.material_override = gold
		city_root.add_child(crown)
		return 50.0
	elif city_id == "istanbul":
		# HAGIA SOFIA: stor kupol + 4 smala minareter
		var terra := _poi_mat(Color(0.72, 0.52, 0.42))
		_add_box(center + Vector3(0.0, 8.0, 0.0), Vector3(18.0, 16.0, 18.0), terra)
		var dome := MeshInstance3D.new()
		var sm := SphereMesh.new()
		sm.radius = 8.5
		sm.height = 14.0
		dome.mesh = sm
		dome.position = center + Vector3(0.0, 17.5, 0.0)
		dome.material_override = dark_stone
		city_root.add_child(dome)
		for mx in [-10.0, 10.0]:
			for mz in [-10.0, 10.0]:
				_add_cyl(center + Vector3(float(mx), 19.0, float(mz)), 0.7, 1.3, 38.0, stone)
				_add_cyl(center + Vector3(float(mx), 40.0, float(mz)), 0.1, 0.9, 5.0, gold)
		return 44.0
	elif city_id == "berlin":
		# BRANDENBURGER TOR: 6 kolonner + bred attika + gyllene Quadriga
		for kx in [-7.5, -4.5, -1.5, 1.5, 4.5, 7.5]:
			_add_cyl(center + Vector3(float(kx), 7.5, 0.0), 0.9, 1.0, 15.0, stone)
		_add_box(center + Vector3(0.0, 16.5, 0.0), Vector3(19.0, 3.5, 6.0), stone)
		_add_box(center + Vector3(0.0, 20.0, 0.0), Vector3(8.0, 3.5, 3.0), gold)
		return 24.0
	elif city_id == "athens":
		# PARTHENON / AKROPOLIS: klassiskt grekiskt tempel med kolonnrad
		_add_box(center + Vector3(0.0, 1.5, 0.0), Vector3(20.0, 3.0, 14.0), stone)
		for px in [-8.0, -4.8, -1.6, 1.6, 4.8, 8.0]:
			_add_cyl(center + Vector3(float(px), 8.5, 5.2), 0.75, 0.9, 11.0, stone)
			_add_cyl(center + Vector3(float(px), 8.5, -5.2), 0.75, 0.9, 11.0, stone)
		_add_box(center + Vector3(0.0, 15.0, 0.0), Vector3(19.5, 2.2, 13.0), stone)
		return 19.0
	else:
		# Ståtligt europeiskt katedral-/palatsmonument med tvillingtorn & kupol
		_add_box(center + Vector3(0.0, 8.0, 0.0), Vector3(16.0, 16.0, 14.0), stone)
		_add_cyl(center + Vector3(-6.2, 18.0, 4.5), 1.4, 2.4, 24.0, stone)
		_add_cyl(center + Vector3(6.2, 18.0, 4.5), 1.4, 2.4, 24.0, stone)
		_add_cyl(center + Vector3(-6.2, 32.0, 4.5), 0.2, 1.6, 6.0, gold)
		_add_cyl(center + Vector3(6.2, 32.0, 4.5), 0.2, 1.6, 6.0, gold)
		_add_box(center + Vector3(0.0, 7.0, 7.2), Vector3(5.0, 8.0, 0.4), warm_glow)
		return 36.0

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

func _is_point_blocked_by_building(pt: Vector2) -> bool:
	# Kolla både exakt punkt och 8 punkter i 4.5m radie så man aldrig hamnar i hus eller trång gränd!
	var offsets := [
		Vector2.ZERO,
		Vector2(4.5, 0.0), Vector2(-4.5, 0.0), Vector2(0.0, 4.5), Vector2(0.0, -4.5),
		Vector2(3.2, 3.2), Vector2(-3.2, 3.2), Vector2(3.2, -3.2), Vector2(-3.2, -3.2)
	]
	for poly in building_polys_2d:
		for off in offsets:
			if Geometry2D.is_point_in_polygon(pt + off, poly):
				return true
	return false

func _find_nearest_free_street(target: Vector3) -> Vector3:
	var best_pt := Vector3(target.x, 0.1, target.z)
	var best_d: float = 1e12
	var t2 := Vector2(target.x, target.z)

	# 1. Föredra BREDA huvudgator (w >= 7m) närmast målet som garanterat har gott om utrymme!
	for rp in wide_road_points:
		var rp2 := Vector2(rp.x, rp.z)
		var d: float = t2.distance_squared_to(rp2)
		if d < best_d and d > 25.0:
			if not _is_point_blocked_by_building(rp2):
				best_d = d
				best_pt = Vector3(rp.x, 0.1, rp.z)
	if best_d < 1e11:
		return best_pt

	# 2. Annars valfri gata med fri 4.5m-radie
	for rp in road_points:
		var rp2 := Vector2(rp.x, rp.z)
		var d: float = t2.distance_squared_to(rp2)
		if d < best_d and d > 25.0:
			if not _is_point_blocked_by_building(rp2):
				best_d = d
				best_pt = Vector3(rp.x, 0.1, rp.z)
	if best_d < 1e11:
		return best_pt

	# 3. Fallback: spiral utåt tills fri gata hittas
	for r in [16.0, 26.0, 38.0, 52.0]:
		for ang_i in range(16):
			var a: float = float(ang_i) * (TAU / 16.0)
			var cand := Vector2(target.x + cos(a) * float(r), target.z + sin(a) * float(r))
			if not _is_point_blocked_by_building(cand):
				return Vector3(cand.x, 0.1, cand.y)
	return Vector3(target.x, 0.1, target.z)

func get_spawn_pos(pkey: String) -> Vector3:
	if pois.has(pkey):
		var c: Vector3 = pois[pkey]["center"]
		return _find_nearest_free_street(c)
	return _find_nearest_free_street(Vector3.ZERO)

func get_police_spawn_pos() -> Vector3:
	if pois.has("hotel"):
		return _find_nearest_free_street(pois["hotel"]["center"])
	if road_points.size() > 0:
		return _find_nearest_free_street(road_points[randi() % road_points.size()])
	return Vector3(120.0, 0.1, -120.0)

func _process(delta: float) -> void:
	light_budget_elapsed += delta
	if light_budget_elapsed > 0.25:
		light_budget_elapsed = 0.0
		_update_noir_light_budget()
	if is_visible_in_tree() and focus_target != null:
		if not chunk_data.is_empty():
			_update_building_chunks(focus_target.global_position, 2)
		if is_instance_valid(fog_cloud_plane):
			fog_cloud_plane.position = Vector3(focus_target.global_position.x, 28.0, focus_target.global_position.z)
	var t: float = float(Time.get_ticks_msec()) * 0.004
	for pkey in pois.keys():
		var r: MeshInstance3D = pois[pkey]["ring"]
		if is_instance_valid(r):
			var pulse: float = 1.0 + sin(t + float(hash(pkey) % 5)) * 0.06
			r.scale = Vector3(pulse, 1.0, pulse)
			r.rotate_y(delta * 0.8)
