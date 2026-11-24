# Globetrotter — designdokument

**Status:** utkast 0.3 (2026-11-20). Diskussionsunderlag; allt kan ändras.
Beslut som är fattade står under *Beslutat*. Förslag är förslag. Siffror är
startvärden som ska justeras efter speltest.

## Beslutat hittills

- **Premiss i stil med 80 Days:** jorden runt mot en tidsgräns, med egna
  ruttval. Fokus på **allmänbildning** som i BackPacker.
- **Verklig värld:** riktiga städer och riktiga underverk.
- **"Göra" en stad:** en stad räknas först när man har gjort den, alltså sett
  dess höjdpunkter. Ingen framstegsmätare syns i stadsvyns HUD — istället
  upptäcker spelaren det genom att passet stämplas med fanfar, och kan alltid
  slå upp passet för att se fyllda vs. tomma platser.
- **Definition av "Jorden runt":** för högre antagningsgrad än *Turist* krävs
  att resan inte bara vänder i grannregionen, utan korsar minst 3–4 världsdelar
  (eller passerar 360° / datumlinjen) innan hemkomst.
- **Underverk** som egna platser på kartan, utöver städerna.
- **Souvenirer** får värde efter avstånd, kan prutas på i basaren och har
  praktisk användning.
- **Kapslade loopar** är grunden för spelets struktur.
- **Hemmamuseum & Resedagbok** som sparas över många resor.
- **Minimalspel först** för att pröva grundidén innan något annat byggs
  (kapitel 12).
- **Visuell stil: 90-tals fotomontage & taktila objekt** enligt skissen i
  `sketches/fotomontage/` (kapitel 11b). **Allt i spelet ska ha en
  BackPacker-lik 90-talslayout — detta är särskilt viktigt för menyer och
  frågor.** Inga tråkiga enhetliga beige webbkort, ingen platt vektorgrafik och
  inga stela webbmenyer. Varje vy ska ha sin egen fotografiska miljöbakgrund
  och taktila, gärna lätt udda 90-talsgränssnitt (mekanisk avgångstavla,
  riktig 3-spaltig dagstidning med röd-inringad jobbannons, hotellreception med
  mässingsklocka, basardisk och stämplade frågekort direkt i fotomiljön).
- **3D-jordglob som levande strategibräde:** roterbar 3D-glob som zoomar in
  över rutten vid resa och visar både avverkade röda linjer och pågående
  tidsbegränsade världshändelser.
- **Öppna och fria källor:** bilder, kartor och faktaunderlag hämtas uteslutande
  från fritt användbara källor som Wikimedia Commons och Wikipedia (CC BY,
  CC BY-SA, Public Domain/CC0). Inget upphovsrättsskyddat material från
  BackPacker-originalen används i den slutgiltiga distributionen, vilket
  säkerställer att spelet kan distribueras och spelas helt öppet.

---

## 1. Vision

Ett webbläsarspel om att resa jorden runt på egen hand. Du tjänar pengarna på
vägen, lär dig om platserna du besöker och kommer hem med en resa att berätta
om. Inspirerat av BackPacker 1 och 2 och av *80 Days*, men ett **eget spel**,
och med flera resenärer i samma värld som ett senare lager.

Kärnmening: *Res mot klockan, gör världen och kom hem klokare och med
fickorna fulla av historier.*

## 2. Premiss

> Du har sökt medlemskap i **Globetrotterklubben**. För att bli antagen måste
> du ta dig jorden runt och hem igen inom **80 dagar**. Klubben bryr sig
> mindre om hur snabbt du reser än om **vad du har gjort och lärt dig** på
> vägen. Du får ett pass, en liten startkassa och en tom ryggsäck.

- **Tidsgräns:** 80 dagar var det ursprungliga startvärdet. I spelet idag är
  standard 30 dagar (20 och 45 kan väljas vid ny resa).
- **Antagningsgrad:** hur bra resan blev räknas fram när du kommer hem, inte
  bara om du klarade det. Förslag på grader: *Turist → Resenär → Upptäckare →
  Globetrotter*.
- **Poäng:**
  - gjorda städer
  - besökta underverk
  - kunskap, det vill säga andel rätt svar och hur svåra frågorna var
  - dagar kvar
  - pengar kvar
  - souvenirer med hem
- **Att missa tidsgränsen** avslutar inte resan, men du kan då bara bli
  antagen som *Turist*. Det är mildare än konkurs i BackPacker.

## 3. Designpelare

1. **Kunskap är framsteg.** Det du vet öppnar dörrar och ger poäng. Spelet
   lär ut innan det frågar, så att spelaren faktiskt blir allmänbildad.
2. **Tid är resursen du väljer över.** Allt kostar timmar. Tid, pengar och
   kunskap ska dra åt olika håll så att inget val är självklart.
3. **Varje plats har något eget.** Egna höjdpunkter, souvenirer och ibland ett
   eget minispel. Platser ska inte vara samma meny med ny bakgrund.
4. **Saker du bär på spelar roll.** Souvenirer används, säljs eller sparas.
5. **Ärliga regler.** Inga dolda mätare. Spelaren ska förstå varför det gick
   som det gick.
6. **Varje resa blir en historia** som syns i slutrevyn och lever vidare i
   museet.

## 4. Kapslade loopar

Spelet byggs av loopar i olika tidsskalor. Kroken är att en loop alltid slutar
när nästa är halvvägs. Det finns aldrig en naturlig punkt att sluta på.

| Nivå | Tidsskala | Loop | Belöning | Krok mot nästa nivå |
|---|---|---|---|---|
| 1. Ögonblick | sekunder | svara på en fråga, minispelsmoment | rätt/fel, ljud, pengar som räknas upp | "en fråga till så är höjdpunkten klar" |
| 2. Aktivitet | minuter | se en höjdpunkt, göra ett jobbpass, handla | faktakort, stjärnor, lön, föremål | "en höjdpunkt kvar så är staden gjord" |
| 3. Dag | 16 speltimmar | planera dagen, sova | kvällsrapport | **teaser om morgondagen** |
| 4. Plats | 1–4 dagar | göra staden eller underverket | stämpel i passet, stadens souvenir | "båten härifrån går till ett underverk" |
| 5. Resa | en omgång, 1–3 timmar | jorden runt och hem | antagningsgrad, slutrevy | "museet saknar tre föremål från Asien" |
| 6. Samling | många omgångar | fylla museet, låsa upp saker | museirum, titlar, upplåsningar | "nästa resa börjar i Tokyo" |

**Designregler för looparna**
- Varje nivå visar alltid **nästa mål** och hur långt det är kvar.
- Mål på olika nivåer ska överlappa. När ett jobb blir klart ska biljetten
  nästan vara betald, och när staden blir gjord ska ett underverk ligga nära.
- **Kvällsrapport efter varje dag:** vad du gjort, pengar, kunskap och en
  teaser. Exempel: *"I morgon: festival i Lima. Billig båt till Valparaíso
  bara i två dagar till."*

## 5. Platser

### 5.1 Städer
- Varje stad har:
  - en faktaruta
  - **4 sevärdheter (höjdpunkter)** som tillsammans krävs för att "göra" staden
  - 1–2 **stadsspecifika signaturaktiviteter** (så varje stad känns unik och inte
    bara upprepar samma loop)
  - jobb (via dagstidningens platsannonser)
  - 2–4 lokala souvenirer (med prutning i basaren)
  - boende (med vandrarhemmets gästbok)
  - avgångar (flyg, tåg/buss eller oceanångare)
  - ibland en världshändelse eller ett minispel
- **Exempel på 4 sevärdheter i New York:** Frihetsgudinnan, Empire State
  Building, Central Park och Brooklyn Bridge.
- **Passboken:** En modern, bläddringsbar passbok där **första sidan** visar
  spelarens personuppgifter, passnummer, MRZ-kod och resestatistik, och de
  **följande sidorna** fylls med stämplar allteftersom städerna görs, följt av
  resedagbok och hemmamuseum.

### 5.2 Att "göra" en stad
- Att besöka en höjdpunkt kostar tid och ibland inträde. Du får ett
  **faktakort** att läsa först och sedan **1–3 frågor** som testar allmänbildning
  och sammanhang kring platsen. **Regel:** faktakortet ger sammanhang, ledtrådar
  och nyfikenhet — men svaret står aldrig ordagrant utskrivet i korttexten.
- **Staden räknas som gjord** när alla höjdpunkter är besökta. Du får en
  stämpel i passet med ljud och firande. Framsteget visas inte som en stel
  mätare på stadsskärmen, utan syns när du slår upp passet (fyllda stämplar
  jämte tomma platsskisser).
- **Stämpelnivåer:**
  - **Brons:** alla höjdpunkter besökta.
  - **Silver:** alla höjdpunkter med full pott på frågorna, plus minst en
    annan sak.
  - **Guld:** allt i staden gjort, eller en särskild prestation som stadens
    minispel.
- En stad du bara passerar, till exempel ett flygbyte, räknas inte som gjord.
  Den syns ändå på kartan som besökt.
- *Förslag:* misslyckade frågor gör inte höjdpunkten osedd. Den är sedd men
  gav färre stjärnor. Det håller ärligheten utan att spelaren fastnar.

### 5.3 Underverk
- Egna platser på kartan utanför städerna, med tunnare och vildare infrastruktur.
- **Exempel:**
  - Giza-pyramiderna
  - Grand Canyon
  - Machu Picchu
  - Kinesiska muren
  - Taj Mahal
  - Uluru
  - Victoriafallen
  - Angkor Wat
  - Petra
  - Iguazúfallen
  - Galápagos
  - Norrsken i Lappland
- **Så kommer man dit:** som utflykt från en närliggande stad (en dag eller
  flera dagar) eller som egen nod på vissa rutter med buss, tåg eller båt.
- **Innehåll:** ett större faktapaket med flera frågor, ett eget unikt
  souvenirföremål och ibland ett minispel. Inga jobb och enklast tänkbara
  boende (läger, lodge).
- **Krav:** vissa underverk kräver rätt utrustning (5.4). Utan kängor tar
  vandringen ner i Grand Canyon längre tid eller går inte alls.
- Underverk ger mycket poäng och är den naturliga dragningskraften i ruttvalet.
  Ska man ta omvägen till Petra?

## 6. Souvenirer

### 6.1 Värde efter avstånd
- Varje föremål har ett **grundpris** och en **ursprungsplats**.
- **Försäljningsvärde:** `grundpris × (1 + k × avstånd_i_tusental_km)`, med ett
  tak. Startvärdet är k = 0,15 och taket ×3.
- I ursprungsregionen säljs föremålet billigt. Långt bort kan det ge en bra
  slant.
- Lokala marknader har dagsvariation och efterfrågan: *"Lima betalar extra för
  kryddor den här veckan."*
- Butikens bud är alltid synligt innan du säljer.
- **Prutning i basaren (2-stegs förhandling):** vid köp kan spelaren välja att
  betala begärt pris eller pruta med en lokal försäljare som har synligt humör.
  Ett rimligt bud ger 15–20 % rabatt; ett skambud gör försäljaren sur och stänger
  prutningen för dagen. Ger äkta BackPacker-charm och liv i varje marknadsbesök.

### 6.2 Praktisk användning
Varje föremål har **en** tydlig användning utöver handelsvärdet:

| Typ | Exempel | Användning |
|---|---|---|
| **Utrustning** | vandringskängor, regnponcho, sovsäck, snorkel | krävs eller förkortar tiden vid vissa underverk och rutter, skyddar mot vissa händelser |
| **Kunskap** | guidebok, parlör, sjökort, stjärnkarta | stryker ett fel svarsalternativ i sin region eller ämneskategori, ett begränsat antal gånger |
| **Yrkesnyckel** | kamera, kockkniv, sjömanskniv | öppnar eller förbättrar vissa jobb (fotograf, kock, däcksgast) |
| **Gåva** | te, choklad, lokala godsaker | ge till en lokal person: gratis natt, tips eller en jobbrekommendation |
| **Samlarföremål** | masker, figurer, mynt, textilier | inget praktiskt, men högre museivärde och ingår i set |

### 6.3 Det centrala valet: använda, sälja eller behålla
- Ryggsäcken har få platser (startvärde 6).
- Ett föremål kan **användas** (vissa förbrukas), **säljas** (mer värt långt
  bort) eller **behållas** till museet (det måste vara med när du kommer hem).
- Det skapar intressanta beslut hela resan. Ska guideboken användas i Kairo,
  säljas i Rio eller ställas i museet?
- **Skicka hem med posten:** kostar pengar och dagar men frigör en plats i
  ryggsäcken. Föremålet räknas för museet om det hinner fram.

### 6.4 Ursprung
Varje föremål minns var, när och av vem det köptes, och vad som hänt med det.
Exempel: *"Kamel i trä: köpt i Kairo dag 12, följde med till Grand Canyon,
skickad hem från Lima."* Ursprunget visas i slutrevyn och i museet.

## 7. Hemmamuseum

- **Sparas mellan resorna** och är unikt för varje spelare.
- Ett rum per kontinent och ett för underverk. Varje föremål har en egen
  monter.
- **Det som räknas:** föremål du har med dig hem, eller som skickats hem och
  hunnit fram innan resan tar slut.
- **Unikt per spelare:**
  - Föremålen har varianter: färger, mönster och ibland en sällsynt
    hantverksvariant.
  - Varje monter visar föremålets eget ursprung.
  - Museet visar dina stämplar, din bästa antagningsgrad och dina resekartor.
- **Samla allt över många resor.** Förslag: omkring 150 föremål i den första
  stora versionen. En resa ger bara 5–15 hem, och sällsynta varianter kräver
  flera besök.
- **Set:** till exempel en mask från varje kontinent eller alla underverkens
  föremål. Ett fullt set ger en titel, ett nytt museirum eller en upplåsning.
- **Upplåsningar:** nya startstäder, svårighetsnivåer, en startsak i
  ryggsäcken, en större ryggsäck. De ska göra spelet bredare, inte bara
  enklare.
- **Faktasamlingen:** alla faktakort du har läst samlas i museets bibliotek,
  så kunskapen syns också som en samling.

## 8. Övriga system

### 8.1 Tid, dagar och dygnsrytm
- 16 spelbara timmar per dag (08:00–24:00). Varje handling har en synlig
  tidskostnad.
- **Dygnsljus i stadsvyn:** ljus och färgton över fotomontaget skiftar mjukt
  från morgon → dagsljus → gyllene kvällsljus → skymning när klockan tickar,
  så tiden känns i miljön och inte bara som en siffra.
- **Miljösignaler på kartan:** en fladdrande röd "REA!"-lapp på flygplatsen när
  det finns sista-minuten-biljetter, och ett varmt sken vid hotellet på kvällen.
- Restid efter avstånd och färdsätt. En nattresa sparar en hotellnatt.

### 8.2 Allmänbildningen
- **Lär först, resonera sedan, fördjupa efteråt:** faktakort före frågorna vid
  höjdpunkter och underverk (ger kontext men aldrig det ordagranna svaret).
  **Efter varje besvarad fråga** (oavsett rätt eller fel) får spelaren ett
  fördjupningskort med bild och en kort, fängslande berättelse om det rätta
  svaret (t.ex. historien bakom personen, byggnaden eller händelsen) som spelaren
  läser i egen takt innan nästa fråga.
- **Frågetyper & BackPacker-variation (prioriteras tidigt):**
  - **flerval med varierande antal alternativ (2–6 st):** precis som i BackPacker
    1 & 2 ska det inte alltid vara 4 alternativ — vi blandar 2-val (Sant/Falskt
    eller antingen/eller), 3-val, 4-val, 5-val och 6-val.
  - **fritext med förlåtande matchning:** likt BackPacker 2:s textfrågor (tål
    små stavningsvarianter och delsträngar, skiftlägesokänsligt).
  - **värdemätare (mässingsreglage):** gissa ett årtal, en höjd eller ett
    invånarantal (uppdaterat till dagens siffror) och få delpoäng ju närmare du
    hamnar.
  - **peka på 3D-jordgloben / klicka i bild:** GeoGuessr-känsla direkt på vår
    3D-jordglob med exakt kilometeravstånd.
  - ljudklipp (öppna inspelningar från Wikimedia Commons: instrument, språk, musik)
  - ordna i rätt tidsordning
- **Frågebank:** Central, platt frågelista (`proto/data/questions.js`, senare
  uppdelad per region) med unika ID:n och `usedQuestionIds` så att samma fråga
  aldrig upprepas. Alla 7 000+ frågor ur BackPacker 1 & 2 inventeras (se
  `docs/BP_QUESTIONS_INVENTORY.md`), formuleras om med eget språk och
  uppdateras till dagens fakta och siffror.
- **Reseflyt (momentum):** flera rätta svar i rad ger "reseflyt" som kan ge
  extra dricks på jobbet, ett insidertips eller rabatt på nästa avgång.
- **Ämnen:** geografi, historia, kultur, natur, språk och vetenskap.
- **Frågebanker:** stora, och samma fråga kommer aldrig två gånger på en resa.
  Svårigheten anpassas efter nivå och tidigare svar.
- **Regional kunskap**, till exempel 0–100 % för Sydamerika, byggs upp av rätt
  svar. Den ger högre lön i regionen och syns för spelaren.

### 8.3 Jobb
- **Korta jobbpass:** ett pass tar 3–6 timmar och består av cirka 5 uppgifter
  med frågor eller ett minispel. Inga tolv frågor i rad som i BackPacker 2.
- Presenteras som en **vikt dagstidning med platsannonser** istället för en
  vanlig webbmeny.
- Lönen beror på prestation, regional kunskap och yrkesintyg.
- Yrkesintyg i kategorier höjer lönen och öppnar bättre jobb senare.

### 8.4 Resor och 3D-Jordgloben
- **3D-Jordglob som levande strategibräde:** en interaktiv, roterbar jordglob i
  BackPacker-anda där spelaren kan inspektera världskartan, rotera klotet fritt
  i 3D, se sin kompletta resrutt och upptäcka **aktiva tidsbegränsade
  världshändelser** (t.ex. körsbärsblomning i Tokyo, basarvecka i Kairo,
  flygstrejk i New York) som lockar till att planera om rutten.
- **Dynamisk inzoomning & röd reslinje:** precis som i BackPacker ritas en
  animerad röd storcirkellinje ut över globen när man reser mellan städer, och
  globen zoomar automatiskt in så att rutten fyller större delen av skärmen med
  en metallisk modell av flygplan eller oceanångare längst fram.
- **Snabbknapp:** en kontinuerligt snurrande 3D-miniglob i dockan öppnar den
  stora jordgloben när som helst.
- **Resesätt med egen karaktär:**
  - **Flyg:** snabbt och dyrt, men sterilt. Avgångstavlan ser ut som en mekanisk
    90-tals klappertavla med slumpade sista-minuten-fynd.
  - **Tåg och buss:** inom kontinenter, billigare — ger chans till ett kort
    kupémöte med en medresenär (rykten, gratis kunskap eller byte).
  - **Båt:** längs kuster och över hav, billigast och långsammast — ger lugn tid
    ombord att läsa guidebok gratis eller arbeta ett kort däcksgastpass.
- Pris och restid räknas från avstånd. Vissa rutter kräver utrustning.

### 8.5 Ekonomi, boende, hotellbar/kafé, stafettuppdrag och gästbok
- **Boende:** dyrt hotell, billigt vandrarhem (presenterat som en taktil
  hotelliggare med mässingsklocka), eller gratis boende genom en gåva eller ett
  utfört stafettuppdrag.
- **Hotellbar / Lokalt kafé (Realms of Arkania-känsla):** kopplat direkt till
  hotellet finns en lokal pub, ölstuga, izakaya eller ett tehus. Spelaren kan
  stanna en timme för att lyssna på baren eller **bjuda sällskapet på en runda /
  kaffe & te** för att få igång samtalet — vilket kan ge rykten om
  världshändelser, lokala tips eller **stafettuppdrag**.
- **Stafettuppdrag (kurirpaket mellan städer):** en lokal gäst i baren kan be
  spelaren ta med ett förseglat paket eller brev till en kontakt i en annan
  stad. Paketet tar 1 plats i ryggsäcken men ger rejäl hittelön och ofta en
  gratis hotellnatt vid leverans, vilket knyter ihop städerna till en levande
  berättelse.
- **Lokala karaktärer:** 1–2 udda, minnesvärda personligheter per stad (t.ex.
  basarhandlare, receptionister, bargäster) som sprider rykten om
  världshändelser och efterfrågar gåvor från andra världsdelar.
- **Vandrarhemmets gästbok:** vid övernattning kan spelaren bläddra i en
  gästbok med handskrivna tips och rykten från andra resenärer (fiktiva i
  singleplayer, riktiga spelare i asynkron multiplayer).
- **Pengar in:** jobb, minispel, sälja/pruta souvenirer, lån från vänner (i
  multiplayer).
- **Om pengarna tar slut:** sälj föremål, ta ett kort jobb, ring hem (en gång
  per resa) eller låna av en vän. Bakslaget ska svida men inte radera resan.

### 8.6 Händelser och Resedagbok
- Slumpade och platsbundna världshändelser: strejk, festival, körsbärsblomning,
  monsun, möte med en lokal person, ett fynd.
- Alltid med en synlig konsekvens och ofta ett val.
- **Skydd mot otur:** efter flera dåliga händelser kommer en bra, och efter tre
  dagar utan billig avgång dyker en upp.
- **Taktil Resedagbok / Klippbok & delbart vykort:** under resan skrivs korta
  dagboksanteckningar automatiskt utifrån dina val (prutningar, fynd,
  underverk, knappa marginaler). Vid målgång visas resan som en bläddringsbar
  klippbok och ett delbart "vykort" med röd rutt, antagningsgrad och bästa
  souvenirhistoria.
- **Ljudlandskap (Ambience):** mjuk lokal bakgrundsatmosfär per stad
  (hamnmåsar, basarsorl, tåg) + taktila ljud (stämpeldunk, pappersprassel,
  hotellklocka, myntklirr).

### 8.7 Minispel
- Gemensamt gränssnitt: `start(värd, sammanhang) → {poäng, lön, rätt, fel}`.
- Placeras vid underverk, i vissa jobb och som guldprestationer i städer.
- Hellre få och unika minispel än många på samma motor.

## 9. Varför man vill fortsätta spela

**Krokar att använda**
1. **Kapslade loopar** (kapitel 4).
2. **Teaser i kvällsrapporten.**
3. **Rättvis slump** med skydd mot otur.
4. **Synliga framsteg:**
   - kartan fylls i
   - passet får stämplar
   - kunskapsmätarna stiger
   - ryggsäcken fylls
5. **Spelarens grundbehov** (självbestämmandeteorin):
   - **självbestämmande:** du väljer din egen rutt
   - **kompetens:** du blir faktiskt mer allmänbildad, både i spelet och utanför
   - **samhörighet:** gåvor och tips mellan spelare
6. **Samlande:** stämplar, souvenirset, faktakort och yrkesintyg.
7. **Berättelser** genom föremålens ursprung och slutrevyn.
8. **Korta omgångar** med upplåsningar emellan, i roguelite-stil.
9. **Låg friktion:** automatisk sparning, snabb start, korta pass.
10. **Känsla i småsakerna:** stämpelljud, saldot som räknas, flygplanet över
    kartan.

**Fallgropar att undvika**
- Malande och långa frågeserier.
- Upprepade frågor.
- Dolda mätare.
- En pengaväg som alltid är bäst.
- Fusk mellan vänner genom byten fram och tillbaka.
- **Mörka mönster:**
  - energimätare som tvingar en att vänta
  - straff om man missar en daglig svit
  - lootlådor
  - rädsla för att missa något

Spelaren ska fortsätta för att det är roligt, inte för att den känner sig
tvingad.

## 10. Multiplayer (senare lager)

### 10.1 Tidsmodell
Varje resenär förbrukar timmar i egen takt.

| Modell | Hur | Passar | Svårighet |
|---|---|---|---|
| **A. Asynkront** | Möten via spår: gästböcker, kvarlämnade gåvor, paket, tips | spela olika kvällar | lätt |
| **B. Dagsrundor** | Alla planerar sin dag. När alla har tryckt *sov* går världen till nästa dag. Samma stad samma dag blir ett möte. | spelkväll med 2–6 spelare | medel |
| **C. Realtid** | gemensam klocka | krockar med frågor och minispel | svårt, troligen inte |

Bygg A först och B sedan.

### 10.2 Lägen
- **Kapplöpning:** samma slumpfrö för alla. Högst antagningsgrad vinner.
- **Resesällskap:** gemensamt mål, till exempel att tillsammans göra alla
  underverk.
- **Spökresenärer:** andras resor syns som vykort och ruttrekord.
- **Dagens resa:** samma start och samma slump för alla under en dag, sedan
  jämför man rutterna som i Wordle.

### 10.3 Samarbete och tävling
- **Samarbete:**
  - tips som stryker ett fel svarsalternativ
  - kompislån
  - jobbrekommendationer
  - reserapporter om avgångar
- **Tävling:**
  - samma annons, där den som svarar bäst får jobbet
  - begränsade billiga platser på hotell och avgångar
  - frågeduell med insats

### 10.4 Souvenirer mellan resenärer
1. Värde efter avstånd gör att spelare som reser åt olika håll har nytta av
   varandras varor.
2. **Bytesdisk** när två spelare är i samma stad samma dag.
3. **Paket till en vän:** leveransen tar dagar och kostar porto.
4. **Gåva i hotellrummet** till nästa gäst.
5. **Exklusiva föremål** som bara finns på ett ställe, så att museets set
   kräver byten.
6. **Ursprungskedjan** följer föremålet mellan spelarna.
7. **Skydd mot fusk:** avgifter vid byte och spärr mot att samma föremål
   byts fram och tillbaka mellan samma spelare.

## 10b. Alternativa spellägen: Jaktlägen (Polis & Förbrytare)

Utöver det klassiska reseäventyret passar 3D-jordgloben, de 67 städerna och ruttnätet (`proto/js/routes.js`) utmärkt för fristående jaktlägen med dold information, spårning och taktik:

1. **Interpol-jakten (Smitta-jakt — implementerad som prototyp i `proto/js/interpol.js`):**
   - 1 **Interpol-agent** jagar 5 **Mästertjuvar** över jordgloben (spelaren väljer roll: *Agent* eller *Rymling*).
   - Tjuvarnas exakta position är dold utom var 3:e dag eller när de tar flyg; tåg och båt döljer spåret.
   - Varje gripen tjuv **omvänds till Interpol-agent** och börjar aktivt jaga de återstående tills alla är fångade eller sista rymlingen överlever tidsgränsen.
2. **Mästertjuven (1 mot alla — *Scotland Yard* jorden runt):**
   - 1 hemlig mästertjuv försöker stjäla 3 föremål i olika världsdelar med begränsat antal dolda biljetter (båt/nattåg), medan 4 agenter (spelare eller bottar) samarbetar på 3D-jordgloben för att ringa in och skära av flyktvägarna.
3. **Skuggan bland turister (Hemlig sabotör / lönnmördare):**
   - Alla 6 resenärer jagar vanliga passmål samtidigt, men 1 spelare är hemlig **Sabotör/Lönnmördare** som kan slå ut eller omvända andra resenärer i samma stad. På hotellbarer, bibliotek och i tidningen samlar övriga resenärer ledtrådar om vem som var i staden dagen innan för att avslöja sabotören.

## 11. Teknisk arkitektur (förslag)

- **Klient:** vanilla JS/HTML/CSS till att börja med.
- **Regellager:** rena funktioner utan DOM, med en injicerbar slumpgenerator
  som seedas per dag och plats. Testas fristående.
- **Händelselogg:** allt spelaren gör blir en händelse. Resans tillstånd är en
  uppspelning av loggen. Samma logg är sparfil och, senare,
  nätverksprotokoll.
- **Museet:** ett eget beständigt lager som ligger utanför resans logg.
- **Innehåll som data:** platser, höjdpunkter, faktakort, frågor, föremål,
  rutter och händelser i JSON.
- **Scenmoduler:** en modul per skärm och ett gemensamt minispelsgränssnitt.
- **Server (senare):** en liten Node-server med WebSocket som är auktoritativ
  för den delade världen.

## 11b. Visuell stil och innehållskällor (beslutat)

Referens: `sketches/fotomontage/index.html` och `preview.png` (Kairo).

**Stadsvyn**
- Överst en historisk karta över staden eller dess omgivningar, som tonar över
  i ett nutida foto av staden. Det är samma grepp som BackPacker 2:s
  stadsbilder, men kontrasten mellan gammalt och nytt ger känslan av en
  upptäcktsresa.
- Stadens namn i stor serifstil på en ljus platta så att det går att läsa mot
  kartan.
- **Höjdpunkter** visas som runda foton med namnet under, stora nog att känna
  igen. En guldkant och en bock visar att höjdpunkten är sedd.
- **Underverk** har en egen form (en rundad fyrkant) och färg, så att de
  sticker ut från höjdpunkterna.
- Dag och klocka, kassa och ryggsäck syns uppe till höger. Mätaren för en
  gjord stad visas inte i förväg i menyn; istället upptäcker spelaren när staden
  är gjord genom att passet stämplas med fanfar och firande.
- Stadens platser och tjänster (hotell, tidning och jobb, basar, flygplats,
  sevärdheter och underverk) är interaktiva ikoner direkt på kartan/i scenen, i
  sann BackPacker-anda. Inga tråkiga webbmenyer.
- Faktafrågorna testar allmänbildning och sammanhang runt platsen – svaret
  finns aldrig ordagrant utskrivet i faktakortets text.
- Reseanimation med filmklipp och avgångsbanner spelas upp vid avresa mellan
  städer (likt BackPackers flyg- och hamnsekvenser).

**Höjdpunkter, underverk, menyer och frågor (BackPacker-layout överallt)**
- **Huvudregel:** Alla skärmar, menyer och frågevyer ska ha en tydlig
  90-tals BackPacker-känsla — aldrig generiska webbkort eller enhetliga
  beige bakgrunder.
- **Höjdpunkter och underverk:** Fotot fyller hela skärmen kant-i-kant.
  Faktakortet och frågorna ligger direkt i miljön som taktila, mässingsramade
  plaketter och stämplade svarskort (A–D i mässings-/lackmedaljonger eller
  fysisk mässingsmätare) — aldrig som vanliga webbformulär.
- **Stadsmenyer som riktiga miljöer:**
  - *Tidning/Jobb:* en riktig 3-spaltig dagstidning på kafébord där jobbannonsen
    är inringad med röd penna bland notiser och småannonser.
  - *Hotell/Gästhus:* fotografisk receptionsbakgrund med klickbar mässingsklocka
    och vandrarhemmets gästbok på disken.
  - *Basar & Flygplats:* fotografiska miljöbakgrunder med prutningsdisk
    respektive svart mekanisk klappertavla och perforerade flygbiljetter.
  - *3D-Jordglob:* fyller hela skärmen med topografisk bergrelief och svävande
    mässingsreglage.

**Bild- och faktakällor (fria och öppna)**
- **Källor:** Wikimedia Commons och Wikipedia eller andra källor med fri licens
  (CC BY, CC BY-SA, Public Domain/CC0).
- **Fakta och frågor:** grundfakta och faktakort hämtas från och verifieras mot
  Wikipedia. Texten sammanfattas och anpassas för spelet, och frågorna formuleras
  med utgångspunkt i öppna encyklopediska data.
- **Gemensam bildbehandling:** alla foton får samma färgton, kontrast och
  utsnitt, så att spelet hänger ihop trots att fotona kommer från olika
  fotografer. Det görs i byggsteget, inte för hand.
- **Kartor:** historiska kartor som är fria att använda, till exempel ur
  Baedeker-guider från tiden kring 1900–1914, med en lätt sepiaton.
- **Dokumentation:** varje bild och faktaresurs har en post med fil, upphov,
  licens och originallänk (se t.ex. `credits.json` och `CREDITS.md`).
- **Upphov syns:** för CC BY och CC BY-SA anges fotografen/källan diskret i
  hörnet och samlat på en sida med eftertexter.
- **Typsnitt:** en serifstil för namn och rubriker och en sans-serif för
  gränssnittet.

## 12. Minimalspelet: pröva grundidén först

### 12.1 Syfte
Ta reda på om **kärnan är rolig** innan något annat byggs. Kärnan är:

> planera tid och pengar → göra platser genom att lära och svara → välja rutt
> → bära, använda och sälja souvenirer → hinna hem i tid.

Om det inte är roligt utan grafik, ljud och multiplayer, så räddar fluffet det
inte.

### 12.2 Steg 0: pappersprototyp (en kväll)
- Ett kalkylark eller papper med en världskarta, platskort, frågekort och
  föremålskort. En tärning används för avgångstavlan.
- Testa om ruttvalen och valet mellan att använda, sälja och behålla blir
  intressanta.
- Det ger svar på de stora frågorna innan någon kod finns.

### 12.3 Steg 1: digitalt minimalspel
**Omfattning**
- **Platser:**
  - 10 städer utspridda så att det går att komma jorden runt
  - 3 underverk, till exempel pyramiderna, Grand Canyon och Taj Mahal
- **Per stad:** 2 höjdpunkter, 1 annan sak, 2 souvenirer och 1 jobb. Ett
  underverk har ett faktapaket, 3 frågor och 1 souvenir.
- **Frågor:** flerval och värdemätare, med cirka 15–20 frågor per plats så att
  inga upprepas.
- **Tid:** 16 timmar per dag och en gräns på 30 dagar.
- **Resor:** flyg och tåg/båt med pris och tid från avstånd, och en enkel
  avgångstavla med slump.
- **Boende:** en kostnad per natt.
- **Souvenirer:**
  - värde efter avstånd
  - utrustning, till exempel kängor till Grand Canyon
  - guidebok som stryker ett fel svarsalternativ
  - ryggsäck med 5 platser
- **Gjord stad** och passstämpel (bara en nivå).
- **Kvällsrapport** med teaser.
- **Slut:** antagningsgrad och en enkel slutrevy.
- **Museum:** en lista som sparas i webbläsaren och fylls över omgångar.

**Uttryckligen utanför minimalspelet**
- fullständig bildbehandling (minimalspelet använder ett eller två foton per
  plats i fotomontagestilen, men utan gemensam bildbehandling)
- ljud
- minispel
- händelser utöver tavlans slump
- multiplayer
- stämpelnivåer
- yrkesintyg
- varianter av föremål
- upplåsningar
- server

**Teknik:** samma arkitektur som i kapitel 11 i miniformat (regellager,
JSON-innehåll, händelselogg som sparning), så att koden går att bygga vidare på.

### 12.4 Vad testet ska besvara
- Planerar spelaren om sin rutt under resan, eller finns det en självklar väg?
- Läser spelaren faktakorten, eller klickar den förbi dem?
- Blir valet mellan att använda, sälja och behålla svårt på riktigt?
- Drar underverken, eller hoppas de över?
- Känns 30 dagar för kort, för långt eller lagom?
- **Viktigast:** vill spelaren köra en omgång till direkt efteråt?

### 12.5 Klart när
- En hel omgång tar 20–40 minuter.
- Minst tre testspelare har spelat två eller fler omgångar.
- Svaren på frågorna i 12.4 är nedskrivna.
- Ett beslut är fattat: bygga vidare, ändra kärnan, eller tänka om.

## 13. Byggordning efter minimalspelet

1. Justera kärnan efter testet.
2. Fler platser och höjdpunkter, plus stämpelnivåer.
3. Fler frågetyper och faktabiblioteket.
4. Fullt museum med set, varianter och upplåsningar.
5. Jobb med yrkesintyg.
6. Händelser och skydd mot otur.
7. Minispel vid underverk.
8. Grafik, ljud och känsla.
9. Asynkron multiplayer.
10. Dagsrundor och bytesdisk.

## 14. Öppna frågor

1. **BackPacker-material:** *Beslutat:* Inget material från BackPacker-skivorna
   ska ingå i distributionen. Spelet är helt självständigt och använder endast
   fritt licensierade bilder och fakta från Wikimedia Commons och Wikipedia, samt
   fria eller egenskapade ljudeffekter.
2. **Språk:** svenska först? Flerspråkigt senare?
3. **Målgrupp och ton:** lärospel, familjespel eller sällskapsspel?
4. **Tidsgränsen:** 80 dagar eller annan? Hur många platser hinner man göra?
5. **Faktagranskning:** *Beslutat:* Grundfakta och frågeunderlag tas fram från
   öppna källor som Wikipedia/Commons med hjälp av kurering och skriptverktyg
   för att säkerställa verifierbarhet och öppna licenser.
6. **Hur många platser** i den första fulla versionen?
7. **Standardläge i multiplayer:** tävling eller samarbete?
8. **Antal spelare** och var det spelas: samma rum, hemnätverk eller internet.
9. **Orkmätare eller hälsa:** djup eller onödig komplexitet?
10. **Hemresan:** måste man börja och sluta i samma stad, eller räcker det att
    passera 360 grader?
11. **Ska ett misslyckat svar kunna göras om** (en ny fråga mot ny tid) för att
    få högre stämpelnivå?
