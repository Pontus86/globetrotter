extends Control

## Skärmkant-kompass & riktningsvisare för stadens 5 POI-platser i 3D-stadsvyn!
## Visar exakt riktning (pil) + ikon + namn + avstånd i meter för Sevärdhet, Station/Flyg, Hotell, Marknad och Bibliotek.

var player_ref: CharacterBody3D

func _ready() -> void:
	anchor_right = 1.0
	anchor_bottom = 1.0
	mouse_filter = Control.MOUSE_FILTER_IGNORE

func _process(_delta: float) -> void:
	visible = GameState.active and not GameState.finished and GameState.view_mode == "city" and player_ref != null and player_ref.city_builder != null
	if visible:
		queue_redraw()

func _draw() -> void:
	if not visible or player_ref == null or player_ref.camera == null or player_ref.city_builder == null:
		return

	var cam: Camera3D = player_ref.camera
	var cb: Node3D = player_ref.city_builder
	var vp: Vector2 = size
	var center := vp * 0.5
	var font: Font = ThemeDB.fallback_font

	# Marginaler så pilar aldrig krockar med topp-HUD, radar eller docka
	var pad_x: float = 95.0
	var pad_top: float = 92.0
	var pad_bot: float = 96.0

	var icons := {
		"landmark": "🎯",
		"hub": "🚉",
		"hotel": "🏨",
		"market": "🛍️",
		"library": "📚"
	}
	var cols := {
		"landmark": Color(1.0, 0.84, 0.28),
		"hub": Color(0.38, 0.80, 1.0),
		"hotel": Color(0.95, 0.50, 0.65),
		"market": Color(0.42, 0.90, 0.58),
		"library": Color(0.74, 0.58, 0.98)
	}

	for pkey in ["landmark", "hub", "hotel", "market", "library"]:
		if not cb.pois.has(pkey):
			continue
		var pinfo: Dictionary = cb.pois[pkey]
		var world_pos: Vector3 = pinfo["center"]
		var dist_m: int = int(Vector2(player_ref.global_position.x, player_ref.global_position.z).distance_to(Vector2(world_pos.x, world_pos.z)))
		var short_nm: String = String(pinfo["name"])
		if pkey == "hub":
			short_nm = "Station/Flyg"
		elif pkey == "hotel":
			short_nm = "Hotell"
		elif pkey == "market":
			short_nm = "Marknad"
		elif pkey == "library":
			short_nm = "Bibliotek"

		var is_target_lm: bool = (pkey == "landmark" and GameState.player_role == "thief" and GameState.real_targets.has(GameState.current_city_id) and not GameState.collected_targets.has(GameState.current_city_id))
		var col: Color = cols.get(pkey, Color.WHITE)
		if is_target_lm:
			col = Color(1.0, 0.88, 0.22)

		var screen_pt: Vector2 = cam.unproject_position(world_pos + Vector3(0.0, 14.0, 0.0))
		var behind: bool = cam.is_position_behind(world_pos + Vector3(0.0, 14.0, 0.0))
		if behind:
			screen_pt = vp - screen_pt

		var on_screen: bool = (not behind) and screen_pt.x >= pad_x and screen_pt.x <= vp.x - pad_x and screen_pt.y >= pad_top and screen_pt.y <= vp.y - pad_bot
		var label_txt: String = "%s %s · %dm" % [String(icons.get(pkey, "✦")), short_nm, dist_m]
		var txt_sz: Vector2 = font.get_string_size(label_txt, HORIZONTAL_ALIGNMENT_LEFT, -1, 12)
		var pill_w: float = txt_sz.x + 18.0
		var pill_h: float = 24.0

		if on_screen:
			# Liten avståndspiller ovanför platsen på skärmen
			var rect := Rect2(screen_pt.x - pill_w * 0.5, screen_pt.y - 34.0, pill_w, pill_h)
			draw_rect(rect, Color(0.10, 0.07, 0.04, 0.82), true)
			draw_rect(rect, col, false, 1.5)
			draw_string(font, Vector2(rect.position.x + 9.0, rect.position.y + 16.0), label_txt, HORIZONTAL_ALIGNMENT_LEFT, -1, 12, col)
		else:
			# Fastklistrad riktningspil + avstånd längs skärmkanten!
			var dir: Vector2 = (screen_pt - center)
			if dir.length_squared() < 0.01:
				dir = Vector2(0.0, -1.0)
			else:
				dir = dir.normalized()

			var half_w: float = (vp.x * 0.5) - pad_x
			var half_h: float = (vp.y * 0.5) - pad_top
			var tx: float = half_w / maxf(0.001, absf(dir.x))
			var ty: float = half_h / maxf(0.001, absf(dir.y))
			var edge_pt: Vector2 = center + dir * minf(tx, ty)
			edge_pt.x = clampf(edge_pt.x, pad_x, vp.x - pad_x)
			edge_pt.y = clampf(edge_pt.y, pad_top, vp.y - pad_bot)

			# Riktningstriangel (pil)
			var ang: float = dir.angle()
			var tip: Vector2 = edge_pt + dir * 18.0
			var p_l: Vector2 = tip + Vector2(cos(ang + 2.5), sin(ang + 2.5)) * 12.0
			var p_r: Vector2 = tip + Vector2(cos(ang - 2.5), sin(ang - 2.5)) * 12.0
			draw_colored_polygon(PackedVector2Array([tip, p_l, p_r]), col)

			var rect2 := Rect2(edge_pt.x - pill_w * 0.5, edge_pt.y - pill_h * 0.5, pill_w, pill_h)
			draw_rect(rect2, Color(0.10, 0.07, 0.04, 0.90), true)
			draw_rect(rect2, col, false, 1.8)
			draw_string(font, Vector2(rect2.position.x + 9.0, rect2.position.y + 16.0), label_txt, HORIZONTAL_ALIGNMENT_LEFT, -1, 12, col)
