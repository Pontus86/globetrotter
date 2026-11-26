extends Control

## Klassisk cirkulär 90-tals Radar-Minimap i nedre vänstra hörnet (3D-stadsvy)
## Visar omkringliggande städer, tåg-/flyglinjer, poliser i realtid & riktningspilar på kanten!

const RANGE_KM: float = 1150.0

func _ready() -> void:
	custom_minimum_size = Vector2(148.0, 148.0)
	mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND

func _gui_input(event: InputEvent) -> void:
	if event is InputEventMouseButton:
		var mb: InputEventMouseButton = event
		if mb.button_index == MOUSE_BUTTON_LEFT and mb.pressed:
			if GameState.active and GameState.view_mode == "city":
				GameState.set_view_mode("globe", GameState.current_city_id)

func _process(_delta: float) -> void:
	visible = GameState.active and not GameState.finished and GameState.view_mode == "city"
	if visible:
		queue_redraw()

func _draw() -> void:
	if not GameState.active:
		return
	var cx: float = size.x * 0.5
	var cy: float = size.y * 0.5
	var max_r: float = minf(cx, cy) - 8.0

	# Bakgrund & mässingsram
	draw_circle(Vector2(cx, cy), max_r + 5.0, Color(0.05, 0.10, 0.08, 0.94))
	draw_arc(Vector2(cx, cy), max_r + 5.0, 0.0, TAU, 48, Color(0.77, 0.61, 0.28), 3.0)

	# Radarringar & kors
	for frac in [0.35, 0.70, 1.0]:
		draw_arc(Vector2(cx, cy), max_r * float(frac), 0.0, TAU, 36, Color(0.30, 0.85, 0.50, 0.20), 1.0)
	draw_line(Vector2(cx - max_r, cy), Vector2(cx + max_r, cy), Color(0.30, 0.85, 0.50, 0.16), 1.0)
	draw_line(Vector2(cx, cy - max_r), Vector2(cx, cy + max_r), Color(0.30, 0.85, 0.50, 0.16), 1.0)

	var actor: Dictionary = GameState.get_controlled_actor()
	var cur_id: String = String(actor["city"])
	if not GameState.cities.has(cur_id):
		return
	var cur_city: Dictionary = GameState.cities[cur_id]
	var origin: Array = cur_city["center"]
	var cos_lat: float = maxf(0.25, cos(deg_to_rad(float(origin[1]))))

	# Rutter från nuvarande stad
	for tid in cur_city["trains"]:
		if GameState.cities.has(tid):
			var p: Dictionary = _proj(origin, GameState.cities[tid]["center"], cos_lat, cx, cy, max_r)
			if float(p["dist_km"]) <= RANGE_KM:
				draw_line(Vector2(cx, cy), Vector2(float(p["x"]), float(p["y"])), Color(0.20, 0.82, 0.60, 0.45), 1.4)
	for fid in cur_city["flights"]:
		if GameState.cities.has(fid):
			var p2: Dictionary = _proj(origin, GameState.cities[fid]["center"], cos_lat, cx, cy, max_r)
			if float(p2["dist_km"]) <= RANGE_KM:
				draw_line(Vector2(cx, cy), Vector2(float(p2["x"]), float(p2["y"])), Color(0.96, 0.78, 0.34, 0.32), 1.2)

	# Grannstäder
	var font: Font = ThemeDB.fallback_font
	for cid in GameState.cities.keys():
		var c: Dictionary = GameState.cities[cid]
		var p: Dictionary = _proj(origin, c["center"], cos_lat, cx, cy, max_r)
		if float(p["dist_km"]) > RANGE_KM * 0.94:
			continue
		var is_cur: bool = String(cid) == cur_id
		var is_target: bool = false
		if GameState.player_role == "thief":
			is_target = GameState.real_targets.has(cid) and not GameState.collected_targets.has(cid)
		else:
			is_target = GameState.suspect_pool.has(cid) and not GameState.cleared_suspects.has(cid)
		var col: Color = Color(0.30, 0.90, 0.50) if is_cur else (Color(0.98, 0.78, 0.30) if is_target else Color(0.80, 0.84, 0.88))
		draw_circle(Vector2(float(p["x"]), float(p["y"])), 4.2 if is_cur else (3.6 if is_target else 2.5), col)
		draw_string(font, Vector2(float(p["x"]) - 18.0, float(p["y"]) - 6.0), String(c["name"]), HORIZONTAL_ALIGNMENT_LEFT, -1, 9, col)

	# Alla 3 poliser — prick om inom radie, klassisk riktningspil på kanten om utanför!
	for pol in GameState.police:
		var pol_pos: Array = _actor_lng_lat(pol)
		var p: Dictionary = _proj(origin, pol_pos, cos_lat, cx, cy, max_r)
		if float(p["dist_km"]) <= RANGE_KM * 0.94:
			var pt := Vector2(float(p["x"]), float(p["y"]))
			draw_circle(pt, 5.2, Color(0.22, 0.74, 0.98))
			draw_arc(pt, 5.2, 0.0, TAU, 16, Color.WHITE, 1.4)
		else:
			var ang: float = float(p["angle"])
			var tip := Vector2(cx + cos(ang) * (max_r + 1.0), cy + sin(ang) * (max_r + 1.0))
			var left_pt := tip + Vector2(cos(ang + 2.55), sin(ang + 2.55)) * 9.0
			var right_pt := tip + Vector2(cos(ang - 2.55), sin(ang - 2.55)) * 9.0
			draw_colored_polygon(PackedVector2Array([tip, left_pt, right_pt]), Color(0.22, 0.74, 0.98))

func _proj(origin: Array, target: Array, cos_lat: float, cx: float, cy: float, max_r: float) -> Dictionary:
	var dx_km: float = (float(target[0]) - float(origin[0])) * 111.32 * cos_lat
	var dy_km: float = (float(target[1]) - float(origin[1])) * 111.32
	return {
		"x": cx + (dx_km / RANGE_KM) * max_r,
		"y": cy - (dy_km / RANGE_KM) * max_r,
		"dist_km": sqrt(dx_km * dx_km + dy_km * dy_km),
		"angle": atan2(-dy_km, dx_km)
	}

func _actor_lng_lat(actor: Dictionary) -> Array:
	if actor.get("travel") != null:
		var t: Dictionary = actor["travel"]
		var frac: float = clampf((GameState.elapsed_sec - float(t["start_sec"])) / float(t["duration_sec"]), 0.0, 1.0)
		var a: Array = GameState.cities[t["from"]]["center"]
		var b: Array = GameState.cities[t["to"]]["center"]
		return [lerpf(float(a[0]), float(b[0]), frac), lerpf(float(a[1]), float(b[1]), frac)]
	return GameState.cities[actor["city"]]["center"]
