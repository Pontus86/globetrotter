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
	var bg_col: Color = Color(0.06, 0.09, 0.10, 0.96)
	var border_col: Color = Color(1.0, 0.96, 0.80) if hovered else Color("b29a68")
	var rect := Rect2(2.0, 2.0 + y_off, w - 4.0, h - 4.0)

	# Skugga + mässingsram
	draw_rect(Rect2(4.0, 6.0, w - 4.0, h - 4.0), Color(0.0, 0.0, 0.0, 0.45), true)
	draw_rect(rect, bg_col, true)
	draw_rect(rect, border_col, false, 2.0)

	var cx: float = w * 0.5
	var cy: float = h * 0.40 + y_off
	var font: Font = ThemeDB.fallback_font

	var texture: Texture2D = NoirVisuals.icon(kind)
	if texture != null:
		draw_texture_rect(texture, Rect2(cx - 22, cy - 22, 44, 44), false, Color("e8e1cf"))

	# Etikett / räknare längst ner på badgen
	if sub_text != "":
		var sz: Vector2 = font.get_string_size(sub_text, HORIZONTAL_ALIGNMENT_LEFT, -1, 10)
		draw_string(font, Vector2(cx - sz.x * 0.5, h - 7.0 + y_off), sub_text, HORIZONTAL_ALIGNMENT_LEFT, -1, 10, Color(0.98, 0.90, 0.68))
