# Globetrotter

Ett svenskt reseäventyr i webbläsaren, inspirerat av 90-talets klassiska *BackPacker*-spel och *80 Days*. Du startar i Malmö med 10 000 kr, ett tomt svenskt pass och 45 dagar på dig att resa jorden runt, arbeta längs vägen, handla på lokala marknader och ta dig hem igen.

**Spela direkt i webbläsaren:** https://pontus86.github.io/globetrotter/

## Så fungerar spelet

Varje ny resa slumpar fram personliga mål som skrivs in på sida 2 i ditt pass:
- Besök minst **3 världsdelar** och återvänd till Malmö innan tiden tar slut.
- Skaffa **yrkeskompetens i 3 olika yrken** genom att ta jobbpass i lokaltidningen och klara arbetsprovet.
- Ta med (eller posta hem) **souvenirer från 3 utvalda städer** runt om i världen.

### Innehåll i korthet

- **67 spelbara städer över 6 kontinenter:** Malmö, Stockholm, Oslo, Köpenhamn, Helsingfors, Reykjavik, Dublin, London, Paris, Amsterdam, Bryssel, Berlin, Prag, Wien, Zürich, Madrid, Lissabon, Rom, Aten, Istanbul, Moskva, Kairo, Marrakech, Tunis, Nairobi, Addis Abeba, Lagos, Dakar, Dar es-Salaam, Antananarivo, Kapstaden, Jerusalem, Dubai, Delhi, Mumbai, Katmandu, Colombo, Bangkok, Singapore, Hanoi, Hongkong, Peking, Seoul, Tokyo, Kyoto, Jakarta, Manila, Sydney, Melbourne, Auckland, Wellington, Toronto, Vancouver, Chicago, New York, San Francisco, Los Angeles, Miami, Mexico City, Havanna, Panama City, Bogotá, Quito, Lima, Santiago, Buenos Aires och Rio de Janeiro.
- **218 sevärdheter och 20 världsarv:** Sevärdheterna börjar som outforskade landmärken på stadskartan tills du besöker dem, frågar runt i hotellbaren eller har en guidebok i packningen. De 20 världsarven (bl.a. Machu Picchu, Mount Everest, Ilulissat isfjord och Pyramiderna i Giza) syns som guldstjärnor på 3D-jordgloben och har egna helskärmsscener och unika minispel.
- **201 jobb & 39 egna minispel:** Varje stad har tre jobbpass i dagstidningen (6-frågors arbetsprov i BackPacker-stil + 39 egna fotografiska och arkadinspirerade minispel).
- **Dagliga avgångstavlor och oceanhamnar:** Du kan inte flyga vart som helst när som helst. Varje stad har ett realistiskt ruttnätverk där dagens avgångar, flightnummer och eventuella Stand by-biljetter lottas fram varje morgon.
- **Marknader, basarer och postkontor:** Pruta på lokala varor, sälj dem längre bort på jordgloben för vinst, uppgradera väskan i 4 steg (2, 5, 7 och 9 platser), köp reseutrustning eller posta hem dina målsouvenirer till Malmö.
- **Stadens bibliotek:** Varje stad har sitt eget bibliotek där du kan slå upp landets flagga, basfakta och trivia.
- **3D-jordglob och 3D-ryggsäck i WebGL:** Interaktiv jordglob med topografisk bergsrelief, röda flyglinjer och zoom, samt en vridbar 3D-vandringsryggsäck.
- **Egen ljudmotor och sparande:** Alla ljudeffekter skapas direkt med Web Audio API och din resa sparas automatiskt lokalt i webbläsaren.

## Köra spelet lokalt

Eftersom spelet laddar WebGL-texturer och en binär 3D-modell behöver det köras över en lokal webbserver (inte direkt via `file://`).

```bash
python -m http.server 8080 --directory proto
```

Öppna sedan http://localhost:8080 i webbläsaren.

## Projektstruktur

- `proto/index.html` - Huvudsida för spelet
- `proto/js/game.js` - Spelmotor, UI, ljudmotor och sparhantering
- `proto/js/globe.js` - 3D-jordglob i WebGL med relief och flyglinjer
- `proto/js/backpack3d.js` - 3D-renderare för vandringsryggsäcken
- `proto/data/` - Städer, frågor, jobbkatalog, världens huvudstäder och landsfakta
- `proto/assets/` - Foton, stadskartor, flaggor, jordglobstexturer och 3D-modell
- `docs/DESIGN.md` - Designdokument och anteckningar

## Öppna källor och licenser

Spelet är byggt helt utan upphovsrättsskyddat material från äldre kommersiella spel och använder fria källor:
- **Foton, historiska kartor och flaggor:** Wikimedia Commons / Wikipedia (Public Domain, CC0, CC BY, CC BY-SA)
- **Jordglobens texturer och höjddata:** NASA Visible Earth / Blue Marble & SRTM (Public Domain)
- **Landsgränser på jordgloben:** Natural Earth 110m (Public Domain)
- **3D-modeller (Ryggsäckar & Duffelbag):** Yellow Backpack av Jungle Jim / Sketchfab (CC BY), Duffle Bag av MadeByYeshe / Sketchfab (CC BY) och Hiking Backpack av DailyArt / Sketchfab (CC BY-NC)
- **Typsnitt:** Google Fonts (Playfair Display, Lora, Special Elite)
