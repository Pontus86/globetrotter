extends CanvasLayer

## Slimmad 90-tals HUD i Godot 4:
## Topp-list, botten-list med [E]-prompt & boarding/resa, hopfällbar polisradio [R],
## Klappertavla, Frågekort + Kassaskåp-minispel, Hotell/Marknad/Bibliotek & Start/Slutskärm.

var player_ref: CharacterBody3D

var lbl_city: Label
var lbl_clock: Label
var lbl_cash: Label
var lbl_targets: Label
var btn_toggle_view: Button

var lbl_status: Label
var btn_nearby: Button
var btn_sprint: Button
var btn_smoke: Button
var prog_box: HBoxContainer
var lbl_prog: Label
var bar_prog: ProgressBar
var btn_cancel_board: Button

var radio_ticker_btn: Button
var radio_panel: PanelContainer
var radio_log_box: VBoxContainer
var radio_input: LineEdit

var modal_backdrop: ColorRect
var modal_panel: PanelContainer
var modal_vbox: VBoxContainer

# Kassaskåp-minispel state
var lock_active := false
var lock_pos := 0.1
var lock_dir := 1.0
var lock_speed := 0.9
var lock_zone_start := 0.35
var lock_zone_w := 0.22
var lock_hits := 0
var lock_bar_ref: Control
var lock_zone_ref: ColorRect
var lock_needle_ref: ColorRect
var lock_fb_ref: Label
var lock_city_id := ""

func _ready() -> void:
	_build_hud()
	GameState.radio_logged.connect(_on_radio_logged)
	GameState.challenge_requested.connect(_open_challenge_modal)
	GameState.departures_requested.connect(_open_departures_modal)
	GameState.extra_place_requested.connect(_open_extra_place_modal)
	GameState.game_ended.connect(_open_gameover_modal)
	_open_start_modal()

func _make_style(bg: Color, border: Color, radius := 8) -> StyleBoxFlat:
	var sb := StyleBoxFlat.new()
	sb.bg_color = bg
	sb.border_color = border
	sb.set_border_width_all(2)
	sb.set_corner_radius_all(radius)
	sb.content_margin_left = 12
	sb.content_margin_right = 12
	sb.content_margin_top = 8
	sb.content_margin_bottom = 8
	return sb

func _build_hud() -> void:
	# 1. Topp-list
	var top_panel := PanelContainer.new()
	top_panel.anchor_left = 0.01
	top_panel.anchor_right = 0.99
	top_panel.anchor_top = 0.015
	top_panel.offset_bottom = 52
	top_panel.add_theme_stylebox_override("panel", _make_style(Color(0.11, 0.08, 0.05, 0.92), Color(0.77, 0.61, 0.28), 10))
	add_child(top_panel)

	var top_h := HBoxContainer.new()
	top_h.add_theme_constant_override("separation", 18)
	top_panel.add_child(top_h)

	lbl_city = Label.new()
	lbl_city.text = "PARIS"
	lbl_city.add_theme_font_size_override("font_size", 18)
	lbl_city.add_theme_color_override("font_color", Color(1.0, 0.86, 0.45))
	top_h.add_child(lbl_city)

	lbl_clock = Label.new()
	lbl_clock.text = "DAG 1/10 · 00:00"
	lbl_clock.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	lbl_clock.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	top_h.add_child(lbl_clock)

	lbl_targets = Label.new()
	lbl_targets.text = "Mål: 0/3"
	lbl_targets.add_theme_color_override("font_color", Color(0.95, 0.85, 0.55))
	top_h.add_child(lbl_targets)

	lbl_cash = Label.new()
	lbl_cash.text = "💰 2200 kr"
	lbl_cash.add_theme_color_override("font_color", Color(0.65, 0.96, 0.72))
	top_h.add_child(lbl_cash)

	btn_toggle_view = Button.new()
	btn_toggle_view.text = "🌍 3D-Glob [G]"
	btn_toggle_view.pressed.connect(func():
		if not GameState.active or GameState.finished:
			return
		var next_mode := "globe" if GameState.view_mode == "city" else "city"
		GameState.set_view_mode(next_mode, GameState.current_city_id)
	)
	top_h.add_child(btn_toggle_view)

	# 2. Slimmad botten-list
	var bot_panel := PanelContainer.new()
	bot_panel.anchor_left = 0.20
	bot_panel.anchor_right = 0.80
	bot_panel.anchor_top = 1.0
	bot_panel.anchor_bottom = 1.0
	bot_panel.offset_top = -62
	bot_panel.offset_bottom = -14
	bot_panel.add_theme_stylebox_override("panel", _make_style(Color(0.11, 0.08, 0.05, 0.92), Color(0.77, 0.61, 0.28), 24))
	add_child(bot_panel)

	var bot_h := HBoxContainer.new()
	bot_h.alignment = BoxContainer.ALIGNMENT_CENTER
	bot_h.add_theme_constant_override("separation", 12)
	bot_panel.add_child(bot_h)

	lbl_status = Label.new()
	lbl_status.text = "DOLD · Missar 0/2"
	bot_h.add_child(lbl_status)

	btn_nearby = Button.new()
	btn_nearby.text = "✦ [E] Öppna"
	btn_nearby.visible = false
	btn_nearby.pressed.connect(func():
		if player_ref and player_ref.nearby_poi_key != "":
			match player_ref.nearby_poi_key:
				"landmark": GameState.challenge_requested.emit(GameState.current_city_id)
				"hub": GameState.departures_requested.emit(GameState.current_city_id)
				"hotel", "market", "library": GameState.extra_place_requested.emit(player_ref.nearby_poi_key, GameState.current_city_id)
	)
	bot_h.add_child(btn_nearby)

	prog_box = HBoxContainer.new()
	prog_box.visible = false
	lbl_prog = Label.new()
	bar_prog = ProgressBar.new()
	bar_prog.custom_minimum_size = Vector2(120, 14)
	bar_prog.show_percentage = false
	btn_cancel_board = Button.new()
	btn_cancel_board.text = "✕"
	btn_cancel_board.pressed.connect(func(): GameState.cancel_thief_boarding())
	prog_box.add_child(lbl_prog)
	prog_box.add_child(bar_prog)
	prog_box.add_child(btn_cancel_board)
	bot_h.add_child(prog_box)

	btn_sprint = Button.new()
	btn_sprint.text = "⚡ Sprint [Shift]"
	btn_sprint.pressed.connect(func(): GameState.activate_sprint_boost())
	bot_h.add_child(btn_sprint)

	btn_smoke = Button.new()
	btn_smoke.text = "💨 Rökbomb"
	btn_smoke.visible = false
	btn_smoke.pressed.connect(func():
		if GameState.gear["smoke"] > 0:
			GameState.gear["smoke"] -= 1
			GameState.police_frozen_until = GameState.elapsed_sec + 6.0
			GameState.add_radio("💨 RÖKBOMB! Poliser i staden frusna i 6s!", "good")
	)
	bot_h.add_child(btn_smoke)

	# 3. Hopfällbar 1-rads Polisradio nere till höger
	radio_ticker_btn = Button.new()
	radio_ticker_btn.anchor_left = 1.0
	radio_ticker_btn.anchor_right = 1.0
	radio_ticker_btn.anchor_top = 1.0
	radio_ticker_btn.anchor_bottom = 1.0
	radio_ticker_btn.offset_left = -330
	radio_ticker_btn.offset_right = -16
	radio_ticker_btn.offset_top = -102
	radio_ticker_btn.offset_bottom = -68
	radio_ticker_btn.text = "📻 Polisradio [R]"
	radio_ticker_btn.clip_text = true
	radio_ticker_btn.pressed.connect(func(): radio_panel.visible = not radio_panel.visible)
	add_child(radio_ticker_btn)

	radio_panel = PanelContainer.new()
	radio_panel.visible = false
	radio_panel.anchor_left = 1.0
	radio_panel.anchor_right = 1.0
	radio_panel.anchor_top = 1.0
	radio_panel.anchor_bottom = 1.0
	radio_panel.offset_left = -340
	radio_panel.offset_right = -16
	radio_panel.offset_top = -380
	radio_panel.offset_bottom = -110
	radio_panel.add_theme_stylebox_override("panel", _make_style(Color(0.09, 0.08, 0.06, 0.96), Color(0.77, 0.61, 0.28), 10))
	add_child(radio_panel)

	var rv := VBoxContainer.new()
	radio_panel.add_child(rv)
	var rh := Label.new()
	rh.text = "📻 POLISSCANNER · 148.2 MHz [R]"
	rh.add_theme_color_override("font_color", Color(1.0, 0.84, 0.4))
	rv.add_child(rh)

	var scroll := ScrollContainer.new()
	scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
	rv.add_child(scroll)
	radio_log_box = VBoxContainer.new()
	radio_log_box.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	scroll.add_child(radio_log_box)

	var rform := HBoxContainer.new()
	radio_input = LineEdit.new()
	radio_input.placeholder_text = "Kapa polisradion & skicka bluff..."
	radio_input.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	radio_input.text_submitted.connect(func(txt):
		GameState.send_player_radio(txt)
		radio_input.text = ""
	)
	var rsend := Button.new()
	rsend.text = "Sänd"
	rsend.pressed.connect(func():
		GameState.send_player_radio(radio_input.text)
		radio_input.text = ""
	)
	rform.add_child(radio_input)
	rform.add_child(rsend)
	rv.add_child(rform)

	# 4. Centrerat Modallager
	modal_backdrop = ColorRect.new()
	modal_backdrop.color = Color(0.03, 0.02, 0.01, 0.72)
	modal_backdrop.anchor_right = 1.0
	modal_backdrop.anchor_bottom = 1.0
	modal_backdrop.visible = false
	add_child(modal_backdrop)

	modal_panel = PanelContainer.new()
	modal_panel.anchor_left = 0.5
	modal_panel.anchor_right = 0.5
	modal_panel.anchor_top = 0.5
	modal_panel.anchor_bottom = 0.5
	modal_panel.offset_left = -290
	modal_panel.offset_right = 290
	modal_panel.offset_top = -230
	modal_panel.offset_bottom = 230
	modal_panel.add_theme_stylebox_override("panel", _make_style(Color(0.14, 0.10, 0.07, 0.98), Color(0.82, 0.64, 0.28), 12))
	modal_backdrop.add_child(modal_panel)

	modal_vbox = VBoxContainer.new()
	modal_vbox.add_theme_constant_override("separation", 10)
	modal_panel.add_child(modal_vbox)

func _show_modal() -> void:
	for c in modal_vbox.get_children():
		c.queue_free()
	lock_active = false
	modal_backdrop.visible = true
	if player_ref:
		player_ref.ui_blocking_input = true

func _close_modal() -> void:
	lock_active = false
	modal_backdrop.visible = false
	if player_ref:
		player_ref.ui_blocking_input = false

func _open_start_modal() -> void:
	_show_modal()
	var t := Label.new()
	t.text = "🕵️ GLOBETROTTER: SCOTLAND YARD 3D"
	t.add_theme_font_size_override("font_size", 22)
	t.add_theme_color_override("font_color", Color(1.0, 0.85, 0.42))
	modal_vbox.add_child(t)

	var desc := Label.new()
	desc.autowrap_mode = TextServer.AUTOWRAP_WORD
	desc.text = "Riktig 3D-fysik i Godot 4! Spring på gatorna med WASD, tryck [E] vid glittrande byggnader (Sevärdhet, Station, Hotell, Marknad, Bibliotek), [G] för 3D-Glob och [R] för Polisradion."
	modal_vbox.add_child(desc)

	var btn := Button.new()
	btn.text = "🚀 STARTA JAKTEN (10 DAGAR · 2 MISSAR INNAN LARM)"
	btn.custom_minimum_size = Vector2(0, 46)
	btn.pressed.connect(func():
		_close_modal()
		GameState.start_match("thief", 60.0, 2)
	)
	modal_vbox.add_child(btn)

func _open_departures_modal(city_id: String) -> void:
	_show_modal()
	var c: Dictionary = GameState.cities[city_id]
	var h := Label.new()
	h.text = "🚉 KLAPPERTAVLA — %s (Kassa: %s)" % [c["name"], GameState.format_kr(GameState.cash)]
	h.add_theme_font_size_override("font_size", 18)
	h.add_theme_color_override("font_color", Color(1.0, 0.85, 0.42))
	modal_vbox.add_child(h)

	# Nödflykt om polis är i staden!
	var pol_here := false
	for p in GameState.police:
		if p["travel"] == null and p["city"] == city_id:
			pol_here = true
	if pol_here and c["trains"].size() > 0:
		var eb := Button.new()
		eb.text = "🏃 NÖDFLYKT: Kasta dig på nästa tåg (2s boarding · +250 kr · Pingar avgångsstad)"
		eb.pressed.connect(func():
			var dest: String = c["trains"][randi() % c["trains"].size()]
			_close_modal()
			GameState.begin_thief_boarding(dest, "train", true)
		)
		modal_vbox.add_child(eb)

	for dest_id in c["trains"]:
		var fare := GameState.get_fare_kr(city_id, dest_id, "train")
		var b := Button.new()
		var mark := " 🎯" if (GameState.real_targets.has(dest_id) and not GameState.collected_targets.has(dest_id)) else ""
		b.text = "🚂 Tåg/Båt → %s%s  |  %s  |  OSYNLIG (4s boarding)" % [GameState.cities[dest_id]["name"], mark, GameState.format_kr(fare)]
		b.disabled = GameState.cash < fare
		b.pressed.connect(func():
			_close_modal()
			GameState.begin_thief_boarding(dest_id, "train", false)
		)
		modal_vbox.add_child(b)

	for dest_id in c["flights"]:
		var fare := GameState.get_fare_kr(city_id, dest_id, "flight")
		var b := Button.new()
		var mark := " 🎯" if (GameState.real_targets.has(dest_id) and not GameState.collected_targets.has(dest_id)) else ""
		b.text = "✈️ Direktflyg → %s%s  |  %s  |  PINGAR AVGÅNGSSTAD (4s)" % [GameState.cities[dest_id]["name"], mark, GameState.format_kr(fare)]
		b.disabled = GameState.cash < fare
		b.pressed.connect(func():
			_close_modal()
			GameState.begin_thief_boarding(dest_id, "flight", false)
		)
		modal_vbox.add_child(b)

	var close_b := Button.new()
	close_b.text = "Stäng"
	close_b.pressed.connect(_close_modal)
	modal_vbox.add_child(close_b)

func _open_challenge_modal(city_id: String) -> void:
	_show_modal()
	lock_city_id = city_id
	var c: Dictionary = GameState.cities[city_id]
	var is_target := GameState.real_targets.has(city_id) and not GameState.collected_targets.has(city_id)

	var h := Label.new()
	h.text = "%s — %s" % [c["landmark"]["name"], "STÖLDMÅL: " + String(c["landmark"]["artifact"]) if is_target else "Tjäna +900 kr"]
	h.add_theme_font_size_override("font_size", 18)
	h.add_theme_color_override("font_color", Color(1.0, 0.85, 0.42))
	modal_vbox.add_child(h)

	# Flikval: Frågekort vs Kassaskåp
	var tab_row := HBoxContainer.new()
	var b_q := Button.new()
	b_q.text = "❓ Frågekort"
	var b_l := Button.new()
	b_l.text = "🔐 Kassaskåp (Mellanslag)"
	tab_row.add_child(b_q)
	tab_row.add_child(b_l)
	modal_vbox.add_child(tab_row)

	var content := VBoxContainer.new()
	modal_vbox.add_child(content)

	var show_quiz := func():
		lock_active = false
		for ch in content.get_children(): ch.queue_free()
		var qs: Array = c["questions"]
		var q: Dictionary = qs[randi() % qs.size()]
		var ql := Label.new()
		ql.autowrap_mode = TextServer.AUTOWRAP_WORD
		ql.text = String(q["q"])
		content.add_child(ql)
		var fb := Label.new()
		var opts: Array = q["options"].duplicate()
		var correct_txt: String = opts[int(q["correct"])]
		opts.shuffle()
		var cross_left := 2 if GameState.guide_hint_ready else 0
		GameState.guide_hint_ready = false
		for opt_txt in opts:
			var ob := Button.new()
			ob.text = String(opt_txt)
			if opt_txt != correct_txt and cross_left > 0:
				cross_left -= 1
				ob.disabled = true
				ob.text = "~~ %s ~~" % opt_txt
			ob.pressed.connect(func():
				if opt_txt == correct_txt:
					_close_modal()
					GameState.complete_landmark_challenge(city_id, false)
				else:
					ob.disabled = true
					fb.text = GameState.register_miss(city_id, "Fel svar")
			)
			content.add_child(ob)
		content.add_child(fb)

	var show_lock := func():
		for ch in content.get_children(): ch.queue_free()
		var hint := Label.new()
		hint.text = "Tryck STOPP / MELLANSLAG när guldnålen är i den gröna zonen (3 träffar)!"
		content.add_child(hint)
		lock_bar_ref = Control.new()
		lock_bar_ref.custom_minimum_size = Vector2(460, 32)
		var bg := ColorRect.new()
		bg.color = Color(0.08, 0.07, 0.06)
		bg.set_anchors_preset(Control.PRESET_FULL_RECT)
		lock_bar_ref.add_child(bg)
		lock_zone_ref = ColorRect.new()
		lock_zone_ref.color = Color(0.2, 0.82, 0.5, 0.65)
		lock_bar_ref.add_child(lock_zone_ref)
		lock_needle_ref = ColorRect.new()
		lock_needle_ref.color = Color(1.0, 0.85, 0.35)
		lock_needle_ref.size = Vector2(8, 32)
		lock_bar_ref.add_child(lock_needle_ref)
		content.add_child(lock_bar_ref)

		var hit_b := Button.new()
		hit_b.text = "🎯 STOPP! (Mellanslag)"
		hit_b.pressed.connect(_handle_lock_hit)
		content.add_child(hit_b)
		lock_fb_ref = Label.new()
		content.add_child(lock_fb_ref)

		lock_zone_w = 0.42 if GameState.gear["lockpick"] > 0 else 0.22
		if GameState.gear["lockpick"] > 0:
			GameState.gear["lockpick"] -= 1
		lock_zone_start = 0.25 + randf() * (0.65 - lock_zone_w)
		lock_pos = 0.05
		lock_dir = 1.0
		lock_speed = 0.9
		lock_hits = 0
		lock_active = true

	b_q.pressed.connect(show_quiz)
	b_l.pressed.connect(show_lock)
	show_quiz.call()

	var foot := HBoxContainer.new()
	if is_target:
		var lb := Button.new()
		lb.text = "💥 Snabbkupp (Ta direkt · Avslöjar dig!)"
		lb.pressed.connect(func():
			_close_modal()
			GameState.complete_landmark_challenge(city_id, true)
		)
		foot.add_child(lb)
	var cb := Button.new()
	cb.text = "Avbryt"
	cb.pressed.connect(_close_modal)
	foot.add_child(cb)
	modal_vbox.add_child(foot)

func _handle_lock_hit() -> void:
	if not lock_active:
		return
	if lock_pos >= lock_zone_start and lock_pos <= lock_zone_start + lock_zone_w:
		lock_hits += 1
		if lock_hits >= 3:
			lock_active = false
			_close_modal()
			GameState.complete_landmark_challenge(lock_city_id, false)
		else:
			lock_speed += 0.24
			lock_zone_w = maxf(0.14, lock_zone_w - 0.03)
			lock_zone_start = 0.14 + randf() * (0.72 - lock_zone_w)
			lock_fb_ref.text = "✅ Klick %d/3!" % lock_hits
	else:
		lock_fb_ref.text = GameState.register_miss(lock_city_id, "Kassaskåpslarm")

func _open_extra_place_modal(place_key: String, city_id: String) -> void:
	_show_modal()
	GameState.trigger_crowd_hide(place_key.capitalize())

	var h := Label.new()
	h.add_theme_font_size_override("font_size", 18)
	h.add_theme_color_override("font_color", Color(1.0, 0.85, 0.42))
	modal_vbox.add_child(h)

	if place_key == "hotel":
		h.text = "🏨 Grand Hotel %s" % GameState.cities[city_id]["name"]
		var b1 := Button.new()
		b1.text = "🎭 Byt förklädnad (Nollställer missar & blockerar nästa ping) — 500 kr"
		b1.disabled = GameState.cash < 500
		b1.pressed.connect(func():
			GameState.cash -= 500
			GameState.misses_count = 0
			GameState.skip_next_reveal = true
			GameState.add_radio("🏨 Förklädnad bytt (-500 kr)!", "good")
			_close_modal()
		)
		modal_vbox.add_child(b1)
	elif place_key == "market":
		h.text = "🛍️ Basar / Marknad (%s)" % GameState.format_kr(GameState.cash)
		var items := [
			["lockpick", "🔧 Dyrkset (2x grön zon i Kassaskåp)", 450],
			["smoke", "💨 Rökbomb (Fryser poliser i 6s)", 550],
			["fake_pass", "🛂 Förfalskat pass (Osynligt flyg)", 800]
		]
		for it in items:
			var b := Button.new()
			b.text = "%s — %s" % [it[1], GameState.format_kr(it[2])]
			b.disabled = GameState.cash < it[2]
			b.pressed.connect(func():
				GameState.cash -= it[2]
				GameState.gear[it[0]] += 1
				GameState.add_radio("🛍️ Köpte %s!" % it[1], "good")
				_close_modal()
			)
			modal_vbox.add_child(b)
	else:
		h.text = "📚 %s Bibliotek (Gratis)" % GameState.cities[city_id]["name"]
		var b := Button.new()
		b.text = "📖 Hämta Guidebok (Stryker 2 fel på nästa Frågekort)"
		b.pressed.connect(func():
			GameState.guide_hint_ready = true
			GameState.add_radio("📚 Guidebok redo för nästa Frågekort!", "good")
			_close_modal()
		)
		modal_vbox.add_child(b)

	var cb := Button.new()
	cb.text = "Stäng"
	cb.pressed.connect(_close_modal)
	modal_vbox.add_child(cb)

func _open_gameover_modal(won: bool, summary: String) -> void:
	_show_modal()
	var h := Label.new()
	h.text = "🏆 SEGER!" if won else "🚨 SPELET ÄR ÖVER!"
	h.add_theme_font_size_override("font_size", 24)
	h.add_theme_color_override("font_color", Color(0.4, 0.95, 0.6) if won else Color(1.0, 0.4, 0.4))
	modal_vbox.add_child(h)

	var s := Label.new()
	s.autowrap_mode = TextServer.AUTOWRAP_WORD
	s.text = "%s\nFöremål: %d/3 · Lösta utmaningar: %d" % [summary, GameState.collected_targets.size(), GameState.stats["solved"]]
	modal_vbox.add_child(s)

	var b := Button.new()
	b.text = "🔄 Spela igen"
	b.pressed.connect(_open_start_modal)
	modal_vbox.add_child(b)

func _on_radio_logged(entry: Dictionary) -> void:
	radio_ticker_btn.text = "📻 %s [R]" % entry["raw"]
	var l := Label.new()
	l.autowrap_mode = TextServer.AUTOWRAP_WORD
	l.text = entry["text"]
	l.add_theme_font_size_override("font_size", 12)
	radio_log_box.add_child(l)
	radio_log_box.move_child(l, 0)

func _unhandled_input(event: InputEvent) -> void:
	if event.is_action_pressed("toggle_radio") and not modal_backdrop.visible:
		radio_panel.visible = not radio_panel.visible
	elif event.is_action_pressed("toggle_view") and not modal_backdrop.visible and GameState.active:
		var nxt := "globe" if GameState.view_mode == "city" else "city"
		GameState.set_view_mode(nxt, GameState.current_city_id)
	elif lock_active and event is InputEventKey and event.pressed and event.keycode == KEY_SPACE:
		_handle_lock_hit()

func _process(delta: float) -> void:
	if lock_active and is_instance_valid(lock_bar_ref):
		lock_pos += lock_dir * lock_speed * delta
		if lock_pos >= 0.98: lock_pos = 0.98; lock_dir = -1.0
		if lock_pos <= 0.02: lock_pos = 0.02; lock_dir = 1.0
		var w := lock_bar_ref.size.x
		lock_zone_ref.position = Vector2(lock_zone_start * w, 0)
		lock_zone_ref.size = Vector2(lock_zone_w * w, 32)
		lock_needle_ref.position = Vector2(lock_pos * w - 4.0, 0)

	if not GameState.active:
		return
	var clk := GameState.get_clock()
	lbl_city.text = "%s (%s)" % [GameState.cities[GameState.current_city_id]["name"].to_upper(), "3D-STAD" if GameState.view_mode == "city" else "3D-GLOB"]
	lbl_clock.text = "DAG %d / 10  ·  %s:%s" % [clk["day"], clk["hh"], clk["mm"]]
	lbl_cash.text = "💰 %s" % GameState.format_kr(GameState.cash)

	var t_names: Array[String] = []
	for tid in GameState.real_targets:
		var done := GameState.collected_targets.has(tid)
		t_names.append(("✅" if done else "🎯") + String(GameState.cities[tid]["name"]))
	lbl_targets.text = "  ".join(t_names)
	btn_toggle_view.text = "🌍 3D-Glob [G]" if GameState.view_mode == "city" else "🏙️ 3D-Stad [G]"

	lbl_status.text = "Missar %d/%d" % [GameState.misses_count, GameState.miss_limit]
	btn_smoke.visible = GameState.gear["smoke"] > 0
	btn_smoke.text = "💨 Rökbomb (%d)" % GameState.gear["smoke"]

	var boarding = GameState.thief.get("boarding")
	var travel = GameState.thief.get("travel")
	if boarding != null:
		prog_box.visible = true
		btn_cancel_board.visible = true
		btn_nearby.visible = false
		var p := clampf((GameState.elapsed_sec - float(boarding["start_sec"])) / float(boarding["duration_sec"]), 0.0, 1.0)
		bar_prog.value = p * 100.0
		lbl_prog.text = "🚂 %s (%ds)" % [GameState.cities[boarding["to"]]["name"], ceili(float(boarding["duration_sec"]) - (GameState.elapsed_sec - float(boarding["start_sec"])))]
	elif travel != null:
		prog_box.visible = true
		btn_cancel_board.visible = false
		btn_nearby.visible = false
		var p := clampf((GameState.elapsed_sec - float(travel["start_sec"])) / float(travel["duration_sec"]), 0.0, 1.0)
		bar_prog.value = p * 100.0
		lbl_prog.text = "✈️ %s (%ds)" % [GameState.cities[travel["to"]]["name"], ceili(float(travel["duration_sec"]) - (GameState.elapsed_sec - float(travel["start_sec"])))]
	else:
		prog_box.visible = false
		if player_ref and GameState.view_mode == "city" and player_ref.nearby_poi_key != "":
			btn_nearby.visible = true
			btn_nearby.text = "✦ [E] %s" % player_ref.nearby_poi_name
		else:
			btn_nearby.visible = false
