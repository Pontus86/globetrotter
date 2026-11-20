"""Kopierar ljud, filmer och stadsbilder från BackPacker-projekten (endast läsning där).

Materialet är © TATI Mixedia / BMG Interactive och används bara lokalt, för
personligt bruk. Det får inte publiceras eller delas vidare.
Användning: python tools/copy_bp_assets.py  (körs från proto/)
"""
import shutil
from pathlib import Path

DOCS = Path(__file__).resolve().parents[3]
BP1 = DOCS / "backpacker-web" / "web" / "assets"
BP2 = DOCS / "backpacker2-web" / "web" / "assets"
OUT = Path("assets/bp")

CITY_IDS = {"stockholm": 56, "kairo": 24, "delhi": 46, "tokyo": 50, "sanfrancisco": 3, "newyork": 6}
BP2_SOUNDS = {
    "klick": "menu/Klick.wav", "cash_in": "shop/Cash_in.wav", "cash_out": "shop/Cash_out.wav",
    "right1": "jobs/shared/Right1.wav", "right2": "jobs/shared/Right2.wav",
    "wrong1": "jobs/shared/Wrong1.wav", "wrong2": "jobs/shared/Wrong2.wav",
    "almost": "jobs/shared/Almost1.wav", "bell": "shared/Bell.wav", "sight": "shared/SightSound.wav",
    "takeoff": "map-flight/TakeOff.wav", "ferry": "shared/FerryHorn.wav",
    "time": "shared/timePasses.wav", "save": "menu/SaveSound.wav", "nomoney": "airport/NoMoney.wav",
    "happening": "shared/HappeningSound.wav", "shop": "shop/SHOP1.wav", "home": "map-flight/INTRO16.wav",
}
BP1_SOUNDS = {
    "theme": "snd/misc/bp_theme.mp3", "happy": "snd/misc/bp_happ.mp3", "fanfar": "snd/alarms/fanfar.mp3",
    "travel_sanfrancisco": "snd/music/travel3.mp3", "travel_newyork": "snd/music/travel6.mp3",
    "travel_kairo": "snd/music/travel24.mp3", "travel_delhi": "snd/music/travel46.mp3",
    "travel_tokyo": "snd/music/travel50.mp3",
    "amb_af": "snd/bckgrnds/city_af.mp3", "amb_rm": "snd/bckgrnds/city_rm.mp3",
    "amb_en": "snd/bckgrnds/city_en.mp3", "amb_ny": "snd/bckgrnds/city_ny.mp3",
    "hotel": "snd/bckgrnds/hotel1.mp3",
}

def copy(src: Path, dst: Path):
    if not src.exists():
        raise SystemExit(f"Saknas: {src}")
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(src, dst)

def main():
    for key, cid in CITY_IDS.items():
        copy(BP2 / "city-entry" / str(cid) / "base.png", OUT / "city" / f"{key}.png")
    for key, rel in BP2_SOUNDS.items():
        copy(BP2 / rel, OUT / "snd" / f"{key}.wav")
    for key, rel in BP1_SOUNDS.items():
        copy(BP1 / rel, OUT / "snd" / f"{key}.mp3")
    for n in range(1, 19):
        copy(BP2 / "ap-qt" / f"AP{n}.mp4", OUT / "film" / f"AP{n}.mp4")
    for n in range(1, 6):
        copy(BP2 / "ha-qt" / f"HA{n}.mp4", OUT / "film" / f"HA{n}.mp4")
    for n in range(121, 135):
        copy(BP2 / "map-flight" / f"stamp{n}.png", OUT / "stamp" / f"stamp{n}.png")
    total = sum(f.stat().st_size for f in OUT.rglob("*") if f.is_file())
    print(f"Kopierat till {OUT}: {sum(1 for f in OUT.rglob('*') if f.is_file())} filer, {total/1e6:.1f} MB")

if __name__ == "__main__":
    main()
