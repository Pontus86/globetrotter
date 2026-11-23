// Globetrotter — Riktiga resehändelser i 80 Days-stil för flyg, tåg och båt
// Varje händelse ger ett konkret val med tydlig konsekvens (tid, pengar, rabatt, gratis hotellnatt eller risk/reward).

(function () {
  'use strict';

  const W = window.GT_WORLD;
  if (!W) return;

  W.travelEvents = {
    flight: [
      {
        id: 'flight_archaeologist',
        title: 'Pratglad arkeolog på rad 14',
        text: 'Under inflygningen hamnar du bredvid en pensionerad museiintendent som känner till varenda billig biljettbyrå i regionen.',
        choices: [
          { label: 'Bjud på kaffe från serveringsvagnen (-45 kr, ger 20 % flygrabatt)', cash: -45, deal: 20, log: 'Bjöd en arkeolog på flygkaffe och fick ett supertips om billiga avgångar.' },
          { label: 'Tacka artigt och sov resten av resan (Gratis)', cash: 0, log: 'Tog en lugn tupplur ovan molnen.' }
        ]
      },
      {
        id: 'flight_customs',
        title: 'Lång kö i passkontrollen',
        text: 'Tre jumbojetar landade samtidigt och kön till tullen ringlar sig genom hela ankomsthallen.',
        choices: [
          { label: 'Betala för snabbspår med flygplatsvärd (-110 kr, sparar 2 timmar)', cash: -110, hours: -2, log: 'Tog snabbspåret genom tullen och vann två värdefulla timmar.' },
          { label: 'Stå kvar i den vanliga kön (Gratis, kostar 2 extra timmar)', cash: 0, hours: 2, log: 'Köade tålmodigt i passkontrollen i två timmar.' }
        ]
      },
      {
        id: 'flight_overbooked',
        title: 'Överbokad anslutning',
        text: 'Flygbolaget ropar ut vid gaten att planet är överbokat och erbjuder kontant ersättning till frivilliga som väntar på nästa avgång.',
        choices: [
          { label: 'Ta nästa plan (+450 kr, men du förlorar 3 timmar)', cash: 450, hours: 3, log: 'Gav upp din sittplats på ett överbokat plan och fick +450 kr i ersättning.' },
          { label: 'Behåll din plats och kom fram i tid', cash: 0, log: 'Stod fast vid din bokning och landade enligt tidtabell.' }
        ]
      },
      {
        id: 'flight_luggage_delay',
        title: 'Försenat bagage på bandet',
        text: 'Bagagebandet stannar men din väska syns inte till! Personalen säger att den kommer med nästa kärra — eller så kan du få ersättning och lösa det själv.',
        choices: [
          { label: 'Vänta ut nästa kärra (Kostar 2 timmar, 0 kr)', cash: 0, hours: 2, log: 'Väntade i två timmar på att väskan skulle dyka upp på bagagebandet.' },
          { label: 'Kräv akutersättning och köp det nödvändigaste (-140 kr, ingen tid förlorad)', cash: -140, log: 'Löste bagagestrul snabbt på flygplatsen utan att tappa tid.' }
        ]
      },
      {
        id: 'flight_exchange',
        title: 'Gynnsam växlingskurs i terminalen',
        text: 'På växlingskontoret i ankomsthallen har kursen precis slagit om, och en svensk affärsresenär vill byta överblivna sedlar.',
        choices: [
          { label: 'Växla smart (+220 kr extra i reskassan)', cash: 220, log: 'Gjorde ett klipp vid växlingskontoret direkt efter landning (+220 kr).' },
          { label: 'Byt resetips istället (25 % sista-minuten-rabatt på nästa flyg)', deal: 25, log: 'Fick en rabattkod på flyg av en medresenär i terminalen.' }
        ]
      },
      {
        id: 'flight_turbulence',
        title: 'Kraftig motvind & omlagd rutt',
        text: 'Kaptenen meddelar att kraftiga stormbyar tvingar planet att gå runt ovädret. Ni landar sent, men flygbolaget delar ut kompensation.',
        choices: [
          { label: 'Ta hotellkupong (Gratis hotellnatt här! Kostar 2 timmar)', freeHotel: true, hours: 2, log: 'Fick en gratis hotellnatt som plåster på såren efter stormförseningen.' },
          { label: 'Ta snabb taxi in till centrum (-120 kr, tappar ingen tid)', cash: -120, log: 'Tog expresstaxi in från flygplatsen för att rädda dagen.' }
        ]
      },
      {
        id: 'flight_journalist',
        title: 'Resereporter söker citat',
        text: 'En reporter från en svensk resetidning känner igen ditt Globetrotter-pass och vill göra en kort intervju om din resa.',
        choices: [
          { label: 'Ställ upp på intervju (+280 kr arvode, tar 1 timme)', cash: 280, hours: 1, log: 'Blev intervjuad på flygplatsen om resan och fick +280 kr i arvode.' },
          { label: 'Tipsa om resrutter i utbyte mot pressrabatt (25 % flygrabatt)', deal: 25, log: 'Fick en pressrabatt på nästa avgång av en resereporter.' }
        ]
      },
      {
        id: 'flight_dutyfree_gamble',
        title: 'Antikhandlare i loungen',
        text: 'En samlare i väntsalen slår vad om att du inte kan pricka in rätt tidszon och växelkurs i huvudet.',
        choices: [
          { label: 'Anta vadet (60 % chans på +420 kr / risk -180 kr)', gamble: { win: 420, lose: -180, chance: 0.60 }, log: 'Antog ett geografivad i avgångshallen.' },
          { label: 'Avböj och ta en kopp kaffe istället', cash: 0, log: 'Lät samlaren behålla sina vad och sparade reskassan.' }
        ]
      },
      {
        id: 'flight_strike_warning',
        title: 'Vild markpersonalstrejk',
        text: 'Markpersonalen har lagt ner arbetet i en timme och flygplatsbussarna står stilla utanför terminalen.',
        choices: [
          { label: 'Dela svarttaxi med andra passagerare (-160 kr, 0 tim)', cash: -160, log: 'Delade taxi förbi strejken in mot centrum.' },
          { label: 'Promenera och ta lokalbuss (Gratis, kostar 2 timmar)', cash: 0, hours: 2, log: 'Tog den långa vägen med lokalbuss förbi strejken.' }
        ]
      },
      {
        id: 'flight_seat_upgrade',
        title: 'Hjälp en förvirrad medresenär',
        text: 'En äldre dam vid bagageinlämningen har tappat bort sin hotelladress och talar varken engelska eller lokalspråket.',
        choices: [
          { label: 'Hjälp henne hitta rätt (Tar 1 timme, hon bjuder dig på gratis hotellnatt!)', hours: 1, freeHotel: true, log: 'Hjälpte en medresenär på flygplatsen och blev bjuden på en fri hotellnatt.' },
          { label: 'Peka ut informationsdisken och skynda vidare (0 tim)', cash: 0, log: 'Visade vägen till informationsdisken och fortsatte direkt in mot stan.' }
        ]
      }
    ],

    train: [
      {
        id: 'train_dining_car',
        title: 'Samtal i restaurangvagnen',
        text: 'Över en rykande kopp kaffe i restaurangvagnen slår sig en konduktör ner och berättar om hemliga fynd i nästa stad.',
        choices: [
          { label: 'Bjud konduktören på lunch (-75 kr, ger 25 % rabatt på nästa avgång)', cash: -75, deal: 25, log: 'Fick ett kanontips om billiga biljetter av konduktören i restaurangvagnen.' },
          { label: 'Njut av utsikten genom kupéfönstret (Gratis)', cash: 0, log: 'Tittade ut över landskapet medan tåget rullade fram.' }
        ]
      },
      {
        id: 'train_border_check',
        title: 'Grundlig gränskontroll i kupén',
        text: 'Tåget stannar vid gränsstationen och tulltjänstemännen går igenom varenda väska i vagnen.',
        choices: [
          { label: 'Betala expressavgift för tulldeklaration (-90 kr, ingen försening)', cash: -90, log: 'Klarade gränskontrollen snabbt mot en liten avgift.' },
          { label: 'Vänta lugnt på din tur (Gratis, kostar 2 timmar)', cash: 0, hours: 2, log: 'Tåget blev stående två timmar vid gränsstationen.' }
        ]
      },
      {
        id: 'train_card_game',
        title: 'Kortspel i sovkupén',
        text: 'Tre rutinerade tågluffare bjuder in dig till en omgång bluffpoker om en slant ur reskassan.',
        choices: [
          { label: 'Satsa en slant (55 % chans på +400 kr / risk -180 kr)', gamble: { win: 400, lose: -180, chance: 0.55 }, log: 'Spelade kort med tågluffare genom natten.' },
          { label: 'Spela bara om äran och få ett restips (+15 % rabatt)', deal: 15, log: 'Fick ett bra resetips av kupégrannarna utan att riskera kassan.' }
        ]
      },
      {
        id: 'train_signal_fault',
        title: 'Signalfel på enkelspåret',
        text: 'Tåget bromsar in mitt ute på landsbygden. En lokal minibuss erbjuder skjuts sista biten in till staden.',
        choices: [
          { label: 'Hoppa på minibussen (-130 kr, sparar 2 timmar)', cash: -130, hours: -2, log: 'Bytte till minibuss vid ett signalfel och kom fram före tidtabell.' },
          { label: 'Sitt kvar på tåget tills felet lagas (Gratis, +2 timmar)', cash: 0, hours: 2, log: 'Väntade ut ett signalfel på järnvägen (+2 timmar).' }
        ]
      },
      {
        id: 'train_translator',
        title: 'Tolk i grannkupén',
        text: 'En utländsk affärsman försöker förgäves förhandla med tågpersonalen om sitt fraktgods.',
        choices: [
          { label: 'Hoppa in och medla (+320 kr i tackgåva, tar 1 timme)', cash: 320, hours: 1, log: 'Hjälpte till att översätta i tågkupén och fick +320 kr i belöning.' },
          { label: 'Be om hans hotellkontakt istället (Gratis hotellnatt vid ankomst!)', freeHotel: true, log: 'Fick en gratis hotellnatt av en tacksam affärsman på tåget.' }
        ]
      },
      {
        id: 'train_night_sleep',
        title: 'Skön sömn i liggvagnen',
        text: 'Tågets rytmiska dunkande vaggar dig till sömns och du vaknar utvilad långt innan perrongen.',
        choices: [
          { label: 'Kliv av full av energi (Vinner 2 extra timmar på dagen!)', hours: -2, log: 'Sov som en stock på tåget och vann två pigga timmar vid ankomst.' },
          { label: 'Ät en stadig frukost i bistron (-60 kr, +150 kr i resetips/fynd)', cash: 90, log: 'Åt tågfrukost och fick värdefulla lokaltips.' }
        ]
      },
      {
        id: 'train_lost_wallet',
        title: 'Borttappad plånbok under sätet',
        text: 'Du ser en läderplånbok som glidit in under sätet mitt emot. Ägaren klev precis av på förra stationen — men tåget står fortfarande kvar i 30 sekunder!',
        choices: [
          { label: 'Spring ut på perrongen och lämna tillbaka den (+350 kr hittelön!)', cash: 350, log: 'Lämnade tillbaka en borttappad plånbok på perrongen och fick +350 kr i hittelön.' },
          { label: 'Lämna den till konduktören (Tryggt och lugnt, 20 % tågrabatt)', deal: 20, log: 'Lämnade in en upphittad plånbok till konduktören.' }
        ]
      },
      {
        id: 'train_accordion',
        title: 'Gatumusikant i vagnen',
        text: 'En dragspelare kliver på med stor entusiasm och skapar feststämning i hela kupén.',
        choices: [
          { label: 'Lägg en slant i hatten (-35 kr, han tipsar om gratis logi hos sin kusin!)', cash: -35, freeHotel: true, log: 'Bjöd en dragspelare på tåget och fick en gratis hotellnatt via hans släkt.' },
          { label: 'Klappa takten och spara pengarna', cash: 0, log: 'Njöt av levande musik längs rälsen.' }
        ]
      }
    ],

    boat: [
      {
        id: 'boat_deckhand',
        title: 'Stiltje på öppet hav',
        text: 'Ångaren glider sakta fram över ett spegelblankt hav. Överstyrman ropar att han behöver en extra hand med att surra last och polera mässing.',
        choices: [
          { label: 'Hoppa in som däcksgast (+480 kr)', cash: 480, log: 'Arbetade extra som däcksgast ombord på oceanångaren och tjänade 480 kr.' },
          { label: 'Sätt dig i solstolen & plugga sjökort (25 % rabatt vid ankomst)', deal: 25, log: 'Studerade tidtabeller på däck och hittade en hemlig rabatt.' }
        ]
      },
      {
        id: 'boat_salon',
        title: 'Kvällsspel i kaptensmatsalen',
        text: 'En förmögen världsomseglare i matsalongen bjuder in dig till geografi-vadslagning över en kopp kaffe.',
        choices: [
          { label: 'Anta utmaningen (65 % chans på +520 kr / risk -200 kr)', gamble: { win: 520, lose: -200, chance: 0.65 }, log: 'Antog en geografiutmaning i ångarens salong.' },
          { label: 'Tacka nej men bjud på gott sällskap (+160 kr i dricks/tips)', cash: 160, log: 'Fick ett generöst resetips av en världsomseglare ombord.' }
        ]
      },
      {
        id: 'boat_storm',
        title: 'Kuling över öppet hav',
        text: 'Vågorna går höga och halva passagerarskaran ligger sjösjuk i hytterna. Kocken i byssan behöver akut hjälp att servera middagen.',
        choices: [
          { label: 'Hjälp till i byssan (+420 kr i sjömanstillägg)', cash: 420, log: 'Höll balansen i stormen, hjälpte kocken och tjänade +420 kr.' },
          { label: 'Sitt lugnt i din hytt tills stormen bedarrat (Kostar 2 timmar vid ankomst)', hours: 2, log: 'Red ut stormen i hytten och kom i land något försenad.' }
        ]
      },
      {
        id: 'boat_smuggler',
        title: 'Skum affär på akterdäck',
        text: 'En sjöman erbjuder sig att sälja en förseglad låda med "exotiskt te" till vrakpris innan ni lägger till.',
        choices: [
          { label: 'Chansa och köp lådan (50 % chans på +600 kr vinst / risk -250 kr tullböter)', gamble: { win: 600, lose: -250, chance: 0.50 }, log: 'Gjorde en vågad affär på akterdäck före hamnankomst.' },
          { label: 'Tacka nej — håll passet rent!', cash: 0, log: 'Avböjde skumma affärer ombord och passerade hamntullen utan problem.' }
        ]
      },
      {
        id: 'boat_captain_table',
        title: 'Inbjudan till kaptenens bord',
        text: 'Kaptenen har hört talas om din jorden-runt-resa och bjuder in dig till middag med rederiets agenter.',
        choices: [
          { label: 'Ta emot rederiets gästfrihet (Gratis hotellnatt i ankomsthamnen!)', freeHotel: true, log: 'Åt middag vid kaptenens bord och blev bjuden på hotellnatt i hamnstaden.' },
          { label: 'Be om agentens bästa biljettkontakter (30 % rabatt på nästa avgång!)', deal: 30, log: 'Fick 30 % kompisrabatt av rederiets agent vid kaptenens bord.' }
        ]
      },
      {
        id: 'boat_whale',
        title: 'Valflock vid styrbord',
        text: 'Utkiksmannen ropar och en flock knölvalar bryter vattenytan! En tysk fotograf ombord har slut på film och erbjuder bra betalt för din plats vid relingen.',
        choices: [
          { label: 'Låt fotografen ta din plats (+260 kr)', cash: 260, log: 'Bytte bästa fotovinkeln vid relingen mot +260 kr.' },
          { label: 'Njut av synen själv och spara minnet i dagboken', cash: 0, log: 'Såg en flock knölvalar på nära håll ute på öppet hav — ett minne för livet!' }
        ]
      },
      {
        id: 'boat_harbor_pilot',
        title: 'Snabb motorbåt i hamninloppet',
        text: 'Hamnlotsen ska in mot kajen två timmar innan stora ångaren hinner förtöja.',
        choices: [
          { label: 'Betala för skjuts med lotsbåten (-100 kr, vinner 2 timmar i land)', cash: -100, hours: -2, log: 'Åkte iland med lotsbåten och vann två timmar i hamnstaden.' },
          { label: 'Vänta lugnt på stora landgången (Gratis)', cash: 0, log: 'Gick i land i lugn och ro när ångaren förtöjde.' }
        ]
      }
    ]
  };
})();
