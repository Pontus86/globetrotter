// Globetrotter - Utökad visuell historietidslinje med porträtt och bilder för stadens bibliotek
// 7-9 historiska punkter per land, alla med fria Wikimedia Commons-porträtt i assets/history/.

window.GT_COUNTRY_HISTORY = {
  stockholm: {
    map: 'assets/maps/countries/se.png',
    timeline: [
      { id: 'se_birka', year: 'ca 800', name: 'Birka', role: 'Vikingatidens handelsstad', wiki: 'Birka', text: 'På ön Björkö i Mälaren växte Sveriges första stad fram. Här möttes nordiska sjöfarare med handelsmän från både Västeuropa och kalifatet i Bagdad.' },
      { id: 'se_birgitta', year: '1303', name: 'Heliga Birgitta', role: 'Författare och helgon', wiki: 'Bridget_of_Sweden', text: 'En av medeltidens mest inflytelserika kvinnor i Europa. Hon grundade Birgittinorden i Vadstena och blev senare skyddshelgon för Europa.' },
      { id: 'se_vasa', year: '1523', name: 'Gustav Vasa', role: 'Kung och riksbyggare', wiki: 'Gustav_I_of_Sweden', text: 'Valdes till kung den 6 juni 1523 efter att ha brutit Sverige ur Kalmarunionen. Han byggde en stark statsmakt och lade grunden till det moderna Sverige.' },
      { id: 'se_g2a', year: '1611', name: 'Gustav II Adolf', role: 'Stormaktstidens kung', wiki: 'Gustavus_Adolphus', text: 'Gjorde Sverige till en europeisk stormakt under 1600-talet, grundade Göteborg och reformerade både skolväsende och förvaltning.' },
      { id: 'se_kristina', year: '1632', name: 'Drottning Kristina', role: 'Regent och kulturälskare', wiki: 'Christina,_Queen_of_Sweden', text: 'Blev drottning som sexåring, bjöd in filosofen Descartes till Stockholm och chockade Europa när hon 1654 abdikerade och flyttade till Rom.' },
      { id: 'se_linne', year: '1707', name: 'Carl von Linné', role: 'Blomsterkungen', wiki: 'Carl_Linnaeus', text: 'Professor i Uppsala som skapade det moderna namnsystemet för växter och djur som forskare över hela jorden fortfarande använder.' },
      { id: 'se_lind', year: '1820', name: 'Jenny Lind', role: '"Den svenska näktergalen"', wiki: 'Jenny_Lind', text: 'En av 1800-talets största operastjärnor. Hennes turnéer genom Europa och USA skapade ren hysteri och hon skänkte stora summor till skolor.' },
      { id: 'se_nobel', year: '1895', name: 'Alfred Nobel', role: 'Uppfinnare och donator', wiki: 'Alfred_Nobel', text: 'Kemisten och dynamitens uppfinnare skrev 1895 sitt testamente där nästan hela förmögenheten gick till Nobelprisen.' },
      { id: 'se_lindgren', year: '1945', name: 'Astrid Lindgren', role: 'Författare', wiki: 'Astrid_Lindgren', text: 'Med Pippi Långstrump 1945 förändrade hon barnlitteraturen i grunden. Hennes böcker har översatts till över 100 språk.' }
    ]
  },
  kairo: {
    map: 'assets/maps/countries/eg.png',
    timeline: [
      { id: 'eg_khufu', year: '2560 f.Kr.', name: 'Farao Cheops', role: 'Stora pyramidens byggherre', wiki: 'Khufu', text: 'Under Cheops regeringstid restes den stora pyramiden i Giza av över två miljoner kalkstensblock, världens högsta byggnad i 3 800 år.' },
      { id: 'eg_hatshepsut', year: '1478 f.Kr.', name: 'Hatshepsut', role: 'Kvinnlig farao', wiki: 'Hatshepsut', text: 'En av Egyptens mest framgångsrika regenter. Hon ledde stora handelsexpeditioner till landet Punt och lät bygga det storslagna terrass-templet vid Deir el-Bahari.' },
      { id: 'eg_nefertiti', year: '1350 f.Kr.', name: 'Nefertiti', role: 'Drottning i Amarna', wiki: 'Nefertiti', text: 'Känd över hela världen genom sin målade kalkstensbyst. Tillsammans med Akhenaton inledde hon en kort men unik konstnärlig epok.' },
      { id: 'eg_tut', year: '1332 f.Kr.', name: 'Tutankhamon', role: 'Pojkfaraon', wiki: 'Tutankhamun', text: 'Blev farao redan som nioåring och blev världsberömd 1922 när Howard Carter hittade hans nästan orörda grav och gyllene dödsmask.' },
      { id: 'eg_ramses', year: '1279 f.Kr.', name: 'Ramses II', role: 'Ramses den store', text: 'Regerade i 66 år, slöt världens äldsta kända fredsfördrag och lät hugga ut klipptemplen vid Abu Simbel.', wiki: 'Ramesses_II' },
      { id: 'eg_cleopatra', year: '51 f.Kr.', name: 'Kleopatra VII', role: 'Sista drottningen', wiki: 'Cleopatra', text: 'En skarp diplomat som talade minst nio språk och allierade sig med Julius Caesar och Marcus Antonius i kampen för Egyptens självständighet.' },
      { id: 'eg_saladin', year: '1176', name: 'Saladin', role: 'Sultan av Egypten', wiki: 'Saladin', text: 'Grundade Ayyubiddynastin i Kairo, byggde citadellet ovanför staden och blev berömd både i öst och väst för sin ridderlighet.' },
      { id: 'eg_umm', year: '1930-tal', name: 'Umm Kulthum', role: '"Österns stjärna"', wiki: 'Umm_Kulthum', text: 'Egyptens mest älskade sångerska. När hennes månatliga konserter sändes i radio tömdes gatorna i hela arabvärlden.' }
    ]
  },
  delhi: {
    map: 'assets/maps/countries/in.png',
    timeline: [
      { id: 'in_ashoka', year: '268 f.Kr.', name: 'Kejsar Ashoka', role: 'Mauryarikets härskare', wiki: 'Ashoka', text: 'Efter kriget i Kalinga valde Ashoka fredens väg, omfamnade buddhismen och lät hugga in budskap om medkänsla på stenpelare över hela Indien.' },
      { id: 'in_aryabhata', year: '499', name: 'Aryabhata', role: 'Matematiker och astronom', wiki: 'Aryabhata', text: 'Beräknade jordens rotation och året med häpnadsväckande precision, och lade grunden till det decimala talsystemet.' },
      { id: 'in_akbar', year: '1556', name: 'Akbar den store', role: 'Mogulkejsare', wiki: 'Akbar', text: 'Enade stora delar av norra Indien och blev berömd för sin religiösa tolerans och sitt lysande hov av poeter och tänkare.' },
      { id: 'in_shahjahan', year: '1632', name: 'Shah Jahan', role: 'Taj Mahals byggherre', wiki: 'Shah_Jahan', text: 'Lät uppföra både Röda fortet i Delhi och det vita marmormausoleet Taj Mahal i Agra till minne av sin hustru Mumtaz Mahal.' },
      { id: 'in_lakshmibai', year: '1857', name: 'Rani Lakshmibai', role: 'Drottning av Jhansi', wiki: 'Rani_of_Jhansi', text: 'En orädd ledare under det indiska upproret 1857 som blev en varaktig symbol för mod och självständighetsvilja.' },
      { id: 'in_tagore', year: '1913', name: 'Rabindranath Tagore', role: 'Poet och Nobelpristagare', wiki: 'Rabindranath_Tagore', text: 'Blev 1913 den första icke-europén att vinna Nobelpriset i litteratur. Han skrev både Indiens och Bangladeshs nationalsånger.' },
      { id: 'in_gandhi', year: '1930', name: 'Mahatma Gandhi', role: 'Frihetskämpe', wiki: 'Mahatma_Gandhi', text: 'Ledde Indiens frihetskamp genom icke-våld och civil olydnad, bland annat den berömda Saltmarschen 1930.' },
      { id: 'in_nehru', year: '1947', name: 'Jawaharlal Nehru', role: 'Förste premiärministern', wiki: 'Jawaharlal_Nehru', text: 'Höll det berömda midnattstalet den 15 augusti 1947 när Indien blev en självständig nation och ledde uppbyggnaden av demokratin.' }
    ]
  },
  tokyo: {
    map: 'assets/maps/countries/jp.png',
    timeline: [
      { id: 'jp_murasaki', year: '1008', name: 'Murasaki Shikibu', role: 'Författare', wiki: 'Murasaki_Shikibu', text: 'Skrev "Berättelsen om Genji" vid kejsarhovet i Kyoto, ofta kallad världens allra första roman.' },
      { id: 'jp_nobunaga', year: '1568', name: 'Oda Nobunaga', role: 'Fältherre och enare', wiki: 'Oda_Nobunaga', text: 'Inledde enandet av Japan efter ett sekel av inbördeskrig och uppmuntrade handel och nya idéer från omvärlden.' },
      { id: 'jp_ieyasu', year: '1603', name: 'Tokugawa Ieyasu', role: 'Shogun av Edo', wiki: 'Tokugawa_Ieyasu', text: 'Gjorde den lilla fiskebyn Edo (dagens Tokyo) till sitt maktcentrum och inledde över 250 år av fred och blomstrande hantverk.' },
      { id: 'jp_basho', year: '1689', name: 'Matsuo Bashō', role: 'Haikupoet', wiki: 'Matsuo_Bashō', text: 'Vandrade till fots genom norra Japan och gjorde den tre-radiga haikudikten till en världsberömd konstform.' },
      { id: 'jp_hokusai', year: '1831', name: 'Katsushika Hokusai', role: 'Träsnittsmästare', wiki: 'Hokusai', text: 'Skapade det ikoniska verket "Under vågen utanför Kanagawa" vid 70 års ålder och inspirerade konstnärer över hela Europa.' },
      { id: 'jp_meiji', year: '1868', name: 'Kejsar Meiji', role: 'Modernisatören', wiki: 'Emperor_Meiji', text: 'Flyttade huvudstaden till Tokyo och ledde omvandlingen från samurajsamhälle till modern industrination på bara några decennier.' },
      { id: 'jp_kurosawa', year: '1954', name: 'Akira Kurosawa', role: 'Filmregissör', wiki: 'Akira_Kurosawa', text: 'Med mästerverk som "De sju samurajerna" och "Rashomon" inspirerade han filmskapare i hela världen, från västernfilmer till Star Wars.' }
    ]
  },
  sanfrancisco: {
    map: 'assets/maps/countries/us.png',
    timeline: [
      { id: 'us_washington', year: '1776', name: 'George Washington', role: 'Förste presidenten', wiki: 'George_Washington', text: 'Ledde kontinentalarmén under frihetskriget och blev USA:s förste president 1789.' },
      { id: 'us_sacagawea', year: '1805', name: 'Sacagawea', role: 'Vägvisare västerut', wiki: 'Sacagawea', text: 'Guidad och tolkade för Lewis och Clarks berömda expedition över Klippiga bergen ända fram till Stilla havet.' },
      { id: 'us_lincoln', year: '1863', name: 'Abraham Lincoln', role: '16:e presidenten', wiki: 'Abraham_Lincoln', text: 'Höll ihop nationen under inbördeskriget och avskaffade slaveriet genom frigörelseproklamationen.' },
      { id: 'us_strauss', year: '1873', name: 'Levi Strauss', role: 'Jeansen i San Francisco', wiki: 'Levi_Strauss', text: 'Skapade de nitförstärkta arbetsbyxorna i denim i San Francisco 1873, plagget som blev älskat över hela världen.' },
      { id: 'us_edison', year: '1879', name: 'Thomas Edison', role: 'Uppfinnare', wiki: 'Thomas_Edison', text: 'Tog över tusen patent och förändrade vardagen med fonografen, filmkameran och kommersiell glödlampsbelysning.' },
      { id: 'us_earhart', year: '1932', name: 'Amelia Earhart', role: 'Flygpionjär', wiki: 'Amelia_Earhart', text: 'Blev den första kvinnan som flög ensam över Atlanten och inspirerade en hel generation äventyrare.' },
      { id: 'us_armstrong', year: '1969', name: 'Neil Armstrong', role: 'Astronaut (Apollo 11)', wiki: 'Neil_Armstrong', text: 'Tog mänsklighetens första steg på månen den 20 juli 1969 inför hundratals miljoner TV-tittare.' }
    ]
  },
  newyork: {
    map: 'assets/maps/countries/us.png',
    timeline: [
      { id: 'ny_hamilton', year: '1789', name: 'Alexander Hamilton', role: 'Förste finansministern', wiki: 'Alexander_Hamilton', text: 'Bodde på Manhattan, grundade landets finanssystem och skapade grunden för det som blev Wall Street.' },
      { id: 'ny_tubman', year: '1850', name: 'Harriet Tubman', role: 'Frihetskämpe', wiki: 'Harriet_Tubman', text: 'Rymde själv från slaveriet och återvände gång på gång för att leda människor till frihet längs den underjordiska järnvägen.' },
      { id: 'ny_roebling', year: '1883', name: 'Emily Warren Roebling', role: 'Brooklyn Bridge', wiki: 'Emily_Warren_Roebling', text: 'När chefsingenjören insjuknade tog hon över ledningen av bygget av Brooklyn Bridge och blev den första som korsade bron.' },
      { id: 'ny_tesla', year: '1890-tal', name: 'Nikola Tesla', role: 'Uppfinnare i New York', wiki: 'Nikola_Tesla', text: 'Arbetade i sitt laboratorium på Manhattan och skapade växelströmssystemet som driver dagens elnät.' },
      { id: 'ny_ellington', year: '1927', name: 'Duke Ellington', role: 'Jazzkompositör', wiki: 'Duke_Ellington', text: 'Satte tonen för Harlem-renässansen på Cotton Club och komponerade över tusen jazzstycken.' },
      { id: 'ny_roosevelt', year: '1948', name: 'Eleanor Roosevelt', role: 'Människorättskämpe', wiki: 'Eleanor_Roosevelt', text: 'Ledde arbetet med FN:s allmänna förklaring om de mänskliga rättigheterna, som antogs 1948.' },
      { id: 'ny_warhol', year: '1962', name: 'Andy Warhol', role: 'Popkonstnär', wiki: 'Andy_Warhol', text: 'Gjorde sin ateljé The Factory på Manhattan till navet för 1960-talets konst, musik och popkultur.' }
    ]
  },
  paris: {
    map: 'assets/maps/countries/fr.png',
    timeline: [
      { id: 'fr_jeanne', year: '1429', name: 'Jeanne d’Arc', role: 'Hjältinnan från Orléans', wiki: 'Joan_of_Arc', text: 'Som tonåring vände hon hundraårskriget vid Orléans och blev en av Frankrikes mest kända historiska gestalter.' },
      { id: 'fr_louis14', year: '1661', name: 'Ludvig XIV', role: 'Solkungen', wiki: 'Louis_XIV', text: 'Regerade i 72 år och gjorde Versailles och Paris till Europas centrum för konst, balett och arkitektur.' },
      { id: 'fr_voltaire', year: '1759', name: 'Voltaire', role: 'Upplysningsfilosof', wiki: 'Voltaire', text: 'Kämpade med skarp penna för yttrandefrihet och tolerans, och inspirerade tänkare över hela världen.' },
      { id: 'fr_napoleon', year: '1804', name: 'Napoleon Bonaparte', role: 'Kejsare och fältherre', wiki: 'Napoleon', text: 'Formade om Europas karta och införde lagboken Code Napoléon som fortfarande påverkar många länders lagar.' },
      { id: 'fr_hugo', year: '1862', name: 'Victor Hugo', role: 'Författare', wiki: 'Victor_Hugo', text: 'Skrev klassikerna "Ringaren i Notre-Dame" (som räddade katedralen från rivning!) och "Samhällets olycksbarn".' },
      { id: 'fr_eiffel', year: '1889', name: 'Gustave Eiffel', role: 'Ingenjör', wiki: 'Gustave_Eiffel', text: 'Ritade järnkonstruktionen till både Eiffeltornet i Paris och Frihetsgudinnan i New York.' },
      { id: 'fr_curie', year: '1903', name: 'Marie Curie', role: 'Dubbel Nobelpristagare', wiki: 'Marie_Curie', text: 'Upptäckte radium och polonium i Paris och blev den första människan i historien att vinna två Nobelpris i olika vetenskaper.' },
      { id: 'fr_piaf', year: '1945', name: 'Édith Piaf', role: '"Sparven från Paris"', wiki: 'Édith_Piaf', text: 'Började som gatusångerska i Paris och blev en av världens mest älskade artister med "La Vie en rose".' }
    ]
  },
  rom: {
    map: 'assets/maps/countries/it.png',
    timeline: [
      { id: 'it_caesar', year: '44 f.Kr.', name: 'Julius Caesar', role: 'Fältherre och statsman', wiki: 'Julius_Caesar', text: 'Erövrade Gallien, reformerade kalendern (som gav oss månaden juli) och förändrade Roms historia i grunden.' },
      { id: 'it_augustus', year: '27 f.Kr.', name: 'Kejsar Augustus', role: 'Förste kejsaren', wiki: 'Augustus', text: 'Inledde Pax Romana, tvåhundra år då vägar, akvedukter och städer band samman hela Medelhavet.' },
      { id: 'it_polo', year: '1271', name: 'Marco Polo', role: 'Upptäcktsresande', wiki: 'Marco_Polo', text: 'Reste från Venedig längs Sidenvägen till Kina och beskrev Asiens städer och uppfinningar för ett häpet Europa.' },
      { id: 'it_dante', year: '1320', name: 'Dante Alighieri', role: 'Poet', wiki: 'Dante_Alighieri', text: 'Skrev "Den gudomliga komedin" på italienska istället för latin och lade grunden till det moderna italienska språket.' },
      { id: 'it_davinci', year: '1503', name: 'Leonardo da Vinci', role: 'Renässansgeni', wiki: 'Leonardo_da_Vinci', text: 'Målare, uppfinnare och anatom som skissade helikoptrar och broar samtidigt som han målade Mona Lisa.' },
      { id: 'it_michelangelo', year: '1512', name: 'Michelangelo', role: 'Skulptör och målare', wiki: 'Michelangelo', text: 'Skulpterade David, målade taket i Sixtinska kapellet och ritade Peterskyrkans mäktiga kupol.' },
      { id: 'it_galileo', year: '1609', name: 'Galileo Galilei', role: 'Astronom', wiki: 'Galileo_Galilei', text: 'Riktade teleskopet mot himlen, upptäckte Jupiters månar och visade att jorden kretsar kring solen.' },
      { id: 'it_garibaldi', year: '1861', name: 'Giuseppe Garibaldi', role: 'Italiens enare', wiki: 'Giuseppe_Garibaldi', text: 'Ledde rödskjortorna i kampen som enade de italienska småstaterna till ett enda kungarike 1861.' }
    ]
  },
  london: {
    map: 'assets/maps/countries/gb.png',
    timeline: [
      { id: 'gb_boudica', year: '60 e.Kr.', name: 'Drottning Boudica', role: 'Keltisk drottning', wiki: 'Boudica', text: 'Ledde de brittiska stammarna i ett mäktigt uppror mot romarna. Hennes bronsstaty står idag vid Westminster Bridge.' },
      { id: 'gb_elizabeth1', year: '1558', name: 'Drottning Elizabeth I', role: 'Guldålderns drottning', wiki: 'Elizabeth_I', text: 'Under hennes 45 år på tronen blomstrade teatern i London och engelska skepp seglade ut över världshaven.' },
      { id: 'gb_shakespeare', year: '1599', name: 'William Shakespeare', role: 'Dramatiker', wiki: 'William_Shakespeare', text: 'Skrev Hamlet, Romeo och Julia och Macbeth för Globe-teatern vid Themsen och skapade hundratals engelska ord.' },
      { id: 'gb_newton', year: '1687', name: 'Isaac Newton', role: 'Fysiker och matematiker', wiki: 'Isaac_Newton', text: 'Beskrev tyngdlagen och rörelselagarna i "Principia" och förändrade vetenskapen för alltid.' },
      { id: 'gb_austen', year: '1813', name: 'Jane Austen', role: 'Författare', wiki: 'Jane_Austen', text: 'Med vass humor och skarpt öga för vardagslivet skrev hon odödliga klassiker som "Stolthet och fördom".' },
      { id: 'gb_darwin', year: '1859', name: 'Charles Darwin', role: 'Naturforskare', wiki: 'Charles_Darwin', text: 'Efter sin världsomsegling med HMS Beagle publicerade han "Om arternas uppkomst" och evolutionsteorin.' },
      { id: 'gb_nightingale', year: '1860', name: 'Florence Nightingale', role: 'Sjukvårdspionjär', wiki: 'Florence_Nightingale', text: 'Grundade den moderna sjuksköterskeutbildningen i London och använde statistik för att rädda liv på sjukhus.' },
      { id: 'gb_churchill', year: '1940', name: 'Winston Churchill', role: 'Premiärminister', wiki: 'Winston_Churchill', text: 'Ledde Storbritannien genom andra världskriget och fick senare även Nobelpriset i litteratur.' }
    ]
  },
  istanbul: {
    map: 'assets/maps/countries/tr.png',
    timeline: [
      { id: 'tr_constantine', year: '330', name: 'Konstantin den store', role: 'Romersk kejsare', wiki: 'Constantine_the_Great', text: 'Grundade sin nya huvudstad Konstantinopel vid Bosporen, mitt mellan Europa och Asien.' },
      { id: 'tr_justinian', year: '537', name: 'Kejsar Justinianus I', role: 'Hagia Sofias byggherre', wiki: 'Justinian_I', text: 'Lät bygga Hagia Sofia på fem år och samlade romersk rätt i en lagbok som användes i sekler.' },
      { id: 'tr_rumi', year: '1250', name: 'Rumi (Mevlana)', role: 'Poet och filosof', wiki: 'Rumi', text: 'En av världslitteraturens mest lästa poeter, vars dikter om vänskap och tolerans lever starkt än idag.' },
      { id: 'tr_mehmed2', year: '1453', name: 'Sultan Mehmed II', role: 'Erövraren', wiki: 'Mehmed_the_Conqueror', text: 'Intog Konstantinopel vid 21 års ålder, gjorde staden till osmansk huvudstad och grundade Stora basaren.' },
      { id: 'tr_suleiman', year: '1520', name: 'Süleyman den magnifike', role: 'Lagstiftaren', wiki: 'Suleiman_the_Magnificent', text: 'Ledde Osmanska rikets guldålder för konst, arkitektur, poesi och lagstiftning.' },
      { id: 'tr_sinan', year: '1557', name: 'Mimar Sinan', role: 'Mästerarkitekt', wiki: 'Mimar_Sinan', text: 'Ritade över 300 byggnader inklusive Süleymaniye-moskén och formade Istanbuls berömda siluett.' },
      { id: 'tr_ataturk', year: '1923', name: 'Mustafa Kemal Atatürk', role: 'Republikens grundare', wiki: 'Mustafa_Kemal_Atatürk', text: 'Grundade den moderna republiken Turkiet 1923, införde latinska alfabetet och moderniserade landet.' }
    ]
  },
  bangkok: {
    map: 'assets/maps/countries/th.png',
    timeline: [
      { id: 'th_ramkhamhaeng', year: '1283', name: 'Kung Ramkhamhaeng', role: 'Sukhothais kung', wiki: 'Ram_Khamhaeng', text: 'Skapade det thailändska alfabetet och inledde en blomstrande tid för kultur och handel.' },
      { id: 'th_naresuan', year: '1590', name: 'Kung Naresuan', role: 'Ayutthayas försvarare', wiki: 'Naresuan', text: 'Återupprättade kungariket Ayutthayas självständighet och är en av Thailands mest firade historiska kungar.' },
      { id: 'th_narai', year: '1680', name: 'Kung Narai', role: 'Diplomaten', wiki: 'Narai', text: 'Skickade thailändska ambassadörer ända till Ludvig XIV:s hov i Versailles och knöt band med hela världen.' },
      { id: 'th_rama1', year: '1782', name: 'Kung Rama I', role: 'Bangkoks grundare', wiki: 'Buddha_Yodfa_Chulaloke', text: 'Grundade Chakridynastin, flyttade huvudstaden till Bangkok och påbörjade bygget av Grand Palace.' },
      { id: 'th_mongkut', year: '1851', name: 'Kung Mongkut (Rama IV)', role: 'Astronom och språklärd', wiki: 'Mongkut', text: 'Förutsade en solförmörkelse med egna beräkningar och öppnade Thailand för modern vetenskap.' },
      { id: 'th_chulalongkorn', year: '1868', name: 'Kung Chulalongkorn', role: 'Rama V', wiki: 'Chulalongkorn', text: 'Avskaffade slaveriet, byggde järnvägar och höll Thailand fritt från kolonialstyre. Han besökte även Sverige 1897!' },
      { id: 'th_bhumibol', year: '1946', name: 'Kung Bhumibol (Rama IX)', role: '70 år på tronen', wiki: 'Bhumibol_Adulyadej', text: 'Regerade i 70 år, var en passionerad jazzsaxofonist och startade tusentals landsbygdsprojekt.' }
    ]
  },
  peking: {
    map: 'assets/maps/countries/cn.png',
    timeline: [
      { id: 'cn_confucius', year: '551 f.Kr.', name: 'Konfucius', role: 'Filosof och lärare', wiki: 'Confucius', text: 'Hans idéer om bildning, respekt och gott styre formade hela Östasiens samhällen i över två tusen år.' },
      { id: 'cn_sun_tzu', year: '500 f.Kr.', name: 'Sun Zi (Sun Tzu)', role: 'Strateg och författare', wiki: 'Sun_Tzu', text: 'Skrev "Krigskonsten", en klassiker om strategi och diplomati som fortfarande läses över hela världen.' },
      { id: 'cn_qin', year: '221 f.Kr.', name: 'Qin Shi Huangdi', role: 'Kinas förste kejsare', wiki: 'Qin_Shi_Huang', text: 'Enade Kina, standardiserade skriften och mynten, började binda samman Kinesiska muren och lät skapa terrakottaarmén.' },
      { id: 'cn_cailun', year: '105 e.Kr.', name: 'Cai Lun', role: 'Papperets uppfinnare', wiki: 'Cai_Lun', text: 'Utvecklade tekniken att tillverka riktigt papper av växtfibrer under Handynastin, en uppfinning som förändrade mänskligheten.' },
      { id: 'cn_wu', year: '690', name: 'Kejsarinnan Wu Zetian', role: 'Kinas enda kejsarinna', wiki: 'Wu_Zetian', text: 'Styrde Kina under Tangdynastins glansdagar och lät ämbetsmän väljas genom kunskapsprov istället för börd.' },
      { id: 'cn_zhenghe', year: '1405', name: 'Amiral Zheng He', role: 'Skattflottans ledare', wiki: 'Zheng_He', text: 'Seglade med väldiga träskepp till Indien, Arabien och Östafrika nästan hundra år före Columbus.' },
      { id: 'cn_yongle', year: '1420', name: 'Kejsar Yongle', role: 'Förbjudna stadens byggherre', wiki: 'Yongle_Emperor', text: 'Flyttade huvudstaden till Peking och lät uppföra Förbjudna staden samt ett enormt uppslagsverk.' }
    ]
  },
  sydney: {
    map: 'assets/maps/countries/au.png',
    timeline: [
      { id: 'au_bennelong', year: '1789', name: 'Bennelong', role: 'Eora-folkets diplomat', wiki: 'Bennelong', text: 'En nyckelperson ur urfolket Eora som byggde broar mellan aboriginerna och nybyggarna. Operahuset står idag på Bennelong Point!' },
      { id: 'au_cook', year: '1770', name: 'Kapten James Cook', role: 'Upptäcktsresande', wiki: 'James_Cook', text: 'Kartlade Australiens östkust med HMS Endeavour och landsteg i Botany Bay strax söder om Sydney.' },
      { id: 'au_phillip', year: '1788', name: 'Arthur Phillip', role: 'Förste guvernören', wiki: 'Arthur_Phillip', text: 'Ledde First Fleet in i Sydney Harbour och grundade bosättningen som växte till Australiens största stad.' },
      { id: 'au_macquarie', year: '1810', name: 'Lachlan Macquarie', role: 'Stadsbyggare', wiki: 'Lachlan_Macquarie', text: 'Förvandlade Sydney från en liten straffkoloni till en välplanerad hamnstad med breda gator, parker och sjukhus.' },
      { id: 'au_kelly', year: '1878', name: 'Ned Kelly', role: 'Legendarisk bushranger', wiki: 'Ned_Kelly', text: 'Känd för sin hemmagjorda järnrustning och blev en av Australiens mest omskrivna folkhjältar och laglösa.' },
      { id: 'au_melba', year: '1890-tal', name: 'Nellie Melba', role: 'Operasångerska', wiki: 'Nellie_Melba', text: 'Australiens första globala superstjärna, så berömd att både desserten Peach Melba och Melba-toast döptes efter henne.' },
      { id: 'au_utzon', year: '1973', name: 'Jørn Utzon', role: 'Operahusets arkitekt', wiki: 'Jørn_Utzon', text: 'Ritade de ikoniska vita segeltaken på Operahuset i Sydney, inspirerad av skalen från en apelsin.' }
    ]
  },
  kapstaden: {
    map: 'assets/maps/countries/za.png',
    timeline: [
      { id: 'za_dias', year: '1488', name: 'Bartolomeu Dias', role: 'Portugisisk sjöfarare', wiki: 'Bartolomeu_Dias', text: 'Blev den förste europén som rundade Afrikas sydspets och öppnade sjövägen mot Indien.' },
      { id: 'za_vanriebeeck', year: '1652', name: 'Jan van Riebeeck', role: 'Hamnens grundare', wiki: 'Jan_van_Riebeeck', text: 'Anlade en försörjningsstation med grönsaksodlingar under Taffelberget, början till dagens Kapstaden.' },
      { id: 'za_shaka', year: '1816', name: 'Kung Shaka Zulu', role: 'Zulurikets grundare', wiki: 'Shaka', text: 'Enade många klaner till det mäktiga Zuluriket och omformade södra Afrikas politiska karta.' },
      { id: 'za_barnard', year: '1967', name: 'Christiaan Barnard', role: 'Hjärtkirurg', wiki: 'Christiaan_Barnard', text: 'Genomförde världens allra första lyckade hjärttransplantation på Groote Schuur-sjukhuset i Kapstaden.' },
      { id: 'za_makeba', year: '1960-tal', name: 'Miriam Makeba', role: '"Mama Africa"', wiki: 'Miriam_Makeba', text: 'Sångerska som spred sydafrikansk musik över hela världen och kämpade mot apartheid i FN.' },
      { id: 'za_tutu', year: '1984', name: 'Desmond Tutu', role: 'Ärkebiskop & fredspristagare', wiki: 'Desmond_Tutu', text: 'Fick Nobels fredspris 1984 och myntade begreppet "Regnbågsnationen" om det nya Sydafrika.' },
      { id: 'za_mandela', year: '1994', name: 'Nelson Mandela', role: 'President & frihetsikon', wiki: 'Nelson_Mandela', text: 'Efter 27 år i fängelse, bland annat på Robben Island, blev han 1994 Sydafrikas förste demokratiskt valde president.' }
    ]
  },
  rio: {
    map: 'assets/maps/countries/br.png',
    timeline: [
      { id: 'br_cabral', year: '1500', name: 'Pedro Álvares Cabral', role: 'Portugisisk upptäckare', wiki: 'Pedro_Álvares_Cabral', text: 'Landsteg på Brasiliens kust år 1500, vilket gjorde Brasilien till Sydamerikas portugisisktalande jätte.' },
      { id: 'br_pedro1', year: '1822', name: 'Kejsar Pedro I', role: 'Självständighetens utropare', wiki: 'Pedro_I_of_Brazil', text: 'Utropade Brasiliens självständighet från Portugal 1822 och blev landets förste kejsare.' },
      { id: 'br_pedro2', year: '1840', name: 'Kejsar Pedro II', role: 'Vetenskapsälskande kejsare', wiki: 'Pedro_II_of_Brazil', text: 'Regerade i 58 år, talade ett dussin språk och var en av de allra första att prova Alexander Graham Bells telefon.' },
      { id: 'br_isabel', year: '1888', name: 'Prinsessan Isabel', role: 'Gyllene lagen', wiki: 'Isabel,_Princess_Imperial_of_Brazil', text: 'Undertecknade lagen "Lei Áurea" den 13 maj 1888 som slutgiltigt avskaffade slaveriet i Brasilien.' },
      { id: 'br_santos', year: '1906', name: 'Alberto Santos-Dumont', role: 'Flygpionjär', wiki: 'Alberto_Santos-Dumont', text: 'Brasiliens älskade uppfinnare som flög sitt motorplan 14-bis i Paris 1906 och populariserade armbandsuret!' },
      { id: 'br_pele', year: '1958', name: 'Pelé', role: 'Fotbollskungen', wiki: 'Pelé', text: 'Slog igenom som 17-åring vid VM i Sverige 1958 och vann totalt tre VM-guld för Brasilien.' },
      { id: 'br_niemeyer', year: '1960', name: 'Oscar Niemeyer', role: 'Arkitekt', wiki: 'Oscar_Niemeyer', text: 'Formgav den modernistiska huvudstaden Brasília med sina berömda böjda betonglinjer.' }
    ]
  },
  mexicocity: {
    map: 'assets/maps/countries/mx.png',
    timeline: [
      { id: 'mx_moctezuma', year: '1502', name: 'Moctezuma II', role: 'Aztekrikets härskare', wiki: 'Moctezuma_II', text: 'Styrde den praktfulla ö-staden Tenochtitlán med flytande trädgårdar, kanaler och storslagna tempel.' },
      { id: 'mx_sorjuana', year: '1680', name: 'Sor Juana Inés de la Cruz', role: 'Poet och vetenskapskvinna', wiki: 'Juana_Inés_de_la_Cruz', text: 'Ett briljant renässansgeni i 1600-talets Mexico City som försvarade kvinnors rätt till utbildning och böcker.' },
      { id: 'mx_hidalgo', year: '1810', name: 'Miguel Hidalgo', role: 'Självständighetsropet', wiki: 'Miguel_Hidalgo_y_Costilla', text: 'Ringde i kyrkklockan i Dolores den 16 september 1810 och tände gnistan till Mexikos självständighet.' },
      { id: 'mx_juarez', year: '1858', name: 'Benito Juárez', role: 'Reformpresident', wiki: 'Benito_Juárez', text: 'Landets förste president med urfolksbakgrund som försvarade Mexikos demokrati och självständighet.' },
      { id: 'mx_zapata', year: '1911', name: 'Emiliano Zapata', role: 'Revolutionsledare', wiki: 'Emiliano_Zapata', text: 'Kämpade för böndernas rätt till sin egen jord under den mexikanska revolutionen med mottot "Jord och frihet".' },
      { id: 'mx_rivera', year: '1929', name: 'Diego Rivera', role: 'Muralmålare', wiki: 'Diego_Rivera', text: 'Målade enorma, färgsprakande väggmålningar om Mexikos hela historia i Nationalpalatset vid Zócalo.' },
      { id: 'mx_kahlo', year: '1939', name: 'Frida Kahlo', role: 'Konstnär', wiki: 'Frida_Kahlo', text: 'Skapade djupt personliga och färgstarka självporträtt i sitt blå hus i Coyoacán och blev en världsikon.' }
    ]
  }
};

window.GT_COUNTRY_HISTORY.malmo = window.GT_COUNTRY_HISTORY.stockholm;
