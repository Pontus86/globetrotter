// Globetrotter - Utmanande & svårare BackPacker-frågor (svårighetsgrad 3)
// Trovärdiga svarsalternativ där man verkligen måste kunna svaret eller resonera skarpt.

(function () {
  'use strict';

  const HARD_QUESTIONS = [
    // =========================================================================
    // EUROPA
    // =========================================================================
    {
      id: 'hq_eu_01', t: 'mc', region: 'Europa', difficulty: 3,
      q: 'Vilken europeisk flod rinner genom eller utgör gräns för flest suveräna länder?',
      a: ['Donau', 'Rhen', 'Elbe', 'Dnepr'],
      explain: 'Donau passerar tio länder (Tyskland, Österrike, Slovakien, Ungern, Kroatien, Serbien, Rumänien, Bulgarien, Moldavien och Ukraina), fler än någon annan flod i världen.'
    },
    {
      id: 'hq_eu_02', t: 'mc', region: 'Europa', difficulty: 3,
      q: 'Vilket år undertecknades Westfaliska freden som avslutade trettioåriga kriget i Europa?',
      a: ['1648', '1618', '1658', '1632'],
      explain: 'Westfaliska freden slöts i Münster och Osnabrück i oktober 1648 och lade grunden för det moderna europeiska statssystemet.'
    },
    {
      id: 'hq_eu_03', t: 'mc', region: 'Europa', difficulty: 3,
      q: 'Vilken är världens enda suveräna huvudstad som direkt gränsar till två andra självständiga länder?',
      a: ['Bratislava', 'Vaduz', 'Nicosia', 'Luxemburg'],
      explain: 'Slovakiens huvudstad Bratislava ligger direkt vid både Österrikes och Ungerns gränser, i det så kallade treriksmötet vid Donau.'
    },
    {
      id: 'hq_eu_04', t: 'mc', region: 'Europa', difficulty: 3,
      q: 'Vilken renässansmästare målade fresken "Skolan i Aten" i Vatikanpalatsets Stanza della Segnatura?',
      a: ['Rafael', 'Michelangelo', 'Sandro Botticelli', 'Donato Bramante'],
      explain: 'Rafael målade Skolan i Aten omkring 1509 till 1511 med Platon och Aristoteles i centrum, samtidigt som Michelangelo arbetade i Sixtinska kapellet.'
    },
    {
      id: 'hq_eu_05', t: 'mc', region: 'Europa', difficulty: 3,
      q: 'Vilket av följande europeiska språk tillhör INTE den indoeuropeiska språkfamiljen?',
      a: ['Ungerska', 'Farsi', 'Litauiska', 'Albanska'],
      explain: 'Ungerska tillhör den uraliska språkfamiljen (släkt med finska och estniska), medan farsi, litauiska och albanska alla är indoeuropeiska språk.'
    },
    {
      id: 'hq_eu_06', t: 'mc', region: 'Europa', difficulty: 3,
      q: 'Vilken italiensk stadsstat kontrollerade öarna Kreta och Cypern under stora delar av senmedeltiden?',
      a: ['Republiken Venedig', 'Republiken Genua', 'Republiken Pisa', 'Hertigdömet Amalfi'],
      explain: 'Venedig byggde ett omfattande sjöimperium i östra Medelhavet (Stato da Màr) med Kreta som sin viktigaste koloni i över 450 år.'
    },
    {
      id: 'hq_eu_07', t: 'mc', region: 'Europa', difficulty: 3,
      q: 'Vilket bergsmassiv utgör den traditionella gränsen mellan Europa och Asien mellan Svarta havet och Kaspiska havet?',
      a: ['Kaukasus', 'Uralbergen', 'Karpaterna', 'Taurusbergen'],
      explain: 'Stora Kaukasus sträcker sig mellan Svarta havet och Kaspiska havet, och dess högsta topp Elbrus (5 642 m) räknas ofta som Europas högsta berg.'
    },
    {
      id: 'hq_eu_08', t: 'mc', region: 'Europa', difficulty: 3,
      q: 'I vilken stad ligger världens äldsta kontinuerligt verksamma universitet, grundat 1088?',
      a: ['Bologna', 'Oxford', 'Salamanca', 'Padua'],
      explain: 'Universitetet i Bologna grundades år 1088 och gav upphov till själva ordet universitas.'
    },
    {
      id: 'hq_eu_09', t: 'mc', region: 'Europa', difficulty: 3,
      q: 'Vilken spansk arkitekt ritade inte bara Sagrada Família utan även Casa Batlló och Park Güell i Barcelona?',
      a: ['Antoni Gaudí', 'Lluís Domènech i Montaner', 'Josep Puig i Cadafalch', 'Santiago Calatrava'],
      explain: 'Antoni Gaudí (1852 till 1926) var den främsta företrädaren för den katalanska modernismen och satte sin unika prägel på Barcelona.'
    },
    {
      id: 'hq_eu_10', t: 'mc', region: 'Europa', difficulty: 3,
      q: 'Vilket fördrag från 1494 delade den nyupptäckta världen utanför Europa mellan Spanien och Portugal?',
      a: ['Tordesillasfördraget', 'Utrechtfördraget', 'Alcáçovasfördraget', 'Zaragosafördraget'],
      explain: 'Genom Tordesillasfördraget 1494 drogs en meridian väster om Kap Verde; därför blev Brasilien portugisiskt medan resten av Sydamerika blev spanskt.'
    },
    {
      id: 'hq_eu_11', t: 'mc', region: 'Europa', difficulty: 3,
      q: 'Vilken kompositör skrev "Bilder på en utställning" som ursprungligen var en svit för solopiano?',
      a: ['Modest Musorgskij', 'Nikolaj Rimskij-Korsakov', 'Aleksandr Borodin', 'Sergej Rachmaninov'],
      explain: 'Modest Musorgskij skrev verket 1874 till minne av sin vän konstnären Viktor Hartmann; Maurice Ravel orkestrerade det 1922.'
    },
    {
      id: 'hq_eu_12', t: 'mc', region: 'Europa', difficulty: 3,
      q: 'Vilket land har flest tidszoner i världen om man räknar med utomeuropeiska territorier?',
      a: ['Frankrike', 'Ryssland', 'USA', 'Storbritannien'],
      explain: 'Tack vare utomeuropeiska departement och territorier i Stilla havet, Indiska oceanen och Karibien spänner Frankrike över 12 tidszoner.'
    },
    {
      id: 'hq_eu_13', t: 'mc', region: 'Europa', difficulty: 3,
      q: 'Vad kallades det handelsförbund av nordtyska och baltiska städer som dominerade Östersjöhandeln under medeltiden?',
      a: ['Hansan', 'Tyska orden', 'Kalmarunionen', 'Schmalkaldiska förbundet'],
      explain: 'Hansan, med Lübeck som ledande stad, knöt samman handelsposter från Novgorod och Visby till Bergen, Brügge och London.'
    },
    {
      id: 'hq_eu_14', t: 'mc', region: 'Europa', difficulty: 3,
      q: 'Vilken engelsk monark grundade Church of England efter att påven nekat honom skilsmässa från Katarina av Aragonien?',
      a: ['Henrik VIII', 'Edvard VI', 'Henrik VII', 'Jakob I'],
      explain: 'Genom Suprematiakten 1534 gjorde sig Henrik VIII till högste chef för den engelska kyrkan.'
    },

    // =========================================================================
    // ASIEN & MELLANÖSTERN
    // =========================================================================
    {
      id: 'hq_as_01', t: 'mc', region: 'Asien', difficulty: 3,
      q: 'Vilken stad var huvudstad i det Osmanska riket omedelbart innan Konstantinopel erövrades 1453?',
      a: ['Edirne', 'Bursa', 'Konya', 'Izmir'],
      explain: 'Edirne (det antika Adrianopel) i europeiska Thrakien var osmansk huvudstad från 1369 fram till Konstantinopels fall 1453.'
    },
    {
      id: 'hq_as_02', t: 'mc', region: 'Asien', difficulty: 3,
      q: 'Vilken dynasti lät bygga den Förbjudna staden i Peking i början av 1400-talet?',
      a: ['Mingdynastin', 'Qingdynastin', 'Yuandynastin', 'Songdynastin'],
      explain: 'Kejsar Yongle i Mingdynastin lät uppföra Förbjudna staden mellan 1406 och 1420 när huvudstaden flyttades från Nanjing till Peking.'
    },
    {
      id: 'hq_as_03', t: 'mc', region: 'Asien', difficulty: 3,
      q: 'Under vilken japansk period stängdes landet nästan helt för utländsk handel (sakoku) med undantag för ön Dejima?',
      a: ['Edoperioden', 'Meijiperioden', 'Muromachiperioden', 'Heianperioden'],
      explain: 'Under Tokugawa-shogunatets Edoperiod (1603 till 1868) fick endast nederländska och kinesiska fartyg handla via Nagasaki.'
    },
    {
      id: 'hq_as_04', t: 'mc', region: 'Asien', difficulty: 3,
      q: 'Vilken rysk eller centralasiatisk öken heter i bokstavlig översättning ungefär "Går du in kommer du aldrig ut"?',
      a: ['Taklamakan', 'Gobiöknen', 'Karakum', 'Kyzylkum'],
      explain: 'Taklamakan i Tarimbäckenet i Xinjiang är en av världens största sandöknar och låg längs sidenvägens farligaste sträckor.'
    },
    {
      id: 'hq_as_05', t: 'mc', region: 'Asien', difficulty: 3,
      q: 'Vilken mogulkejsare lät uppföra Taj Mahal i Agra till minne av sin hustru Mumtaz Mahal?',
      a: ['Shah Jahan', 'Akbar den store', 'Aurangzeb', 'Jahangir'],
      explain: 'Shah Jahan påbörjade bygget 1632; senare avsattes han av sin son Aurangzeb och sattes i husarrest i Röda fortet med utsikt mot mausoleet.'
    },
    {
      id: 'hq_as_06', t: 'mc', region: 'Asien', difficulty: 3,
      q: 'Vilket antikt handelsfolk byggde klippstaden Petra i dagens Jordanien?',
      a: ['Nabatéerna', 'Fenicierna', 'Assyrierna', 'Hettiterna'],
      explain: 'Nabatéerna kontrollerade rökelse- och kryddkaravanerna mellan Arabiska halvön och Medelhavet och högg ut Petra i röd sandsten.'
    },
    {
      id: 'hq_as_07', t: 'mc', region: 'Asien', difficulty: 3,
      q: 'Vad heter världens djupaste sjö, som ensam rymmer ungefär en femtedel av jordens ofrusna sötvatten?',
      a: ['Bajkalsjön', 'Tanganyikasjön', 'Kaspiska havet', 'Issyk-Kul'],
      explain: 'Bajkalsjön i Sibirien är 1 642 meter djup och omkring 25 miljoner år gammal, vilket gör den till både världens djupaste och äldsta sjö.'
    },
    {
      id: 'hq_as_08', t: 'mc', region: 'Asien', difficulty: 3,
      q: 'Vilket tempelkomplex i Kambodja byggdes ursprungligen som ett hinduiskt tempel tillägnat guden Vishnu på 1100-talet?',
      a: ['Angkor Wat', 'Borobudur', 'Prambanan', 'Bagan'],
      explain: 'Angkor Wat uppfördes av khmerkungen Suryavarman II på 1100-talet och omvandlades gradvis till ett buddhistiskt tempel mot slutet av seklet.'
    },
    {
      id: 'hq_as_09', t: 'mc', region: 'Asien', difficulty: 3,
      q: 'Vilken marockansk 1300-talsresenär reste omkring 120 000 kilometer genom Afrika, Mellanöstern, Indien och Kina?',
      a: ['Ibn Battuta', 'Al-Idrisi', 'Ibn Khaldun', 'Al-Biruni'],
      explain: 'Ibn Battuta från Tanger reste i nästan 30 år och dikterade sina upplevelser i reseskildringen Rihla, betydligt längre än Marco Polo.'
    },
    {
      id: 'hq_as_10', t: 'mc', region: 'Asien', difficulty: 3,
      q: 'Vilket land är det enda i Sydostasien som aldrig koloniserades av någon europeisk makt?',
      a: ['Thailand', 'Burma (Myanmar)', 'Laos', 'Kambodja'],
      explain: 'Siam (dagens Thailand) behöll sin självständighet under 1800-talet genom skicklig diplomati och fungerade som buffertzon mellan Brittiska Indien och Franska Indokina.'
    },
    {
      id: 'hq_as_11', t: 'mc', region: 'Asien', difficulty: 3,
      q: 'Vilket sund förbinder Persiska viken med Omanbukten och är en av världens mest strategiska oljeleder?',
      a: ['Hormuzsundet', 'Bab al-Mandab', 'Malackasundet', 'Sundasundet'],
      explain: 'Hormuzsundet mellan Iran och Oman är som smalast knappt 40 kilometer brett, men ungefär en femtedel av världens oljehandel passerar där.'
    },
    {
      id: 'hq_as_12', t: 'mc', region: 'Asien', difficulty: 3,
      q: 'Vilken kinesisk amiral ledde sju gigantiska skattflotteexpeditioner till Indien, Persiska viken och Östafrika på 1400-talet?',
      a: ['Zheng He', 'Sun Tzu', 'Kublai Khan', 'Zhang Qian'],
      explain: 'Amiral Zheng He seglade mellan 1405 och 1433 med väldiga djonker långt innan Vasco da Gama rundade Afrika.'
    },

    // =========================================================================
    // AFRIKA
    // =========================================================================
    {
      id: 'hq_af_01', t: 'mc', region: 'Afrika', difficulty: 3,
      q: 'Vad hette det mäktiga antika handelsriket i nuvarande Etiopien och Eritrea som präglade egna guldmynt redan på 200-talet?',
      a: ['Aksumriket', 'Kushriket', 'Maliriket', 'Songhairiket'],
      explain: 'Aksumriket kontrollerade handeln på Röda havet mellan Romarriket och Indien och var ett av de första rikena i världen som antog kristendomen.'
    },
    {
      id: 'hq_af_02', t: 'mc', region: 'Afrika', difficulty: 3,
      q: 'Vilken legendomspunnen 1300-talshärskare över Maliriket gjorde en vallfärd till Mecka som sänkte guldpriset i Kairo i åratal?',
      a: ['Mansa Musa', 'Sundiata Keita', 'Askia Mohammad', 'Shaka Zulu'],
      explain: 'Mansa Musas karavan 1324 bestod av tiotusentals människor och tonvis med guld, och han byggde upp Timbuktu som lärdomscentrum.'
    },
    {
      id: 'hq_af_03', t: 'mc', region: 'Afrika', difficulty: 3,
      q: 'Vilken afrikansk flod korsar ekvatorn två gånger innan den mynnar ut i Atlanten?',
      a: ['Kongofloden', 'Nigerfloden', 'Zambezifloden', 'Vita Nilen'],
      explain: 'Kongofloden gör en stor båge norr om ekvatorn genom Centralafrikas regnskog och är världens djupaste flod.'
    },
    {
      id: 'hq_af_04', t: 'mc', region: 'Afrika', difficulty: 3,
      q: 'Vilket av följande afrikanska länder är helt omslutet av ett enda annat land (en enklavstat)?',
      a: ['Lesotho', 'Eswatini', 'Malawi', 'Burundi'],
      explain: 'Lesotho är helt omgivet av Sydafrika (till skillnad från Eswatini som även gränsar till Moçambique) och är världens enda land helt över 1 000 meters höjd.'
    },
    {
      id: 'hq_af_05', t: 'mc', region: 'Afrika', difficulty: 3,
      q: 'I vilken stad ligger det berömda universitetet Al-Qarawiyyin, grundat år 859 av Fatima al-Fihri?',
      a: ['Fès', 'Marrakech', 'Tunis', 'Kairo'],
      explain: 'Al-Qarawiyyin i marockanska Fès erkänns av UNESCO som världens äldsta fortfarande verksamma högre lärosäte.'
    },
    {
      id: 'hq_af_06', t: 'mc', region: 'Afrika', difficulty: 3,
      q: 'Vilket land har flest bevarade antika pyramider i världen, drygt 200 stycken?',
      a: ['Sudan', 'Egypten', 'Mexiko', 'Peru'],
      explain: 'I forntida Nubien (dagens Sudan) byggde kushitiska kungar över 200 branta pyramider vid Meroë, El-Kurru och Nuri.'
    },
    {
      id: 'hq_af_07', t: 'mc', region: 'Afrika', difficulty: 3,
      q: 'Vilken ö utanför Tanzanias kust var under 1800-talet centrum för kryddnejlikeodling och säte för sultanen av Oman?',
      a: ['Zanzibar', 'Pemba', 'Komorerna', 'Lamu'],
      explain: 'Zanzibar blev på 1840-talet residens för Omans sultan Said bin Sultan och kallades länge Kryddön.'
    },
    {
      id: 'hq_af_08', t: 'mc', region: 'Afrika', difficulty: 3,
      q: 'Vilken afrikansk sjö är både kontinentens längsta och världens näst djupaste sjö efter Bajkal?',
      a: ['Tanganyikasjön', 'Victoriasjön', 'Malawisjön', 'Turkanasjön'],
      explain: 'Tanganyikasjön i Östafrikanska gravsänkan är 673 kilometer lång och 1 470 meter djup.'
    },
    {
      id: 'hq_af_09', t: 'mc', region: 'Afrika', difficulty: 3,
      q: 'Vilket språk talas ursprungligen i Etiopien och skrivs med ett eget abugida-alfabet kallat Ge\'ez-skrift?',
      a: ['Amhariska', 'Swahili', 'Hausa', 'Yoruba'],
      explain: 'Amhariska (och tigrinja) skrivs med fidel-skriften, som utvecklades ur det antika skriftspråket ge\'ez i Aksumriket.'
    },
    {
      id: 'hq_af_10', t: 'mc', region: 'Afrika', difficulty: 3,
      q: 'Vilken stenstad i södra Afrika gav namn åt dagens Zimbabwe och byggdes utan murbruk mellan 1000- och 1400-talet?',
      a: ['Stora Zimbabwe', 'Mapungubwe', 'Khami', 'Kilwa Kisiwani'],
      explain: 'Stora Zimbabwe var huvudstad i ett mäktigt rike som handlade med guld och elfenben via kusten mot Indiska oceanen.'
    },

    // =========================================================================
    // NORDAMERIKA
    // =========================================================================
    {
      id: 'hq_na_01', t: 'mc', region: 'Nordamerika', difficulty: 3,
      q: 'Vilket år genomfördes Louisiana Purchase, då USA köpte ett gigantiskt landområde av Napoleon och Frankrike?',
      a: ['1803', '1783', '1819', '1848'],
      explain: 'År 1803 köpte USA cirka 2,1 miljoner kvadratkilometer av Frankrike för 15 miljoner dollar, vilket i ett slag fördubblade landets yta.'
    },
    {
      id: 'hq_na_02', t: 'mc', region: 'Nordamerika', difficulty: 3,
      q: 'Vilken var aztekernas mäktiga ö-huvudstad mitt i Texcocosjön innan spanjorerna erövrade den 1521?',
      a: ['Tenochtitlán', 'Teotihuacán', 'Palenque', 'Tikal'],
      explain: 'Tenochtitlán hade omkring 200 000 invånare och var en av världens största städer; dagens Mexico City vilar direkt ovanpå dess ruiner.'
    },
    {
      id: 'hq_na_03', t: 'mc', region: 'Nordamerika', difficulty: 3,
      q: 'Vilken av USA:s fem stora sjöar (Great Lakes) är den enda som ligger helt inom USA:s gränser?',
      a: ['Michigansjön', 'Övre sjön (Lake Superior)', 'Huronsjön', 'Eriesjön'],
      explain: 'Alla de andra fyra Stora sjöarna delas mellan USA och Kanada, medan Michigansjön helt omges av amerikanska delstater.'
    },
    {
      id: 'hq_na_04', t: 'mc', region: 'Nordamerika', difficulty: 3,
      q: 'Vilken kanadensisk provins är den enda officiellt tvåspråkiga provinsen i Kanada (både engelska och franska)?',
      a: ['New Brunswick', 'Québec', 'Ontario', 'Manitoba'],
      explain: 'Québec har enbart franska som officiellt språk, medan New Brunswick på östkusten är Kanadas enda officiellt tvåspråkiga provins.'
    },
    {
      id: 'hq_na_05', t: 'mc', region: 'Nordamerika', difficulty: 3,
      q: 'Vilken arkitekt ritade det berömda huset Fallingwater i Pennsylvania och Guggenheimmuseet i New York?',
      a: ['Frank Lloyd Wright', 'Louis Sullivan', 'Ludwig Mies van der Rohe', 'Eero Saarinen'],
      explain: 'Frank Lloyd Wright (1867 till 1959) skapade den organiska arkitekturen och ritade spiralformen på Guggenheim som öppnade 1959.'
    },
    {
      id: 'hq_na_06', t: 'mc', region: 'Nordamerika', difficulty: 3,
      q: 'Vilken amerikansk delstat har flest mil kustlinje av alla delstater i USA?',
      a: ['Alaska', 'Kalifornien', 'Florida', 'Hawaii'],
      explain: 'Med alla sina fjordar, vikar och öar har Alaska längre kustlinje än alla övriga 49 amerikanska delstater tillsammans.'
    },
    {
      id: 'hq_na_07', t: 'mc', region: 'Nordamerika', difficulty: 3,
      q: 'Vad hette den forntida kultur i centrala Mexiko som reste de jättelika Sol- och Månpyramiderna i Teotihuacán?',
      a: ['En äldre okänd kultur före aztekerna', 'Aztekerna på 1400-talet', 'Mayafolket från Yucatán', 'Olmekerna vid Mexikanska golfen'],
      explain: 'Teotihuacán blomstrade redan omkring år 100 till 550 e.Kr. och låg i ruiner i många hundra år innan aztekerna gav staden dess namn.'
    },
    {
      id: 'hq_na_08', t: 'mc', region: 'Nordamerika', difficulty: 3,
      q: 'Vilken stad i USA var landets första officiella huvudstad under den nya konstitutionen 1789?',
      a: ['New York', 'Philadelphia', 'Boston', 'Annapolis'],
      explain: 'George Washington svors in som president i Federal Hall på Wall Street i New York 1789, innan huvudstaden flyttade till Philadelphia och sedan Washington D.C.'
    },

    // =========================================================================
    // SYDAMERIKA
    // =========================================================================
    {
      id: 'hq_sa_01', t: 'mc', region: 'Sydamerika', difficulty: 3,
      q: 'Vilka är de enda två länderna i Sydamerika som helt saknar havskust?',
      a: ['Bolivia och Paraguay', 'Bolivia och Ecuador', 'Paraguay och Uruguay', 'Bolivia och Surinam'],
      explain: 'Bolivia förlorade sin Stillahavskust till Chile i Stillahavskriget (1879 till 1884), och Paraguay ligger mitt inne på kontinenten.'
    },
    {
      id: 'hq_sa_02', t: 'mc', region: 'Sydamerika', difficulty: 3,
      q: 'Vad kallades Inkarikets sinnrika system av knutna snören som användes för bokföring, räkenskaper och meddelanden?',
      a: ['Quipu', 'Chasqui', 'Intihuatana', 'Ayllu'],
      explain: 'Inkariket saknade skriftspråk i vanlig mening men lagrade sifferuppgifter och arkiv i färgade och knutna quipu-snören.'
    },
    {
      id: 'hq_sa_03', t: 'mc', region: 'Sydamerika', difficulty: 3,
      q: 'Vilken sydamerikansk stad är världens högst belägna regeringssäte (ca 3 650 meter över havet)?',
      a: ['La Paz', 'Quito', 'Bogotá', 'Cusco'],
      explain: 'Bolivias regeringssäte La Paz ligger i en kanjon på omkring 3 650 meters höjd (med grannstaden El Alto på över 4 000 m), ännu högre än Quito (2 850 m).'
    },
    {
      id: 'hq_sa_04', t: 'mc', region: 'Sydamerika', difficulty: 3,
      q: 'Vilket europeiskt språk är officiellt språk i det sydamerikanska landet Surinam?',
      a: ['Nederländska', 'Franska', 'Engelska', 'Portugisiska'],
      explain: 'Surinam var tidigare Nederländska Guyana och är det enda självständiga landet i Sydamerika med nederländska som officiellt språk.'
    },
    {
      id: 'hq_sa_05', t: 'mc', region: 'Sydamerika', difficulty: 3,
      q: 'Vilken modernistisk arkitekt formgav regeringsbyggnaderna och katedralen i Brasiliens planerade huvudstad Brasília?',
      a: ['Oscar Niemeyer', 'Lúcio Costa', 'Paulo Mendes da Rocha', 'Roberto Burle Marx'],
      explain: 'Lúcio Costa ritade stadsplanen som ett flygplan, medan Oscar Niemeyer ritade de ikoniska skulpturala byggnaderna i betong inför invigningen 1960.'
    },
    {
      id: 'hq_sa_06', t: 'mc', region: 'Sydamerika', difficulty: 3,
      q: 'Vilken frihetshjälte kallades "El Libertador" och bidrog till självständigheten för bland annat Venezuela, Colombia, Peru och Bolivia?',
      a: ['Simón Bolívar', 'José de San Martín', 'Bernardo O\'Higgins', 'Antonio José de Sucre'],
      explain: 'Simón Bolívar (1783 till 1830) ledde frihetskampen i norra Sydamerika och har givit namn åt både landet Bolivia och Venezuelas valuta.'
    },
    {
      id: 'hq_sa_07', t: 'mc', region: 'Sydamerika', difficulty: 3,
      q: 'Vilket är världens torraste icke-polära ökenområde, där vissa väderstationer knappt registrerat regn på decennier?',
      a: ['Atacamaöknen', 'Namiböknen', 'Sonoraöknen', 'Rub al-Khali'],
      explain: 'Atacamaöknen i norra Chile ligger i regnskugga mellan Anderna och den kalla Humboldtströmmen och används för världens största teleskop.'
    },
    {
      id: 'hq_sa_08', t: 'mc', region: 'Sydamerika', difficulty: 3,
      q: 'Vilken colombiansk författare fick Nobelpriset i litteratur 1982 för bland annat "Hundra år av ensamhet"?',
      a: ['Gabriel García Márquez', 'Mario Vargas Llosa', 'Jorge Luis Borges', 'Pablo Neruda'],
      explain: 'Gabriel García Márquez gjorde den magiska realismen världsberömd genom skildringen av släkten Buendía i den fiktiva staden Macondo.'
    },

    // =========================================================================
    // OCEANIEN & GLOBAL GEOGRAFI / VETENSKAP / KULTUR
    // =========================================================================
    {
      id: 'hq_oc_01', t: 'mc', region: 'Oceanien', difficulty: 3,
      q: 'Vilket sund skiljer Nordön från Sydön på Nya Zeeland?',
      a: ['Cooksundet', 'Bass-sundet', 'Torressundet', 'Foveauxsundet'],
      explain: 'Cooksundet är som smalast bara 22 kilometer brett mellan Nordön och Sydön och är känt för sina kraftiga vindar och strömmar.'
    },
    {
      id: 'hq_oc_02', t: 'mc', region: 'Oceanien', difficulty: 3,
      q: 'Vilken dansk arkitekt vann 1957 års tävling om att rita Operahuset i Sydney med sina snäckliknande takvalv?',
      a: ['Jørn Utzon', 'Arne Jacobsen', 'Bjarke Ingels', 'Henning Larsen'],
      explain: 'Jørn Utzon inspirerades bland annat av apelsinklyftor för att kunna bygga de monumentala betongskalen ur en och samma sfär.'
    },
    {
      id: 'hq_oc_03', t: 'mc', region: 'Oceanien', difficulty: 3,
      q: 'Varför valdes just platsen för Canberra till Australiens huvudstad år 1908?',
      a: ['Som kompromiss mellan rivalerna Sydney och Melbourne', 'Eftersom den låg närmast guldgruvorna i Ballarat', 'För att skydda regeringen från cykloner vid nordkusten', 'Eftersom det var den äldsta brittiska bosättningen'],
      explain: 'Sydney och Melbourne kunde inte enas om vem som skulle bli huvudstad, så man grundade en helt ny planerad huvudstad mellan dem.'
    },
    {
      id: 'hq_oc_04', t: 'mc', region: 'Oceanien', difficulty: 3,
      q: 'Vilken östat i Stilla havet är världens enda land som sträcker sig över alla fyra jordklotshalvor (norra, södra, östra och västra)?',
      a: ['Kiribati', 'Fiji', 'Samoa', 'Tonga'],
      explain: 'Kiribatis 33 atoller sprider sig på båda sidor om både ekvatorn och 180-gradersmeridianen över ett enormt havsområde.'
    },
    {
      id: 'hq_gl_01', t: 'mc', region: 'Europa', difficulty: 3,
      q: 'Vilken vetenskapsman upptäckte år 1928 penicillinet av en slump på St Mary\'s Hospital i London?',
      a: ['Alexander Fleming', 'Louis Pasteur', 'Robert Koch', 'Joseph Lister'],
      explain: 'Alexander Fleming märkte att mögelsvampen Penicillium notatum dödade bakterier i en bortglömd petriskål; tillsammans med Florey och Chain fick han Nobelpriset 1945.'
    },
    {
      id: 'hq_gl_02', t: 'mc', region: 'Asien', difficulty: 3,
      q: 'Vilken krydda utvinns ur de torkade märkena från krokusblomman Crocus sativus och är världens dyraste räknat per gram?',
      a: ['Saffran', 'Kardemumma', 'Vanilj', 'Muskotblomma'],
      explain: 'Det krävs omkring 150 000 handplockade krokusblommor för att få ihop ett enda kilogram torkad saffran.'
    },
    {
      id: 'hq_gl_03', t: 'mc', region: 'Europa', difficulty: 3,
      q: 'Vilket hav på jorden saknar helt landkuster och avgränsas enbart av havsströmmar i Nordatlanten?',
      a: ['Sargassohavet', 'Korallhavet', 'Weddellhavet', 'Timorhavet'],
      explain: 'Sargassohavet ramas in av Golfströmmen, Nordatlantiska strömmen, Kanarieströmmen och Nordekvatorialströmmen och är känd för sin flytande tång.'
    },
    {
      id: 'hq_gl_04', t: 'mc', region: 'Nordamerika', difficulty: 3,
      q: 'Vilken skala används inom geologin för att mäta mineralers hårdhet från 1 (talk) till 10 (diamant)?',
      a: ['Mohs hårdhetsskala', 'Richterskalan', 'Beaufortskalan', 'Mercalliskalan'],
      explain: 'Den tyske mineralogen Friedrich Mohs skapade skalan 1812 baserat på vilket mineral som kan repa ett annat.'
    }
  ];

  window.GT_HARD_QUESTIONS = HARD_QUESTIONS;
})();
