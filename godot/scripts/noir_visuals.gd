extends Node

## One vector icon vocabulary for UI, map markers and world labels.
const GLYPHS := {
	"🏨": "hotel", "📚": "library", "📖": "library", "🗂": "library",
	"🛍": "market", "🚉": "hub", "🚂": "hub", "🚆": "hub", "🚄": "hub",
	"🎯": "landmark", "🏛": "landmark", "🏆": "landmark",
	"🚓": "police", "👮": "police", "🕵": "thief", "😏": "thief",
	"🛂": "passport", "🎒": "backpack", "🌍": "globe", "🌐": "globe",
	"📻": "radio", "📡": "radio", "📢": "radio", "💰": "cash",
	"🔧": "lockpick", "💨": "smoke", "🐕": "hound", "✈": "flight",
	"⛴": "boat", "🚢": "boat", "🎭": "disguise", "⏱": "clock",
	"⏳": "clock", "📅": "clock", "🚨": "alert", "🔴": "alert",
	"⚠": "alert", "✅": "check", "🚫": "close", "✕": "close",
	"☰": "menu", "🔊": "sound", "🔇": "mute", "▶": "play",
	"🚀": "play", "⚡": "sprint", "❓": "question", "🔍": "question",
	"🔐": "safe", "🎮": "gear", "🔄": "restart", "⚙": "gear"
}
var textures: Dictionary = {}
var watched: Array[WeakRef] = []
var elapsed: float = 0.0

func _ready() -> void:
	get_tree().node_added.connect(_watch)

func icon(key: String) -> Texture2D:
	if not textures.has(key):
		var path := "res://assets/noir/icons/" + key + ".svg"
		textures[key] = load(path) if ResourceLoader.exists(path) else null
	return textures[key]

func clean(raw: String) -> String:
	var result := ""
	for character in raw:
		var code: int = character.unicode_at(0)
		if code >= 0x1f000 or code == 0xfe0f or code == 0x200d:
			continue
		if GLYPHS.has(character):
			continue
		result += character
	return result.strip_edges()

func _watch(node: Node) -> void:
	if node is Label or node is Button or node is Label3D:
		watched.append(weakref(node))
		_decorate.call_deferred(node)

func _process(delta: float) -> void:
	elapsed += delta
	if elapsed < 0.12:
		return
	elapsed = 0.0
	for i in range(watched.size() - 1, -1, -1):
		var node = watched[i].get_ref()
		if node == null:
			watched.remove_at(i)
		else:
			_decorate(node)

func _decorate(node: Node) -> void:
	if not is_instance_valid(node) or node.is_queued_for_deletion():
		return
	var raw: String = node.text
	if raw == String(node.get_meta("noir_rendered", "\u0001")):
		return
	var key: String = ""
	for character in raw:
		if GLYPHS.has(character):
			key = GLYPHS[character]
			break
	var text: String = clean(raw)
	if node is Label3D:
		# World labels retain words; location symbols are Sprite3D/compass icons.
		node.text = text if not text.is_empty() else key.to_upper()
	elif node is Button:
		if not node.has_meta("noir_item"):
			node.icon = icon(key) if not key.is_empty() else null
			node.expand_icon = true
			node.add_theme_constant_override("icon_max_width", 22)
		node.text = text
		if text.is_empty() and not key.is_empty():
			node.tooltip_text = key
	elif node is Label:
		var symbol = node.get_node_or_null("NoirSymbol")
		if not key.is_empty():
			if symbol == null:
				symbol = TextureRect.new()
				symbol.name = "NoirSymbol"
				symbol.mouse_filter = Control.MOUSE_FILTER_IGNORE
				symbol.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
				symbol.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
				symbol.size = Vector2(18, 18)
				node.add_child(symbol)
			symbol.texture = icon(key)
			symbol.visible = true
			node.text = "     " + text
		else:
			if symbol != null:
				symbol.visible = false
			node.text = text
	node.set_meta("noir_rendered", node.text)
