extends Control

## Taktila 90-tals reseknappar nere till höger — exakt som webbversionens .travel-dock!
## kind: "globe" (snurrande mini-jordglob) | "backpack" (läderryggsäck med mässingsspännen) | "passport" (vinrött svenskt EU-pass)

signal clicked

var kind: String = "globe"
var sub_text: String = ""
var hovered: bool = false
var spin: float = 0.0

func _ready() -> void:
	custom_minimum_size = Vector2(74.0, 74.0)
	mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
	mouse_entered.connect(func(): hovered = true; queue_redraw())
	mouse_exited.connect(func(): hovered = false; queue_redraw())

func _gui_input(event: InputEvent) -> void:
	if event is InputEventMouseButton:
		var mb: InputEventMouseButton = event
		if mb.button_index == MOUSE_BUTTON_LEFT and mb.pressed:
			clicked.emit()

func _process(delta: float) -> void:
	if kind == "globe":
		spin = fmod(spin + delta * 0.9, TAU)
		queue_redraw()

func set_sub_text(txt: String) -> void:
	if sub_text != txt:
		sub_text = txt
		queue_redraw()

func _draw() -> void:
	var w: float = size.x
	var h: float = size.y
	var y_off: float = -3.0 if hovered else 0.0
	var bg_col: Color = Color(0.42, 0.09, 0.14, 0.96) if kind == "passport" else Color(0.11, 0.08, 0.05, 0.94)
	var border_col: Color = Color(1.0, 0.96, 0.80) if hovered else Color(0.82, 0.64, 0.28)
	var rect := Rect2(2.0, 2.0 + y_off, w - 4.0, h - 4.0)

	# Skugga + mässingsram
	draw_rect(Rect2(4.0, 6.0, w - 4.0, h - 4.0), Color(0.0, 0.0, 0.0, 0.45), true)
	draw_rect(rect, bg_col, true)
	draw_rect(rect, border_col, false, 2.0)

	var cx: float = w * 0.5
	var cy: float = h * 0.40 + y_off
	var font: Font = ThemeDB.fallback_font

	if kind == "globe":
		# Snurrande 3D-liknande mini-jordglob med mässingsbåge!
		var r: float = 20.0
		draw_arc(Vector2(cx, cy), r + 3.0, -PI * 0.35, PI * 0.65, 20, Color(0.84, 0.66, 0.30), 2.2)
		draw_circle(Vector2(cx, cy), r, Color(0.11, 0.38, 0.68))
		# Kontinenter som glider förbi i takt med spin
		for i in range(3):
			var phase: float = fmod(spin + float(i) * 2.1, TAU)
			var dx: float = sin(phase) * (r * 0.58)
			var vis_w: float = cos(phase)
			if vis_w > 0.0:
				var cr: float = (5.0 + float(i % 2) * 2.5) * vis_w
				var dy: float = -5.0 + float(i) * 4.5
				draw_circle(Vector2(cx + dx, cy + dy), maxf(2.0, cr), Color(0.32, 0.68, 0.36, 0.90))
		# Atmosfär-glans
		draw_circle(Vector2(cx - 6.0, cy - 6.0), 6.0, Color(1.0, 1.0, 1.0, 0.20))
		draw_arc(Vector2(cx, cy), r, 0.0, TAU, 28, Color(0.55, 0.82, 1.0, 0.55), 1.4)
	elif kind == "backpack":
		# Klassisk 90-tals läder-vandringsryggsäck med mässingsspännen!
		var bx: float = cx - 15.0
		var by: float = cy - 15.0
		# Handtag överst
		draw_arc(Vector2(cx, by + 2.0), 6.0, PI, TAU, 12, Color(0.42, 0.25, 0.13), 2.5)
		# Huvudkropp (varmt läder)
		draw_rect(Rect2(bx, by + 3.0, 30.0, 31.0), Color(0.56, 0.34, 0.17), true)
		draw_rect(Rect2(bx, by + 3.0, 30.0, 31.0), Color(0.32, 0.18, 0.08), false, 1.8)
		# Topplock
		draw_rect(Rect2(bx - 1.0, by + 2.0, 32.0, 13.0), Color(0.66, 0.42, 0.22), true)
		draw_rect(Rect2(bx - 1.0, by + 2.0, 32.0, 13.0), Color(0.35, 0.20, 0.09), false, 1.5)
		# Framficka
		draw_rect(Rect2(bx + 5.0, by + 18.0, 20.0, 12.0), Color(0.48, 0.28, 0.14), true)
		draw_rect(Rect2(bx + 5.0, by + 18.0, 20.0, 12.0), Color(0.32, 0.18, 0.08), false, 1.2)
		# Två läderremmar & guldspännen!
		draw_rect(Rect2(bx + 6.0, by + 6.0, 4.0, 16.0), Color(0.35, 0.20, 0.10), true)
		draw_rect(Rect2(bx + 20.0, by + 6.0, 4.0, 16.0), Color(0.35, 0.20, 0.10), true)
		draw_rect(Rect2(bx + 5.0, by + 13.0, 6.0, 5.0), Color(0.95, 0.78, 0.30), true)
		draw_rect(Rect2(bx + 19.0, by + 13.0, 6.0, 5.0), Color(0.95, 0.78, 0.30), true)
	else:
		# Riktigt vinrött svenskt EU-pass med guldtext ("EU · SVERIGE · ✦ ✦ ✦ · PASS")!
		var px: float = cx - 16.0
		var py: float = cy - 19.0
		var gold := Color(0.96, 0.80, 0.38)
		draw_rect(Rect2(px, py, 32.0, 40.0), Color(0.46, 0.08, 0.14), true)
		draw_rect(Rect2(px, py, 32.0, 40.0), gold, false, 1.5)
		draw_string(font, Vector2(cx - 6.0, py + 10.0), "EU", HORIZONTAL_ALIGNMENT_LEFT, -1, 8, gold)
		draw_string(font, Vector2(cx - 14.0, py + 19.0), "SVERIGE", HORIZONTAL_ALIGNMENT_LEFT, -1, 7, gold)
		draw_string(font, Vector2(cx - 11.0, py + 28.0), "✦ ✦ ✦", HORIZONTAL_ALIGNMENT_LEFT, -1, 8, gold)
		draw_string(font, Vector2(cx - 10.0, py + 36.0), "PASS", HORIZONTAL_ALIGNMENT_LEFT, -1, 8, gold)

	# Etikett / räknare längst ner på badgen
	if sub_text != "":
		var sz: Vector2 = font.get_string_size(sub_text, HORIZONTAL_ALIGNMENT_LEFT, -1, 10)
		draw_string(font, Vector2(cx - sz.x * 0.5, h - 7.0 + y_off), sub_text, HORIZONTAL_ALIGNMENT_LEFT, -1, 10, Color(0.98, 0.90, 0.68))
