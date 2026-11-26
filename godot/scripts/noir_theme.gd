extends RefCounted

## Shared restrained palette; all labels remain real, localizable Godot text.
const INK := Color("10191b")
const PAPER := Color("e8e1cf")
const BRASS := Color("b29a68")

static func panel(fill: Color, edge: Color) -> StyleBoxFlat:
	var style := StyleBoxFlat.new()
	style.bg_color = fill
	style.border_color = edge
	style.set_border_width_all(1)
	style.set_corner_radius_all(3)
	style.content_margin_left = 16
	style.content_margin_right = 16
	style.content_margin_top = 10
	style.content_margin_bottom = 10
	return style

static func create() -> Theme:
	var theme := Theme.new()
	theme.default_font_size = 16
	theme.set_color("font_color", "Label", PAPER)
	theme.set_color("font_color", "Button", PAPER)
	theme.set_color("font_hover_color", "Button", Color.WHITE)
	theme.set_color("font_disabled_color", "Button", Color("9ca49e"))
	theme.set_stylebox("normal", "Button", panel(Color("1c292a"), Color("53605a")))
	theme.set_stylebox("hover", "Button", panel(Color("30413f"), BRASS))
	theme.set_stylebox("pressed", "Button", panel(Color("40504a"), PAPER))
	theme.set_stylebox("disabled", "Button", panel(Color("161e20"), Color("39443f")))
	var focus := panel(Color(0, 0, 0, 0), PAPER)
	focus.set_border_width_all(2)
	theme.set_stylebox("focus", "Button", focus)
	theme.set_stylebox("normal", "LineEdit", panel(INK, BRASS))
	theme.set_color("font_color", "LineEdit", PAPER)
	return theme
