extends CanvasLayer

## Fullständig 90-tals HUD i Godot 4 (Paritet med webbversionen):
## - Topp-list (Stad, Dag/10, Klocka, Mål/Pass [P], Reskassa, 3D-Glob [G], Ljud)
## - Centrerad röd Siren-banner vid jakt i samma stad
## - Cirkulär Radar-Minimap nere till vänster (grannstäder + poliser + riktningspilar)
## - Slimmad botten-list (DOLD/AVSLÖJAD, Polisflikar [1/2/3], [E]-prompt, Boarding/Resa, Sprint, Rökbomb/Spårhund)
## - Hopfällbar 1-rads Polisradio [R] med chatt & snabb-bluffar
## - Modaler: Setup (Roll, Tid, Missar X), Uppdragspass, Klappertavla, Frågekort + Kassaskåp + Minispel, Hotell/Marknad/Bibliotek, Game Over

const RadarScript = preload("res://scripts/radar_minimap.gd")
const MinigameScript = preload("res://scripts/minigame_panel.gd")

var player_ref: CharacterBody3D

var lbl_city: Label
var lbl_clock: Label
var lbl_cash: Label
var btn_passport: Button
var btn_bag: Button
var btn_toggle_view: Button
var btn_sound: Button
var danger_vignette: Panel
var chase_banner: PanelContainer
var lbl_chase: Label

var radar_minimap: Control

var lbl_status: Label
var lbl_next_ping: Label
var lbl_gear: Label
var police_tab_box: HBoxContainer
var btn_nearby: Button
var btn_sprint: Button
var btn_smoke: Button
var btn_hound: Button
var prog_box: HBoxContainer
var lbl_prog: Label
var bar_prog: ProgressBar
var btn_cancel_board: Button

var radio_ticker_btn: Button
var radio_panel: PanelContainer
var radio_log_box: VBoxContainer
var radio_input: LineEdit
var radio_qb1: Button
var radio_qb2: Button

var modal_backdrop: ColorRect
var modal_panel: PanelContainer
var modal_vbox: VBoxContainer

# Setup-val
var setup_role: String = "thief"
var setup_sec_per_day: float = 60.0
var setup_miss_limit: int = 2

# Kassaskåp-minispel
var lock_active: bool = false
var lock_pos: float = 0.1
var lock_dir: float = 1.0
var lock_speed: float = 0.9
var lock_zone_start: float = 0.35
var lock_zone_w: float = 0.22
var lock_hits: int = 0
var lock_bar_ref: Control
var lock_zone_ref: ColorRect
var lock_needle_ref: ColorRect
var lock_fb_ref: Label
var lock_pips_ref: Label
var lock_city_id: String = ""

func _ready() -> void:
	_build_hud()
	GameState.radio_logged.connect(_on_radio_logged)
	GameState.match_started.connect(_on_match_started)
	GameState.target_updated.connect(_rebuild_police_tabs)
	GameState.view_changed.connect(func(_m, _c): _rebuild_police_tabs())
	GameState.challenge_requested.connect(_open_challenge_modal)
	GameState.departures_requested.connect(_open_departures_modal)
	GameState.extra_place_requested.connect(_open_extra_place_modal)
	GameState.game_ended.connect(_open_gameover_modal)
	_open_start_modal()

func _on_match_started() -> void:
	for ch in radio_log_box.get_children():
		ch.queue_free()
	if GameState.player_role == "thief":
		radio_qb1.text = "😏 Retas"
		radio_qb2.text = "🎭 Bluffa"
	else:
		radio_qb1.text = "📢 Omringa!"
		radio_qb2.text = "📡 Lägesrapport"
	_rebuild_police_tabs()

func _make_style(bg: Color, border: Color, radius: int = 8) -> StyleBoxFlat:
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
	# 0. Pulserande Siren-vinjett runt skärmkanten under jakt (som webbversionen!)
	danger_vignette = Panel.new()
	danger_vignette.anchor_right = 1.0
	danger_vignette.anchor_bottom = 1.0
	danger_vignette.mouse_filter = Control.MOUSE_FILTER_IGNORE
	danger_vignette.visible = false
	var dv_sb := StyleBoxFlat.new()
	dv_sb.bg_color = Color(0.0, 0.0, 0.0, 0.0)
	dv_sb.border_color = Color(0.95, 0.15, 0.18, 0.72)
	dv_sb.set_border_width_all(10)
	danger_vignette.add_theme_stylebox_override("panel", dv_sb)
	add_child(danger_vignette)

	# 1. Topp-list
	var top_panel := PanelContainer.new()
	top_panel.anchor_left = 0.01
	top_panel.anchor_right = 0.99
	top_panel.anchor_top = 0.014
	top_panel.offset_bottom = 52
	top_panel.add_theme_stylebox_override("panel", _make_style(Color(0.11, 0.08, 0.05, 0.92), Color(0.77, 0.61, 0.28), 10))
	add_child(top_panel)

	var top_h := HBoxContainer.new()
	top_h.add_theme_constant_override("separation", 14)
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

	lbl_cash = Label.new()
	lbl_cash.text = "💰 2200 kr"
	lbl_cash.add_theme_color_override("font_color", Color(0.65, 0.96, 0.72))
	top_h.add_child(lbl_cash)

	btn_passport = Button.new()
	btn_passport.text = "🛂 Pass (0/3) [P]"
	btn_passport.pressed.connect(_open_passport_modal)
	top_h.add_child(btn_passport)

	btn_bag = Button.new()
	btn_bag.text = "🎒 Väska [B]"
	btn_bag.pressed.connect(_open_bag_modal)
	top_h.add_child(btn_bag)

	btn_toggle_view = Button.new()
	btn_toggle_view.text = "🌍 3D-Glob [G]"
	btn_toggle_view.pressed.connect(func():
		if not GameState.active or GameState.finished:
			return
		var nxt: String = "globe" if GameState.view_mode == "city" else "city"
		GameState.set_view_mode(nxt, GameState.current_city_id)
	)
	top_h.add_child(btn_toggle_view)

	btn_sound = Button.new()
	btn_sound.text = "🔊"
	btn_sound.pressed.connect(func():
		var on: bool = AudioMgr.toggle()
		btn_sound.text = "🔊" if on else "🔇"
	)
	top_h.add_child(btn_sound)

	var btn_menu := Button.new()
	btn_menu.text = "☰"
	btn_menu.pressed.connect(_open_pause_or_start_modal)
	top_h.add_child(btn_menu)

	# 2. Siren-banner under topp-listen under pågående jakt
	chase_banner = PanelContainer.new()
	chase_banner.visible = false
	chase_banner.anchor_left = 0.5
	chase_banner.anchor_right = 0.5
	chase_banner.anchor_top = 0.0
	chase_banner.offset_left = -240
	chase_banner.offset_right = 240
	chase_banner.offset_top = 62
	chase_banner.offset_bottom = 98
	chase_banner.add_theme_stylebox_override("panel", _make_style(Color(0.75, 0.10, 0.12, 0.94), Color(1.0, 0.75, 0.75), 18))
	add_child(chase_banner)

	lbl_chase = Label.new()
	lbl_chase.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	lbl_chase.text = "🚨 POLIS I STADEN!"
	chase_banner.add_child(lbl_chase)

	# 3. Cirkulär Radar-Minimap i nedre vänstra hörnet
	radar_minimap = RadarScript.new()
	radar_minimap.anchor_left = 0.0
	radar_minimap.anchor_top = 1.0
	radar_minimap.anchor_bottom = 1.0
	radar_minimap.offset_left = 16
	radar_minimap.offset_top = -164
	radar_minimap.offset_right = 164
	radar_minimap.offset_bottom = -16
	add_child(radar_minimap)

	# 4. Slimmad botten-list
	var bot_panel := PanelContainer.new()
	bot_panel.anchor_left = 0.22
	bot_panel.anchor_right = 0.78
	bot_panel.anchor_top = 1.0
	bot_panel.anchor_bottom = 1.0
	bot_panel.offset_top = -60
	bot_panel.offset_bottom = -14
	bot_panel.add_theme_stylebox_override("panel", _make_style(Color(0.11, 0.08, 0.05, 0.92), Color(0.77, 0.61, 0.28), 24))
	add_child(bot_panel)

	var bot_h := HBoxContainer.new()
	bot_h.alignment = BoxContainer.ALIGNMENT_CENTER
	bot_h.add_theme_constant_override("separation", 10)
	bot_panel.add_child(bot_h)

	lbl_status = Label.new()
	lbl_status.text = "DOLD · 0/2"
	bot_h.add_child(lbl_status)

	lbl_next_ping = Label.new()
	lbl_next_ping.text = "📡 D3"
	lbl_next_ping.add_theme_color_override("font_color", Color(1.0, 0.72, 0.42))
	bot_h.add_child(lbl_next_ping)

	lbl_gear = Label.new()
	lbl_gear.visible = false
	lbl_gear.add_theme_color_override("font_color", Color(1.0, 0.88, 0.45))
	bot_h.add_child(lbl_gear)

	police_tab_box = HBoxContainer.new()
	police_tab_box.visible = false
	bot_h.add_child(police_tab_box)

	btn_nearby = Button.new()
	btn_nearby.text = "✦ [E] Öppna"
	btn_nearby.visible = false
	btn_nearby.pressed.connect(func():
		if player_ref != null and player_ref.nearby_poi_key != "":
			_trigger_poi(player_ref.nearby_poi_key)
	)
	bot_h.add_child(btn_nearby)

	prog_box = HBoxContainer.new()
	prog_box.visible = false
	lbl_prog = Label.new()
	bar_prog = ProgressBar.new()
	bar_prog.custom_minimum_size = Vector2(110, 14)
	bar_prog.show_percentage = false
	btn_cancel_board = Button.new()
	btn_cancel_board.text = "✕"
	btn_cancel_board.pressed.connect(func(): GameState.cancel_controlled_boarding())
	prog_box.add_child(lbl_prog)
	prog_box.add_child(bar_prog)
	prog_box.add_child(btn_cancel_board)
	bot_h.add_child(prog_box)

	btn_sprint = Button.new()
	btn_sprint.text = "⚡ Sprint"
	btn_sprint.pressed.connect(func(): GameState.activate_sprint_boost())
	bot_h.add_child(btn_sprint)

	btn_smoke = Button.new()
	btn_smoke.text = "💨 Rökbomb"
	btn_smoke.visible = false
	btn_smoke.pressed.connect(func():
		if int(GameState.gear["smoke"]) > 0:
			GameState.gear["smoke"] = int(GameState.gear["smoke"]) - 1
			GameState.police_frozen_until = GameState.elapsed_sec + 6.0
			AudioMgr.play_sound("takeoff")
			GameState.add_radio("💨 RÖKBOMB! Poliser i staden frusna i 6s!", "good")
	)
	bot_h.add_child(btn_smoke)

	btn_hound = Button.new()
	btn_hound.text = "🐕 Spårhund"
	btn_hound.visible = false
	btn_hound.pressed.connect(func():
		if int(GameState.gear["hound"]) > 0:
			GameState.gear["hound"] = int(GameState.gear["hound"]) - 1
			GameState.hound_until = GameState.elapsed_sec + 30.0
			AudioMgr.play_sound("bell")
			GameState.add_radio("🐕 SPÅRHUND! Dubbel gripanderadie i 30s!", "police")
	)
	bot_h.add_child(btn_hound)

	# 5. Hopfällbar 1-rads Polisradio nere till höger
	radio_ticker_btn = Button.new()
	radio_ticker_btn.anchor_left = 1.0
	radio_ticker_btn.anchor_right = 1.0
	radio_ticker_btn.anchor_top = 1.0
	radio_ticker_btn.anchor_bottom = 1.0
	radio_ticker_btn.offset_left = -320
	radio_ticker_btn.offset_right = -16
	radio_ticker_btn.offset_top = -54
	radio_ticker_btn.offset_bottom = -18
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
	radio_panel.offset_left = -336
	radio_panel.offset_right = -16
	radio_panel.offset_top = -350
	radio_panel.offset_bottom = -62
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

	var qrow := HBoxContainer.new()
	radio_qb1 = Button.new()
	radio_qb1.text = "😏 Retas"
	radio_qb1.pressed.connect(func():
		if GameState.player_role == "thief":
			GameState.send_player_radio("Ni letar i fel stad 😉")
		else:
			GameState.send_player_radio("Alla enheter, omringa zonen och spärra stationerna!")
	)
	radio_qb2 = Button.new()
	radio_qb2.text = "🎭 Bluffa"
	radio_qb2.pressed.connect(func():
		if GameState.player_role == "thief":
			GameState.send_player_radio("Hälsa Rom från mig!")
		else:
			GameState.send_player_radio("Ge mig lägesrapport från alla enheter!")
	)
	qrow.add_child(radio_qb1)
	qrow.add_child(radio_qb2)
	rv.add_child(qrow)

	var rform := HBoxContainer.new()
	radio_input = LineEdit.new()
	radio_input.placeholder_text = "Prata på polisradion..."
	radio_input.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	radio_input.text_submitted.connect(func(txt):
		GameState.send_player_radio(txt)
		radio_input.text = ""
		radio_input.release_focus()
	)
	var rsend := Button.new()
	rsend.text = "Sänd"
	rsend.pressed.connect(func():
		GameState.send_player_radio(radio_input.text)
		radio_input.text = ""
		radio_input.release_focus()
	)
	rform.add_child(radio_input)
	rform.add_child(rsend)
	rv.add_child(rform)

	# 6. Centrerat Modallager
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
	modal_panel.offset_left = -310
	modal_panel.offset_right = 310
	modal_panel.offset_top = -255
	modal_panel.offset_bottom = 255
	modal_panel.add_theme_stylebox_override("panel", _make_style(Color(0.14, 0.10, 0.07, 0.98), Color(0.82, 0.64, 0.28), 12))
	modal_backdrop.add_child(modal_panel)

	var mscroll := ScrollContainer.new()
	mscroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
	modal_panel.add_child(mscroll)

	modal_vbox = VBoxContainer.new()
	modal_vbox.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	modal_vbox.add_theme_constant_override("separation", 10)
	mscroll.add_child(modal_vbox)

func _trigger_poi(pkey: String) -> void:
	match pkey:
		"landmark": GameState.challenge_requested.emit(GameState.current_city_id)
		"hub": GameState.departures_requested.emit(GameState.current_city_id)
		"hotel", "market", "library": GameState.extra_place_requested.emit(pkey, GameState.current_city_id)

func _rebuild_police_tabs() -> void:
	for ch in police_tab_box.get_children():
		ch.queue_free()
	police_tab_box.visible = GameState.active and GameState.player_role == "police"
	if not police_tab_box.visible:
		return
	for idx in range(GameState.police.size()):
		var p: Dictionary = GameState.police[idx]
		var pid: String = String(p["id"])
		var b := Button.new()
		var loc_txt: String = String(GameState.cities[p["city"]]["name"])
		if p.get("travel") != null:
			var t: Dictionary = p["travel"]
			loc_txt = "%s→%s" % [GameState.get_actor_icon(p, "✈️"), String(GameState.cities[t["to"]]["name"])]
		b.text = "[%d] %s (%s)" % [idx + 1, String(p["short"]), loc_txt]
		b.disabled = pid == GameState.selected_police_id
		b.pressed.connect(func(): GameState.select_police(pid))
		police_tab_box.add_child(b)

func _show_modal() -> void:
	for c in modal_vbox.get_children():
		c.queue_free()
	lock_active = false
	modal_backdrop.visible = true
	if player_ref != null:
		player_ref.ui_blocking_input = true

func _close_modal() -> void:
	lock_active = false
	modal_backdrop.visible = false
	if player_ref != null:
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
	desc.text = "10 kontinuerliga dagar över Europa. Spring på riktiga 3D-gator (WASD), tryck [E] vid glittrande byggnader, [G] för 3D-Glob med berg & moln, [P] för Passet och [R] för Polisradion."
	modal_vbox.add_child(desc)

	# Rollval
	var rl := Label.new()
	rl.text = "VÄLJ ROLL:"
	modal_vbox.add_child(rl)
	var rrow := HBoxContainer.new()
	var b_thief := Button.new()
	b_thief.text = "🕵️ Mästertjuv (Du vs 3 Poliser)"
	var b_pol := Button.new()
	b_pol.text = "🚓 Polischef (Styr 3 Poliser vs AI-Tjuv)"
	b_thief.disabled = setup_role == "thief"
	b_pol.disabled = setup_role == "police"
	b_thief.pressed.connect(func(): setup_role = "thief"; _open_start_modal())
	b_pol.pressed.connect(func(): setup_role = "police"; _open_start_modal())
	rrow.add_child(b_thief)
	rrow.add_child(b_pol)
	modal_vbox.add_child(rrow)

	# Matchlängd
	var dl := Label.new()
	dl.text = "MATCHLÄNGD (10 DAGAR):"
	modal_vbox.add_child(dl)
	var drow := HBoxContainer.new()
	for opt in [[30.0, "5 min (30s/dag)"], [60.0, "10 min (60s/dag)"], [90.0, "15 min (90s/dag)"]]:
		var b := Button.new()
		var sec_v: float = float(opt[0])
		b.text = String(opt[1])
		b.disabled = is_equal_approx(setup_sec_per_day, sec_v)
		b.pressed.connect(func(): setup_sec_per_day = sec_v; _open_start_modal())
		drow.add_child(b)
	modal_vbox.add_child(drow)

	# Missgräns X
	var ml := Label.new()
	ml.text = "MISSAR INNAN LARMET AVSLÖJAR TJUVEN (X):"
	modal_vbox.add_child(ml)
	var mrow := HBoxContainer.new()
	for m in [1, 2, 3, 5]:
		var b := Button.new()
		var mv: int = int(m)
		b.text = "%d miss%s" % [mv, "" if mv == 1 else "ar"]
		b.disabled = setup_miss_limit == mv
		b.pressed.connect(func(): setup_miss_limit = mv; _open_start_modal())
		mrow.add_child(b)
	modal_vbox.add_child(mrow)

	var start_b := Button.new()
	start_b.text = "🚀 STARTA NY JAKT" if (GameState.active and not GameState.finished) else "🚀 STARTA JAKTEN"
	start_b.custom_minimum_size = Vector2(0, 46)
	start_b.pressed.connect(func():
		_close_modal()
		GameState.start_match(setup_role, setup_sec_per_day, setup_miss_limit)
	)
	modal_vbox.add_child(start_b)

	if GameState.active and not GameState.finished:
		var resume_b := Button.new()
		resume_b.text = "▶ Fortsätt jakten"
		resume_b.custom_minimum_size = Vector2(0, 38)
		resume_b.pressed.connect(_close_modal)
		modal_vbox.add_child(resume_b)

func _open_pause_or_start_modal() -> void:
	if not GameState.active or GameState.finished:
		_open_start_modal()
		return
	_show_modal()
	var t := Label.new()
	t.text = "☰ MENY — GLOBETROTTER"
	t.add_theme_font_size_override("font_size", 20)
	t.add_theme_color_override("font_color", Color(1.0, 0.85, 0.42))
	modal_vbox.add_child(t)

	var b_res := Button.new()
	b_res.text = "▶ Fortsätt jakten [Esc]"
	b_res.custom_minimum_size = Vector2(0, 42)
	b_res.pressed.connect(_close_modal)
	modal_vbox.add_child(b_res)

	var b_pass := Button.new()
	b_pass.text = "🛂 Öppna Pass / Uppdrag [P]"
	b_pass.pressed.connect(_open_passport_modal)
	modal_vbox.add_child(b_pass)

	var b_bag := Button.new()
	b_bag.text = "🎒 Öppna Ryggsäck / Prylar [B]"
	b_bag.pressed.connect(_open_bag_modal)
	modal_vbox.add_child(b_bag)

	var b_dep := Button.new()
	b_dep.text = "🚉 Öppna Avgångstavla (%s)" % GameState.cities[GameState.current_city_id]["name"]
	b_dep.pressed.connect(func(): _open_departures_modal(GameState.current_city_id))
	modal_vbox.add_child(b_dep)

	var b_snd := Button.new()
	b_snd.text = "🔊 Ljud: PÅ" if AudioMgr.enabled else "🔇 Ljud: AV"
	b_snd.pressed.connect(func():
		var on: bool = AudioMgr.toggle()
		btn_sound.text = "🔊" if on else "🔇"
		b_snd.text = "🔊 Ljud: PÅ" if on else "🔇 Ljud: AV"
	)
	modal_vbox.add_child(b_snd)

	var b_new := Button.new()
	b_new.text = "🔄 Ny match / Byt roll & inställningar"
	b_new.pressed.connect(_open_start_modal)
	modal_vbox.add_child(b_new)

func _open_bag_modal() -> void:
	if not GameState.active:
		return
	AudioMgr.play_sound("paper")
	_show_modal()
	var h := Label.new()
	h.text = "🎒 RYGGSÄCK & UTRUSTNING"
	h.add_theme_font_size_override("font_size", 20)
	h.add_theme_color_override("font_color", Color(1.0, 0.85, 0.42))
	modal_vbox.add_child(h)

	var is_thief: bool = GameState.player_role == "thief"
	var cash_l := Label.new()
	cash_l.text = "💰 Reskassa: %s" % GameState.format_kr(GameState.cash) if is_thief else "🚓 Interpols fältutrustning"
	cash_l.add_theme_color_override("font_color", Color(0.65, 0.96, 0.72))
	modal_vbox.add_child(cash_l)

	var any_item: bool = false
	if is_thief:
		if int(GameState.gear["lockpick"]) > 0:
			any_item = true
			var l1 := Label.new()
			l1.text = "🔧 Dyrkset (%d st) — Dubbel grön zon i nästa Kassaskåp" % int(GameState.gear["lockpick"])
			modal_vbox.add_child(l1)
		if int(GameState.gear["smoke"]) > 0:
			any_item = true
			var b_sm := Button.new()
			b_sm.text = "💨 Använd Rökbomb (%d st) — Fryser poliser i staden i 6s!" % int(GameState.gear["smoke"])
			b_sm.pressed.connect(func():
				GameState.gear["smoke"] = int(GameState.gear["smoke"]) - 1
				GameState.police_frozen_until = GameState.elapsed_sec + 6.0
				AudioMgr.play_sound("takeoff")
				GameState.add_radio("💨 RÖKBOMB! Poliser i staden frusna i 6s!", "good")
				_close_modal()
			)
			modal_vbox.add_child(b_sm)
		if int(GameState.gear["fake_pass"]) > 0:
			any_item = true
			var l3 := Label.new()
			l3.text = "🛂 Förfalskat pass (%d st) — Nästa direktflyg pingar inte avgångsstaden" % int(GameState.gear["fake_pass"])
			modal_vbox.add_child(l3)
		if GameState.skip_next_reveal:
			any_item = true
			var l4 := Label.new()
			l4.text = "🎭 Hotellförklädnad (AKTIV) — Blockerar nästa radarping"
			modal_vbox.add_child(l4)
	else:
		if int(GameState.gear["fast_flight"]) > 0:
			any_item = true
			var l5 := Label.new()
			l5.text = "⚡ Snabbrekvisition (%d st) — Halverar nästa restid" % int(GameState.gear["fast_flight"])
			modal_vbox.add_child(l5)
		if int(GameState.gear["hound"]) > 0:
			any_item = true
			var b_hd := Button.new()
			b_hd.text = "🐕 Släpp loss Spårhund (%d st) — 2x gripanderadie i 30s!" % int(GameState.gear["hound"])
			b_hd.pressed.connect(func():
				GameState.gear["hound"] = int(GameState.gear["hound"]) - 1
				GameState.hound_until = GameState.elapsed_sec + 30.0
				AudioMgr.play_sound("bell")
				GameState.add_radio("🐕 SPÅRHUND! Dubbel gripanderadie i 30s!", "police")
				_close_modal()
			)
			modal_vbox.add_child(b_hd)
		if GameState.train_tap_active:
			any_item = true
			var l6 := Label.new()
			l6.text = "📡 Tågspaning (AKTIV) — Avslöjar tjuvens nästa tåg/båt"
			modal_vbox.add_child(l6)

	if GameState.guide_hint_ready:
		any_item = true
		var lg := Label.new()
		lg.text = "📖 Bibliotekets Guidebok (AKTIV) — Stryker 2 fel på nästa Frågekort"
		modal_vbox.add_child(lg)

	if not any_item:
		var emp := Label.new()
		emp.autowrap_mode = TextServer.AUTOWRAP_WORD
		emp.text = "Ryggsäcken är tom just nu. Besök 🛍️ Marknaden, 🏨 Hotellet eller 📚 Biblioteket i valfri stad för att skaffa prylar!"
		modal_vbox.add_child(emp)

	var cb := Button.new()
	cb.text = "Stäng ryggsäcken [Esc]"
	cb.pressed.connect(_close_modal)
	modal_vbox.add_child(cb)

func _open_passport_modal() -> void:
	if not GameState.active:
		return
	AudioMgr.play_sound("paper")
	_show_modal()
	var h := Label.new()
	h.text = "🛂 TJUVENS UPPDRAGSPASS" if GameState.player_role == "thief" else "🛂 INTERPOLS SPANINGSAKT"
	h.add_theme_font_size_override("font_size", 20)
	h.add_theme_color_override("font_color", Color(1.0, 0.85, 0.42))
	modal_vbox.add_child(h)

	var rules := Label.new()
	rules.autowrap_mode = TextServer.AUTOWRAP_WORD
	rules.text = "Regler: 10 dagar · Radarping Dag 3, 6 & 8 · Missgräns: %d missar · Flyg pingar avgångsstaden." % GameState.miss_limit
	rules.add_theme_color_override("font_color", Color(0.78, 0.82, 0.86))
	modal_vbox.add_child(rules)

	if GameState.player_role == "thief":
		for tid in GameState.real_targets:
			var c: Dictionary = GameState.cities[tid]
			var done: bool = GameState.collected_targets.has(tid)
			var icon: String = String(c["landmark"].get("icon", "🎯"))
			var l := Label.new()
			l.text = "%s %s %s — %s (%s)" % ["✅ STULEN:" if done else "🎯 MÅL:", icon, String(c["landmark"]["artifact"]), String(c["name"]), String(c["landmark"]["name"])]
			l.add_theme_color_override("font_color", Color(0.45, 0.92, 0.60) if done else Color(1.0, 0.92, 0.65))
			modal_vbox.add_child(l)
	else:
		for sid in GameState.suspect_pool:
			var c: Dictionary = GameState.cities[sid]
			var stolen: bool = GameState.collected_targets.has(sid)
			var cleared: bool = GameState.cleared_suspects.has(sid)
			var l := Label.new()
			l.text = "%s %s (%s)" % ["🚨 STULEN:" if stolen else ("✓ AVSKRIVEN:" if cleared else "❓ MISSTÄNKT:"), String(c["name"]), String(c["landmark"]["name"])]
			l.add_theme_color_override("font_color", Color(1.0, 0.45, 0.45) if stolen else (Color(0.55, 0.65, 0.72) if cleared else Color(1.0, 0.90, 0.55)))
			modal_vbox.add_child(l)

	var cb := Button.new()
	cb.text = "Stäng passet [Esc]"
	cb.pressed.connect(_close_modal)
	modal_vbox.add_child(cb)

func _open_departures_modal(city_id: String) -> void:
	_show_modal()
	AudioMgr.play_sound("flap")
	var actor: Dictionary = GameState.get_controlled_actor()
	var c: Dictionary = GameState.cities[city_id]
	var is_thief: bool = GameState.player_role == "thief"

	var h := Label.new()
	h.text = "🚉 KLAPPERTAVLA — %s" % String(c["name"]).to_upper()
	h.add_theme_font_size_override("font_size", 18)
	h.add_theme_color_override("font_color", Color(1.0, 0.85, 0.42))
	modal_vbox.add_child(h)

	if is_thief:
		var wallet := Label.new()
		wallet.text = "💰 Reskassa: %s" % GameState.format_kr(GameState.cash)
		wallet.add_theme_color_override("font_color", Color(0.65, 0.96, 0.72))
		modal_vbox.add_child(wallet)

	var police_cities: Dictionary = {}
	for p in GameState.police:
		if p["travel"] == null:
			police_cities[String(p["city"])] = true

	var min_train_fare: int = 999999
	if is_thief:
		var pol_here: bool = police_cities.has(city_id)
		if pol_here and c["trains"].size() > 0:
			var eb := Button.new()
			eb.text = "🏃 NÖDFLYKT: Kasta dig på nästa tåg (2s boarding · +250 kr · Pingar avgångsstad)"
			eb.pressed.connect(func():
				var safe_trains: Array[String] = []
				for tid in c["trains"]:
					var ts: String = String(tid)
					if not police_cities.has(ts):
						safe_trains.append(ts)
				var dest: String = safe_trains[randi() % safe_trains.size()] if safe_trains.size() > 0 else String(c["trains"][randi() % c["trains"].size()])
				_close_modal()
				GameState.begin_actor_boarding(actor, dest, "train", true)
			)
			modal_vbox.add_child(eb)

	for dest_id in c["trains"]:
		var did: String = String(dest_id)
		var fare: int = GameState.get_fare_kr(city_id, did, "train")
		if fare < min_train_fare:
			min_train_fare = fare
		var secs: int = int(GameState.get_travel_seconds(city_id, did, "train"))
		var tinfo: Dictionary = GameState.get_transit_mode_info(city_id, did, "train")
		var b := Button.new()
		var mark: String = " 🎯" if (is_thief and GameState.real_targets.has(did) and not GameState.collected_targets.has(did)) else ""
		var pol_warn: String = " 🚓" if police_cities.has(did) else ""
		var price_txt: String = (GameState.format_kr(fare) if GameState.cash >= fare else "SAKNAR %d kr" % (fare - GameState.cash)) if is_thief else "POLIS"
		b.text = "%s %s%s%s  |  %ds  |  %s  |  OSYNLIG" % [tinfo["icon"], GameState.cities[did]["name"], mark, pol_warn, secs, price_txt]
		b.disabled = is_thief and GameState.cash < fare
		b.pressed.connect(func():
			_close_modal()
			GameState.begin_actor_boarding(actor, did, "train", false)
		)
		modal_vbox.add_child(b)

	for dest_id in c["flights"]:
		var did: String = String(dest_id)
		var fare: int = GameState.get_fare_kr(city_id, did, "flight")
		var secs2: int = int(GameState.get_travel_seconds(city_id, did, "flight"))
		var b := Button.new()
		var mark: String = " 🎯" if (is_thief and GameState.real_targets.has(did) and not GameState.collected_targets.has(did)) else ""
		var pol_warn2: String = " 🚓" if police_cities.has(did) else ""
		var price_txt2: String = (GameState.format_kr(fare) if GameState.cash >= fare else "SAKNAR %d kr" % (fare - GameState.cash)) if is_thief else "POLIS"
		var stealth_txt: String = "🛂 FALSKPASS (OSYNLIG)" if (is_thief and int(GameState.gear["fake_pass"]) > 0) else "PINGAR AVGÅNGSSTAD"
		b.text = "✈️ %s%s%s  |  %ds  |  %s  |  %s" % [GameState.cities[did]["name"], mark, pol_warn2, secs2, price_txt2, stealth_txt]
		b.disabled = is_thief and GameState.cash < fare
		b.pressed.connect(func():
			_close_modal()
			GameState.begin_actor_boarding(actor, did, "flight", false)
		)
		modal_vbox.add_child(b)

	if is_thief and GameState.cash < min_train_fare:
		var broke_b := Button.new()
		broke_b.text = "💰 Saknar pengar! Gå till %s och klara utmaningen (+900 kr)" % String(c["landmark"]["name"])
		broke_b.pressed.connect(_close_modal)
		modal_vbox.add_child(broke_b)

	var close_b := Button.new()
	close_b.text = "Stäng tavlan"
	close_b.pressed.connect(_close_modal)
	modal_vbox.add_child(close_b)

func _open_challenge_modal(city_id: String) -> void:
	if GameState.player_role == "police":
		var cd_until: float = float(GameState.recon_cooldown_until.get(city_id, 0.0))
		if GameState.elapsed_sec < cd_until:
			GameState.add_radio("🔍 Spaning i %s redan gjord (%ds kvar)." % [GameState.cities[city_id]["name"], ceili(cd_until - GameState.elapsed_sec)], "police")
			return

	_show_modal()
	lock_city_id = city_id
	var c: Dictionary = GameState.cities[city_id]
	var is_police: bool = GameState.player_role == "police"
	var is_target: bool = GameState.real_targets.has(city_id) and not GameState.collected_targets.has(city_id)

	var h := Label.new()
	h.text = "%s — %s" % [c["landmark"]["name"], "SPANING" if is_police else ("STÖLDMÅL: " + String(c["landmark"]["artifact"]) if is_target else "Tjäna +900 kr")]
	h.add_theme_font_size_override("font_size", 18)
	h.add_theme_color_override("font_color", Color(1.0, 0.85, 0.42))
	modal_vbox.add_child(h)

	var tick_lbl := Label.new()
	tick_lbl.text = "⏱️ KLOCKAN TICKAR I REALTID · Missar: %d / %d" % [GameState.misses_count, GameState.miss_limit]
	tick_lbl.add_theme_color_override("font_color", Color(1.0, 0.45, 0.42))
	modal_vbox.add_child(tick_lbl)

	var tab_row := HBoxContainer.new()
	var b_q := Button.new()
	b_q.text = "❓ Frågekort"
	var b_l := Button.new()
	b_l.text = "🔐 Kassaskåp"
	var b_m := Button.new()
	b_m.text = "🎮 Minispel"
	tab_row.add_child(b_q)
	tab_row.add_child(b_l)
	tab_row.add_child(b_m)
	modal_vbox.add_child(tab_row)

	var content := VBoxContainer.new()
	modal_vbox.add_child(content)

	# Välj 1 fråga per modalöppning så flikbyte inte byter ut frågan
	var qs: Array = c["questions"]
	var chosen_q: Dictionary = qs[randi() % qs.size()]
	var chosen_opts: Array = chosen_q["options"].duplicate()
	var chosen_correct_txt: String = String(chosen_opts[int(chosen_q["correct"])])
	chosen_opts.shuffle()
	var modal_state: Dictionary = { "lockpick_applied": false, "guide_applied": false }

	var show_quiz := func():
		lock_active = false
		for ch in content.get_children(): ch.queue_free()

		# Polischef får levande Polisradio-diskussion från kollegorna med riktiga namn!
		if is_police:
			var col_names: Array[String] = []
			for po in GameState.police:
				if String(po["id"]) != GameState.selected_police_id:
					col_names.append(String(po["short"]))
			var cn1: String = col_names[0] if col_names.size() > 0 else "Vega"
			var cn2: String = col_names[1] if col_names.size() > 1 else "Lind"
			var wrong_txt: String = String(chosen_opts[0]) if String(chosen_opts[0]) != chosen_correct_txt else String(chosen_opts[1])
			var t1: String = chosen_correct_txt if randf() < 0.78 else wrong_txt
			var t2: String = chosen_correct_txt if randf() < 0.55 else wrong_txt
			var tip_lbl := Label.new()
			tip_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD
			tip_lbl.text = '📻 POLISRADIO:\n• %s: "Jag tror starkt på %s!"\n• %s: "Kan det inte vara %s?"' % [cn1, t1, cn2, t2]
			tip_lbl.add_theme_color_override("font_color", Color(0.60, 0.88, 1.0))
			content.add_child(tip_lbl)

		var ql := Label.new()
		ql.autowrap_mode = TextServer.AUTOWRAP_WORD
		ql.text = String(chosen_q["q"])
		content.add_child(ql)
		var fb := Label.new()

		if GameState.guide_hint_ready and not bool(modal_state["guide_applied"]):
			GameState.guide_hint_ready = false
			modal_state["guide_applied"] = true
		var cross_left: int = 2 if bool(modal_state["guide_applied"]) else 0
		for opt_v in chosen_opts:
			var opt_txt: String = String(opt_v)
			var ob := Button.new()
			ob.text = opt_txt
			if opt_txt != chosen_correct_txt and cross_left > 0:
				cross_left -= 1
				ob.disabled = true
				ob.text = "~~ %s ~~" % opt_txt
			ob.pressed.connect(func():
				if opt_txt == chosen_correct_txt:
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
		hint.text = "Tryck STOPP / MELLANSLAG i den gröna zonen (3 träffar)!"
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
		lock_pips_ref = Label.new()
		lock_pips_ref.text = "Låstappar: ○ ○ ○ (0/3)"
		lock_pips_ref.add_theme_color_override("font_color", Color(0.45, 0.96, 0.65))
		content.add_child(lock_pips_ref)
		lock_fb_ref = Label.new()
		content.add_child(lock_fb_ref)

		if not bool(modal_state["lockpick_applied"]) and int(GameState.gear["lockpick"]) > 0:
			GameState.gear["lockpick"] = int(GameState.gear["lockpick"]) - 1
			modal_state["lockpick_applied"] = true
		lock_zone_w = 0.42 if bool(modal_state["lockpick_applied"]) else 0.22
		lock_zone_start = 0.25 + randf() * (0.65 - lock_zone_w)
		lock_pos = 0.05
		lock_dir = 1.0
		lock_speed = 0.9
		lock_hits = 0
		lock_active = true

	var show_mg_holder: Array = []
	var show_mg := func():
		lock_active = false
		for ch in content.get_children(): ch.queue_free()
		var mg: VBoxContainer = MinigameScript.new()
		content.add_child(mg)
		mg.finished.connect(func(passed: bool, summary: String):
			if passed:
				_close_modal()
				GameState.complete_landmark_challenge(city_id, false)
			else:
				var msg: String = GameState.register_miss(city_id, summary)
				var fl := Label.new()
				fl.text = "%s — %s" % [summary, msg]
				content.add_child(fl)
				var rb := Button.new()
				rb.text = "🔄 Försök igen"
				rb.pressed.connect(func():
					if show_mg_holder.size() > 0:
						(show_mg_holder[0] as Callable).call()
				)
				content.add_child(rb)
		)
		mg.start_for_city(city_id)
	show_mg_holder.append(show_mg)

	b_q.pressed.connect(show_quiz)
	b_l.pressed.connect(show_lock)
	b_m.pressed.connect(show_mg)
	show_quiz.call()

	var foot := HBoxContainer.new()
	if not is_police and is_target:
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
		AudioMgr.play_sound("right1")
		if is_instance_valid(lock_pips_ref):
			var pips: String = ""
			for i in range(3):
				pips += "● " if i < lock_hits else "○ "
			lock_pips_ref.text = "Låstappar: %s(%d/3)" % [pips, lock_hits]
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
	var cd_key: String = "%s:%s" % [city_id, place_key]
	var cd_until: float = float(GameState.place_cooldown_until.get(cd_key, 0.0))
	if GameState.elapsed_sec < cd_until:
		GameState.add_radio("⏳ Du besökte nyss %s i %s (%ds kvar)." % [place_key.capitalize(), GameState.cities[city_id]["name"], ceili(cd_until - GameState.elapsed_sec)], "")
		return

	_show_modal()
	AudioMgr.play_sound("bell")
	var is_police: bool = GameState.player_role == "police"
	var c: Dictionary = GameState.cities[city_id]
	if not is_police:
		GameState.trigger_crowd_hide(place_key.capitalize())

	var h := Label.new()
	h.add_theme_font_size_override("font_size", 18)
	h.add_theme_color_override("font_color", Color(1.0, 0.85, 0.42))
	modal_vbox.add_child(h)

	if place_key == "hotel":
		h.text = "🏨 Grand Hotel %s" % c["name"]
		if is_police:
			var log_l := Label.new()
			log_l.autowrap_mode = TextServer.AUTOWRAP_WORD
			if GameState.thief_visit_log.has(city_id):
				var v: Dictionary = GameState.thief_visit_log[city_id]
				var clue_txt: String = "En misstänkt gäst checkade ut Dag %d kl %s:%s och reste med %s mot %s!" % [int(v["day"]), v["hh"], v["mm"], v["mode_label"], GameState.cities[v["last_to"]]["name"]]
				log_l.text = "📖 SPÅR I HOTELLIGGAREN!\n" + clue_txt
				GameState.add_radio("🏨 Hotellspår i %s: %s" % [c["name"], clue_txt], "police")
			else:
				log_l.text = "Receptionisten kollar gästboken: Ingen misstänkt gäst har bott här."
			modal_vbox.add_child(log_l)
		else:
			var b1 := Button.new()
			b1.text = "🎭 Byt förklädnad (Nollställer missar & blockerar nästa ping) — 500 kr"
			b1.disabled = GameState.cash < 500
			b1.pressed.connect(func():
				GameState.cash -= 500
				GameState.misses_count = 0
				GameState.skip_next_reveal = true
				GameState.place_cooldown_until[cd_key] = GameState.elapsed_sec + GameState.PLACE_COOLDOWN_SEC
				AudioMgr.play_sound("cash_out")
				GameState.add_radio("🏨 Förklädnad bytt (-500 kr)!", "good")
				_close_modal()
			)
			modal_vbox.add_child(b1)

			var nb: Array = c["trains"] + c["flights"]
			if nb.size() > 0:
				var decoy_id: String = String(nb[randi() % nb.size()])
				var b2 := Button.new()
				b2.text = "📡 Falsk hotellbokning i %s (Falskt spår på polisradarn) — 400 kr" % GameState.cities[decoy_id]["name"]
				b2.disabled = GameState.cash < 400
				b2.pressed.connect(func():
					GameState.cash -= 400
					var clk: Dictionary = GameState.get_clock()
					GameState.last_ping = { "city_id": decoy_id, "day": clk["day"], "hh": clk["hh"], "mm": clk["mm"], "time": GameState.elapsed_sec, "reason": "Falsk bokning" }
					GameState.place_cooldown_until[cd_key] = GameState.elapsed_sec + GameState.PLACE_COOLDOWN_SEC
					AudioMgr.play_sound("stamp")
					GameState.add_radio("🎭 Falskt spår utlagt i %s (-400 kr)!" % GameState.cities[decoy_id]["name"], "good")
					_close_modal()
				)
				modal_vbox.add_child(b2)
	elif place_key == "market":
		h.text = "🛍️ Basar / Marknad"
		var items: Array = [
			["fast_flight", "⚡ Snabbrekvisition (Halverar nästa restid)", 0],
			["hound", "🐕 Spårhund (2x gripanderadie i 30s)", 0],
			["train_tap", "📡 Tågspaning (Avslöjar nästa tåg/båt)", 0]
		] if is_police else [
			["lockpick", "🔧 Dyrkset (2x grön zon i Kassaskåp)", 450],
			["smoke", "💨 Rökbomb (Fryser poliser i 6s)", 550],
			["fake_pass", "🛂 Förfalskat pass (Osynligt flyg)", 800]
		]
		for it in items:
			var gid: String = String(it[0])
			var price: int = int(it[2])
			var b := Button.new()
			b.text = "%s — %s" % [String(it[1]), "GRATIS" if price == 0 else GameState.format_kr(price)]
			b.disabled = (not is_police) and GameState.cash < price
			b.pressed.connect(func():
				if not is_police:
					GameState.cash -= price
				GameState.gear[gid] = int(GameState.gear[gid]) + 1
				if gid == "train_tap":
					GameState.train_tap_active = true
				GameState.place_cooldown_until[cd_key] = GameState.elapsed_sec + GameState.PLACE_COOLDOWN_SEC
				AudioMgr.play_sound("cash_out")
				GameState.add_radio("🛍️ Skaffade %s!" % String(it[1]), "good")
				_close_modal()
			)
			modal_vbox.add_child(b)
	else:
		h.text = "📚 %s Bibliotek (Gratis)" % c["name"]
		var fl := Label.new()
		fl.autowrap_mode = TextServer.AUTOWRAP_WORD
		fl.text = "📖 Lokal handbok: %s" % String(c.get("fact", ""))
		modal_vbox.add_child(fl)

		var b1 := Button.new()
		b1.text = "📖 Hämta Guidebok (Stryker 2 fel på nästa Frågekort)"
		b1.pressed.connect(func():
			GameState.guide_hint_ready = true
			GameState.place_cooldown_until[cd_key] = GameState.elapsed_sec + GameState.PLACE_COOLDOWN_SEC
			AudioMgr.play_sound("paper")
			GameState.add_radio("📚 Guidebok redo för nästa Frågekort!", "good")
			_close_modal()
		)
		modal_vbox.add_child(b1)

		if is_police:
			var b2 := Button.new()
			b2.text = "🗂️ Arkivsökning (Stryk 1 falsk målstad)"
			b2.pressed.connect(func():
				for sid in GameState.suspect_pool:
					if not GameState.real_targets.has(sid) and not GameState.cleared_suspects.has(sid):
						GameState.cleared_suspects.append(sid)
						GameState.add_radio("🗂️ Arkivfynd: %s avskriven som falskt mål!" % GameState.cities[sid]["name"], "police")
						GameState.target_updated.emit()
						break
				GameState.place_cooldown_until[cd_key] = GameState.elapsed_sec + GameState.PLACE_COOLDOWN_SEC
				AudioMgr.play_sound("stamp")
				_close_modal()
			)
			modal_vbox.add_child(b2)

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

	var clk: Dictionary = GameState.get_clock()
	var s := Label.new()
	s.autowrap_mode = TextServer.AUTOWRAP_WORD
	s.text = "%s\n\n📅 Sluttid: Dag %d · %s:%s\n🏆 Föremål: %d / 3\n🧠 Lösta utmaningar: %d" % [summary, int(clk["day"]), clk["hh"], clk["mm"], GameState.collected_targets.size(), int(GameState.stats["solved"])]
	modal_vbox.add_child(s)

	var brow := HBoxContainer.new()
	var b := Button.new()
	b.text = "🔄 Spela igen direkt"
	b.pressed.connect(func():
		_close_modal()
		GameState.start_match(setup_role, setup_sec_per_day, setup_miss_limit)
	)
	var b2 := Button.new()
	b2.text = "⚙️ Byt roll / Inställningar"
	b2.pressed.connect(_open_start_modal)
	brow.add_child(b)
	brow.add_child(b2)
	modal_vbox.add_child(brow)

func _on_radio_logged(entry: Dictionary) -> void:
	radio_ticker_btn.text = "🔴 %s [R]" % String(entry["raw"])
	var l := Label.new()
	l.autowrap_mode = TextServer.AUTOWRAP_WORD
	l.text = String(entry["text"])
	l.add_theme_font_size_override("font_size", 12)
	var kind: String = String(entry.get("kind", ""))
	if kind == "alert":
		l.add_theme_color_override("font_color", Color(1.0, 0.45, 0.45))
	elif kind == "police":
		l.add_theme_color_override("font_color", Color(0.45, 0.82, 1.0))
	elif kind == "good":
		l.add_theme_color_override("font_color", Color(0.45, 0.95, 0.65))
	elif kind == "thief":
		l.add_theme_color_override("font_color", Color(1.0, 0.86, 0.42))
	radio_log_box.add_child(l)
	radio_log_box.move_child(l, 0)

func _unhandled_input(event: InputEvent) -> void:
	if modal_backdrop.visible:
		if event is InputEventKey:
			var ek: InputEventKey = event
			if ek.pressed and ek.keycode == KEY_ESCAPE and GameState.active and not GameState.finished:
				_close_modal()
				return
			if lock_active and ek.pressed and ek.keycode == KEY_SPACE:
				_handle_lock_hit()
		return
	var fo: Control = get_viewport().gui_get_focus_owner()
	if fo is LineEdit or fo is TextEdit:
		if event is InputEventKey and (event as InputEventKey).pressed and (event as InputEventKey).keycode == KEY_ESCAPE:
			fo.release_focus()
			radio_panel.visible = false
		return
	if event is InputEventKey and (event as InputEventKey).pressed and (event as InputEventKey).keycode == KEY_ESCAPE:
		if radio_panel.visible:
			radio_panel.visible = false
		elif GameState.active and not GameState.finished:
			_open_pause_or_start_modal()
		return
	if event.is_action_pressed("toggle_radio"):
		radio_panel.visible = not radio_panel.visible
	elif event.is_action_pressed("toggle_view") and GameState.active and not GameState.finished:
		var nxt: String = "globe" if GameState.view_mode == "city" else "city"
		GameState.set_view_mode(nxt, GameState.current_city_id)
	elif event is InputEventKey:
		var k: InputEventKey = event
		if k.pressed and GameState.active and not GameState.finished:
			if k.keycode == KEY_P:
				_open_passport_modal()
			elif k.keycode == KEY_B:
				_open_bag_modal()
			elif GameState.player_role == "police":
				if k.keycode == KEY_1 and GameState.police.size() > 0: GameState.select_police(String(GameState.police[0]["id"]))
				elif k.keycode == KEY_2 and GameState.police.size() > 1: GameState.select_police(String(GameState.police[1]["id"]))
				elif k.keycode == KEY_3 and GameState.police.size() > 2: GameState.select_police(String(GameState.police[2]["id"]))

func _process(delta: float) -> void:
	if lock_active and is_instance_valid(lock_bar_ref):
		lock_pos += lock_dir * lock_speed * delta
		if lock_pos >= 0.98: lock_pos = 0.98; lock_dir = -1.0
		if lock_pos <= 0.02: lock_pos = 0.02; lock_dir = 1.0
		var w: float = lock_bar_ref.size.x
		lock_zone_ref.position = Vector2(lock_zone_start * w, 0.0)
		lock_zone_ref.size = Vector2(lock_zone_w * w, 32.0)
		lock_needle_ref.position = Vector2(lock_pos * w - 4.0, 0.0)

	if not GameState.active:
		return
	var clk: Dictionary = GameState.get_clock()
	var actor: Dictionary = GameState.get_controlled_actor()
	lbl_city.text = "%s (%s)" % [String(GameState.cities[GameState.current_city_id]["name"]).to_upper(), "3D-STAD" if GameState.view_mode == "city" else "3D-GLOB"]
	lbl_clock.text = "DAG %d / 10  ·  %s:%s" % [int(clk["day"]), clk["hh"], clk["mm"]]
	lbl_cash.text = "💰 %s" % GameState.format_kr(GameState.cash) if GameState.player_role == "thief" else "🚓 POLISCHEF"
	btn_passport.text = "🛂 Pass (%d/3) [P]" % GameState.collected_targets.size()
	btn_toggle_view.text = "🌍 3D-Glob [G]" if GameState.view_mode == "city" else "🏙️ 3D-Stad [G]"

	# Siren-banner + pulserande röd/blå skärmkant under pågående jakt
	var in_same: bool = false
	if GameState.thief.get("travel") == null:
		for p in GameState.police:
			if p["travel"] == null and String(p["city"]) == String(GameState.thief["city"]):
				in_same = true
	chase_banner.visible = in_same
	danger_vignette.visible = in_same and GameState.view_mode == "city" and GameState.player_role == "thief" and GameState.nearest_police_chasing
	if danger_vignette.visible:
		var pulse_sb: StyleBoxFlat = danger_vignette.get_theme_stylebox("panel") as StyleBoxFlat
		if pulse_sb != null:
			var is_red: bool = (int(Time.get_ticks_msec() / 260) % 2) == 0
			pulse_sb.border_color = Color(0.95, 0.16, 0.18, 0.72) if is_red else Color(0.18, 0.56, 0.98, 0.72)
	if in_same:
		if GameState.player_role == "thief":
			var d_str: String = " (%dm)" % int(GameState.nearest_police_dist_in_city) if GameState.nearest_police_dist_in_city < 900.0 else ""
			if GameState.nearest_police_chasing:
				lbl_chase.text = "🚨 POLIS JAGAR DIG%s! DRA IFRÅN >%dm ELLER NÖDFLY!" % [d_str, int(GameState.LOSE_SIGHT_DIST_M)]
			else:
				lbl_chase.text = "⚠️ POLIS SÖKER I STADEN%s — LÄGE ATT FLY ELLER GÖMMA SIG!" % d_str
		else:
			lbl_chase.text = "🚨 TJUVEN I %s! GRIP TJUVEN!" % String(GameState.cities[GameState.thief["city"]]["name"]).to_upper()

	var exposed: bool = (not GameState.last_ping.is_empty()) and String(GameState.last_ping["city_id"]) == String(GameState.thief["city"])
	lbl_status.text = ("%s · ⚠️%d/%d" % ["AVSLÖJAD" if exposed else "DOLD", GameState.misses_count, GameState.miss_limit]) if GameState.player_role == "thief" else String(actor.get("short", "Polis"))
	lbl_status.add_theme_color_override("font_color", Color(1.0, 0.42, 0.42) if (GameState.player_role == "thief" and exposed) else Color(0.45, 0.95, 0.65))

	# Nästa obligatoriska radarping (D3/D6/D8)
	var next_rd: int = -1
	for rd in GameState.REVEAL_DAYS:
		if not GameState.reveal_triggered.has(rd):
			next_rd = int(rd)
			break
	lbl_next_ping.visible = next_rd != -1
	if lbl_next_ping.visible:
		lbl_next_ping.text = "📡 D%d" % next_rd

	# Passiva pryl-ikoner
	var gear_badges: Array[String] = []
	if int(GameState.gear["lockpick"]) > 0: gear_badges.append("🔧%d" % int(GameState.gear["lockpick"]))
	if int(GameState.gear["fake_pass"]) > 0: gear_badges.append("🛂%d" % int(GameState.gear["fake_pass"]))
	if int(GameState.gear["fast_flight"]) > 0: gear_badges.append("⚡%d" % int(GameState.gear["fast_flight"]))
	if GameState.train_tap_active: gear_badges.append("📡")
	if GameState.guide_hint_ready: gear_badges.append("📖")
	if GameState.skip_next_reveal: gear_badges.append("🎭")
	lbl_gear.visible = gear_badges.size() > 0
	if lbl_gear.visible:
		lbl_gear.text = " ".join(gear_badges)

	btn_sprint.visible = GameState.player_role == "thief"
	if btn_sprint.visible:
		if GameState.elapsed_sec < GameState.boost_until:
			btn_sprint.disabled = true
			btn_sprint.text = "⚡ %ds" % ceili(GameState.boost_until - GameState.elapsed_sec)
		elif GameState.elapsed_sec < GameState.boost_cooldown_until:
			btn_sprint.disabled = true
			btn_sprint.text = "⏳ %ds" % ceili(GameState.boost_cooldown_until - GameState.elapsed_sec)
		else:
			btn_sprint.disabled = actor.get("travel") != null
			btn_sprint.text = "⚡ Sprint"

	btn_smoke.visible = int(GameState.gear["smoke"]) > 0
	btn_hound.visible = int(GameState.gear["hound"]) > 0

	var boarding = actor.get("boarding")
	var travel = actor.get("travel")
	if boarding != null:
		prog_box.visible = true
		btn_cancel_board.visible = true
		btn_nearby.visible = false
		var p_frac: float = clampf((GameState.elapsed_sec - float(boarding["start_sec"])) / float(boarding["duration_sec"]), 0.0, 1.0)
		bar_prog.value = p_frac * 100.0
		var b_icon: String = "🏃" if bool(boarding.get("emergency", false)) else String(GameState.get_transit_mode_info(String(actor["city"]), String(boarding["to"]), String(boarding["mode"]))["icon"])
		lbl_prog.text = "%s %s (%ds)" % [b_icon, GameState.cities[boarding["to"]]["name"], ceili(float(boarding["duration_sec"]) - (GameState.elapsed_sec - float(boarding["start_sec"])))]
	elif travel != null:
		prog_box.visible = true
		btn_cancel_board.visible = false
		btn_nearby.visible = false
		var p_frac2: float = clampf((GameState.elapsed_sec - float(travel["start_sec"])) / float(travel["duration_sec"]), 0.0, 1.0)
		bar_prog.value = p_frac2 * 100.0
		lbl_prog.text = "%s %s (%ds)" % [GameState.get_actor_icon(actor, "✈️"), GameState.cities[travel["to"]]["name"], ceili(float(travel["duration_sec"]) - (GameState.elapsed_sec - float(travel["start_sec"])))]
	else:
		prog_box.visible = false
		if player_ref != null and GameState.view_mode == "city" and player_ref.nearby_poi_key != "":
			btn_nearby.visible = true
			btn_nearby.text = "✦ [E] %s" % player_ref.nearby_poi_name
		else:
			btn_nearby.visible = false
