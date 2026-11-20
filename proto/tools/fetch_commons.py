"""Hämtar fritt licensierade foton från Wikimedia Commons till assets/photos.

Användning: python tools/fetch_commons.py  (körs från proto/)
Skriver assets/photos/<nyckel>.jpg och assets/photos/credits.json.
"""
import json, re, sys, time, urllib.error, urllib.parse, urllib.request
from pathlib import Path

UA = "GlobetrotterPrototype/0.1 (personal non-commercial prototype)"
OK = ("CC BY", "CC0", "Public domain", "No restrictions", "PDM")
QUERIES = {
    "vasa": "Vasa ship museum Stockholm hull",
    "gamlastan": "Stortorget Gamla stan Stockholm",
    "redfort": "Red Fort Delhi Lahori Gate",
    "qutb": "File:Qutb Minar Minaret Delhi India.jpg",
    "taj": "Taj Mahal Agra front view",
    "sensoji": "Senso-ji temple Asakusa Kaminarimon",
    "tokyotower": "Tokyo Tower",
    "goldengate": "File:Golden Gate Bridge from Marin Headlands 1.jpg",
    "alcatraz": "File:Alcatraz Island as seen from the East.jpg",
    "grandcanyon": "Grand Canyon South Rim view",
    "liberty": "Statue of Liberty New York",
    "empirestate": "Empire State Building Manhattan",
}

def fetch(url):
    for attempt in range(5):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA})) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code != 429 or attempt == 4:
                raise
            time.sleep(10 * (attempt + 1))

def api(params):
    return json.loads(fetch("https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(params)))

def pick(query):
    if query.startswith("File:"):
        sel = {"titles": query}
    else:
        sel = {"generator": "search", "gsrnamespace": 6, "gsrlimit": 15,
               "gsrsearch": query + " filetype:bitmap"}
    d = api({"action": "query", "format": "json", **sel, "prop": "imageinfo",
             "iiprop": "url|size|extmetadata|mime", "iiurlwidth": 1280,
             "iiextmetadatafilter": "LicenseShortName|Artist"})
    pages = sorted(d.get("query", {}).get("pages", {}).values(), key=lambda p: p.get("index", 99))
    for p in pages:
        i = p["imageinfo"][0]
        m = i.get("extmetadata", {})
        lic = m.get("LicenseShortName", {}).get("value", "")
        if i.get("mime") != "image/jpeg" or (not query.startswith("File:") and (i["width"] < 1200 or i["width"] < i["height"])):
            continue
        if not lic.startswith(OK):
            continue
        artist = re.sub(r"<[^>]+>", "", m.get("Artist", {}).get("value", "")).strip()
        return {"title": p["title"], "license": lic, "artist": artist,
                "page": i["descriptionurl"], "thumb": i["thumburl"]}
    raise SystemExit(f"Ingen lämplig bild för {query!r}")

def main():
    out = Path("assets/photos")
    credits_path = out / "credits.json"
    credits = json.loads(credits_path.read_text(encoding="utf-8")) if credits_path.exists() else {}
    only = set(sys.argv[1:])
    for key, q in QUERIES.items():
        if only and key not in only:
            continue
        info = pick(q)
        (out / f"{key}.jpg").write_bytes(fetch(info["thumb"]))
        info.pop("thumb")
        credits[key] = info
        credits_path.write_text(json.dumps(credits, ensure_ascii=False, indent=2), encoding="utf-8")
        print(key, "|", info["title"], "|", info["license"], "|", info["artist"][:40])
        time.sleep(2)
    credits_path.write_text(json.dumps(credits, ensure_ascii=False, indent=2), encoding="utf-8")

if __name__ == "__main__":
    main()
