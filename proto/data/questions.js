// Globetrotter, Central frågebank (platt lista för enkel överblick & faktagranskning)
// Stödjer BackPacker-variation: mc (2–6 alternativ), text (fritext), num (mässingsmätare) och globe (3D-jordglob).

(function () {
  const root = typeof window !== "undefined" ? window : global;

  root.GT_QUESTIONS = [
  {
    "id": "stockholm_job_01",
    "explain": "Stockholms skärgård sträcker sig från Arholma i norr till Landsort i söder och rymmer omkring 30 000 öar, kobbar och skär.",
    "city": "stockholm",
    "place": "job",
    "region": "europa",
    "type": "num",
    "difficulty": 2,
    "q": "Ungefär hur många öar, kobbar och skär räknar man med finns i Stockholms skärgård?",
    "ans": 30000,
    "min": 5000,
    "max": 60000,
    "step": 1000,
    "unit": "st",
    "photo": "assets/photos/gamlastan.jpg"
  },
  {
    "id": "stockholm_job_02",
    "explain": "Mälaren är Sveriges tredje största sjö och har sitt utlopp i Östersjön genom Slussen och Norrström mitt i Stockholm.",
    "city": "stockholm",
    "place": "job",
    "region": "europa",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilken sjö möter Östersjön vid Slussen i Stockholm?",
    "a": [
      "Mälaren",
      "Vänern",
      "Hjälmaren",
      "Vättern"
    ],
    "photo": "assets/photos/gamlastan.jpg"
  },
  {
    "id": "stockholm_job_03",
    "explain": "Birger jarl lät befästa Stadsholmen i mitten av 1200-talet som ett lås för Mälaren mot plundrare från Östersjön.",
    "city": "stockholm",
    "place": "job",
    "region": "europa",
    "type": "mc",
    "difficulty": 1,
    "q": "Vem brukar enligt Erikskrönikan räknas som Stockholms grundare på 1200-talet?",
    "a": [
      "Birger jarl",
      "Gustav Vasa",
      "Olof Skötkonung",
      "Magnus Ladulås"
    ],
    "photo": "assets/photos/gamlastan.jpg"
  },
  {
    "id": "stockholm_job_04",
    "explain": "Stockholms stadshus ritades av Ragnar Östberg och invigdes på midsommarafton den 23 juni 1923, på 400-årsdagen av Gustav Vasas intåg.",
    "city": "stockholm",
    "place": "job",
    "region": "europa",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilket år invigdes Stockholms stadshus vid Riddarfjärden, ritat av Ragnar Östberg?",
    "a": [
      "1923",
      "1897",
      "1952",
      "1912"
    ],
    "photo": "assets/photos/gamlastan.jpg"
  },
  {
    "id": "kairo_job_05",
    "explain": "Nilen breder ut sig i det stora, bördiga Nildeltat norr om Kairo innan den mynnar ut i Medelhavet.",
    "city": "kairo",
    "place": "job",
    "region": "afrika",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilket hav ligger norr om Egypten och tar emot Nilens vattenmassor?",
    "a": [
      "Medelhavet",
      "Röda havet",
      "Svarta havet",
      "Arabiska havet"
    ],
    "photo": "assets/skylines/skyline.jpg"
  },
  {
    "id": "kairo_job_06",
    "explain": "Suezkanalen är 193 km lång och låter fartyg segla mellan Europa och Asien utan att behöva runda hela Afrika.",
    "city": "kairo",
    "place": "job",
    "region": "afrika",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilken kanal invigdes 1869 och förbinder Medelhavet med Röda havet?",
    "a": [
      "Suezkanalen",
      "Panamakanalen",
      "Kielkanalen",
      "Korintkanalen"
    ],
    "photo": "assets/skylines/skyline.jpg"
  },
  {
    "id": "kairo_job_07",
    "explain": "Nilen är cirka 6 650 km lång och rinner genom elva länder i nordöstra Afrika från källorna vid Victoriasjön till Medelhavet.",
    "city": "kairo",
    "place": "job",
    "region": "afrika",
    "type": "num",
    "difficulty": 2,
    "q": "Hur lång är Nilen, mätt i kilometer från sina källor i Östafrika?",
    "ans": 6650,
    "min": 3000,
    "max": 10000,
    "step": 50,
    "unit": "km",
    "photo": "assets/skylines/skyline.jpg"
  },
  {
    "id": "kairo_job_08",
    "explain": "Assuandammen reglerar Nilens årliga översvämningar och producerar en stor del av Egyptens el, samtidigt som flera antika tempel fick flyttas undan vattnet.",
    "city": "kairo",
    "place": "job",
    "region": "afrika",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilken stor dammbyggnad stod klar 1970 och dämde upp Nassersjön i södra Egypten?",
    "a": [
      "Assuandammen",
      "Karibadammen",
      "Atatürkdammmen",
      "Akosombodammen"
    ],
    "photo": "assets/skylines/skyline.jpg"
  },
  {
    "id": "delhi_job_09",
    "explain": "Gurkmeja är en rot i ingefärssläktet som ger curry dess starkt gula färg och har använts i indisk matlagning i tusentals år.",
    "city": "delhi",
    "place": "job",
    "region": "asien",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilken malen rot ger curryblandningar och gyllene dal-grytor dess färg?",
    "a": [
      "Gurkmeja",
      "Saffran",
      "Kardemumma",
      "Ingefära"
    ],
    "photo": "assets/photos/redfort.jpg"
  },
  {
    "id": "delhi_job_10",
    "explain": "Den indiska rupien (INR) har fått sitt namn från sanskritordet \"rupya\", som ursprungligen betydde präglat silver.",
    "city": "delhi",
    "place": "job",
    "region": "asien",
    "type": "mc",
    "difficulty": 1,
    "q": "Vad heter Indiens officiella valuta?",
    "a": [
      "Rupie",
      "Rupiah",
      "Taka",
      "Baht"
    ],
    "photo": "assets/photos/redfort.jpg"
  },
  {
    "id": "delhi_job_11",
    "explain": "Himalaya bildades när den indiska kontinentalplattan kolliderade med Asien och rymmer världens högsta topp, Mount Everest (8 849 m).",
    "city": "delhi",
    "place": "job",
    "region": "asien",
    "type": "mc",
    "difficulty": 1,
    "q": "I vilken mäktig bergskedja norr om Indien reser sig jordens högsta bergstoppar?",
    "a": [
      "Himalaya",
      "Karakoram",
      "Hindukush",
      "Altai"
    ],
    "photo": "assets/photos/redfort.jpg"
  },
  {
    "id": "delhi_job_12",
    "explain": "Calcutta (dagens Kolkata) var Brittiska Indiens huvudstad fram till 1911, då britterna flyttade huvudstaden inåt landet till New Delhi.",
    "city": "delhi",
    "place": "job",
    "region": "asien",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilken stad vid Bengaliska viken var huvudstad i Brittiska Indien fram till 1911?",
    "a": [
      "Calcutta",
      "Bombay",
      "Madras",
      "Agra"
    ],
    "photo": "assets/photos/redfort.jpg"
  },
  {
    "id": "tokyo_job_13",
    "explain": "Under Tokugawa-shogunatet (1603-1868) växte fiskebyn Edo till världens folkrikaste stad med över en miljon invånare innan den döptes om till Tokyo.",
    "city": "tokyo",
    "place": "job",
    "region": "asien",
    "type": "mc",
    "difficulty": 1,
    "q": "Vad hette Tokyo under samurajernas shogunstyre fram till Meijirestaurationen 1868?",
    "a": [
      "Edo",
      "Kyoto",
      "Nara",
      "Kamakura"
    ],
    "photo": "assets/photos/tokyotower.jpg"
  },
  {
    "id": "tokyo_job_14",
    "explain": "Honshu är Japans största och mest tätbefolkade ö, där bland annat Tokyo, Kyoto, Osaka och berget Fuji ligger.",
    "city": "tokyo",
    "place": "job",
    "region": "asien",
    "type": "mc",
    "difficulty": 1,
    "q": "På vilken av Japans fyra stora huvudöar ligger mångmiljonstaden Tokyo?",
    "a": [
      "Honshu",
      "Hokkaido",
      "Kyushu",
      "Shikoku"
    ],
    "photo": "assets/photos/tokyotower.jpg"
  },
  {
    "id": "tokyo_job_15",
    "explain": "Japansk yen (JPY) infördes 1871 under Meijirestaurationen. Ordet \"en\" betyder \"rund\" och syftar på myntets form.",
    "city": "tokyo",
    "place": "job",
    "region": "asien",
    "type": "mc",
    "difficulty": 1,
    "q": "Vad heter Japans valuta?",
    "a": [
      "Yen",
      "Won",
      "Yuan",
      "Ringgit"
    ],
    "photo": "assets/photos/tokyotower.jpg"
  },
  {
    "id": "tokyo_job_16",
    "explain": "Kejsarpalatset Kōkyo ligger mitt i Tokyo på samma plats som den gamla shogunborgen Edo Castle, omgiven av vallgravar och murar.",
    "city": "tokyo",
    "place": "job",
    "region": "asien",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilket är Tokyos anrika kejsarpalats som omges av vallgravar mitt i staden?",
    "a": [
      "Kōkyo",
      "Himeji",
      "Nijo",
      "Osaka-jo"
    ],
    "photo": "assets/photos/tokyotower.jpg"
  },
  {
    "id": "sanfrancisco_job_17",
    "explain": "Guldruschen 1849 lockade runt 300 000 guldsökare (\"forty-niners\") till Kalifornien och förvandlade San Francisco från liten by till storstad på några år.",
    "city": "sanfrancisco",
    "place": "job",
    "region": "amerika",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilket årtal startade guldruschen i Kalifornien som fick tusentals lycksökare att strömma hit?",
    "a": [
      "1849",
      "1776",
      "1812",
      "1906"
    ],
    "photo": "assets/photos/goldengate.jpg"
  },
  {
    "id": "sanfrancisco_job_18",
    "explain": "Jordbävningen den 18 april 1906 och de tre dagar långa bränderna som följde förstörde omkring 80 procent av San Francisco.",
    "city": "sanfrancisco",
    "place": "job",
    "region": "amerika",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilken stor naturkatastrof ödelade stora delar av San Francisco i april 1906?",
    "a": [
      "En stor jordbävning och efterföljande brand",
      "En massiv orkan",
      "En tsunami",
      "Ett vulkanutbrott"
    ],
    "photo": "assets/photos/goldengate.jpg"
  },
  {
    "id": "sanfrancisco_job_19",
    "explain": "Silicon Valley i Santa Clara-dalen söder om San Francisco fick sitt namn av kislet i tidiga mikrochip och rymmer idag världens största teknikbolag.",
    "city": "sanfrancisco",
    "place": "job",
    "region": "amerika",
    "type": "mc",
    "difficulty": 1,
    "q": "Vad kallas det globala teknik- och mjukvaruklustret strax söder om staden kring Palo Alto?",
    "a": [
      "Silicon Valley",
      "Napa Valley",
      "Death Valley",
      "Central Valley"
    ],
    "photo": "assets/photos/goldengate.jpg"
  },
  {
    "id": "sanfrancisco_job_20",
    "explain": "Kalifornien är USA:s folkrikaste delstat och har fått smeknamnet \"The Golden State\" efter guldruschen och sina gyllene vallmofält.",
    "city": "sanfrancisco",
    "place": "job",
    "region": "amerika",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilken delstat i USA tillhör San Francisco?",
    "a": [
      "Kalifornien",
      "Oregon",
      "Washington",
      "Nevada"
    ],
    "photo": "assets/photos/goldengate.jpg"
  },
  {
    "id": "newyork_job_21",
    "explain": "Manhattan köptes enligt traditionen av holländska kolonisatörer 1626 och är idag ett av världens tätast bebyggda finans- och kulturcentrum.",
    "city": "newyork",
    "place": "job",
    "region": "amerika",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilken långsmal ö mellan Hudsonfloden och East River utgör New Yorks historiska hjärta?",
    "a": [
      "Manhattan",
      "Brooklyn",
      "Queens",
      "Staten Island"
    ],
    "photo": "assets/photos/empirestate.jpg"
  },
  {
    "id": "newyork_job_22",
    "explain": "Central Park invigdes 1858, täcker 3,4 kvadratkilometer mitt på Manhattan och har över 40 miljoner besökare om året.",
    "city": "newyork",
    "place": "job",
    "region": "amerika",
    "type": "mc",
    "difficulty": 1,
    "q": "Vad heter den berömda parken som ritades av Frederick Law Olmsted och sträcker sig mitt igenom Manhattan?",
    "a": [
      "Central Park",
      "Prospect Park",
      "Hyde Park",
      "Battery Park"
    ],
    "photo": "assets/photos/empirestate.jpg"
  },
  {
    "id": "newyork_job_23",
    "explain": "I slutscenen av filmklassikern King Kong (1933) klättrar jättegorillan upp i toppen av det då helt nybyggda Empire State Building.",
    "city": "newyork",
    "place": "job",
    "region": "amerika",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilken filmklassiker från 1933 gjorde Empire State Building världsberömd genom en klättrande jättegorilla?",
    "a": [
      "King Kong",
      "Godzilla",
      "Tarantula",
      "Apornas planet"
    ],
    "photo": "assets/photos/empirestate.jpg"
  },
  {
    "id": "newyork_job_24",
    "explain": "New York City består av fem boroughs: Manhattan, Brooklyn, Queens, The Bronx och Staten Island.",
    "city": "newyork",
    "place": "job",
    "region": "amerika",
    "type": "mc",
    "difficulty": 1,
    "q": "Hur många stadsdelar (boroughs) består New York City officiellt av?",
    "a": [
      "5",
      "4",
      "7",
      "12"
    ],
    "photo": "assets/photos/empirestate.jpg"
  },
  {
    "id": "stockholm_vasa_25",
    "city": "stockholm",
    "place": "vasa",
    "region": "europa",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilken marinarkeolog och ingenjör lokaliserade Vasas vrak på 32 meters djup år 1956?",
    "a": [
      "Anders Franzén",
      "Carl Gustaf Wrangel",
      "Sven Hedin",
      "Thor Heyerdahl"
    ],
    "explain": "Marinarkeologen Anders Franzén (1918–1993) letade efter Vasa i flera år genom att dra ett egenkonstruerat lod över Stockholms ström. År 1956 fick han upp en bit svartnad ek, och 1961 bärgades hela skeppet efter 333 år på botten.",
    "photo": "assets/photos/vasa.jpg"
  },
  {
    "id": "stockholm_vasa_26",
    "city": "stockholm",
    "place": "vasa",
    "region": "europa",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilket hårt träslag byggdes skeppet främst av, som motstod skeppsmask i Östersjöns bräckta vatten?",
    "a": [
      "Ek",
      "Furu",
      "Gran",
      "Bok"
    ],
    "explain": "Skeppet Vasa byggdes av över 1 000 utvalda ekar. Eftersom Östersjöns vatten är bräckt trivs inte skeppsmasken (Teredo navalis) här, vilket är huvudorsaken till att skrovet är så otroligt välbevarat.",
    "photo": "assets/photos/vasa.jpg"
  },
  {
    "id": "stockholm_vasa_27",
    "explain": "Regalskeppet Vasa sjönk den 10 augusti 1628 efter bara 1 300 meters segling eftersom skeppet var för smalt och topp-tungt för sina 64 kanoner.",
    "city": "stockholm",
    "place": "vasa",
    "region": "europa",
    "type": "num",
    "difficulty": 2,
    "q": "Vilket årtal under stormaktstiden kantrade och sjönk Vasa på sin jungfrufärd?",
    "ans": 1628,
    "min": 1550,
    "max": 1750,
    "step": 1,
    "unit": "år",
    "photo": "assets/photos/vasa.jpg"
  },
  {
    "id": "stockholm_vasa_28",
    "city": "stockholm",
    "place": "vasa",
    "region": "europa",
    "type": "globe",
    "difficulty": 2,
    "q": "Peka på 3D-jordgloben: Var ligger Östersjöns grannhuvudstad Helsingfors?",
    "targetLat": 60.17,
    "targetLon": 24.94,
    "targetName": "Helsingfors",
    "startLat": 56,
    "startLon": 16,
    "explain": "Helsingfors ligger tvärs över Östersjön från Stockholm och grundades år 1550 av kung Gustav Vasa, farfar till kungen som lät bygga regalskeppet Vasa!",
    "photo": "assets/photos/vasa.jpg"
  },
  {
    "id": "stockholm_gamlastan_29",
    "city": "stockholm",
    "place": "gamlastan",
    "region": "europa",
    "type": "mc",
    "difficulty": 1,
    "q": "Vad heter Stockholms allra smalaste gränd i Gamla stan, med en bredd på bara 90 cm?",
    "a": [
      "Mårten Trotzigs gränd",
      "Prästgatan",
      "Svartmangatan",
      "Västerlånggatan"
    ],
    "explain": "Mårten Trotzigs gränd i Gamla stan är uppkallad efter en tysk köpman från 1500-talet. Gränden har 36 trappsteg och smalnar av till endast 90 centimeter på sitt trängsta ställe.",
    "photo": "assets/photos/gamlastan.jpg"
  },
  {
    "id": "stockholm_gamlastan_30",
    "city": "stockholm",
    "place": "gamlastan",
    "region": "europa",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilken dansk unionskung lät avrätta ett 80-tal personer på Stortorget under Stockholms blodbad 1520?",
    "a": [
      "Kristian II",
      "Valdemar Atterdag",
      "Kristian IV",
      "Hans"
    ],
    "explain": "Under Stockholms blodbad i november 1520 lät unionskungen Kristian II (i Sverige kallad Kristian Tyrann) avrätta över 80 adelsmän och borgare på Stortorget, en händelse som utlöste Gustav Vasas uppror.",
    "photo": "assets/photos/gamlastan.jpg"
  },
  {
    "id": "stockholm_gamlastan_31",
    "city": "stockholm",
    "place": "gamlastan",
    "region": "europa",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilket museum finns i dag inrymt i Börshuset vid Stortorget i Gamla stan?",
    "a": [
      "Nobelprismuseet",
      "Historiska museet",
      "Medeltidsmuseet",
      "Nationalmuseum"
    ],
    "explain": "I det praktfulla Börshuset från 1776 vid Stortorget huserar både Svenska Akademien och Nobelprismuseet, där pristagarnas egna föremål och signaturer under kaféstolarna visas upp.",
    "photo": "assets/photos/gamlastan.jpg"
  },
  {
    "id": "kairo_museum_32",
    "city": "kairo",
    "place": "museum",
    "region": "afrika",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilken ung faraos nästan intakta guldskatter och grav upptäcktes av Howard Carter 1922?",
    "a": [
      "Tutankhamon",
      "Ramses II",
      "Akhenaton",
      "Seti I"
    ],
    "explain": "Den unge faraon Tutankhamon dog bara omkring 19 år gammal cirka 1323 f.Kr. När arkeologen Howard Carter öppnade hans orörda grav i Konungarnas dal 1922 hittades över 5 000 föremål, däribland den 11 kilo tunga dödsmasken i massivt guld.",
    "photo": "assets/photos/museum.jpg"
  },
  {
    "id": "kairo_museum_33",
    "city": "kairo",
    "place": "museum",
    "region": "afrika",
    "type": "mc",
    "difficulty": 1,
    "q": "Vad heter den berömda svarta stenplatta med grekisk och egyptisk text som gav nyckeln till hieroglyferna?",
    "a": [
      "Rosettastenen",
      "Palermostenen",
      "Narmerpaletten",
      "Hammurabis stele"
    ],
    "explain": "Rosettastenen hittades av franska soldater 1799 och bär samma dekret på tre skriftspråk: hieroglyfer, demotisk skrift och forngrekiska. Det gjorde att språkforskaren Jean-François Champollion kunde knäcka hieroglyfernas gåta 1822.",
    "photo": "assets/photos/museum.jpg"
  },
  {
    "id": "kairo_museum_34",
    "city": "kairo",
    "place": "museum",
    "region": "afrika",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilken egyptisk forntida solgud avbildades traditionellt med falkhuvud och en lysande solskiva?",
    "a": [
      "Ra",
      "Anubis",
      "Osiris",
      "Sobek"
    ],
    "explain": "Solguden Ra färdades enligt egyptisk mytologi över himlen i sin solbåt varje dag och genom underjorden varje natt. Faraonerna kallade sig själva \"Ras son\" för att visa sin gudomliga rätt att härska.",
    "photo": "assets/photos/museum.jpg"
  },
  {
    "id": "kairo_museum_35",
    "city": "kairo",
    "place": "museum",
    "region": "afrika",
    "type": "globe",
    "difficulty": 2,
    "q": "Peka på 3D-jordgloben: Var mynnar Nilen ut i Medelhavet (Nildeltat)?",
    "targetLat": 31.2,
    "targetLon": 30.8,
    "targetName": "Nildeltat",
    "startLat": 26,
    "startLon": 25,
    "explain": "Nildeltat norr om Kairo är ett av världens bördigaste och mest tätbefolkade floddeltan, format under tiotusentals år av bördigt slam från Östafrika.",
    "photo": "assets/photos/museum.jpg"
  },
  {
    "id": "kairo_khan_36",
    "city": "kairo",
    "place": "khan",
    "region": "afrika",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilken egyptisk författare och nobelpristagare i litteratur (1988) skildrade basarens kvarter i Kairotrilogin?",
    "a": [
      "Naguib Mahfouz",
      "Taha Hussein",
      "Alaa al-Aswany",
      "Tawfiq al-Hakim"
    ],
    "explain": "Naguib Mahfouz (1911–2006) blev 1988 den första arabiskspråkiga författaren som tilldelades Nobelpriset i litteratur. Han skrev ofta på sitt stamkafé El-Fishawy mitt inne i basaren Khan el-Khalili.",
    "photo": "assets/photos/khan.jpg"
  },
  {
    "id": "kairo_khan_37",
    "explain": "Karkadeh bryggs på torkade hibiskusblad, har en djupröd färg och frisk syrlighet, och dricks både iskall i sommarhettan och varm på vintern.",
    "city": "kairo",
    "place": "khan",
    "region": "afrika",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilken syrlig mörkröd tedryck bryggd på torkade hibiskusblommor är en omtyckt egyptisk specialitet?",
    "a": [
      "Karkadeh",
      "Chai",
      "Sahlab",
      "Mate"
    ],
    "photo": "assets/photos/khan.jpg"
  },
  {
    "id": "kairo_khan_38",
    "explain": "Egyptiskt pund (EGP) delas in i 100 piastrar och pryds ofta av historiska moskéer, faraoner och tempel på sedlarna.",
    "city": "kairo",
    "place": "khan",
    "region": "afrika",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilken valuta betalar man med i basarens bodar i Kairo?",
    "a": [
      "Egyptiskt pund",
      "Dinar",
      "Dirham",
      "Rial"
    ],
    "photo": "assets/photos/khan.jpg"
  },
  {
    "id": "kairo_citadel_39",
    "city": "kairo",
    "place": "citadel",
    "region": "afrika",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilken berömd muslimsk fältherre och sultan påbörjade bygget av Citadellet under korstågstiden på 1100-talet?",
    "a": [
      "Saladin",
      "Harun al-Rashid",
      "Baibars",
      "Suleyman den store"
    ],
    "explain": "Salah al-Din (Saladin, 1137–1193) enade Egypten och Syrien, byggde Kairos mäktiga citadell mot korsfararna och blev även i Europa legendarisk för sin ridderlighet och diplomati.",
    "photo": "assets/photos/mosque.jpg"
  },
  {
    "id": "kairo_citadel_40",
    "explain": "Minareter är smala torn vid en moské varifrån böneutroparen (muezzinen) kallar till bön fem gånger om dagen.",
    "city": "kairo",
    "place": "citadel",
    "region": "afrika",
    "type": "mc",
    "difficulty": 1,
    "q": "Vad kallas de höga tornen vid en moské varifrån böneutropet traditionellt kungörs?",
    "a": [
      "Minareter",
      "Obelisker",
      "Pagoder",
      "Stupor"
    ],
    "photo": "assets/photos/mosque.jpg"
  },
  {
    "id": "delhi_redfort_41",
    "city": "delhi",
    "place": "redfort",
    "region": "asien",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilken känd 105-karatig diamant satt en gång i mogulernas Påfågelstron i Delhi innan den togs till England?",
    "a": [
      "Koh-i-Noor",
      "Cullinan",
      "Hope-diamanten",
      "Daria-i-Noor"
    ],
    "explain": "Diamanten Koh-i-Noor (\"Ljusets berg\") vägde ursprungligen 186 karat och har bytt ägare mellan indiska, persiska och afghanska härskare innan den 1849 överlämnades till drottning Viktoria och idag sitter i de brittiska kronjuvelerna.",
    "photo": "assets/photos/redfort.jpg"
  },
  {
    "id": "delhi_redfort_42",
    "explain": "Chandni Chowk (\"Månskensmarknaden\") anlades på 1600-talet av kejsar Shah Jahans dotter Jahanara och är fortfarande en av Indiens livligaste basargator.",
    "city": "delhi",
    "place": "redfort",
    "region": "asien",
    "type": "mc",
    "difficulty": 1,
    "q": "Vad heter den berömda medeltida marknadsgatan strax utanför fortets Lahori-port?",
    "a": [
      "Chandni Chowk",
      "Connaught Place",
      "Janpath",
      "Rajpath"
    ],
    "photo": "assets/photos/redfort.jpg"
  },
  {
    "id": "delhi_redfort_43",
    "city": "delhi",
    "place": "redfort",
    "region": "asien",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilken stormogul lät bygga både Röda fortet i Delhi och Taj Mahal i Agra?",
    "a": [
      "Shah Jahan",
      "Akbar den store",
      "Babur",
      "Aurangzeb"
    ],
    "explain": "Stormogulen Shah Jahan regerade 1628–1658 under mogulrikets arkitektoniska guldålder. Förutom Röda fortet i Delhi lät han uppföra Taj Mahal som ett evigt gravmonument åt sin älskade hustru Mumtaz Mahal.",
    "photo": "assets/photos/redfort.jpg"
  },
  {
    "id": "delhi_qutb_44",
    "explain": "Qutb Minar är cirka 73 meter högt med 379 trappsteg invändigt och är världens högsta minaret byggd helt i tegel.",
    "city": "delhi",
    "place": "qutb",
    "region": "asien",
    "type": "num",
    "difficulty": 2,
    "q": "Hur högt reser sig Qutb Minar-tornet i meter, ungefär?",
    "ans": 73,
    "min": 20,
    "max": 150,
    "step": 1,
    "unit": "m",
    "photo": "assets/photos/qutb.jpg"
  },
  {
    "id": "delhi_qutb_45",
    "explain": "Yamuna rinner rakt förbi både Delhi och Taj Mahal i Agra innan den förenas med Ganges vid den heliga mötesplatsen i Prayagraj.",
    "city": "delhi",
    "place": "qutb",
    "region": "asien",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilken helig flod rinner förbi Delhi och förenar sig senare med Ganges vid Allahabad?",
    "a": [
      "Yamuna",
      "Indus",
      "Brahmaputra",
      "Narmada"
    ],
    "photo": "assets/photos/qutb.jpg"
  },
  {
    "id": "delhi_qutb_46",
    "explain": "Den 15 augusti 1947 blev Indien självständigt från Storbritannien efter en lång frihetskamp ledd av bland andra Mahatma Gandhi och Jawaharlal Nehru.",
    "city": "delhi",
    "place": "qutb",
    "region": "asien",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilket årtal förklarade sig Indien självständigt från det brittiska imperiet?",
    "a": [
      "1947",
      "1914",
      "1930",
      "1962"
    ],
    "photo": "assets/photos/qutb.jpg"
  },
  {
    "id": "tokyo_sensoji_47",
    "city": "tokyo",
    "place": "sensoji",
    "region": "asien",
    "type": "mc",
    "difficulty": 1,
    "q": "Vad kallas Japans traditionella inhemska naturreligion med heliga kami (andar) som ofta samspelar med buddhismen?",
    "a": [
      "Shinto",
      "Konfucianism",
      "Daoism",
      "Brahmanism"
    ],
    "explain": "Shinto (\"gudarnas väg\") är Japans uråldriga naturreligion utan helig skrift eller grundare. Den betonar renhet och vördnad för naturens andar (kami) som bor i berg, träd, vattenfall och stenar.",
    "photo": "assets/photos/sensoji.jpg"
  },
  {
    "id": "tokyo_sensoji_48",
    "explain": "Samurajerna var Japans krigaradel från 1100-talet fram till 1868 och levde efter hederskodexen bushido (\"krigarens väg\").",
    "city": "tokyo",
    "place": "sensoji",
    "region": "asien",
    "type": "mc",
    "difficulty": 1,
    "q": "Vad kallas den japanska krigarklass och adel som styrde landet under feodaltiden?",
    "a": [
      "Samurajer",
      "Shoguner",
      "Ronin",
      "Ninjor"
    ],
    "photo": "assets/photos/sensoji.jpg"
  },
  {
    "id": "tokyo_sensoji_49",
    "explain": "Hanami betyder \"att titta på blommor\" och samlar vänner, familjer och kollegor i parkerna under körsbärsträden varje vår.",
    "city": "tokyo",
    "place": "sensoji",
    "region": "asien",
    "type": "mc",
    "difficulty": 1,
    "q": "Vad kallas vårens traditionella körsbärsblomningspicknick i Japan?",
    "a": [
      "Hanami",
      "Matsuri",
      "Obon",
      "Tanabata"
    ],
    "photo": "assets/photos/sensoji.jpg"
  },
  {
    "id": "tokyo_tokyotower_50",
    "city": "tokyo",
    "place": "tokyotower",
    "region": "asien",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilket snötäckt vulkanberg sydväst om Tokyo kan man skymta från tornet klara vinterdagar?",
    "a": [
      "Fuji",
      "Aso",
      "Tateyama",
      "Ontake"
    ],
    "explain": "Vulkanen Fuji (3 776 m ö.h.) är Japans högsta berg och ett av landets tre heliga berg. Dess perfekta, snötäckta kon har avbildats i tusentals träsnitt, mest berömt av konstnären Hokusai.",
    "photo": "assets/photos/tokyotower.jpg"
  },
  {
    "id": "tokyo_tokyotower_51",
    "explain": "Shinkansen (\"nya stamlinjen\") invigdes 1964 inför OS i Tokyo, kör i upp till 320 km/h och är världsberömt för sin punktlighet.",
    "city": "tokyo",
    "place": "tokyotower",
    "region": "asien",
    "type": "mc",
    "difficulty": 1,
    "q": "Vad heter Japans berömda snabbtåg som binder samman Tokyo med Kyoto och Osaka?",
    "a": [
      "Shinkansen",
      "Maglev",
      "TGV",
      "Nozomi Express"
    ],
    "photo": "assets/photos/tokyotower.jpg"
  },
  {
    "id": "tokyo_tokyotower_52",
    "explain": "Tokyo Tower är 333 meter högt (13 meter högre än Eiffeltornet) och målades i internationell orange och vitt för flygsäkerhetens skull.",
    "city": "tokyo",
    "place": "tokyotower",
    "region": "asien",
    "type": "num",
    "difficulty": 2,
    "q": "Hur många meter högt är Tokyo Tower?",
    "ans": 333,
    "min": 100,
    "max": 600,
    "step": 1,
    "unit": "m",
    "photo": "assets/photos/tokyotower.jpg"
  },
  {
    "id": "tokyo_tokyotower_53",
    "city": "tokyo",
    "place": "tokyotower",
    "region": "asien",
    "type": "globe",
    "difficulty": 2,
    "q": "Peka på 3D-jordgloben: Var ligger vulkanen Fuji i Japan?",
    "targetLat": 35.36,
    "targetLon": 138.73,
    "targetName": "Berget Fuji",
    "startLat": 35,
    "startLon": 132,
    "explain": "Berget Fuji (3 776 m) ligger cirka 100 kilometer sydväst om Tokyo på ön Honshu och har varit en helig pilgrimsdestination i över tusen år.",
    "photo": "assets/photos/tokyotower.jpg"
  },
  {
    "id": "sanfrancisco_goldengate_54",
    "explain": "San Franciscos täta sommar-dimma kallas kärleksfullt \"Karl the Fog\" av lokalborna och rullar in från det kalla Stilla havet genom Golden Gate.",
    "city": "sanfrancisco",
    "place": "goldengate",
    "region": "amerika",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilket personnamn har lokalbefolkningen och meteorologerna gett den återkommande sommar-dimman i bukten?",
    "a": [
      "Karl the Fog",
      "Foggy Jack",
      "Pacific Pete",
      "Misty Sam"
    ],
    "photo": "assets/photos/goldengate.jpg"
  },
  {
    "id": "sanfrancisco_goldengate_55",
    "explain": "San Franciscos kabelspårvagnar (Cable Cars) började rulla 1873 och dras fortfarande av en ständigt rörlig stålkabel under gatstenen.",
    "city": "sanfrancisco",
    "place": "goldengate",
    "region": "amerika",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilken kabeldragen klassisk spårvagnstyp klättrar upp och ner för San Franciscos branta gator?",
    "a": [
      "Cable Car",
      "Trolleybus",
      "MUNI Tram",
      "Metro Liner"
    ],
    "photo": "assets/photos/goldengate.jpg"
  },
  {
    "id": "sanfrancisco_goldengate_56",
    "explain": "Färgen \"International Orange\" valdes av arkitekten Irving Morrow eftersom den syns tydligt i dimman och harmonierar med de gyllene kullarna runt sundet.",
    "city": "sanfrancisco",
    "place": "goldengate",
    "region": "amerika",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilken färg har brons skyddslack officiellt?",
    "a": [
      "International Orange",
      "California Rust",
      "Pacific Red",
      "Golden Sun"
    ],
    "photo": "assets/photos/goldengate.jpg"
  },
  {
    "id": "sanfrancisco_alcatraz_57",
    "city": "sanfrancisco",
    "place": "alcatraz",
    "region": "amerika",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilken Chicagogangster känd under smeknamnet \"Scarface\" avtjänade straff på Alcatraz på 1930-talet?",
    "a": [
      "Al Capone",
      "Lucky Luciano",
      "Bugsy Siegel",
      "John Dillinger"
    ],
    "explain": "Maffiabossen Alphonse \"Al\" Capone styrde Chicagos undre värld under förbudstiden men fälldes till slut för skattebrott 1931. På Alcatraz var han fånge nr 85 och fick arbeta i tvätteriet och spela banjo i fängelsebandet.",
    "photo": "assets/photos/alcatraz.jpg"
  },
  {
    "id": "sanfrancisco_alcatraz_58",
    "explain": "Robert Stroud studerade kanariefåglar i sin cell i Leavenworth och skrev böcker om fågelsjukdomar, men på Alcatraz fick han faktiskt aldrig ha några fåglar.",
    "city": "sanfrancisco",
    "place": "alcatraz",
    "region": "amerika",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilken fånge och morddömd man blev känd över hela världen som \"The Birdman of Alcatraz\"?",
    "a": [
      "Robert Stroud",
      "Frank Morris",
      "George Kelly",
      "Alvin Karpis"
    ],
    "photo": "assets/photos/alcatraz.jpg"
  },
  {
    "id": "sanfrancisco_alcatraz_59",
    "explain": "Alcatraz stängdes i mars 1963 eftersom det var nästan tre gånger dyrare att driva fängelset på en ö än på fastlandet.",
    "city": "sanfrancisco",
    "place": "alcatraz",
    "region": "amerika",
    "type": "num",
    "difficulty": 2,
    "q": "Vilket årtal under 1960-talet stängdes fängelset för gott?",
    "ans": 1963,
    "min": 1940,
    "max": 1980,
    "step": 1,
    "unit": "år",
    "photo": "assets/photos/alcatraz.jpg"
  },
  {
    "id": "newyork_liberty_60",
    "city": "newyork",
    "place": "liberty",
    "region": "amerika",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilken närliggande ö tog emot över tolv miljoner immigranter vid sin mottagningsstation 1892–1954?",
    "a": [
      "Ellis Island",
      "Governors Island",
      "Roosevelt Island",
      "Staten Island"
    ],
    "explain": "Mellan 1892 och 1954 passerade över 12 miljoner emigranter, däribland hundratusentals svenskar, genom mottagningshallen på Ellis Island. Idag uppskattas omkring 40 % av USA:s befolkning ha minst en förfader som steg iland här.",
    "photo": "assets/photos/liberty.jpg"
  },
  {
    "id": "newyork_liberty_61",
    "explain": "De sju strålarna på Frihetsgudinnans krona symboliserar världens sju hav och sju kontinenter, ett tecken på frihet som når hela jorden.",
    "city": "newyork",
    "place": "liberty",
    "region": "amerika",
    "type": "mc",
    "difficulty": 1,
    "q": "Vad symboliserar de sju strålarna på Frihetsgudinnans krona?",
    "a": [
      "De sju världshaven och kontinenterna",
      "De sju dygderna",
      "De sju ursprungliga kolonierna",
      "De sju grundlagsfäderna"
    ],
    "photo": "assets/photos/liberty.jpg"
  },
  {
    "id": "newyork_liberty_62",
    "city": "newyork",
    "place": "liberty",
    "region": "amerika",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilken fransk ingenjör konstruerade statyns inre bärande stålram innan han ritade sitt kända torn i Paris?",
    "a": [
      "Gustave Eiffel",
      "Ferdinand de Lesseps",
      "Le Corbusier",
      "Eugène Viollet-le-Duc"
    ],
    "explain": "Innan Gustave Eiffel byggde Eiffeltornet 1889 konstruerade han det geniala, flexibla fackverksskelettet inuti Frihetsgudinnan så att den tunna kopparhuden skulle tåla Atlantens hårda stormvindar.",
    "photo": "assets/photos/liberty.jpg"
  },
  {
    "id": "newyork_liberty_63",
    "city": "newyork",
    "place": "liberty",
    "region": "amerika",
    "type": "globe",
    "difficulty": 2,
    "q": "Peka på 3D-jordgloben: Var ligger Paris, staden där Frihetsgudinnan byggdes och skeppades ifrån?",
    "targetLat": 48.86,
    "targetLon": 2.35,
    "targetName": "Paris",
    "startLat": 45,
    "startLon": 5,
    "explain": "Frihetsgudinnan byggdes först i full skala i Paris 1884, plockades sedan isär i 350 koppar- och järndelar och skeppades i 214 trälådor över Atlanten!",
    "photo": "assets/photos/liberty.jpg"
  },
  {
    "id": "newyork_empirestate_64",
    "explain": "Times Square och Theater District runt Broadway rymmer ett fyrtiotal stora teatrar och lyser upp Midtown Manhattan dygnet runt.",
    "city": "newyork",
    "place": "empirestate",
    "region": "amerika",
    "type": "mc",
    "difficulty": 1,
    "q": "Vad kallas New Yorks legendariska teater- och nöjeskvarter strax norr om skyskrapan vid Broadway?",
    "a": [
      "Times Square / Theater District",
      "Wall Street",
      "SoHo",
      "Greenwich Village"
    ],
    "photo": "assets/photos/empirestate.jpg"
  },
  {
    "id": "newyork_empirestate_65",
    "explain": "Toppspiran byggdes ursprungligen som förtöjningsmast för luftskepp, men vindarna 380 meter upp visade sig vara alldeles för farliga för landning.",
    "city": "newyork",
    "place": "empirestate",
    "region": "amerika",
    "type": "mc",
    "difficulty": 1,
    "q": "Vad var skyskrapans högsta metallspira ursprungligen tänkt att användas som, innan idén övergavs?",
    "a": [
      "Förtöjningsmast för luftskepp",
      "Radioteleskop",
      "Blixtfångare för kraftverk",
      "Utsiktsbalkong för fallskärmshoppare"
    ],
    "photo": "assets/photos/empirestate.jpg"
  },
  {
    "id": "newyork_empirestate_66",
    "explain": "Wall Street på södra Manhattan har fått sitt namn efter den träpalissad som holländarna byggde här på 1600-talet och hyser idag New York-börsen.",
    "city": "newyork",
    "place": "empirestate",
    "region": "amerika",
    "type": "mc",
    "difficulty": 1,
    "q": "Vad heter den finansiella gatan på södra Manhattan där New York-börsen (NYSE) är belägen?",
    "a": [
      "Wall Street",
      "Broadway",
      "Fifth Avenue",
      "Madison Avenue"
    ],
    "photo": "assets/photos/empirestate.jpg"
  },
  {
    "id": "stockholm_skansen_67",
    "city": "stockholm",
    "place": "skansen",
    "region": "europa",
    "type": "mc",
    "difficulty": 1,
    "q": "Vem grundade Skansen och Nordiska museet i slutet av 1800-talet?",
    "a": [
      "Artur Hazelius",
      "Anders Zorn",
      "Carl Larsson",
      "Alfred Nobel"
    ],
    "explain": "Filologen och folklivsforskaren Artur Hazelius (1833–1901) skapade både Nordiska museet och Skansen för att rädda det gamla svenska allmogearvet innan industrialiseringen suddade ut det.",
    "photo": "assets/photos/skansen.jpg"
  },
  {
    "id": "stockholm_skansen_68",
    "explain": "Allsång på Skansen började redan 1935 på Sollidenscenen och har sänts i svensk TV varje sommar sedan 1979.",
    "city": "stockholm",
    "place": "skansen",
    "region": "europa",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilken sommartradition direktsänds varje tisdag från Sollidenscenen på Skansen?",
    "a": [
      "Allsång på Skansen",
      "Melodifestivalen",
      "Sommar i P1",
      "Midnattssolsrallyt"
    ],
    "photo": "assets/photos/skansen.jpg"
  },
  {
    "id": "stockholm_skansen_69",
    "explain": "Skansen grundades av Artur Hazelius 1891 och är världens äldsta friluftsmuseum, med historiska byggnader flyttade hit från hela Sverige.",
    "city": "stockholm",
    "place": "skansen",
    "region": "europa",
    "type": "num",
    "difficulty": 2,
    "q": "Vilket årtal öppnade Skansen sina portar för första gången?",
    "ans": 1891,
    "min": 1850,
    "max": 1930,
    "step": 1,
    "unit": "år",
    "photo": "assets/photos/skansen.jpg"
  },
  {
    "id": "stockholm_stadshuset_70",
    "city": "stockholm",
    "place": "stadshuset",
    "region": "europa",
    "type": "mc",
    "difficulty": 1,
    "q": "Vad heter den stora röda tegelsalen i Stadshuset där Nobelbanketten hålls varje år den 10 december?",
    "a": [
      "Blå hallen",
      "Gyllene salen",
      "Rikssalen",
      "Prinsens galleri"
    ],
    "explain": "Trots namnet är Blå hallen i Stockholms stadshus helt i varmt rött tegel! Arkitekten Ragnar Östberg hade ursprungligen tänkt putsa väggarna blå, men föll så handlöst för teglets lyster att han lät det vara omålat.",
    "photo": "assets/photos/stadshuset.jpg"
  },
  {
    "id": "stockholm_stadshuset_71",
    "explain": "Omkring åtta miljoner mörkröda, handslagna tegelstenar murades in i Stockholms stadshus mellan 1911 och 1923.",
    "city": "stockholm",
    "place": "stadshuset",
    "region": "europa",
    "type": "mc",
    "difficulty": 1,
    "q": "Hur många miljoner handslagna tegelstenar gick det ungefär åt för att bygga Stadshuset?",
    "a": [
      "Cirka 8 miljoner",
      "Cirka 500 000",
      "Cirka 2 miljoner",
      "Cirka 40 miljoner"
    ],
    "photo": "assets/photos/stadshuset.jpg"
  },
  {
    "id": "stockholm_stadshuset_72",
    "explain": "Stadshustornet är 106 meter högt upp till toppen av de förgyllda Tre Kronor och bjuder på en av Stockholms bästa utsikter.",
    "city": "stockholm",
    "place": "stadshuset",
    "region": "europa",
    "type": "num",
    "difficulty": 2,
    "q": "Hur högt är Stadshustornet i meter, upp till spetsen av Tre Kronor?",
    "ans": 106,
    "min": 50,
    "max": 180,
    "step": 1,
    "unit": "m",
    "photo": "assets/photos/stadshuset.jpg"
  },
  {
    "id": "kairo_alazhar_73",
    "explain": "Fatimiderna grundade både Kairo (\"Al-Qahira\", Den segerrika) och Al-Azhar-moskén år 969-970, som snabbt blev ett ledande lärosäte.",
    "city": "kairo",
    "place": "alazhar",
    "region": "afrika",
    "type": "mc",
    "difficulty": 1,
    "q": "Under vilken shiamuslimsk dynasti grundades Kairo och Al-Azhar på 970-talet?",
    "a": [
      "Fatimiderna",
      "Umayyaderna",
      "Abbasiderna",
      "Osmanska riket"
    ],
    "photo": "assets/photos/alazhar.jpg"
  },
  {
    "id": "kairo_alazhar_74",
    "explain": "Arabiska skrivs från höger till vänster med 28 bokstäver och talas som huvudspråk i över tjugo länder i Mellanöstern och Nordafrika.",
    "city": "kairo",
    "place": "alazhar",
    "region": "afrika",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilket skriftspråk skrivs från höger till vänster och är Egyptens officiella språk?",
    "a": [
      "Arabiska",
      "Koptiska",
      "Farsi",
      "Arameiska"
    ],
    "photo": "assets/photos/alazhar.jpg"
  },
  {
    "id": "delhi_indiagate_75",
    "explain": "Den brittiske arkitekten Edwin Lutyens utformade New Delhis breda boulevarder, presidentpalatset Rashtrapati Bhavan och triumfbågen India Gate.",
    "city": "delhi",
    "place": "indiagate",
    "region": "asien",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilken brittisk arkitekt ritade stora delar av New Delhi och själva India Gate?",
    "a": [
      "Edwin Lutyens",
      "Christopher Wren",
      "Norman Foster",
      "John Nash"
    ],
    "photo": "assets/photos/indiagate.jpg"
  },
  {
    "id": "delhi_indiagate_76",
    "explain": "India Gate bär namnen på över 13 000 indiska och brittiska soldater som stupade under första världskriget och tredje anglo-afghanska kriget.",
    "city": "delhi",
    "place": "indiagate",
    "region": "asien",
    "type": "mc",
    "difficulty": 1,
    "q": "Till minne av vilka soldater restes India Gate ursprungligen på 1920-talet?",
    "a": [
      "Indiska soldater som stupade i första världskriget",
      "Mogulrikets kavalleri",
      "Kriget mot Persien",
      "Handelsflottans sjömän"
    ],
    "photo": "assets/photos/indiagate.jpg"
  },
  {
    "id": "delhi_humayun_77",
    "explain": "Humayuns grav från 1570 introducerade den symmetriska mogularkitekturen i Indien och blev direkt förebild för Taj Mahal knappt hundra år senare.",
    "city": "delhi",
    "place": "humayun",
    "region": "asien",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilken ännu mer berömd byggnad i Agra inspirerades direkt av Humayuns grav hundra år senare?",
    "a": [
      "Taj Mahal",
      "Röda fortet",
      "Hawa Mahal",
      "Lotus-templet"
    ],
    "photo": "assets/photos/humayun.jpg"
  },
  {
    "id": "delhi_humayun_78",
    "explain": "UNESCO (FN:s organ för utbildning, vetenskap och kultur) satte upp Humayuns grav på världsarvslistan 1993.",
    "city": "delhi",
    "place": "humayun",
    "region": "asien",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilken världsorganisation har utsett Humayuns grav till världsarv?",
    "a": [
      "UNESCO",
      "WHO",
      "UNICEF",
      "WTO"
    ],
    "photo": "assets/photos/humayun.jpg"
  },
  {
    "id": "tokyo_shibuya_79",
    "city": "tokyo",
    "place": "shibuya",
    "region": "asien",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilken berömd trogen hund står staty utanför Shibuya-stationen som en populär mötesplats?",
    "a": [
      "Hachiko",
      "Shiba",
      "Kuro",
      "Taro"
    ],
    "explain": "Akita-hunden Hachiko väntade troget på sin husse, professor Ueno, vid Shibuya-stationen varje dag, och fortsatte komma dit i nästan tio år efter att professorn plötsligt gått bort 1925.",
    "photo": "assets/photos/shibuya.jpg"
  },
  {
    "id": "tokyo_shibuya_80",
    "explain": "Yamanote-linjen är en 34,5 km lång grön ringlinje som knyter ihop nästan alla stora knutpunkter i Tokyo, från Shibuya och Shinjuku till Tokyo Station.",
    "city": "tokyo",
    "place": "shibuya",
    "region": "asien",
    "type": "mc",
    "difficulty": 1,
    "q": "Vad heter den kända lokala järnvägslinjen i ringform som förbinder Shibuya, Shinjuku och Tokyo Station?",
    "a": [
      "Yamanote-linjen",
      "Ginza-linjen",
      "Tokaido-linjen",
      "Chuo-linjen"
    ],
    "photo": "assets/photos/shibuya.jpg"
  },
  {
    "id": "tokyo_meiji_81",
    "explain": "En torii-port markerar gränsen mellan den vardagliga världen och det heliga området inne vid en japansk shinto-helgedom.",
    "city": "tokyo",
    "place": "meiji",
    "region": "asien",
    "type": "mc",
    "difficulty": 1,
    "q": "Vad kallas de stora traditionella träportarna som markerar ingången till en shintohelgedom?",
    "a": [
      "Torii",
      "Pagod",
      "Tatami",
      "Origami"
    ],
    "photo": "assets/photos/meiji.jpg"
  },
  {
    "id": "tokyo_meiji_82",
    "explain": "Under Meijiperioden (1868-1912) avskaffades samurajväldet, järnvägar byggdes och Japan öppnade sina hamnar för handel och vetenskap.",
    "city": "tokyo",
    "place": "meiji",
    "region": "asien",
    "type": "mc",
    "difficulty": 1,
    "q": "Under vilken epok (1868–1912) öppnades Japan mot omvärlden och moderniserades i rasande takt?",
    "a": [
      "Meijiperioden",
      "Edoperioden",
      "Heianperioden",
      "Showaperioden"
    ],
    "photo": "assets/photos/meiji.jpg"
  },
  {
    "id": "sanfrancisco_fishermans_83",
    "explain": "San Franciscos surdegsbröd får sin unika syrliga smak från lokala mjölksyrabakterier (Fructilactobacillus sanfranciscensis) och serveras ofta urgröpt med clam chowder.",
    "city": "sanfrancisco",
    "place": "fishermans",
    "region": "amerika",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilken syrlig brödsort är San Francisco världsberömt för, ofta serverad urgröpt med musselsoppa?",
    "a": [
      "Surdegsbröd",
      "Brioche",
      "Pumpernickel",
      "Ciabatta"
    ],
    "photo": "assets/photos/fishermans.jpg"
  },
  {
    "id": "sanfrancisco_fishermans_84",
    "explain": "Stilla havet breder ut sig direkt väster om Golden Gate och täcker ungefär en tredjedel av hela jordens yta.",
    "city": "sanfrancisco",
    "place": "fishermans",
    "region": "amerika",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilket stort världshav ligger precis väster om San Francisco?",
    "a": [
      "Stilla havet",
      "Atlanten",
      "Indiska oceanen",
      "Karibiska havet"
    ],
    "photo": "assets/photos/fishermans.jpg"
  },
  {
    "id": "sanfrancisco_chinatown_sf_85",
    "explain": "Lyckokakan (fortune cookie) har sitt ursprung bland japanska och kinesiska bagare i Kalifornien i början av 1900-talet, inte i Kina.",
    "city": "sanfrancisco",
    "place": "chinatown_sf",
    "region": "amerika",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilken känd lyckokaka som ofta serveras på kinesiska restauranger i väst har sitt ursprung i Kalifornien?",
    "a": [
      "Fortune cookie",
      "Månkaka",
      "Macaron",
      "Mochi"
    ],
    "photo": "assets/photos/lombard.jpg"
  },
  {
    "id": "sanfrancisco_chinatown_sf_86",
    "explain": "Den berömda tegelbelagda delen av Lombard Street på Russian Hill slingrar sig i åtta skarpa hårnålskurvor för att bilar ska kunna ta sig nerför den branta backen.",
    "city": "sanfrancisco",
    "place": "chinatown_sf",
    "region": "amerika",
    "type": "num",
    "difficulty": 2,
    "q": "Hur många skarpa hårnålskurvor har den berömda branta delen av Lombard Street?",
    "ans": 8,
    "min": 2,
    "max": 20,
    "step": 1,
    "unit": "kurvor",
    "photo": "assets/photos/lombard.jpg"
  },
  {
    "id": "newyork_centralpark_87",
    "city": "newyork",
    "place": "centralpark",
    "region": "amerika",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilken tidigare Beatles-medlem hedras i minneslunden \"Strawberry Fields\" i Central Park?",
    "a": [
      "John Lennon",
      "George Harrison",
      "Paul McCartney",
      "Ringo Starr"
    ],
    "explain": "Minnesplatsen Strawberry Fields i Central Park ligger mitt emot Dakota Building där John Lennon bodde. Mosaiken \"Imagine\" skänktes av staden Neapel och pryds dagligen av färska blommor från besökare världen över.",
    "photo": "assets/photos/centralpark.jpg"
  },
  {
    "id": "newyork_centralpark_88",
    "explain": "Metropolitan Museum of Art (\"The Met\") ligger vid Fifth Avenue i kanten av Central Park och är ett av världens största konstmuseer.",
    "city": "newyork",
    "place": "centralpark",
    "region": "amerika",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilket världsberömt konstmuseum ligger direkt längs Central Parks östra sida på Fifth Avenue?",
    "a": [
      "Metropolitan Museum of Art",
      "Tate Modern",
      "Louvren",
      "Pradomuseet"
    ],
    "photo": "assets/photos/centralpark.jpg"
  },
  {
    "id": "newyork_brooklynbridge_89",
    "explain": "Brooklyn Bridge spänner över East River och band 1883 samman de då separata städerna New York (Manhattan) och Brooklyn.",
    "city": "newyork",
    "place": "brooklynbridge",
    "region": "amerika",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilket vattendrag spänner Brooklyn Bridge över?",
    "a": [
      "East River",
      "Hudsonfloden",
      "Harlem River",
      "Potomac"
    ],
    "photo": "assets/photos/brooklynbridge.jpg"
  },
  {
    "id": "newyork_brooklynbridge_90",
    "explain": "Brooklyn Bridge invigdes 1883 som världens första hängbro med stålkablar och var då världens längsta hängbro.",
    "city": "newyork",
    "place": "brooklynbridge",
    "region": "amerika",
    "type": "num",
    "difficulty": 2,
    "q": "Vilket årtal på 1800-talet invigdes Brooklyn Bridge som världens då längsta hängbro?",
    "ans": 1883,
    "min": 1840,
    "max": 1920,
    "step": 1,
    "unit": "år",
    "photo": "assets/photos/brooklynbridge.jpg"
  },
  {
    "id": "kairo_giza_91",
    "city": "kairo",
    "place": "giza",
    "region": "afrika",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilket mytologiskt lejonväsen med faraonskt mansansikte vaktar östra infarten till Gizas gravar?",
    "a": [
      "Stora sfinxen",
      "Griffen",
      "Anubis-statyn",
      "Horusfalken"
    ],
    "explain": "Stora sfinxen i Giza är uthuggen direkt ur ett enda massivt kalkstensblock för cirka 4 500 år sedan. Den är 73 meter lång och tros bära farao Chefrens anletsdrag.",
    "photo": "assets/photos/pyramids.jpg"
  },
  {
    "id": "kairo_giza_92",
    "city": "kairo",
    "place": "giza",
    "region": "afrika",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilken grekisk antik historiker reste i Egypten på 400-talet f.Kr. och skildrade pyramidbyggena?",
    "a": [
      "Herodotos",
      "Homeros",
      "Platon",
      "Thukydides"
    ],
    "explain": "Den grekiske resenären Herodotos (ca 484–425 f.Kr.) kallas ofta \"historiens fader\". Han besökte Egypten runt 450 f.Kr. och skrev den första kända europeiska skildringen av hur pyramiderna uppfördes.",
    "photo": "assets/photos/pyramids.jpg"
  },
  {
    "id": "kairo_giza_93",
    "explain": "Av antikens sju underverk är Cheopspyramiden i Giza både det äldsta och det enda som fortfarande står kvar idag.",
    "city": "kairo",
    "place": "giza",
    "region": "afrika",
    "type": "num",
    "difficulty": 2,
    "q": "Hur många av antikens ursprungliga sju underverk finns kvar i bevarat skick i dag?",
    "ans": 1,
    "min": 0,
    "max": 7,
    "step": 1,
    "unit": "st",
    "photo": "assets/photos/pyramids.jpg"
  },
  {
    "id": "delhi_taj_94",
    "explain": "Taj Mahal ligger vid floden Yamuna i staden Agra, omkring 20 mil söder om Delhi.",
    "city": "delhi",
    "place": "taj",
    "region": "asien",
    "type": "mc",
    "difficulty": 1,
    "q": "I vilken indisk stad strax söder om Delhi ligger Taj Mahal?",
    "a": [
      "Agra",
      "Jaipur",
      "Varanasi",
      "Lucknow"
    ],
    "photo": "assets/photos/taj.jpg"
  },
  {
    "id": "delhi_taj_95",
    "explain": "Charbagh betyder \"fyra trädgårdar\" på persiska och delas upp i fyra symmetriska kvarter av raka vattenkanaler och gångar.",
    "city": "delhi",
    "place": "taj",
    "region": "asien",
    "type": "mc",
    "difficulty": 1,
    "q": "Vad kallas den persiskt inspirerade symmetriska trädgårdsformen i fyra kvadranter som omger mausoleet?",
    "a": [
      "Charbagh",
      "Mandala-park",
      "Zen-trädgård",
      "Engelsk park"
    ],
    "photo": "assets/photos/taj.jpg"
  },
  {
    "id": "delhi_taj_96",
    "explain": "Fotografiet på prinsessan Diana ensam på marmorbänken framför Taj Mahal i februari 1992 blev en av 1990-talets mest kända nyhetsbilder.",
    "city": "delhi",
    "place": "taj",
    "region": "asien",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilken brittisk kunglighet fotograferades ensam och melankolisk framför Taj Mahal 1992 i en världsberömd bild?",
    "a": [
      "Prinsessan Diana",
      "Drottning Elizabeth II",
      "Drottning Victoria",
      "Prinsessan Margaret"
    ],
    "photo": "assets/photos/taj.jpg"
  },
  {
    "id": "sanfrancisco_grandcanyon_97",
    "explain": "Havasupaifolket (\"folket vid det blågröna vattnet\") har bott i Grand Canyon i över 800 år. Deras by Supai nås bara till fots, med mula eller helikopter.",
    "city": "sanfrancisco",
    "place": "grandcanyon",
    "region": "amerika",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilket ursprungsamerikanskt folk har sin avskilda by Supai i botten av kanjonen vid Havasu-fallen?",
    "a": [
      "Havasupai",
      "Navajo",
      "Cherokee",
      "Sioux"
    ],
    "photo": "assets/photos/grandcanyon.jpg"
  },
  {
    "id": "sanfrancisco_grandcanyon_98",
    "explain": "President Theodore Roosevelt skyddade Grand Canyon som nationalmonument 1908 med orden: \"Lämna det som det är. Människan kan inte förbättra det.\"",
    "city": "sanfrancisco",
    "place": "grandcanyon",
    "region": "amerika",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilken amerikansk president och ivrig naturvårdare bidrog avgörande till att skydda kanjonen 1908?",
    "a": [
      "Theodore Roosevelt",
      "Abraham Lincoln",
      "George Washington",
      "Thomas Jefferson"
    ],
    "photo": "assets/photos/grandcanyon.jpg"
  },
  {
    "id": "sanfrancisco_grandcanyon_99",
    "explain": "Coloradofloden har under fem till sex miljoner år skurit sig rakt ner genom lager av röd sandsten och kalksten till nästan 1 800 meters djup.",
    "city": "sanfrancisco",
    "place": "grandcanyon",
    "region": "amerika",
    "type": "mc",
    "difficulty": 1,
    "q": "Vilken mäktig flod har under årmiljonerna mejslat ut Grand Canyons branta klyftor?",
    "a": [
      "Coloradofloden",
      "Mississippi",
      "Rio Grande",
      "Columbiafloden"
    ],
    "photo": "assets/photos/grandcanyon.jpg"
  },
  {
    "id": "sthlm_bp_01",
    "city": "stockholm",
    "place": "gamlastan",
    "region": "europa",
    "type": "mc",
    "difficulty": 1,
    "q": "Sant eller falskt: Stockholm är den enda staden i Sverige som har ett tunnelbanesystem.",
    "a": [
      "Sant",
      "Falskt"
    ],
    "explain": "Sant! Stockholms tunnelbana invigdes 1950 och är fortfarande Sveriges enda tunnelbana, Göteborg och Norrköping har istället spårvagnar.",
    "photo": "assets/photos/gamlastan.jpg"
  },
  {
    "id": "sthlm_bp_02",
    "city": "stockholm",
    "place": "gamlastan",
    "region": "europa",
    "type": "mc",
    "difficulty": 2,
    "q": "Vilken av dessa 6 svenska platser har INTE en egen station i Stockholms tunnelbana?",
    "a": [
      "Hallsberg",
      "Hjulsta",
      "Farsta",
      "Mörby centrum",
      "Norsborg",
      "Hagsätra"
    ],
    "explain": "Hallsberg är en klassisk järnvägsknut i Närke, medan de övriga fem är riktiga slutstationer i Stockholms tunnelbana!",
    "photo": "assets/photos/gamlastan.jpg"
  },
  {
    "id": "sthlm_bp_03",
    "city": "stockholm",
    "place": "stadshuset",
    "region": "europa",
    "type": "num",
    "difficulty": 2,
    "q": "Ungefär hur många invånare bor i Stockholms kommun idag (i tusental)?",
    "ans": 990,
    "min": 400,
    "max": 1800,
    "step": 10,
    "unit": "tusen",
    "explain": "På 1990-talet (när BackPacker gjordes) bodde drygt 700 000 personer i Stockholms stad. Idag har kommunen passerat cirka 990 000 invånare (och över 1,6 miljoner i tätorten)!",
    "photo": "assets/photos/stadshuset.jpg"
  },
  {
    "id": "sthlm_bp_04",
    "city": "stockholm",
    "place": "skansen",
    "region": "europa",
    "type": "text",
    "difficulty": 2,
    "q": "Vad heter det kungliga slottet på Lovön i Mälaren där kung Carl XVI Gustaf och drottning Silvia har sitt permanenta residens?",
    "ans": "Drottningholm",
    "accept": [
      "drottningholm",
      "drottningholms"
    ],
    "explain": "Drottningholms slott från 1600-talet blev 1991 Sveriges allra första världsarv på UNESCO:s lista och är sedan 1981 kungaparets hem.",
    "photo": "assets/photos/skansen.jpg"
  },
  {
    "id": "sthlm_bp_05",
    "city": "stockholm",
    "place": "vasa",
    "region": "europa",
    "type": "mc",
    "difficulty": 2,
    "q": "I vilken svensk stad ligger kung Gustav Vasa (farfar till Vasaskeppets byggherre) begravd?",
    "a": [
      "Uppsala",
      "Stockholm",
      "Kalmar",
      "Vadstena",
      "Strängnäs"
    ],
    "explain": "Gustav Vasa vilar i det praktfulla Vasakoret i Uppsala domkyrka tillsammans med sina drottningar.",
    "photo": "assets/photos/vasa.jpg"
  },
  {
    "id": "kairo_bp_01",
    "city": "kairo",
    "place": "museum",
    "region": "afrika",
    "type": "text",
    "difficulty": 2,
    "q": "I vilken modern egyptisk stad vid Nilen ligger porten till Konungarnas dal, där Tutankhamons grav hittades?",
    "ans": "Luxor",
    "accept": [
      "luxor",
      "luksor",
      "thebe",
      "tebe"
    ],
    "explain": "Luxor (det forntida Thebe) i södra Egypten kallas ofta världens största friluftsmuseum med både Karnaktemplet och Konungarnas dal tvärs över Nilen.",
    "photo": "assets/photos/museum.jpg"
  },
  {
    "id": "kairo_bp_02",
    "city": "kairo",
    "place": "giza",
    "region": "afrika",
    "type": "text",
    "difficulty": 1,
    "q": "Vad kallas den mytiska skulpturen i Giza med lejonkropp och människohuvud? (Skriv ordet!)",
    "ans": "Sfinxen",
    "accept": [
      "sfinx",
      "sphinx",
      "sfinxen"
    ],
    "explain": "Stora sfinxen i Giza är över 4 500 år gammal och uthuggen direkt ur berggrunden framför Chefrens pyramid.",
    "photo": "assets/photos/pyramids.jpg"
  },
  {
    "id": "kairo_bp_03",
    "city": "kairo",
    "place": "khan",
    "region": "afrika",
    "type": "mc",
    "difficulty": 2,
    "q": "Vilken internationell samarbetsorganisation har sitt högkvarter vid Tahrirtorget i Kairo?",
    "a": [
      "Arabförbundet",
      "Afrikanska unionen",
      "OPEC",
      "FN:s miljöprogram",
      "ASEAN"
    ],
    "explain": "Arabförbundet grundades i Kairo 1945 och samlar idag 22 arabstater i Nordafrika och Mellanöstern.",
    "photo": "assets/photos/khan.jpg"
  },
  {
    "id": "kairo_bp_04",
    "city": "kairo",
    "place": "citadel",
    "region": "afrika",
    "type": "mc",
    "difficulty": 2,
    "q": "Vad kallades det historiska fredsavtalet mellan Egypten (Anwar Sadat) och Israel som slöts 1978–1979?",
    "a": [
      "Camp David-avtalet",
      "Osloavtalet",
      "Daytonavtalet"
    ],
    "explain": "Camp David-avtalet förhandlades fram i USA med president Jimmy Carter som medlare och ledde till att både Anwar Sadat och Menachem Begin fick Nobels fredspris.",
    "photo": "assets/photos/mosque.jpg"
  },
  {
    "id": "delhi_bp_01",
    "city": "delhi",
    "place": "indiagate",
    "region": "asien",
    "type": "mc",
    "difficulty": 2,
    "q": "Delhis berömda paradgata vid India Gate hette länge Rajpath, vad bytte den officiellt namn till år 2022?",
    "a": [
      "Kartavya Path",
      "Gandhi Marg",
      "Nehru Avenue",
      "Shanti Path",
      "Indira Road"
    ],
    "explain": "I september 2022 döptes kolonialtidens \"Rajpath\" (Kungsvägen) om till \"Kartavya Path\" (Pliktens väg) för att markera ett modernt, självständigt Indien.",
    "photo": "assets/photos/indiagate.jpg"
  },
  {
    "id": "delhi_bp_02",
    "city": "delhi",
    "place": "qutb",
    "region": "asien",
    "type": "text",
    "difficulty": 1,
    "q": "Vad heter den indiske frihetsledaren som ledde det fredliga icke-våldsmotståndet mot det brittiska styret? (Efternamn räcker)",
    "ans": "Mahatma Gandhi",
    "accept": [
      "gandhi",
      "gandi",
      "mahatma"
    ],
    "explain": "Mohandas \"Mahatma\" Gandhi (1869–1948) inspirerade hela världen med sin filosofi satyagraha (fredligt motstånd) och ledde bland annat den berömda Saltmarschen 1930.",
    "photo": "assets/photos/qutb.jpg"
  },
  {
    "id": "delhi_bp_03",
    "city": "delhi",
    "place": "redfort",
    "region": "asien",
    "type": "mc",
    "difficulty": 2,
    "q": "Strax väster om Delhi breder Indiens största öken ut sig, vad heter den?",
    "a": [
      "Tharöknen",
      "Gobiöknen",
      "Taklamakan",
      "Karakum",
      "Kalahari"
    ],
    "explain": "Tharöknen (Stora indiska öknen) ligger i Rajasthan och sträcker sig in i Pakistan. Här ligger de färgsprakande ökenstäderna Jaisalmer och Jodhpur.",
    "photo": "assets/photos/redfort.jpg"
  },
  {
    "id": "delhi_bp_04",
    "city": "delhi",
    "place": "humayun",
    "region": "asien",
    "type": "text",
    "difficulty": 1,
    "q": "Vad kallas den urgamla indiska disciplinen med kroppsställningar, andning och meditation som idag utövas över hela världen?",
    "ans": "Yoga",
    "accept": [
      "yoga"
    ],
    "explain": "Ordet yoga kommer från sanskrit och betyder \"förening\". Praktiken har rötter som sträcker sig flera tusen år tillbaka på den indiska subkontinenten.",
    "photo": "assets/photos/humayun.jpg"
  },
  {
    "id": "tokyo_bp_01",
    "city": "tokyo",
    "place": "sensoji",
    "region": "asien",
    "type": "mc",
    "difficulty": 1,
    "q": "Vad får du på tallriken om du beställer den berömda (och potentiellt giftiga!) delikatessen \"fugu\" i Tokyo?",
    "a": [
      "Blåsfisk",
      "Rå bläckfisk",
      "Fermenterade sojabönor",
      "Sjöborre",
      "Sjögurka"
    ],
    "explain": "Fugu (blåsfisk) innehåller det starka nervgiftet tetrodotoxin, så kockar i Japan måste genomgå flera års utbildning och särskild licens för att få tillaga den!",
    "photo": "assets/photos/sensoji.jpg"
  },
  {
    "id": "tokyo_bp_02",
    "city": "tokyo",
    "place": "shibuya",
    "region": "asien",
    "type": "mc",
    "difficulty": 2,
    "q": "Den japanska elektronikjätten som i BackPacker på 90-talet hette \"Matsushita\" bytte 2008 namn till ett världskänt varumärke, vilket?",
    "a": [
      "Panasonic",
      "Sony",
      "Nintendo",
      "Toshiba",
      "Hitachi",
      "Sharp"
    ],
    "explain": "Matsushita Electric Industrial Co. grundades 1918 i Osaka, men samlade år 2008 hela koncernen under sitt mest kända varumärke: Panasonic!",
    "photo": "assets/photos/shibuya.jpg"
  },
  {
    "id": "tokyo_bp_03",
    "city": "tokyo",
    "place": "meiji",
    "region": "asien",
    "type": "text",
    "difficulty": 2,
    "q": "Den 6 augusti 1945 föll den första atombomben över Hiroshima. Vilken annan japansk stad drabbades tre dagar senare, den 9 augusti?",
    "ans": "Nagasaki",
    "accept": [
      "nagasaki"
    ],
    "explain": "Den 9 augusti 1945 föll atombomben över hamnstaden Nagasaki. Både Hiroshima och Nagasaki är idag blomstrande städer med starka fredsmuseer och minnesparker.",
    "photo": "assets/photos/meiji.jpg"
  },
  {
    "id": "tokyo_bp_04",
    "city": "tokyo",
    "place": "tokyotower",
    "region": "asien",
    "type": "mc",
    "difficulty": 1,
    "q": "Sant eller falskt: Japan är världens äldsta fortfarande existerande kejsardöme.",
    "a": [
      "Sant",
      "Falskt"
    ],
    "explain": "Sant! Det japanska kejsarhuset har en obruten tronföljd som sträcker sig över 1 500 år tillbaka i historien (sedan 2019 är Naruhito Japans kejsare).",
    "photo": "assets/photos/tokyotower.jpg"
  },
  {
    "id": "sf_bp_01",
    "city": "sanfrancisco",
    "place": "goldengate",
    "region": "amerika",
    "type": "mc",
    "difficulty": 1,
    "q": "Sant eller falskt: San Francisco är delstaten Kaliforniens huvudstad.",
    "a": [
      "Falskt",
      "Sant"
    ],
    "explain": "Falskt! Många gissar på Los Angeles eller San Francisco, men Kaliforniens huvudstad är faktiskt Sacramento längre in i landet.",
    "photo": "assets/photos/goldengate.jpg"
  },
  {
    "id": "sf_bp_02",
    "city": "sanfrancisco",
    "place": "fishermans",
    "region": "amerika",
    "type": "mc",
    "difficulty": 2,
    "q": "Vilket landsnummer slår du före riktnumret om du ska ringa ett amerikanskt telefonnummer från Sverige?",
    "a": [
      "+1",
      "+44",
      "+49",
      "+61",
      "+81"
    ],
    "explain": "USA och Kanada delar på det nordamerikanska landsnumret +1!",
    "photo": "assets/photos/fishermans.jpg"
  },
  {
    "id": "sf_bp_03",
    "city": "sanfrancisco",
    "place": "chinatown_sf",
    "region": "amerika",
    "type": "mc",
    "difficulty": 2,
    "q": "Vilket känt jeansmärke grundades i San Francisco under guldruschen på 1850-talet för att ge guldgrävarna slitstarka byxor?",
    "a": [
      "Levi's",
      "Wrangler",
      "Lee"
    ],
    "explain": "Levi Strauss kom till San Francisco 1853 och skapade tillsammans med skräddaren Jacob Davis de nitförstärkta blåjeansen (patent 1873).",
    "photo": "assets/photos/lombard.jpg"
  },
  {
    "id": "ny_bp_01",
    "city": "newyork",
    "place": "centralpark",
    "region": "amerika",
    "type": "text",
    "difficulty": 1,
    "q": "Vad heter den berömda stadsdelen strax norr om Central Park, känd för jazz, kultur och basketlaget Harlem Globetrotters?",
    "ans": "Harlem",
    "accept": [
      "harlem"
    ],
    "explain": "Under 1920-talets \"Harlem Renaissance\" blev stadsdelen ett världsberömt centrum för afroamerikansk musik, litteratur, konst och legendariska klubbar som Apollo Theater.",
    "photo": "assets/photos/centralpark.jpg"
  },
  {
    "id": "ny_bp_02",
    "city": "newyork",
    "place": "empirestate",
    "region": "amerika",
    "type": "mc",
    "difficulty": 2,
    "q": "På 90-talet hade \"A Chorus Line\" rekordet på Broadway. Vilken musikal tog senare över som den längst spelade Broadway-musikalen genom tiderna (13 981 föreställningar)?",
    "a": [
      "The Phantom of the Opera",
      "Cats",
      "Les Misérables",
      "The Lion King",
      "Wicked"
    ],
    "explain": "Andrew Lloyd Webbers \"The Phantom of the Opera\" spelades i otroliga 35 år på Broadway (1988–2023)! Av de som fortfarande går idag har \"Chicago\" rekordet.",
    "photo": "assets/photos/empirestate.jpg"
  },
  {
    "id": "ny_bp_03",
    "city": "newyork",
    "place": "brooklynbridge",
    "region": "amerika",
    "type": "text",
    "difficulty": 1,
    "q": "Vad heter den världskända teater- och nöjesgatan som löper diagonalt genom Manhattan och passerar Times Square?",
    "ans": "Broadway",
    "accept": [
      "broadway"
    ],
    "explain": "Broadway är en av Manhattans äldsta gator, den följer ursprungligen en uråldrig stig som användes av Lenape-folket långt innan holländarna grundade Nya Amsterdam.",
    "photo": "assets/photos/brooklynbridge.jpg"
  },
  {
    "id": "ny_bp_04",
    "city": "newyork",
    "place": "liberty",
    "region": "amerika",
    "type": "mc",
    "difficulty": 2,
    "q": "Vad hette New York innan engelsmännen tog över staden år 1664?",
    "a": [
      "Nya Amsterdam",
      "Nya Rotterdam",
      "Nya London",
      "Nya Stockholm",
      "Nya Paris"
    ],
    "explain": "Holländska kolonisatörer grundade handelsstationen \"Nieuw Amsterdam\" (Nya Amsterdam) på södra spetsen av Manhattan 1624. När engelsmännen tog över döptes den om efter hertigen av York.",
    "photo": "assets/photos/liberty.jpg"
  }
];

  if (typeof module !== "undefined" && module.exports) {
    module.exports = root.GT_QUESTIONS;
  }
})();
