# Globetrotter

Ett webbläsarspel om att resa jorden runt på egen hand.
Inspirerat av BackPacker 1 och 2 och *80 Days*, men ett helt eget spel med öppet innehåll.

**Status:** Spelbar vertikal slice (minimalspel enligt kapitel 12 i designdokumentet).

- **Spelbar prototyp:** Öppna [proto/index.html](proto/index.html) direkt i webbläsaren.
- **Designdokument:** [docs/DESIGN.md](docs/DESIGN.md)
- **Visuell förlaga:** [sketches/fotomontage/index.html](sketches/fotomontage/index.html)

## Vad vertikala slicen innehåller

1. **Jorden-runt-rutt med 6 städer och 3 underverk:**
   - Stockholm $\rightarrow$ Kairo $\rightarrow$ Delhi $\rightarrow$ Tokyo $\rightarrow$ San Francisco $\rightarrow$ New York $\rightarrow$ Stockholm.
   - Underverk: Giza-pyramiderna, Taj Mahal och Grand Canyon.
2. **Resurs- och tidsmodell:**
   - 16 speltimmar per dygn (08:00–24:00), 30 dagars tidsgräns, startkassa 10 000 kr.
   - Hotellnatt återställer timmarna och visar **kvällsrapport** med teaser inför morgondagen.
3. **Kunskapsmoment (Lär först, svara sedan):**
   - Faktakort och frågor för varje höjdpunkt och underverk.
   - Full pott på en stads höjdpunkter ger pass-stämpel ("Staden gjord").
4. **Ekonomi och Souvenirer:**
   - Avståndspris: souvenirer ökar i värde ju längre bort de säljs.
   - Praktisk användning: guideböcker stryker fel svar, kamera ger +50 % lön på jobb, kängor förkortar expeditionstiden vid Grand Canyon.
5. **Jobb och resor:**
   - Arbetspass i varje stad som betalar lön baserat på rätt svar.
   - Flyg- och båtresor med distans- och tidsberäkning samt sista-minuten-erbjudanden.
6. **3D-Jordglob och BackPacker-flyglinje:**
   - Interaktiv roterbar 3D-jordglob som nås via snabbknapp (🌍 *Jordglob*).
   - Vid resor ritas en animerad röd storcirkellinje ut över klotet med flygplansikon och motorljud.
   - Visar totalt tillryggalagda kilometer och alla avverkade rutter.
7. **Slutrevy och Hemmamuseum:**
   - Utvärdering och titel (*Turist*, *Resenär*, *Upptäckare*, *Globetrotter*).
   - Hemförda souvenirer sparas till spelarens permanenta museum i webbläsaren (`localStorage`).

## Innehåll och licenser

Spelet använder uteslutande fritt användbara bilder, kartor och fakta från **Wikimedia Commons** och **Wikipedia** (CC BY, CC BY-SA, Public Domain / CC0). Alla referenser till BackPacker 2:s fasta koordinater har rensats bort till förmån för en responsiv 16:9 fotomontagedesign.
