extends Node

## Syntetiserad 90-tals ljudmotor i Godot 4 (Autoload: AudioMgr)
## Speglar proto/js/audio.js helt utan externa ljudfiler.

var enabled: bool = true
var player: AudioStreamPlayer
var gen: AudioStreamGenerator
var playback: AudioStreamGeneratorPlayback
var queue: Array[Dictionary] = [] # { freq, end_freq, dur, vol, wave, elapsed }
var phase: float = 0.0

func _ready() -> void:
	player = AudioStreamPlayer.new()
	gen = AudioStreamGenerator.new()
	gen.mix_rate = 22050.0
	gen.buffer_length = 0.12
	player.stream = gen
	add_child(player)
	player.play()
	playback = player.get_stream_playback() as AudioStreamGeneratorPlayback

func toggle() -> bool:
	enabled = not enabled
	return enabled

func play_sound(snd: String) -> void:
	if not enabled:
		return
	match snd:
		"klick":
			_tone(620.0, 240.0, 0.04, 0.14)
		"paper":
			_tone(320.0, 180.0, 0.08, 0.09)
		"flap":
			_tone(520.0, 160.0, 0.04, 0.14)
			_tone(480.0, 140.0, 0.04, 0.12)
		"stamp":
			_tone(155.0, 48.0, 0.15, 0.25)
		"bell":
			_tone(1318.0, 1318.0, 0.28, 0.14)
		"cash_in":
			_tone(1046.0, 1568.0, 0.14, 0.14)
		"cash_out":
			_tone(784.0, 587.0, 0.12, 0.12)
		"right1":
			_tone(523.0, 659.0, 0.12, 0.15)
			_tone(784.0, 784.0, 0.16, 0.14)
		"wrong1":
			_tone(290.0, 185.0, 0.22, 0.16)
		"fanfar":
			_tone(523.0, 659.0, 0.12, 0.16)
			_tone(784.0, 1046.0, 0.26, 0.18)
		"takeoff":
			_tone(140.0, 320.0, 0.35, 0.12)
		"ferry":
			_tone(110.0, 92.0, 0.35, 0.12)
		_:
			_tone(520.0, 480.0, 0.05, 0.10)

func play_note(freq: float, dur: float = 0.22) -> void:
	if enabled:
		_tone(freq, freq, dur, 0.16)

func _tone(freq: float, end_freq: float, dur: float, vol: float) -> void:
	queue.append({ "f0": freq, "f1": end_freq, "dur": dur, "vol": vol, "t": 0.0 })

func _process(_delta: float) -> void:
	if playback == null and player != null:
		playback = player.get_stream_playback() as AudioStreamGeneratorPlayback
	if playback == null:
		return
	var frames_avail: int = playback.get_frames_available()
	if frames_avail <= 0:
		return
	var sr: float = gen.mix_rate
	for _i in range(frames_avail):
		var sample: float = 0.0
		if queue.size() > 0:
			var cur: Dictionary = queue[0]
			var t: float = float(cur["t"])
			var dur: float = float(cur["dur"])
			var frac: float = clampf(t / maxf(0.001, dur), 0.0, 1.0)
			var freq: float = lerpf(float(cur["f0"]), float(cur["f1"]), frac)
			var env: float = sin(frac * PI)
			phase = fmod(phase + freq / sr, 1.0)
			sample = sin(phase * TAU) * float(cur["vol"]) * env
			cur["t"] = t + (1.0 / sr)
			if float(cur["t"]) >= dur:
				queue.pop_front()
		playback.push_frame(Vector2(sample, sample))
