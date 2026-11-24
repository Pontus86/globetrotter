# Globetrotter – kritisk genomgång och åtgärdslista

**Datum:** 2026-11-23
**Underlag:** kodläsning (`proto/js/game.js`, `proto/data/`, `docs/DESIGN.md`) och speltest av början av en resa (Malmö: en sevärdhet, jobbtidningen och avgångshallen).

Bocka av punkterna allteftersom. Varje avsnitt har först **problemet** och sedan **åtgärder**.

---

## Sammanfattning

Spelet är i dagsläget ett frågesportformulär i en dyr kostym. Ta bort fotona, 3D-globen och 90-talsramarna så återstår loopen *klicka på ikon → svara på flervalsfrågor → få kronor → klicka på nästa ikon*. Spelaren fattar inga intressanta beslut, och därför känns det tråkigt.

Nästan alla verb i spelet är en quiz:

| Aktivitet | Vad spelaren faktiskt gör |
|---|---|
| Sevärdhet | Quiz med 2 frågor |
| Jobb | Quiz med 6 frågor |
| Yrkeskompetens | Minst 4 av 6 rätt på jobbquizen |
| Världsarv | Quiz eller minispel |
| Duell mot bot | Quiz |
| Telegram och utmaningar | Quiz |

---

## Uppföljning 2026-11-24

**Underlag:** de nio commits som kommit sedan första genomgången (`9d5a90d` till `187b08d`), åtta körningar av `proto/tools/test_rules.js`, mätningar på speldatan i webbläsaren och början av en ny resa från Malmö.

### Omdöme

Det har hänt mycket på ett dygn, och mycket av det är rätt saker:
- Passmålen går nu att nå tur och retur.
- Souvenirpriserna fungerar.
- Prutningen har en riktig risk.
- Man ser pris och tid innan man går in på en sevärdhet.
- Solo är standard och dag 1 börjar med en tydlig genomgång av målen.
- Det finns regeltester.

Spelet har gått från *quiz i kostym* till *quiz med en ekonomi runt omkring*. Kärnan är ändå oförändrad: det enda sättet att få lokalkännedom, lön och yrken är fortfarande att svara på flervalsfrågor. Lokalkännedomen gör kunskapen värdefull, men man skaffar den på samma sätt som förut.

### Det största problemet just nu: frysningen följdes inte

Avsnitt 4 säger *frys nytt innehåll tills kärnloopen är rolig*. Samma dygn kom ändå:
- ett helt nytt spelläge, Interpol-jakten (`js/interpol.js`, 509 rader)
- 16× zoom med Retina-skärpa på jordgloben
- tappkort och etikettfilter på globen

Ingen av punkterna i avsnitt 9 (speltest med nya spelare) är påbörjad. Det är samma mönster som förut: nya system i stället för att pröva om grundloopen håller.

### Bockar som inte stämmer med koden

- **Balansfilen** (avsnitt 7) är bara delvis genomförd. `game.js` har fortfarande 12 hårdkodade bonusbelopp, till exempel `changeCash(350, …)` för jobbrekord och `changeCash(500, …)` för stipendiet. `BOT_JOB_RECORD_BONUS` (250) och `MP_JOB_RECORD_BONUS` (300) finns i `balance.js` men används inte; koden betalar ut 350 och 400 kr. Samma sak med `ROUTE_BLOCK_SURCHARGE`, som finns kvar fast rutblockeringen är borttagen för spelaren.
- **Uppdelningen av `game.js`** (avsnitt 7) har kommit en bit. Filen har ändå 5 470 rader.
- **Juicy Couture-väskan** (avsnitt 10) är borta ur texterna, men 3D-modellen för första nivån laddar fortfarande `tier0_juicy_atlas.jpg` (`js/backpack3d.js:12–13`).
- **Bottarna får fortfarande `+500 kr` från ingenstans** när kassan tar slut (`js/bots.js:363`).

### Regeltestet och simuleringen

- **Testet är instabilt.** Ekonomisimuleringen slumpar och kräver minst 75 klarade resor av 100. På åtta körningar blev det 73–85, och en körning föll. Seeda slumpen eller sänk gränsen med god marginal.
- **Simuleringen är för snäll för att lita på.** Den:
  - antar 80 % rätt på varje jobb och att varje jobbpass ger en ny yrkeskompetens
  - räknar alltid med 4 timmar per jobb (riktiga pass är 4–8 timmar)
  - ger +36 % lokalkännedom per pass, trots att `balance.js` säger +4 % per rätt svar (högst 24 % på 6 frågor)
  - bortser från dagens avgångstavla, fullbokade avgångar, kravet på 3 världsdelar och gränsen på ett pass per jobb och dag.

  Siffran "79/100 klarade" säger därför lite om hur det går för en riktig spelare. Det är samma varning som i avsnitt 7: simulera med spelarens regler, inte en förenklad modell.
- Raden "(79 behövde jobba)" är alltid lika med antalet klarade resor, eftersom simuleringen tvingas jobba för yrkeskompetenserna. Den säger alltså ingenting.

### Mätningar på innehållet

- **Svaret står i faktatexten i 25 av 286 sevärdhetsfrågor** (räknat lågt, bara exakta ordträffar), till exempel Turning Torso → Santiago Calatrava, Nyhavn → H.C. Andersen, Tivoli → 1843 och Akropolis → Athena. Lilla torg-frågan från första genomgången finns kvar.
- **166 av 218 sevärdheter använder stadens översiktsfoto.** I alla 50 nya städer delar samtliga sevärdheter samma bild.

### Nya småbuggar

- [ ] Dag 1-genomgången visar regioner med gemener och fel namn: "Kairo (Egypten, afrika)", "New York (USA, amerika)". Den normaliserade regionnyckeln från `GT_ROUTES.normRegion` läcker ut i texten. Visa stadens riktiga `region` i stället.
- [ ] Gör regeltestet deterministiskt.

### Prioritet framåt

1. **Speltesta det som finns** innan något nytt byggs (avsnitt 9). Göm Interpol-jakten och multiplayer under tiden.
2. **Rätta de 25 frågorna** där svaret står i texten. Det tar några timmar och är det enda som ändrar upplevelsen av varje sevärdhetsbesök.
3. **Gör simuleringen ärlig**, så att balansändringar kan bedömas med siffror.
4. **För in de återstående bonusbeloppen i `balance.js`**, och rensa bort de flesta enligt avsnitt 1.

---

## Tre fel som går före balanseringen

Den oberoende granskningen omfattade början av två enspelarresor i webbläsaren, från Malmö och Oslo, samt kontroller av speldata och regler. Slutspelet bedömdes genom kodläsning. Siffrorna nedan avser versionen som granskades den 23 november 2026.

- [x] **Gör alla obligatoriska resmål nåbara och säkra hemvägen.** *(Åtgärdat: `GT_ROUTES.getRoundTripReachableCities` använder dubbelriktad BFS så passmål bara lottas bland städer nåbara tur-och-retur, Malmö ↔ Köpenhamn är kopplat och alla 67 städer ingår i nätverket. Verifierat av `proto/tools/test_rules.js`.)*
- [x] **Laga souvenirpriserna.** *(Åtgärdat: `world_50_cities.js` mappar nu `.basePrice` → `.price` och `GT_ECONOMY.getSouvenirBasePrice` skyddar mot `NaN` i hela katalogen. Osthyveln kostar 190 kr → 9 810 kr kvar.)*
- [x] **Räkna geografiska regioner konsekvent.** *(Åtgärdat: `GT_ROUTES.normRegion` normaliserar regionnamn i både målgeneratorn och `getVisitedRegions`, så Malmö–Stockholm räknas som 1 världsdel.)*

## 1. Inga verkliga avvägningar

**Problem**
- Designpelare 2 säger att tid, pengar och kunskap ska dra åt olika håll. Det gör de inte.
- Startkassan är 10 000 kr, flyg kostar 600–1 000 kr och ett jobb ger 600–1 200 kr. Pengar känns aldrig knappa.
- Det finns bonusar överallt: +400 först på plats, +350 jobbrekord, +300 duell, +250 telegram, +500 stipendium, +400 världsarv. När allt ger pengar betyder pengar ingenting.
- Vinstvillkoret är en checklista: 3 världsdelar, 3 yrken och 3 souvenirer. Det finns inget att optimera.
- Rangen i `triggerGameOver` räknas bara på stämplar, underverk och andel rätt. Pengar kvar och dagar kvar, som DESIGN.md lovar ska räknas, påverkar inte rangen. Spelaren har ingen anledning att resa smart.

**Åtgärder**
- [x] Välj en kärnspänning och bygg allt runt den *(ruttplanering under tids- och pengapress kopplat till regional lokalkännedom och reseflyt)*.
- [x] Gör pengar knappa: startkassan sänkt från `10 000 kr` till `4 500 kr` (verifierat i 100-resors ekonomisimulering i `test_rules.js`), och nödlån kostar nu `-250 p` i slutpoäng.
- [ ] Rensa bort de flesta småbonusar. Behåll några få som känns *(först-på-plats och rekordbonus nedjusterade i `balance.js`)*.
- [ ] Ge avgångar verkliga avvägningar: billigt men långsamt, dyrt men snabbt, riskabel standby.
- [x] Låt resehändelser få konsekvenser (missad anslutning, strejk, förseningar, gratis hotellnatt m.m. — 25 händelser över flyg, tåg och båt i `proto/data/travel_events.js`).
- [x] Räkna in dagar kvar och pengar kvar i slutpoängen och rangen i `triggerGameOver`.

**Kommentar från den oberoende granskningen.** Slutgraden förbiser restid och kassa, men 600–1 000 kr underskattar långflygen. Grundpriset är 500 kr plus 0,22 kr per kilometer, alltså 2 260 kr för 8 000 km före prisjusteringar. Vänta med att sänka startkassan till 3 000 kr. Om en njutbar omväg kostar både pengar, tid och slutpoäng blir det rationellt att hoppa över den. Redan nu går det att vinna utan en enda avklarad sevärdhet eller ett enda världsarv. Låt spelaren välja åtminstone ett klubbmål där en expedition eller ett lokalt uppdrag kan ersätta ett souvenirinköp.

## 2. Frågorna är svaga

**Problem**
- **Svaret står i texten.** Faktakortet om Lilla torg säger "kantat av korsvirkeshus" och frågan efter är vilken typ av trähus som finns runt Lilla torg. Det bryter mot regeln i DESIGN.md §5.2.
- **Frågan hör inte ihop med platsen.** Besök på Lilla torg ger frågan om vilken storleksplats Malmö har bland Sveriges städer.
- **Spelet testar men lär inte ut** (bryter mot pelare 1). Frågor slumpas, man gissar och glömmer. Det man lär sig i en stad används aldrig senare.
- **Ändligt innehåll ger inget omspelsvärde.** Efter två eller tre resor känner man igen frågorna.

**Åtgärder**
- [ ] Gå igenom alla sevärdhetsfrågor: svaret får aldrig stå ordagrant i faktakortet.
- [ ] Varje fråga ska handla om just den plats man besöker.
- [x] Gör kunskap till ett verktyg: regional lokalkännedom (0–100 % per världsdel) + Reseflyt ger nu konkret högre jobblön (+15/+30/+10 %), bättre prutchans (+8/+15 %) och billigare biljetter (-10 % vid ≥60 %).
- [ ] Låt frågor testa det spelet faktiskt har lärt ut, med repetition av samma fakta i nya sammanhang.
- [ ] Färre men bättre frågor hellre än fler.

**Kommentar från den oberoende granskningen.** Turning Torso gav samma problem som Lilla torg. Faktarutan namngav Santiago Calatrava, och första frågan bad mig välja arkitektens namn medan texten stod kvar. Att flytta undan facit skulle främst göra detta till ett minnestest. Låt mig i stället använda bilden för att känna igen hur huset vrider sig och sedan använda den iakttagelsen när jag visar en annan resenär vägen. Hur snabbt frågebanken känns uttömd efter flera resor behöver prövas med återkommande spelare.

## 3. Jobben är bara fler quiz

**Problem**
- Ett jobb som barista betyder att svara på frågor om bryggvattnets temperatur. Sex flervalsfrågor per jobbpass.

**Åtgärder**
- [ ] Gör jobb till ett beslut om tid mot pengar, eller till ett kort och riktigt minispel, inte sex frågor till.

**Kommentar från den oberoende granskningen.** En del platsannonser leder redan till praktiska minispel, och det vanliga sexfrågorspasset kan innehålla en interaktiv uppgift. Det som gör mest ont är glappet mellan annons och arbetsdag. Ayla i Istanbul vill ha en kryddkock som känner igen spiskummin, sumak och saffran. Ändå fylls passet delvis ur regionala frågepooler. Bygg ett enda pass där jag hjälper Ayla genom lunchrusningen. Låt mig välja mellan att fullfölja hennes beställning och att hinna med min avgång. Då får både yrket och klockan en funktion i samma scen.

## 4. Brett men grunt (feature creep)

**Problem**
- Commit-historiken: 67 städer, 218 sevärdheter, 39 minispel, 201 jobb, bottar, WebRTC-multiplayer, rekordduell, telegram, stipendium, bonuskontrakt, stadsinmutning, 3D-ryggsäckar i fyra nivåer och PWA.
- Varje commit lägger till ett nytt system; ingen fördjupar ett befintligt.
- DESIGN.md säger "Minimalspel först för att pröva grundidén innan något annat byggs". Det beslutet har inte följts.
- README:n lyfter fram antal (städer, frågor, minispel) i stället för upplevelser.

**Åtgärder**
- [ ] Frys nytt innehåll tills kärnloopen är rolig. *(Inte följt: Interpol-jakten, 16× zoom och tappkort på globen tillkom 2026-11-24.)*
- [ ] Göm eller ta bort multiplayer, telegram, stipendium, kontrakt och inmutning tills grundspelet håller.
- [ ] Gå ner till 10–12 städer med djup. Varje stad ska ha något unikt som påverkar spelarens beslut, inte bara ett nytt foto.

**Kommentar från den oberoende granskningen.** I 50 av 67 städer använder samtliga huvudsevärdheter stadens översiktsfoto. I Oslo visar Vigelandsparken, operahuset och Akershus fästning samma bild. Osthyveln använder dessutom fotot av en dalahäst. Här märker spelaren återbruket precis när utflykten borde löna sig. Börja med tre sammanhängande städer och ge varje stopp en igenkännbar vy, en person och ett beslut med följder. Behåll resten av materialet medan den korta resan provas.

## 5. Känsla och feedback

**Problem**
- Belöningar visas som modalfönster med text ("+400 kr"). Det ger ingen känsla.
- Många popup-fönster och toasts avbryter flödet.
- Det första spelaren ser i Malmö är en aktivitet märkt "STÄNGT".

**Åtgärder**
- [ ] Ersätt textrutor med tydlig visuell och ljudmässig feedback där det spelar roll.
- [ ] Minska antalet modaler och toasts.
- [ ] Se till att första stadsbilden visar saker man faktiskt kan göra.

**Kommentar från den oberoende granskningen.** Den stängda aktiviteten är ett mindre problem än de öppna frågetecknen. I Malmö klickade jag på ett klockan 08.00. När jag fick veta att Turning Torso tog två timmar var klockan redan 10.00. Vid avgiftsbelagda besök dras också entrén direkt. Alla rätt krävs för att klara platsen, och ett nytt försök kostar tid och eventuell entré igen. Visa namn, pris och tidsåtgång före beslutet. En felgissning kan ge en ledtråd under pågående besök. En skylt med öppettid får gärna stå kvar om jag kan använda den för att planera eftermiddagen.

- [x] Ge förstagångsspelaren ett konkret ärende och två begripliga vägar framåt. *(Åtgärdat: Solo/0 botar är nu standard i inställningarna, och en Dag 1-briefing visar resans 3 mål + snabbknapp till 3D-jordgloben eller staden.)*

## 6. Buggar och slarv

- [x] Städer utan egen karta visade fel lands karta: Malmö och 17 andra städer fick en egyptisk karta, Paris/Rom/London fick Stockholms, och 35 städer pekade på kartfiler som inte finns (`map1914b–d.jpg`). Nu visar bara de sex städer som har en egen karta en karta; övriga visar enbart stadsfotot. Generatorn `scratch/build_50_cities.js` är också rättad.
- [x] Alla städer utan eget skylttema fick den svenska blågula skylten. Nu väljs tema efter land (Kyoto får japanskt, Chicago amerikanskt osv.); länder utan tema får en neutral skylt.
- [x] "Hem till Stockholm" på slutskärmen och på postkontoret visar nu den valda hemstaden.
- [x] Speltiden i README och DESIGN.md stämmer nu med spelet (30 dagar som standard, 20 eller 45 valbart).
- [x] Jobbtiden dras när passet är klart, inte innan första frågan. Avbryter man mitt i passet kostar det ingen tid men ger ingen lön, och jobbet är förbrukat för dagen.
- [x] Mellanskärmen "Väl genomfört!" är borttagen; sista svarsknappen avslutar direkt. Sevärdheter visar en kort bekräftelse i stället.
- [x] Jobbpass säger nu "UPPGIFT x / 6" även på svarsskärmen och avslutas med "Avsluta passet »" i stället för "Avsluta besöket »".

**Kvar att titta på**
- [ ] Det första spelaren ser i Malmö är en aktivitet märkt "STÄNGT".
- [ ] Bara 6 av 67 städer har en egen karta. Skaffa fler fria historiska stadskartor, eller acceptera bara foto.
- [x] Kunskapsduellen och signaturaktiviteter avslutas nu med "Avsluta duellen »" respektive "Avsluta aktiviteten »".

**Kommentar från den oberoende granskningen.** De tre felen under sammanfattningen påverkar möjligheten att vinna och förstå sin kassa. De bör gå före nya kartor och knapptexter. Rättningen av jobbpass flyttar tidskostnaden till slutet av arbetet. Sevärdheter behöver en egen lösning, eftersom själva klicket på en okänd plats i dag binder spelaren till kostnaden.

## 7. Teknik som hindrar balansering

**Problem**
- `game.js` har 6 123 rader och `game.css` 6 979 rader.
- 318 inline-`style=""` i HTML-strängar och `onclick="window.GT…"` överallt.
- Balansvärden (400, 350, 250, 1500 …) är hårdkodade mitt i UI-koden.
- Inga tester och ingen simulering av ekonomin.

**Åtgärder**
- [ ] Samla alla balanssiffror i en balansfil (`proto/js/balance.js`). *(Påbörjat. 12 bonusbelopp är fortfarande hårdkodade i `game.js`, och två konstanter i `balance.js` används inte; se Uppföljning 2026-11-24.)*
- [ ] Dela upp `game.js` i moduler (`balance.js`, `audio.js`, `routes.js`, `economy.js`, `quiz.js` — över 1 030 rader utbrutna ur `game.js`). *(Påbörjat. `game.js` har fortfarande 5 470 rader.)*
- [ ] Använd de befintliga bottarna för att simulera 1 000 resor och kontrollera att ekonomin håller (automatiserade regeltester för rutter, priser, regioner och prutning tillagda i `proto/tools/test_rules.js`).

**Kommentar från den oberoende granskningen.** Prioritera tester som skulle ha fångat det omöjliga passet och den trasiga osthyveln. Det finns redan en testsida för minispel. Den lucka som spelar roll här är kontroller av resor och handel genom spelarens regler. Bottarna väljer destinationer ur världens städer med egen logik. Tusen lyckade botresor kan därför ge falsk trygghet om spelaren står kvar på Malmö central. Låt simuleringen köpa från samma avgångstavla och betala samma priser som spelaren. [Bottarnas ruttval](../proto/js/bots.js) · [Minispelens testsida](../proto/minigames_test.html)

## 8. Målgrupp och identitet

**Problem**
- Det är oklart vem spelet är för: barn som ska lära sig geografi, vuxna som vill ha trivia, strategispelare eller tävlingsinriktade spelare.
- Den som får en gratis kick är den som har nostalgi för BackPacker, en liten och åldrande målgrupp. Koden är full av "BackPacker 1 & 2-stil"-kommentarer; spelet behöver en egen identitet.

**Åtgärder**
- [ ] Bestäm en primär målgrupp och skriv in den i DESIGN.md.
- [ ] Formulera vad som gör Globetrotter till något eget, inte bara en hyllning.

**Kommentar från den oberoende granskningen.** Globen, platsannonserna och det svenska passet är tre saker jag skulle behålla även för en publik som aldrig hört talas om BackPacker. Påståendet om nostalgipublikens storlek kräver publikdata. En första målgrupp att prova är spelare som gillar korta berättelsedrivna resor där lokalkännedom hjälper dem vidare. Ge dem ett löfte som kan infrias redan första kvällen, exempelvis att de kommer hem med en historia om ett val de själva gjorde.

## 9. Speltestning

- [ ] Låt fem personer som aldrig hört talas om BackPacker spela i tysthet.
- [ ] Anteckna exakt var de tittar bort eller slutar spela.
- [ ] Mät hur lång en resa tar. Sikta på 20–30 minuter per resa.

**Kommentar från den oberoende granskningen.** Börja med en spelbar sträcka Malmö–Köpenhamn–Berlin. Prova ett paket som ska fram i tid, en dyr direktbiljett och ett avlönat stopp i Köpenhamn som kan kosta kvällsanslutningen. Låt fem nya spelare upptäcka alternativen själva. Anteckna om de förstår kostnaden före klicket, om någon frivilligt tar omvägen och om de efteråt kan berätta varför de valde som de gjorde. Ge dem sedan chansen att prova den andra vägen. Hur många som faktiskt startar om säger mer om omspelsvärdet än om första resan tog exakt 20 eller 30 minuter.

## 10. Kompletterande granskning (ytterligare designbrister och konkreta buggar)

Följande punkter tillkommer utöver genomgången ovan (och överlappar inte redan noterade fel):

### Trasig risk/reward och döda mekaniker
- **Ingen konkurs och noll straff för att vara pank.** Om spelaren saknar pengar på hotellet ger `sleepHotel` en gratis natt på tågstationen utan förlorade timmar, ork eller andra följder. Dessutom ger hotelltelefonen `2 × 1 500 kr` i gratis nödlån utan poäng- eller rankavdrag.
- **Prutningen saknar beslut.** `haggleSouvenir` är en enda knapp (`Pruta -20 %`) som rullar dold slump utan nackdel vid misslyckande (i värsta fall betalar man ordinarie pris). Det finns aldrig någon anledning att inte klicka på den.
- **Startväskan kväver handelssystemet.** Spelaren börjar med en *"Juicy Couture Daydreamer"* (som dessutom skär sig mot 90-talstemat) med bara **2 platser**, samtidigt som passet kräver 3 souvenirer plus plats för guideböcker, utrustning och kurirpaket.
- **3D-jordgloben fungerar inte som ruttplanerare.** Globen visar varken spelarens målstäder eller flygnätverket (`CITY_ROUTES`), vilket gör navigationen till blind ö-hoppning.
- **Tunna händelsepooler och fejkade teasers.** Det finns bara **3 flyghändelser och 2 båthändelser** i hela spelet, stafettuppdrag finns bara i de ursprungliga 6 städerna, och kvällsrapportens `TEASERS` är 5 hårdkodade texter som roterar blint utan koppling till morgondagens faktiska världshändelser.
- **Botarnas regler och rutblockering känns orättvisa — och resultatet försvinner.** Bottarna kräver 4 världsdelar/yrken (spelaren 3), får magiskt `+500 kr` när pengarna tryter, och deras Ticket-to-Ride-rutblockering (+60 % straffavgift i 3 dagar) saknar taktiskt motspel. Dessutom visar `triggerGameOver` inte ens slutställningen mot botarna.
- **Stadsvyns ikoner saknar koppling till bilden.** `getFreeCitySpotCoords` kastar ut 10–11 runda ikoner i ett slumpmässigt rutnät över fotot, vilket ger ett rörigt intryck utan rumslig känsla.

### Konkreta buggar och lögner i koden som saknas ovan
- [x] **Signaturaktiviteter i alla 50 nya städer är permanent stängda.** *(Åtgärdat i `world_50_cities.js` med default `openFrom: 8, openUntil: 22`.)*
- [x] **Biblioteket saknas i alla 50 nya städer.** *(Åtgärdat: `world_50_cities.js` registrerar nu `GT_COUNTRY_FACTS[item.key]` och `GT_COUNTRY_HISTORY[item.key]` i rätt format.)*
- [ ] **Dubblettfrågor och tomma jobb #2 i de 50 nya städerna.** Jobb #1 kopierar stadens 3 sevärdhetsfrågor med nya ID:n (`q50_*_job_s1` osv.), så `usedQuestionIds` stoppar inte dubbletterna, och blandar in triviala frågor som *"I vilket land ligger staden Oslo?"*. Jobb #2 (*"Receptionist på..."*) saknar helt `questions`-array och faller tillbaka på slumpmässiga regionfrågor.
- [x] **Postade souvenirer försvinner ur Hemmamuseet.** *(Åtgärdat: `triggerGameOver` sparar nu både `state.backpack` och `state.mailedHome` i `gt_museum`.)*
- [x] **Systemkameran ljuger om sin bonus.** *(Åtgärdat: både `GT_BALANCE.GEAR_SHOP_ITEMS` och löneberäkningen i `game.js` använder nu `CAMERA_JOB_BONUS = 0.20` (+20 %).)*
- [x] **Felaktig ryggsäckstext (`NIVÅ 4 / 3`).** *(Åtgärdat: använder nu `${BACKPACK_TIERS.length}`.)*
- [x] **Online Duell hårdkodar "Malmö"** *(Åtgärdat: använder nu `homeCityName()`.)*

### Kompletterande åtgärder
- [x] Inför verkliga konsekvenser av att vara pank *(sova pank på stationen innebär nu att man vaknar kl. 11:00 istället för 08:00)*.
- [x] Byt ut prutningsknappen mot ett 3-nivåersval med riktig risk *(-10 % artigt, -20 % tufft, -35 % skambud med risk för +15 % straffpris)*.
- [x] Börja med rymligare startväska *(4 platser i `Liten resväska`, skrotade Juicy Couture-väskan)*. *(3D-modellen för första nivån laddar fortfarande `tier0_juicy_atlas.jpg`.)*
- [x] Markera målstäder och möjliga flygrutter direkt på 3D-jordgloben *(inkl. snabbknappar för varje passmål)*.
- [x] Ta bort Ticket-to-Ride-rutblockeringen *(och sluttabell mot botarna i `triggerGameOver` är tillagd)*.
- [x] Låt spelaren se sevärdhetens namn, pris och tidskostnad före quizet, och ersätt 100 %-kravet med Guld/Silver/Brons.
- [x] Byt ut de 5 hårdkodade `TEASERS` mot riktiga ledtrådar (aktiva världshändelser visas först i kvällsrapporten) och bygg ut resehändelserna till 25 val i `proto/data/travel_events.js`.

---

## Det som fungerar

- Den visuella stilen har en tydlig identitet.
- Globen och avgångstavlan har stämning.
- Innehållsmängden visar att det finns arbetsvilja. Den energin behöver läggas på en loop som är rolig att spela tio gånger.
