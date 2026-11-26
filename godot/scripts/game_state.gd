extends Node

## Globetrotter: Scotland Yard 3D — Fullständig spelmotor (Autoload: GameState)
## Full paritet med webbversionen: Tjuv OCH Polischef, kontinuerlig 10-dagarsklocka,
## 2200 kr reskassa, avgångs-ping för flyg, 4s/2s boarding, Hotell/Marknad/Bibliotek,
## 3 koordinerade AI-poliser, smart AI-tjuv och live Polisradio.

signal match_started
signal view_changed(mode: String, city_id: String)
signal target_updated
signal radio_logged(entry: Dictionary)
signal game_ended(player_won: bool, summary: String)
signal city_arrived(city_id: String)
signal challenge_requested(city_id: String)
signal departures_requested(city_id: String)
signal extra_place_requested(place_key: String, city_id: String)

const TOTAL_DAYS: int = 10
const REVEAL_DAYS := [3, 6, 8]
const CAPTURE_DIST_M: float = 16.0
const VISION_DIST_M: float = 95.0
const LOSE_SIGHT_DIST_M: float = 115.0
const CROWD_HIDE_SAFE_DIST_M: float = 38.0
const POLICE_RECON_COOLDOWN_SEC: float = 90.0
const PLACE_COOLDOWN_SEC: float = 55.0

const SEA_EDGES := {
	"amsterdam--london": true,
	"copenhagen--oslo": true,
	"athens--rome": true,
	"athens--istanbul": true,
	"london--paris": true
}

var cities: Dictionary = {}
var police_roster: Array = []

var active: bool = false
var finished: bool = false
var player_role: String = "thief" # "thief" | "police"
var selected_police_id: String = "p1"
var sec_per_day: float = 60.0
var miss_limit: int = 2
var misses_count: int = 0
var elapsed_sec: float = 0.0

var view_mode: String = "city" # "city" | "globe"
var current_city_id: String = "paris"
var cash: int = 2200

var real_targets: Array[String] = []
var collected_targets: Array[String] = []
var suspect_pool: Array[String] = []
var cleared_suspects: Array[String] = []
var recon_cooldown_until: Dictionary = {}
var place_cooldown_until: Dictionary = {}
var match_token: int = 0
var nearest_police_dist_in_city: float = 999.0
var nearest_police_chasing: bool = false
var player_at_hub: bool = false
var player_sneaking: bool = false
var last_noise_pos: Vector3 = Vector3.ZERO
var last_noise_time: float = -999.0
var thief_visit_log: Dictionary = {} # city_id -> { last_to, mode_label, day, hh, mm }
var reveal_triggered: Dictionary = {}
var last_ping: Dictionary = {}

var gear: Dictionary = {
	"lockpick": 0,
	"smoke": 0,
	"fake_pass": 0,
	"fast_flight": 0,
	"hound": 0,
	"train_tap": 0
}
var skip_next_reveal: bool = false
var guide_hint_ready: bool = false
var police_frozen_until: float = 0.0
var thief_hidden_until: float = 0.0
var hound_until: float = 0.0
var train_tap_active: bool = false
var boost_until: float = 0.0
var boost_cooldown_until: float = 0.0
var ai_taunt_timer: float = 24.0

var thief: Dictionary = {}
var police: Array[Dictionary] = []
var radio_feed: Array[Dictionary] = []
var stats: Dictionary = { "solved": 0, "travels": 0, "reveals": 0 }

func _ready() -> void:
	_load_city_data()

func _load_city_data() -> void:
	var f := FileAccess.open("res://data/cities.json", FileAccess.READ)
	if f == null:
		push_error("Kunde inte öppna res://data/cities.json")
		return
	var parsed = JSON.parse_string(f.get_as_text())
	if typeof(parsed) == TYPE_DICTIONARY:
		cities = parsed.get("cities", {})
		police_roster = parsed.get("police", [])

func start_match(role: String = "thief", p_sec_per_day: float = 60.0, p_miss_limit: int = 2) -> void:
	player_role = role
	sec_per_day = p_sec_per_day
	miss_limit = p_miss_limit
	misses_count = 0
	elapsed_sec = 0.0
	cash = 2200
	finished = false
	active = true
	reveal_triggered.clear()
	last_ping.clear()
	collected_targets.clear()
	cleared_suspects.clear()
	recon_cooldown_until.clear()
	place_cooldown_until.clear()
	match_token += 1
	nearest_police_dist_in_city = 999.0
	nearest_police_chasing = false
	player_at_hub = false
	player_sneaking = false
	last_noise_time = -999.0
	thief_visit_log.clear()
	radio_feed.clear()
	stats = { "solved": 0, "travels": 0, "reveals": 0 }
	gear = { "lockpick": 0, "smoke": 0, "fake_pass": 0, "fast_flight": 0, "hound": 0, "train_tap": 0 }
	skip_next_reveal = false
	guide_hint_ready = false
	police_frozen_until = 0.0
	thief_hidden_until = 0.0
	hound_until = 0.0
	train_tap_active = false
	boost_until = 0.0
	boost_cooldown_until = 0.0
	ai_taunt_timer = 22.0 + randf() * 15.0

	var all_ids: Array[String] = []
	for k in cities.keys():
		all_ids.append(String(k))
	all_ids.shuffle()

	var police_starts: Array[String] = []
	for p in police_roster:
		police_starts.append(String(p["startCity"]))

	var thief_start: String = "paris"
	for cid in all_ids:
		if not police_starts.has(cid):
			thief_start = cid
			break

	var pool: Array[String] = []
	for cid in all_ids:
		if cid != thief_start:
			pool.append(cid)
	pool.shuffle()

	real_targets = [pool[0], pool[1], pool[2]]
	suspect_pool = [pool[0], pool[1], pool[2], pool[3], pool[4], pool[5]]
	suspect_pool.shuffle()

	thief = {
		"id": "thief",
		"city": thief_start,
		"travel": null,
		"boarding": null,
		"ai_work": 0.0,
		"ai_cd": 2.0
	}

	police.clear()
	for idx in range(police_roster.size()):
		var p: Dictionary = police_roster[idx]
		police.append({
			"idx": idx,
			"id": String(p["id"]),
			"name": String(p["name"]),
			"short": String(p["short"]),
			"city": String(p["startCity"]),
			"travel": null,
			"boarding": null,
			"ai_cooldown": 2.0 + randf() * 2.0
		})

	selected_police_id = police[0]["id"] if police.size() > 0 else "p1"
	current_city_id = thief_start if player_role == "thief" else String(police[0]["city"])

	AudioMgr.play_sound("fanfar")
	match_started.emit()

	if player_role == "thief":
		add_radio("Jakten har börjat! Du startar i %s med %s. Stjäl 3 föremål inom 10 dagar!" % [cities[thief_start]["name"], format_kr(cash)], "good")
	else:
		add_radio("Polischef redo! 6 misstänkta målstäder markerade. Välj polis [1/2/3] och genskjut tjuven!", "police")

	set_view_mode("city" if player_role == "thief" else "globe", current_city_id)

func get_controlled_actor() -> Dictionary:
	if player_role == "thief":
		return thief
	for p in police:
		if String(p["id"]) == selected_police_id:
			return p
	return police[0] if police.size() > 0 else thief

func select_police(pid: String) -> void:
	if player_role != "police":
		return
	selected_police_id = pid
	var p: Dictionary = get_controlled_actor()
	current_city_id = String(p["city"])
	AudioMgr.play_sound("klick")
	var target_mode: String = "globe" if p.get("travel") != null else view_mode
	set_view_mode(target_mode, current_city_id)

func _process(delta: float) -> void:
	if not active or finished:
		return
	elapsed_sec += delta

	if elapsed_sec >= float(TOTAL_DAYS) * sec_per_day:
		end_game(player_role == "police", "Tiden tog slut efter 10 dagar! Poliserna stoppade kuppen.")
		return

	var clk: Dictionary = get_clock()
	for rd in REVEAL_DAYS:
		if int(clk["day"]) >= int(rd) and not reveal_triggered.has(rd):
			reveal_triggered[rd] = true
			var pc: String = String(thief["travel"]["to"]) if thief["travel"] != null else String(thief["city"])
			trigger_thief_reveal(pc, "Obligatorisk radarping Dag %d" % int(rd))

	_tick_actor_transit(thief, true)
	for p in police:
		_tick_actor_transit(p, false)

	if player_role == "thief":
		_update_police_globe_ai(delta)
	else:
		_update_ai_thief_globe(delta)

func _tick_actor_transit(actor: Dictionary, is_thief: bool) -> void:
	if actor["boarding"] != null:
		var b: Dictionary = actor["boarding"]
		if elapsed_sec >= float(b["start_sec"]) + float(b["duration_sec"]):
			actor["boarding"] = null
			_start_travel(actor, String(b["to"]), String(b["mode"]), is_thief, bool(b.get("emergency", false)), bool(b.get("use_item", false)))
	if actor["travel"] != null:
		var t: Dictionary = actor["travel"]
		if elapsed_sec >= float(t["start_sec"]) + float(t["duration_sec"]):
			var dest: String = String(t["to"])
			actor["city"] = dest
			actor["travel"] = null
			var controlled: Dictionary = get_controlled_actor()
			if actor["id"] == controlled["id"]:
				current_city_id = dest
				AudioMgr.play_sound("bell")
				add_radio("Framme i %s!" % cities[dest]["name"], "good")
				city_arrived.emit(dest)
				set_view_mode("city", dest)
			elif not is_thief and player_role == "thief" and thief["travel"] == null and String(thief["city"]) == dest:
				AudioMgr.play_sound("wrong1")
				add_radio("🚨 VARNING! %s har landat i %s!" % [actor["name"], cities[dest]["name"]], "alert")
			elif not is_thief and player_role == "police" and thief["travel"] == null and String(thief["city"]) == dest:
				AudioMgr.play_sound("bell")
				add_radio("🚨 %s hittade tjuven i %s! Välj %s för att jaga!" % [actor["short"], cities[dest]["name"], actor["short"]], "alert")
			if not is_thief:
				target_updated.emit()

func begin_actor_boarding(actor: Dictionary, dest_id: String, mode: String, emergency: bool = false, use_item: bool = false) -> bool:
	if finished or actor["travel"] != null or actor["boarding"] != null:
		return false
	var is_thief_player: bool = (actor["id"] == "thief" and player_role == "thief")
	if is_thief_player:
		var fare: int = get_fare_kr(String(actor["city"]), dest_id, mode)
		if not emergency and cash < fare:
			add_radio("💰 Saknar pengar (%s krävs)! Klara stadens sevärdhet för +900 kr." % format_kr(fare), "alert")
			return false
	var dur: float = 2.0 if emergency else (4.0 if is_thief_player else 5.0)
	actor["boarding"] = {
		"to": dest_id,
		"mode": mode,
		"start_sec": elapsed_sec,
		"duration_sec": dur,
		"emergency": emergency,
		"use_item": use_item
	}
	AudioMgr.play_sound("flap")
	var tinfo: Dictionary = get_transit_mode_info(String(actor["city"]), dest_id, mode)
	add_radio("%s Boarding mot %s (%ds)..." % ["🏃 NÖDFLYKT!" if emergency else String(tinfo["icon"]), cities[dest_id]["name"], int(dur)], "alert" if emergency else "good")
	return true

func cancel_controlled_boarding() -> void:
	var a: Dictionary = get_controlled_actor()
	if a.get("boarding") != null:
		a["boarding"] = null
		AudioMgr.play_sound("klick")
		add_radio("🏃 Avbröt boarding!", "")

func _start_travel(actor: Dictionary, dest_id: String, mode: String, is_thief: bool, emergency: bool = false, use_item: bool = false) -> void:
	var from_id: String = String(actor["city"])
	if from_id == dest_id:
		return
	var dur: float = get_travel_seconds(from_id, dest_id, mode)
	var tinfo: Dictionary = get_transit_mode_info(from_id, dest_id, mode)
	var controlled: Dictionary = get_controlled_actor()

	if not is_thief and actor["id"] == controlled["id"] and use_item and int(gear["fast_flight"]) > 0:
		gear["fast_flight"] = int(gear["fast_flight"]) - 1
		dur = maxf(4.0, roundf(dur * 0.5))
		add_radio("⚡ Snabbrekvisition använd! Halverad restid (%ds)." % int(dur), "police")

	if is_thief and player_role == "thief":
		var fare: int = get_fare_kr(from_id, dest_id, mode)
		var cost: int = (fare + 250) if emergency else fare
		cash = maxi(0, cash - cost)
		AudioMgr.play_sound("cash_out")

	if is_thief:
		var clk: Dictionary = get_clock()
		thief_visit_log[from_id] = {
			"last_to": dest_id,
			"mode_label": "%s %s" % [tinfo["icon"], tinfo["label"]],
			"day": clk["day"],
			"hh": clk["hh"],
			"mm": clk["mm"]
		}

	if actor["id"] == controlled["id"]:
		stats["travels"] = int(stats["travels"]) + 1
		AudioMgr.play_sound("takeoff" if mode == "flight" else "ferry")
		set_view_mode("globe", from_id)

	actor["travel"] = {
		"from": from_id,
		"to": dest_id,
		"mode": mode,
		"start_sec": elapsed_sec,
		"duration_sec": dur
	}
	if not is_thief:
		target_updated.emit()

	# Balanserad regel: Flyg & Nödflykt avslöjar AVGÅNGSSTADEN (inte destinationen!)
	if is_thief and (mode == "flight" or emergency):
		if mode == "flight" and use_item and int(gear["fake_pass"]) > 0:
			gear["fake_pass"] = int(gear["fake_pass"]) - 1
			add_radio("🛂 Förfalskat pass använt — ditt flyg från %s hölls osynligt!" % cities[from_id]["name"], "good")
		else:
			trigger_thief_reveal(from_id, "Nödflykt från %s!" % cities[from_id]["name"] if emergency else "Lyfte med direktflyg från %s!" % cities[from_id]["name"])
	elif is_thief:
		if train_tap_active:
			train_tap_active = false
			trigger_thief_reveal(dest_id, "Tågspaning fångade %s mot %s!" % [String(tinfo["label"]).to_lower(), cities[dest_id]["name"]])
		elif player_role == "thief":
			add_radio("%s Smyger med %s mot %s (%ds)." % [tinfo["icon"], String(tinfo["label"]).to_lower(), cities[dest_id]["name"], int(dur)], "good")

func handle_globe_city_click(city_id: String) -> void:
	var actor: Dictionary = get_controlled_actor()
	if actor["travel"] != null or actor["boarding"] != null:
		return
	if String(actor["city"]) == city_id:
		set_view_mode("city", city_id)
		return
	if player_role == "thief":
		var cur_t: Dictionary = cities[actor["city"]]
		if player_at_hub and (cur_t["trains"].has(city_id) or cur_t["flights"].has(city_id)):
			var m_mode: String = "train" if cur_t["trains"].has(city_id) else "flight"
			begin_actor_boarding(actor, city_id, m_mode, false)
			return
		add_radio("🚉 Gå till stationen i %s för att resa vidare!" % cities[actor["city"]]["name"], "alert")
		set_view_mode("city", String(actor["city"]))
		return
	# Polischef kan skicka poliser direkt på globen
	var cur: Dictionary = cities[actor["city"]]
	if cur["trains"].has(city_id):
		begin_actor_boarding(actor, city_id, "train", false)
	elif cur["flights"].has(city_id):
		begin_actor_boarding(actor, city_id, "flight", false)
	else:
		departures_requested.emit(String(actor["city"]))

func trigger_thief_reveal(city_id: String, reason: String) -> void:
	if skip_next_reveal:
		skip_next_reveal = false
		add_radio("🎭 Din hotellförklädnad blockerade radarpingen (%s)!" % reason, "good")
		return
	var clk: Dictionary = get_clock()
	last_ping = {
		"city_id": city_id,
		"day": clk["day"],
		"hh": clk["hh"],
		"mm": clk["mm"],
		"time": elapsed_sec,
		"reason": reason
	}
	stats["reveals"] = int(stats["reveals"]) + 1
	AudioMgr.play_sound("stamp")
	add_radio("📡 RADARPING i %s! (%s)" % [cities[city_id]["name"], reason], "alert")

func register_miss(city_id: String, reason: String) -> String:
	AudioMgr.play_sound("wrong1")
	if player_role != "thief":
		return "❌ Fel svar — försök igen medan klockan tickar!"
	misses_count += 1
	if misses_count >= miss_limit:
		misses_count = 0
		trigger_thief_reveal(city_id, "%s (%d missar)" % [reason, miss_limit])
		return "🚨 LARM! (%d/%d missar) — Poliserna ser din stad!" % [miss_limit, miss_limit]
	var left: int = miss_limit - misses_count
	return "⚠️ Miss (%d/%d)! %d kvar innan larmet går!" % [misses_count, miss_limit, left]

func complete_landmark_challenge(city_id: String, loud: bool = false) -> void:
	stats["solved"] = int(stats["solved"]) + 1
	AudioMgr.play_sound("right1")

	if player_role == "police":
		recon_cooldown_until[city_id] = elapsed_sec + POLICE_RECON_COOLDOWN_SEC
		if not real_targets.has(city_id) and not cleared_suspects.has(city_id):
			cleared_suspects.append(city_id)
			add_radio("🔍 %s avskriven som skenmål!" % cities[city_id]["name"], "police")
		var pc: String = String(thief["travel"]["to"]) if thief["travel"] != null else String(thief["city"])
		trigger_thief_reveal(pc, "Spaningsgenombrott i %s!" % cities[city_id]["name"])
		target_updated.emit()
		return

	var is_target: bool = real_targets.has(city_id) and not collected_targets.has(city_id)
	if is_target:
		collected_targets.append(city_id)
		var reward: int = 0 if loud else 600
		cash += reward
		AudioMgr.play_sound("fanfar")
		var r_txt: String = "0 kr (Snabbkupp)" if loud else "+600 kr"
		add_radio("🏆 Stöldgods: %s i %s (%s · %d/3)!" % [cities[city_id]["landmark"]["artifact"], cities[city_id]["name"], r_txt, collected_targets.size()], "good")
		if loud:
			trigger_thief_reveal(city_id, "Snabbkupp vid %s!" % cities[city_id]["landmark"]["name"])
		target_updated.emit()
		if collected_targets.size() >= 3:
			end_game(true, "Du samlade alla 3 föremål inom tidsgränsen!")
	else:
		cash += 900
		boost_cooldown_until = 0.0
		AudioMgr.play_sound("cash_in")
		add_radio("💰 Snyggt jobb i %s: +900 kr & fulladdad Sprint!" % cities[city_id]["name"], "good")

func activate_sprint_boost() -> bool:
	if player_role != "thief" or elapsed_sec < boost_cooldown_until or thief["travel"] != null:
		return false
	boost_until = elapsed_sec + 10.0
	boost_cooldown_until = elapsed_sec + 25.0
	trigger_thief_reveal(String(thief["city"]), "Sprint-boost aktiverad!")
	return true

func trigger_crowd_hide(place_name: String) -> void:
	if player_role != "thief":
		return
	var pol_here: bool = false
	for p in police:
		if p["travel"] == null and String(p["city"]) == String(thief.get("city", "")):
			pol_here = true
			break
	if not pol_here:
		return
	if nearest_police_dist_in_city < CROWD_HIDE_SAFE_DIST_M:
		add_radio("🚨 Polisen är för nära (<%dm) — du hinner inte gömma dig i folkmassan på %s!" % [int(CROWD_HIDE_SAFE_DIST_M), place_name], "alert")
		return
	thief_hidden_until = elapsed_sec + 8.0
	add_radio("👥 Du smälte in i folkmassan på %s! Polisen tappade spåret i 8s!" % place_name, "good")

func _update_police_globe_ai(delta: float) -> void:
	var ping_city: String = String(last_ping.get("city_id", ""))
	var ping_age: float = elapsed_sec - float(last_ping.get("time", -999.0))
	var active_suspects: Array[String] = []
	for s in suspect_pool:
		if not collected_targets.has(s) and not cleared_suspects.has(s):
			active_suspects.append(s)

	for p in police:
		if p["travel"] != null or p["boarding"] != null:
			continue
		if thief["travel"] == null and String(p["city"]) == String(thief["city"]):
			continue

		p["ai_cooldown"] = float(p["ai_cooldown"]) - delta
		if float(p["ai_cooldown"]) > 0.0:
			continue
		p["ai_cooldown"] = 2.0 + randf() * 1.5

		var claimed: Array[String] = []
		for o in police:
			if String(o["id"]) != String(p["id"]):
				claimed.append(String(o["travel"]["to"]) if o["travel"] != null else String(o["city"]))

		var goal: String = ""
		var radio_msg: String = ""
		var idx: int = int(p["idx"])
		if idx == 0:
			if ping_city != "" and ping_city != String(p["city"]) and ping_age < 25.0:
				goal = ping_city
				radio_msg = '📻 %s: "Färskt spår — tar sikte på %s!"' % [p["short"], cities[ping_city]["name"]]
			elif ping_city != "":
				var nb: Array = cities[ping_city]["trains"] + cities[ping_city]["flights"]
				for n in nb:
					var ns: String = String(n)
					if ns != String(p["city"]) and not claimed.has(ns):
						goal = ns
						break
				if goal != "":
					radio_msg = '📻 %s: "Spåret kallnar — söker vidare i %s!"' % [p["short"], cities[goal]["name"]]
			else:
				for s in active_suspects:
					if s != String(p["city"]) and not claimed.has(s):
						goal = s
						break
				if goal != "":
					radio_msg = '📻 %s: "Söker igenom misstänkt mål %s."' % [p["short"], cities[goal]["name"]]
		elif idx == 1:
			if ping_city != "" and active_suspects.size() > 0:
				var best_d: float = 1e9
				for s in active_suspects:
					if s != String(p["city"]) and not claimed.has(s):
						var d: float = haversine_km(cities[ping_city]["center"], cities[s]["center"])
						if d < best_d:
							best_d = d
							goal = s
				if goal != "":
					radio_msg = '📻 %s: "Genskjuter flyktvägen vid %s!"' % [p["short"], cities[goal]["name"]]
			else:
				var hubs: Array[String] = ["zurich", "paris", "berlin", "milan", "prague"]
				for hb in hubs:
					if cities.has(hb) and hb != String(p["city"]) and not claimed.has(hb):
						goal = hb
						break
				if goal != "":
					radio_msg = '📻 %s: "Tar position vid knutpunkten %s."' % [p["short"], cities[goal]["name"]]
		else:
			for s in active_suspects:
				if s != String(p["city"]) and not claimed.has(s):
					goal = s
					break
			if goal != "":
				radio_msg = '📻 %s: "Lägger mig i bakhåll vid %s."' % [p["short"], cities[goal]["name"]]

		if goal != "" and goal != String(p["city"]):
			var step: Dictionary = bfs_next_step(String(p["city"]), goal)
			if not step.is_empty():
				p["boarding"] = { "to": step["to"], "mode": step["mode"], "start_sec": elapsed_sec, "duration_sec": 5.0, "emergency": false }
				if radio_msg != "" and randf() < 0.7:
					add_radio(radio_msg, "police")

func _update_ai_thief_globe(delta: float) -> void:
	# AI-tjuv kapar polisradion ibland i Polischef-läget!
	ai_taunt_timer -= delta
	if ai_taunt_timer <= 0.0:
		ai_taunt_timer = 30.0 + randf() * 20.0
		var fake_city: String = String(cities[suspect_pool[randi() % suspect_pool.size()]]["name"])
		add_radio('🎙️ Tjuven (kapad radio): "Ni är helt fel ute — kaffe i %s var underbart!"' % fake_city, "thief")

	if thief["travel"] != null or thief["boarding"] != null:
		return
	var cur_id: String = String(thief["city"])
	# Om en polis är i samma stad hanterar 3D-stadsloop flykten eller nödavgång
	for p in police:
		if p["travel"] == null and String(p["city"]) == cur_id:
			thief["ai_cd"] = float(thief["ai_cd"]) - delta
			if float(thief["ai_cd"]) <= 0.0:
				thief["ai_cd"] = 6.0
				var tr: Array = cities[cur_id]["trains"]
				if tr.size() > 0:
					var esc: String = String(tr[randi() % tr.size()])
					thief["boarding"] = { "to": esc, "mode": "train", "start_sec": elapsed_sec, "duration_sec": 2.0, "emergency": true }
			return

	# Stjäl i målstad efter ~10s arbete
	if real_targets.has(cur_id) and not collected_targets.has(cur_id):
		thief["ai_work"] = float(thief["ai_work"]) + delta
		if float(thief["ai_work"]) >= 10.0:
			thief["ai_work"] = 0.0
			collected_targets.append(cur_id)
			add_radio("🚨 LARM! %s stals i %s (%d/3)!" % [cities[cur_id]["landmark"]["artifact"], cities[cur_id]["name"], collected_targets.size()], "alert")
			trigger_thief_reveal(cur_id, "Stöldlarm vid %s" % cities[cur_id]["landmark"]["name"])
			target_updated.emit()
			if collected_targets.size() >= 3:
				end_game(false, "Tjuven hann stjäla alla 3 föremål!")
		return

	thief["ai_cd"] = float(thief["ai_cd"]) - delta
	if float(thief["ai_cd"]) > 0.0:
		return
	thief["ai_cd"] = 3.5

	var next_goal: String = ""
	for t in real_targets:
		if not collected_targets.has(t):
			next_goal = t
			break
	if next_goal != "":
		var step: Dictionary = bfs_next_step(cur_id, next_goal)
		if not step.is_empty():
			thief["boarding"] = { "to": step["to"], "mode": step["mode"], "start_sec": elapsed_sec, "duration_sec": 4.0, "emergency": false }

func bfs_next_step(from_id: String, to_id: String) -> Dictionary:
	if from_id == to_id:
		return {}
	var q: Array = [[from_id]]
	var seen: Dictionary = { from_id: true }
	while q.size() > 0:
		var path: Array = q.pop_front()
		var cur: String = String(path[path.size() - 1])
		var edges: Array = cities[cur]["flights"] + cities[cur]["trains"]
		for nxt in edges:
			var ns: String = String(nxt)
			if ns == to_id:
				var first: String = ns if path.size() == 1 else String(path[1])
				var mode: String = "train" if cities[from_id]["trains"].has(first) else "flight"
				return { "to": first, "mode": mode }
			if not seen.has(ns):
				seen[ns] = true
				var next_path: Array = path.duplicate()
				next_path.append(ns)
				q.append(next_path)
	return {}

func set_view_mode(mode: String, city_id: String = "") -> void:
	view_mode = mode
	if city_id != "":
		current_city_id = city_id
	AudioMgr.play_sound("paper")
	view_changed.emit(view_mode, current_city_id)

func add_radio(text: String, kind: String = "") -> void:
	var clk: Dictionary = get_clock()
	var entry: Dictionary = { "text": "D%d %s:%s %s" % [int(clk["day"]), clk["hh"], clk["mm"], text], "raw": text, "kind": kind }
	radio_feed.push_front(entry)
	if radio_feed.size() > 24:
		radio_feed.pop_back()
	radio_logged.emit(entry)

func send_player_radio(msg: String) -> void:
	var clean: String = msg.strip_edges()
	if clean == "":
		return
	var tok: int = match_token
	AudioMgr.play_sound("klick")
	if player_role == "thief":
		add_radio('🎙️ Du (kapad radio): "%s"' % clean, "thief")
		var sp: Dictionary = police[randi() % police.size()]
		var reply: String = '📻 %s: "Tjuven kapar vår frekvens! Håll ögonen öppna!"' % sp["short"]
		for cid in cities.keys():
			if clean.to_lower().find(String(cities[cid]["name"]).to_lower()) != -1:
				reply = '📻 %s: "Hörde ni? Tjuven nämnde %s — bluff eller misstag?"' % [sp["short"], cities[cid]["name"]]
				break
		get_tree().create_timer(1.0).timeout.connect(func():
			if active and not finished and match_token == tok:
				add_radio(reply, "police")
		)
	else:
		add_radio('📻 Polischef (du): "%s"' % clean, "police")
		var sp2: Dictionary = police[randi() % police.size()]
		var rep2: String = '📻 %s: "Uppfattat chefen! Befinner mig i %s."' % [sp2["short"], cities[sp2["city"]]["name"]]
		get_tree().create_timer(0.8).timeout.connect(func():
			if active and not finished and match_token == tok:
				add_radio(rep2, "police")
		)

func end_game(won: bool, summary: String) -> void:
	if finished:
		return
	finished = true
	AudioMgr.play_sound("fanfar" if won else "wrong1")
	game_ended.emit(won, summary)

func get_transit_mode_info(from_id: String, to_id: String, mode: String) -> Dictionary:
	if mode == "flight":
		return { "icon": "✈️", "label": "Flyg" }
	var k: String = ("%s--%s" % [from_id, to_id]) if from_id < to_id else ("%s--%s" % [to_id, from_id])
	if SEA_EDGES.has(k):
		return { "icon": "🚢", "label": "Båt" }
	return { "icon": "🚂", "label": "Tåg" }

func get_actor_icon(actor: Dictionary, default_icon: String) -> String:
	if actor.get("travel") != null:
		var t: Dictionary = actor["travel"]
		return String(get_transit_mode_info(String(t["from"]), String(t["to"]), String(t["mode"]))["icon"])
	return default_icon

func get_clock() -> Dictionary:
	var f: float = elapsed_sec / sec_per_day
	var day: int = mini(TOTAL_DAYS, int(floorf(f)) + 1)
	var frac: float = f - floorf(f)
	var mins: int = int(floorf(frac * 24.0 * 60.0))
	return {
		"day": day,
		"hh": "%02d" % int(mins / 60),
		"mm": "%02d" % (mins % 60)
	}

func haversine_km(a: Array, b: Array) -> float:
	var lat1: float = deg_to_rad(float(a[1]))
	var lat2: float = deg_to_rad(float(b[1]))
	var dlat: float = lat2 - lat1
	var dlon: float = deg_to_rad(float(b[0]) - float(a[0]))
	var s1: float = sin(dlat * 0.5)
	var s2: float = sin(dlon * 0.5)
	var x: float = s1 * s1 + cos(lat1) * cos(lat2) * s2 * s2
	return 2.0 * 6371.0 * asin(sqrt(clampf(x, 0.0, 1.0)))

func get_travel_seconds(from_id: String, to_id: String, mode: String) -> float:
	var km: float = haversine_km(cities[from_id]["center"], cities[to_id]["center"])
	if mode == "flight":
		return clampf(roundf(6.0 + km / 260.0), 7.0, 16.0)
	return clampf(roundf(10.0 + km / 140.0), 12.0, 24.0)

func get_fare_kr(from_id: String, to_id: String, mode: String) -> int:
	var km: float = haversine_km(cities[from_id]["center"], cities[to_id]["center"])
	if mode == "flight":
		return int(roundf((650.0 + km * 0.30) / 50.0) * 50.0)
	return int(roundf((300.0 + km * 0.25) / 50.0) * 50.0)

func format_kr(amount: int) -> String:
	return "%d kr" % amount
