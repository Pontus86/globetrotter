extends Node

## Globetrotter: Scotland Yard 3D — Central spelmotor (Autoload: GameState)
## Kontinuerlig 10-dagarsklocka, reskassa (2200 kr), koordinerade polisbottar,
## avgångs-ping för flyg, 4s/2s boarding, polisradio & taktiska prylar.

signal match_started
signal view_changed(mode: String, city_id: String)
signal radio_logged(entry: Dictionary)
signal game_ended(player_won: bool, summary: String)
signal city_arrived(city_id: String)
signal challenge_requested(city_id: String)
signal departures_requested(city_id: String)
signal extra_place_requested(place_key: String, city_id: String)

const TOTAL_DAYS := 10
const REVEAL_DAYS := [3, 6, 8]
const CAPTURE_DIST_M := 6.0 # 1 Godot-meter ≈ 6.3 kartmeter (skalad stad ~180x180m)
const VISION_DIST_M := 36.0
const LOSE_SIGHT_DIST_M := 44.0

var cities: Dictionary = {}
var police_roster: Array = []

var active: bool = false
var finished: bool = false
var player_role: String = "thief" # "thief" | "police"
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
var reveal_triggered: Dictionary = {}
var last_ping: Dictionary = {} # { city_id, day, hh, mm, time, reason }

var gear: Dictionary = {
	"lockpick": 0,
	"smoke": 0,
	"fake_pass": 0
}
var skip_next_reveal: bool = false
var guide_hint_ready: bool = false
var police_frozen_until: float = 0.0
var thief_hidden_until: float = 0.0
var boost_until: float = 0.0
var boost_cooldown_until: float = 0.0

# Aktörer på världsnivå
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
	radio_feed.clear()
	stats = { "solved": 0, "travels": 0, "reveals": 0 }
	gear = { "lockpick": 0, "smoke": 0, "fake_pass": 0 }
	skip_next_reveal = false
	guide_hint_ready = false
	police_frozen_until = 0.0
	thief_hidden_until = 0.0
	boost_until = 0.0
	boost_cooldown_until = 0.0

	var all_ids: Array[String] = []
	for k in cities.keys():
		all_ids.append(String(k))
	all_ids.shuffle()

	var police_starts: Array[String] = []
	for p in police_roster:
		police_starts.append(String(p["startCity"]))

	var thief_start := "paris"
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

	current_city_id = thief_start
	thief = {
		"city": thief_start,
		"travel": null,
		"boarding": null
	}

	police.clear()
	for idx in range(police_roster.size()):
		var p = police_roster[idx]
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

	add_radio("Jakten har börjat! Du startar i %s med %s." % [cities[thief_start]["name"], format_kr(cash)], "good")
	match_started.emit()
	set_view_mode("city", thief_start)

func _process(delta: float) -> void:
	if not active or finished:
		return
	elapsed_sec += delta

	if elapsed_sec >= TOTAL_DAYS * sec_per_day:
		end_game(player_role == "police", "Tiden tog slut efter 10 dagar! Poliserna stoppade kuppen.")
		return

	var clk := get_clock()
	for rd in REVEAL_DAYS:
		if clk["day"] >= rd and not reveal_triggered.has(rd):
			reveal_triggered[rd] = true
			var pc: String = thief["travel"]["to"] if thief["travel"] != null else thief["city"]
			trigger_thief_reveal(pc, "Obligatorisk radarping Dag %d" % rd)

	# Uppdatera boarding & resor för Tjuv + Poliser
	_tick_actor_transit(thief, true)
	for p in police:
		_tick_actor_transit(p, false)

	# Uppdatera AI-poliser på globnivå
	_update_police_globe_ai(delta)

func _tick_actor_transit(actor: Dictionary, is_thief: bool) -> void:
	if actor["boarding"] != null:
		var b: Dictionary = actor["boarding"]
		if elapsed_sec >= b["start_sec"] + b["duration_sec"]:
			actor["boarding"] = null
			_start_travel(actor, b["to"], b["mode"], is_thief, b.get("emergency", false))
	if actor["travel"] != null:
		var t: Dictionary = actor["travel"]
		if elapsed_sec >= t["start_sec"] + t["duration_sec"]:
			var dest: String = t["to"]
			actor["city"] = dest
			actor["travel"] = null
			if is_thief:
				current_city_id = dest
				add_radio("Framme i %s!" % cities[dest]["name"], "good")
				city_arrived.emit(dest)
				set_view_mode("city", dest)
			else:
				if thief["travel"] == null and thief["city"] == dest:
					add_radio("🚨 VARNING! %s har landat i %s!" % [actor["name"], cities[dest]["name"]], "alert")

func begin_thief_boarding(dest_id: String, mode: String, emergency: bool = false) -> bool:
	if finished or thief["travel"] != null or thief["boarding"] != null:
		return false
	var fare := get_fare_kr(thief["city"], dest_id, mode)
	if not emergency and cash < fare:
		add_radio("💰 Saknar pengar (%s krävs)! Klara stadens sevärdhet för +900 kr." % format_kr(fare), "alert")
		return false
	if emergency:
		cash = maxi(0, cash - 250)
	var dur := 2.0 if emergency else 4.0
	thief["boarding"] = {
		"to": dest_id,
		"mode": mode,
		"start_sec": elapsed_sec,
		"duration_sec": dur,
		"emergency": emergency
	}
	add_radio("%s Boarding mot %s (%ds på stationen)..." % ["🏃 NÖDFLYKT!" if emergency else "🚂", cities[dest_id]["name"], int(dur)], "alert" if emergency else "good")
	return true

func cancel_thief_boarding() -> void:
	if thief.get("boarding") != null:
		thief["boarding"] = null
		add_radio("🏃 Avbröt boarding!", "")

func _start_travel(actor: Dictionary, dest_id: String, mode: String, is_thief: bool, emergency: bool = false) -> void:
	var from_id: String = actor["city"]
	if from_id == dest_id:
		return
	var dur := get_travel_seconds(from_id, dest_id, mode)
	if is_thief:
		var fare := get_fare_kr(from_id, dest_id, mode)
		cash = maxi(0, cash - fare)
		stats["travels"] += 1
		set_view_mode("globe", from_id)
	actor["travel"] = {
		"from": from_id,
		"to": dest_id,
		"mode": mode,
		"start_sec": elapsed_sec,
		"duration_sec": dur
	}
	# Balanserad regel: Flyg & Nödflykt avslöjar AVGÅNGSSTADEN (inte destinationen!)
	if is_thief and (mode == "flight" or emergency):
		if mode == "flight" and gear["fake_pass"] > 0:
			gear["fake_pass"] -= 1
			add_radio("🛂 Förfalskat pass använt — ditt flyg från %s hölls osynligt!" % cities[from_id]["name"], "good")
		else:
			trigger_thief_reveal(from_id, "Nödflykt från %s!" % cities[from_id]["name"] if emergency else "Lyfte med direktflyg från %s!" % cities[from_id]["name"])
	elif is_thief:
		add_radio("🚂 Smyger med tåg/båt mot %s (%ds)." % [cities[dest_id]["name"], int(dur)], "good")

func trigger_thief_reveal(city_id: String, reason: String) -> void:
	if skip_next_reveal:
		skip_next_reveal = false
		add_radio("🎭 Din hotellförklädnad blockerade radarpingen (%s)!" % reason, "good")
		return
	var clk := get_clock()
	last_ping = {
		"city_id": city_id,
		"day": clk["day"],
		"hh": clk["hh"],
		"mm": clk["mm"],
		"time": elapsed_sec,
		"reason": reason
	}
	stats["reveals"] += 1
	add_radio("📡 RADARPING i %s! (%s)" % [cities[city_id]["name"], reason], "alert")

func register_miss(city_id: String, reason: String) -> String:
	misses_count += 1
	if misses_count >= miss_limit:
		misses_count = 0
		trigger_thief_reveal(city_id, "%s (%d missar)" % [reason, miss_limit])
		return "🚨 LARM! (%d/%d missar) — Poliserna ser din stad!" % [miss_limit, miss_limit]
	var left := miss_limit - misses_count
	return "⚠️ Miss (%d/%d)! %d kvar innan larmet går!" % [misses_count, miss_limit, left]

func complete_landmark_challenge(city_id: String, loud: bool = false) -> void:
	stats["solved"] += 1
	var is_target := real_targets.has(city_id) and not collected_targets.has(city_id)
	if is_target:
		collected_targets.append(city_id)
		cash += 600
		add_radio("🏆 Stöldgods: %s i %s (+600 kr · %d/3)!" % [cities[city_id]["landmark"]["artifact"], cities[city_id]["name"], collected_targets.size()], "good")
		if loud:
			trigger_thief_reveal(city_id, "Snabbkupp vid %s!" % cities[city_id]["landmark"]["name"])
		if collected_targets.size() >= 3:
			end_game(true, "Du samlade alla 3 föremål inom tidsgränsen!")
	else:
		cash += 900
		boost_cooldown_until = 0.0
		add_radio("💰 Snyggt jobb i %s: +900 kr & fulladdad Sprint!" % cities[city_id]["name"], "good")

func activate_sprint_boost() -> bool:
	if elapsed_sec < boost_cooldown_until or thief["travel"] != null:
		return false
	boost_until = elapsed_sec + 10.0
	boost_cooldown_until = elapsed_sec + 25.0
	trigger_thief_reveal(thief["city"], "Sprint-boost aktiverad!")
	return true

func trigger_crowd_hide(place_name: String) -> void:
	thief_hidden_until = elapsed_sec + 8.0
	add_radio("👥 Du smälte in i folkmassan på %s! Polisen tappade spåret i 8s!" % place_name, "good")

func _update_police_globe_ai(delta: float) -> void:
	var ping_city: String = last_ping.get("city_id", "")
	var ping_age: float = elapsed_sec - float(last_ping.get("time", -999.0))
	var active_suspects: Array[String] = []
	for s in suspect_pool:
		if not collected_targets.has(s) and not cleared_suspects.has(s):
			active_suspects.append(s)

	for p in police:
		if p["travel"] != null or p["boarding"] != null:
			continue
		if thief["travel"] == null and p["city"] == thief["city"]:
			continue # Jagar inne i 3D-staden

		p["ai_cooldown"] -= delta
		if p["ai_cooldown"] > 0.0:
			continue
		p["ai_cooldown"] = 2.0 + randf() * 1.5

		var claimed: Array[String] = []
		for o in police:
			if o["id"] != p["id"]:
				claimed.append(o["travel"]["to"] if o["travel"] != null else o["city"])

		var goal := ""
		var radio_msg := ""
		var idx: int = p["idx"]
		if idx == 0:
			if ping_city != "" and ping_city != p["city"] and ping_age < 25.0:
				goal = ping_city
				radio_msg = '📻 %s: "Färskt spår — tar sikte på %s!"' % [p["short"], cities[ping_city]["name"]]
			elif ping_city != "":
				var nb: Array = cities[ping_city]["trains"] + cities[ping_city]["flights"]
				for n in nb:
					if n != p["city"] and not claimed.has(n):
						goal = String(n)
						break
				if goal != "":
					radio_msg = '📻 %s: "Spåret kallnar — söker vidare i %s!"' % [p["short"], cities[goal]["name"]]
		elif idx == 1:
			if ping_city != "" and active_suspects.size() > 0:
				var best_d := 1e9
				for s in active_suspects:
					if s != p["city"] and not claimed.has(s):
						var d := haversine_km(cities[ping_city]["center"], cities[s]["center"])
						if d < best_d:
							best_d = d
							goal = s
				if goal != "":
					radio_msg = '📻 %s: "Genskjuter flyktvägen vid %s!"' % [p["short"], cities[goal]["name"]]
		else:
			for s in active_suspects:
				if s != p["city"] and not claimed.has(s):
					goal = s
					break
			if goal != "":
				radio_msg = '📻 %s: "Lägger mig i bakhåll vid %s."' % [p["short"], cities[goal]["name"]]

		if goal != "" and goal != p["city"]:
			var step := bfs_next_step(p["city"], goal)
			if not step.is_empty():
				p["boarding"] = { "to": step["to"], "mode": step["mode"], "start_sec": elapsed_sec, "duration_sec": 5.0, "emergency": false }
				if radio_msg != "" and randf() < 0.7:
					add_radio(radio_msg, "police")

func bfs_next_step(from_id: String, to_id: String) -> Dictionary:
	if from_id == to_id:
		return {}
	var q: Array = [[from_id]]
	var seen: Dictionary = { from_id: true }
	while q.size() > 0:
		var path: Array = q.pop_front()
		var cur: String = path[path.size() - 1]
		var edges: Array = cities[cur]["flights"] + cities[cur]["trains"]
		for nxt in edges:
			var ns := String(nxt)
			if ns == to_id:
				var first: String = ns if path.size() == 1 else String(path[1])
				var mode := "flight" if cities[from_id]["flights"].has(first) else "train"
				return { "to": first, "mode": mode }
			if not seen.has(ns):
				seen[ns] = true
				var next_path := path.duplicate()
				next_path.append(ns)
				q.append(next_path)
	return {}

func set_view_mode(mode: String, city_id: String = "") -> void:
	view_mode = mode
	if city_id != "":
		current_city_id = city_id
	view_changed.emit(view_mode, current_city_id)

func add_radio(text: String, kind: String = "") -> void:
	var clk := get_clock()
	var entry := { "text": "D%d %s:%s %s" % [clk["day"], clk["hh"], clk["mm"], text], "raw": text, "kind": kind }
	radio_feed.push_front(entry)
	if radio_feed.size() > 24:
		radio_feed.pop_back()
	radio_logged.emit(entry)

func send_player_radio(msg: String) -> void:
	var clean := msg.strip_edges()
	if clean == "":
		return
	add_radio('🎙️ Du (kapad radio): "%s"' % clean, "thief")
	var sp: Dictionary = police[randi() % police.size()]
	var reply := '📻 %s: "Tjuven kapar vår frekvens! Håll ögonen öppna!"' % sp["short"]
	for cid in cities.keys():
		if clean.to_lower().find(String(cities[cid]["name"]).to_lower()) != -1:
			reply = '📻 %s: "Hörde ni? Tjuven nämnde %s — bluff eller misstag?"' % [sp["short"], cities[cid]["name"]]
			break
	get_tree().create_timer(1.0).timeout.connect(func():
		if active and not finished:
			add_radio(reply, "police")
	)

func end_game(won: bool, summary: String) -> void:
	if finished:
		return
	finished = true
	game_ended.emit(won, summary)

func get_clock() -> Dictionary:
	var f := elapsed_sec / sec_per_day
	var day := mini(TOTAL_DAYS, int(floor(f)) + 1)
	var frac := f - floor(f)
	var mins := int(floor(frac * 24.0 * 60.0))
	return {
		"day": day,
		"hh": "%02d" % int(mins / 60),
		"mm": "%02d" % (mins % 60)
	}

func haversine_km(a: Array, b: Array) -> float:
	var lat1 := deg_to_rad(float(a[1]))
	var lat2 := deg_to_rad(float(b[1]))
	var dlat := lat2 - lat1
	var dlon := deg_to_rad(float(b[0]) - float(a[0]))
	var x := pow(sin(dlat * 0.5), 2) + cos(lat1) * cos(lat2) * pow(sin(dlon * 0.5), 2)
	return 2.0 * 6371.0 * asin(sqrt(clampf(x, 0.0, 1.0)))

func get_travel_seconds(from_id: String, to_id: String, mode: String) -> float:
	var km := haversine_km(cities[from_id]["center"], cities[to_id]["center"])
	if mode == "flight":
		return clampf(roundf(6.0 + km / 260.0), 7.0, 16.0)
	return clampf(roundf(10.0 + km / 140.0), 12.0, 24.0)

func get_fare_kr(from_id: String, to_id: String, mode: String) -> int:
	var km := haversine_km(cities[from_id]["center"], cities[to_id]["center"])
	if mode == "flight":
		return int(round((650.0 + km * 0.30) / 50.0) * 50.0)
	return int(round((300.0 + km * 0.25) / 50.0) * 50.0)

func format_kr(amount: int) -> String:
	return "%d kr" % amount
