extends VBoxContainer

## Huvudspelets minispel portade till Godot 4 (Passkontrollant, Ånglokets Eldare, Konsertpianist)
## Anropas som 3:e flik i Sevärdhets-modalen bredvid Frågekort och Kassaskåp!

signal finished(passed: bool, summary: String)

var mode: String = "passport"
var active: bool = false

# Passkontrollant
var pass_idx: int = 0
var pass_score: int = 0
var pass_valid: bool = true
var pass_lbl: Label
var pass_hud: Label

# Ånglokets Eldare
var stoker_pressure: float = 0.5
var stoker_time: float = 0.0
var stoker_good_time: float = 0.0
var stoker_bar: ProgressBar
var stoker_hud: Label

# Konsertpianist (Simon Says)
var piano_seq: Array[int] = []
var piano_step: int = 0
var piano_round: int = 0
var piano_waiting: bool = false
var piano_lbl: Label
const PIANO_FREQS := [261.63, 293.66, 329.63, 392.00, 440.00]
const PIANO_NAMES := ["C", "D", "E", "G", "A"]

func start_for_city(city_id: String) -> void:
	for c in get_children():
		c.queue_free()
	var h: int = absi(hash(city_id)) % 3
	if h == 0:
		_start_passport()
	elif h == 1:
		_start_stoker()
	else:
		_start_piano()

func _start_passport() -> void:
	mode = "passport"
	active = true
	pass_idx = 0
	pass_score = 0

	pass_hud = Label.new()
	pass_hud.text = "🛂 PASSKONTROLLANT · Rätt: 0/3 (Krav: 3 av 4)"
	add_child(pass_hud)

	pass_lbl = Label.new()
	pass_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD
	add_child(pass_lbl)

	var row := HBoxContainer.new()
	var b_ok := Button.new()
	b_ok.text = "✅ GODKÄNN PASS"
	b_ok.pressed.connect(func(): _answer_passport(true))
	var b_no := Button.new()
	b_no.text = "🚫 AVVISA FÖRFALSKNING"
	b_no.pressed.connect(func(): _answer_passport(false))
	row.add_child(b_ok)
	row.add_child(b_no)
	add_child(row)
	_next_passport()

func _next_passport() -> void:
	if pass_idx >= 4:
		active = false
		finished.emit(pass_score >= 3, "Passkontroll: %d av 4 rätt!" % pass_score)
		return
	var names := ["Anna Lind", "Marco Rossi", "Jean Moreau", "Klara Berg", "Lukas Weber"]
	var nm: String = names[randi() % names.size()]
	var is_ok: bool = randf() < 0.5
	pass_valid = is_ok
	var yr: int = 2029 if is_ok else 2021
	var stamp: String = "GILTIG EU-STÄMPEL" if (is_ok or randf() < 0.5) else "SAKNAR STÄMPEL!"
	if not is_ok and stamp == "GILTIG EU-STÄMPEL":
		yr = 2020
	pass_lbl.text = "RESENÄR: %s\nGILTIGT TILL: %d (Idag: 2026)\nSTÄMPEL: %s" % [nm, yr, stamp]
	pass_hud.text = "🛂 PASSKONTROLL %d/4 · Rätt: %d" % [pass_idx + 1, pass_score]

func _answer_passport(approved: bool) -> void:
	if not active:
		return
	if approved == pass_valid:
		pass_score += 1
		AudioMgr.play_sound("right1")
	else:
		AudioMgr.play_sound("wrong1")
	pass_idx += 1
	_next_passport()

func _start_stoker() -> void:
	mode = "stoker"
	active = true
	stoker_pressure = 0.5
	stoker_time = 0.0
	stoker_good_time = 0.0

	stoker_hud = Label.new()
	stoker_hud.text = "🚂 ÅNGLOKETS ELDARE · Håll trycket mellan 40%–75% i 5 sek!"
	add_child(stoker_hud)

	stoker_bar = ProgressBar.new()
	stoker_bar.min_value = 0.0
	stoker_bar.max_value = 100.0
	stoker_bar.value = 50.0
	stoker_bar.custom_minimum_size = Vector2(0, 28)
	add_child(stoker_bar)

	var row := HBoxContainer.new()
	var b_coal := Button.new()
	b_coal.text = "🔥 SKOTTA KOL (+18%)"
	b_coal.pressed.connect(func():
		stoker_pressure = clampf(stoker_pressure + 0.18, 0.0, 1.0)
		AudioMgr.play_sound("klick")
	)
	var b_vent := Button.new()
	b_vent.text = "💨 SLÄPP ÅNGA (-18%)"
	b_vent.pressed.connect(func():
		stoker_pressure = clampf(stoker_pressure - 0.18, 0.0, 1.0)
		AudioMgr.play_sound("paper")
	)
	row.add_child(b_coal)
	row.add_child(b_vent)
	add_child(row)

func _start_piano() -> void:
	mode = "piano"
	active = true
	piano_round = 0
	piano_seq.clear()

	piano_lbl = Label.new()
	piano_lbl.text = "🎹 KONSERTPIANIST · Lyssna och upprepa melodin (2 rundor)!"
	add_child(piano_lbl)

	var row := HBoxContainer.new()
	for i in range(PIANO_NAMES.size()):
		var b := Button.new()
		b.text = PIANO_NAMES[i]
		b.custom_minimum_size = Vector2(64, 68)
		var idx: int = i
		b.pressed.connect(func(): _press_piano_key(idx))
		row.add_child(b)
	add_child(row)
	_next_piano_round()

func _next_piano_round() -> void:
	piano_round += 1
	if piano_round > 2:
		active = false
		finished.emit(true, "Du spelade alla melodier perfekt!")
		return
	piano_seq.clear()
	var length: int = 2 + piano_round
	for _i in range(length):
		piano_seq.append(randi() % PIANO_NAMES.size())
	piano_step = 0
	piano_waiting = false
	var notes_txt: Array[String] = []
	for n in piano_seq:
		notes_txt.append(PIANO_NAMES[n])
	piano_lbl.text = "🎹 Runda %d/2 — Spela: %s" % [piano_round, " → ".join(notes_txt)]
	for i in range(piano_seq.size()):
		var f: float = PIANO_FREQS[piano_seq[i]]
		get_tree().create_timer(0.28 * float(i)).timeout.connect(func():
			if is_instance_valid(self) and active:
				AudioMgr.play_note(f, 0.20)
		)
	piano_waiting = true

func _press_piano_key(idx: int) -> void:
	if not active or not piano_waiting:
		return
	AudioMgr.play_note(PIANO_FREQS[idx], 0.18)
	if idx == piano_seq[piano_step]:
		piano_step += 1
		if piano_step >= piano_seq.size():
			_next_piano_round()
	else:
		active = false
		finished.emit(false, "Fel ton på pianot!")

func _process(delta: float) -> void:
	if not active or mode != "stoker":
		return
	stoker_time += delta
	stoker_pressure = clampf(stoker_pressure - 0.16 * delta, 0.0, 1.0)
	if stoker_pressure >= 0.40 and stoker_pressure <= 0.75:
		stoker_good_time += delta
	stoker_bar.value = stoker_pressure * 100.0
	stoker_hud.text = "🚂 Tryck: %d%% (Mål 40-75%%) · Grön tid: %.1f / 4.5s (Tid: %.1f / 8s)" % [int(stoker_pressure * 100.0), stoker_good_time, stoker_time]
	if stoker_good_time >= 4.5:
		active = false
		finished.emit(true, "Perfekt ångtryck!")
	elif stoker_time >= 8.0:
		active = false
		finished.emit(false, "Ångtrycket föll utanför gröna zonen!")
