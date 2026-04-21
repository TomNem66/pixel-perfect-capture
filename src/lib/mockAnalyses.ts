import { AnalysisResult } from "@/types/analysis";

type MockData = Partial<AnalysisResult> & { siteName: string };

const mockAlza: MockData = {
  siteName: "Alza",
  kategorie: "eshop_zbozi",
  kategorie_label: "Klasický e-shop a Marketplace",
  kategorie_confidence: 0.98,
  kategorie_duvod: "Prodej elektroniky a spotřebního zboží, částečně zprostředkování prodeje třetích stran.",
  trustRating: "ok",
  prodejce: {
    nazev: "Alza.cz a.s.",
    ico: "27082440",
    sidlo: "Jankovcova 1522/53, Praha 7",
    zeme: "ČR",
    typ: "přímý prodejce",
    zapis_or: "Městský soud v Praze, oddíl B, vložka 8573",
    _citace: { nazev: "Tyto VOP upravují vztahy mezi společností Alza.cz a.s...", sidlo: "se sídlem Jankovcova 1522/53, Praha 7" },
  },
  nesoulady: null,
  varovani: [
    { kategorie: "Marketplace", text: "Pozor: U produktů označených jako 'Partnerský prodej' uzavíráte smlouvu s třetí stranou, Alza pouze zprostředkovává.", zavaznost: "info" },
  ],
  bonusy: [
    { kategorie: "Vrácení", text: "Zboží lze snadno vrátit přes jakýkoliv AlzaBox." },
  ],
  vraceni: {
    lhuta_dny: 14,
    kdo_plati_postovne: "zákazník",
    vyjimky: ["rozbalený software", "hygienické potřeby (sluchátka, zubní kartáčky)"],
    sankce: null,
    lhuta_vraceni_penez_dny: 14,
    _citace: { lhuta_dny: "Kupující má právo odstoupit od smlouvy bez udání důvodu ve lhůtě 14 dnů." },
  },
  reklamace: {
    zarucni_doba_mesice: 24,
    reklamace_v_zahranici: false,
    lhuta_vyrizeni_dny: 30,
    lhuta_vraceni_penez_dny: 14,
    _citace: { zarucni_doba_mesice: "Na veškeré zboží poskytujeme zákonnou záruční dobu 24 měsíců." },
  },
  platby: {
    ceny_vcetne_dph: true,
    skryte_poplatky: ["dobírka +39 Kč"],
    sankce_nevyzvedni: "200 Kč + poštovné při opakovaném nevyzvednutí zásilky",
    _citace: {
      sankce_nevyzvedni: "V případě opakovaného nevyzvednutí zásilky si Alza vyhrazuje právo účtovat manipulační poplatek.",
      skryte_poplatky: "Příplatek za platbu dobírkou činí 39 Kč.",
    },
  },
  doprava: {
    sledovani_zasilky: true,
    dopravci: ["PPL", "DPD", "Zásilkovna", "AlzaBox", "Alza kurýr"],
    expresni_doruceni: "Tentýž den – Praha a vybraná města",
    _citace: {
      dopravci: "Zboží doručujeme prostřednictvím PPL, DPD, Zásilkovny nebo vlastním kurýrem.",
      expresni_doruceni: "V Praze a vybraných městech nabízíme expresní doručení do 2 hodin.",
    },
  },
  gdpr: {
    spravce: "Alza.cz a.s.",
    ucely_zpracovani: ["plnění smlouvy", "zasílání obchodních sdělení (se souhlasem)", "analytika"],
    predani_tretim: true,
    predani_komu: "dopravci a marketingoví partneři",
    doba_uchovani: "po dobu trvání smluvního vztahu + 5 let",
    prava_subjektu: ["přístup", "výmaz", "přenositelnost", "námitka"],
    _citace: {
      predani_tretim: "Osobní údaje předáváme dopravcům a marketingovým partnerům.",
      doba_uchovani: "Údaje uchováváme po dobu trvání smlouvy a 5 let po jejím skončení.",
    },
  },
} as unknown as MockData;

const mockNetflix: MockData = {
  siteName: "Netflix",
  kategorie: "digitalni_produkt",
  kategorie_label: "Digitální předplatné",
  kategorie_confidence: 0.99,
  kategorie_duvod: "Poskytování digitálního obsahu (streamování) na bázi měsíčního předplatného.",
  trustRating: "ok",
  prodejce: {
    nazev: "Netflix International B.V.",
    ico: "Neuvedeno",
    sidlo: "Karperstraat 8-10, 1075 KZ Amsterdam, Nizozemsko",
    zeme: "EU",
    typ: "přímý prodejce",
    zapis_or: "Obchodní komora Nizozemsko",
    _citace: { nazev: "Službu Netflix vám poskytuje společnost Netflix International B.V..." },
  },
  nesoulady: null,
  varovani: [
    { kategorie: "Storno", text: "Při zrušení předplatného se nevrací poměrná část peněz. Službu můžete využívat až do konce aktuálního zúčtovacího období.", zavaznost: "info" },
    { kategorie: "Změna ceny", text: "Poskytovatel si vyhrazuje právo měnit cenu předplatného, o změně vás musí informovat alespoň 30 dní předem.", zavaznost: "pozor" },
    {
      kategorie: "Profilování",
      text: "Netflix provádí automatické profilování vašeho sledování pro personalizaci obsahu. Máte právo vznést námitku (čl. 21 GDPR).",
      zavaznost: "info",
    },
    {
      kategorie: "Regionální omezení",
      text: "Katalog filmů a seriálů se liší dle země, ze které se přihlásíte. Použití VPN pro přístup k jinému katalogu je dle podmínek zakázáno.",
      zavaznost: "info",
    },
  ],
  bonusy: [
    { kategorie: "Flexibilita", text: "Předplatné lze zrušit kdykoliv online bez dalších poplatků nebo výpovědních lhůt." },
  ],
  predplatne_info: {
    cena: "Měsíční poplatek dle vybraného tarifu",
    fakturacni_cyklus: "Měsíčně",
    automaticke_obnoveni: true,
    jak_zrusit: "Online přes sekci 'Účet'",
    vypovedni_lhuta: "Kdykoliv před dalším zúčtovacím dnem",
    vraci_pomernou_cast: false,
    zkusebni_doba: null,
    trial_automaticky_placeny: null,
    zmena_ceny_predstih: "30 dní",
    _citace: { vraci_pomernou_cast: "Platby jsou nevratné a za částečně vyčerpaná období neposkytujeme žádné náhrady." },
  },
  licence_digital: {
    vlastnictvi_vs_licence: "Licence (přístup platí pouze po dobu předplatného)",
    prenositelnost: false,
    drm: "Widevine, FairPlay – stahování omezeno na vybraná zařízení",
    offline_pristup: true,
    regionalni_omezeni: "Katalog se liší dle země přihlášení",
    _citace: {
      vlastnictvi_vs_licence: "Obsah Netflix je licencován, nikoli prodáván.",
      offline_pristup: "Vybrané tituly lze stáhnout pro sledování offline.",
      regionalni_omezeni: "Dostupnost titulů se liší v závislosti na vaší geografické poloze.",
    },
  },
  gdpr: {
    spravce: "Netflix International B.V.",
    ucely_zpracovani: [
      "plnění smlouvy (přístup ke službě)",
      "personalizace doporučení (automatické profilování)",
      "marketingová komunikace (se souhlasem)",
      "bezpečnost a prevence podvodů",
    ],
    predani_tretim: true,
    predani_komu: "partneři pro platební zpracování, reklamní partneři, cloudové služby",
    doba_uchovani: "po dobu předplatného + 10 měsíců po zrušení účtu",
    prava_subjektu: ["přístup", "výmaz", "přenositelnost", "námitka proti profilování"],
    automaticke_profilovani: true,
    _citace: {
      predani_tretim: "Vaše informace sdílíme s poskytovateli služeb, kteří nám pomáhají s provozem, například se zpracováním plateb.",
      automaticke_profilovani: "Využíváme automatizované zpracování dat k personalizaci obsahu.",
    },
  },
  platby: {
    ceny_vcetne_dph: true,
    skryte_poplatky: [],
    sankce_nevyzvedni: null,
    _citace: { ceny_vcetne_dph: "Zobrazené ceny jsou konečné a zahrnují DPH." },
  },
} as unknown as MockData;

const mockCinemax: MockData = {
  siteName: "Cinemax",
  kategorie: "vstupenky",
  kategorie_label: "Kina a kulturní akce",
  kategorie_confidence: 0.99,
  kategorie_duvod: "Prodej vstupenek na konkrétní filmová představení s určeným časem.",
  trustRating: "obezretni",
  prodejce: {
    nazev: "CINEMAX, a. s.",
    ico: "36252768",
    sidlo: "Ševčenkova 34, Bratislava",
    zeme: "EU",
    typ: "přímý prodejce",
    zapis_or: "Okresní soud Bratislava I, oddíl Sa",
    _citace: { nazev: "Provozovatelem sítě multikin CINEMAX je..." },
  },
  nesoulady: null,
  varovani: [
    { kategorie: "Odstoupení od smlouvy", text: "Ze zákona NEMÁTE právo odstoupit od smlouvy do 14 dnů (§ 1837 písm. j OZ - volný čas). Zakoupené lístky nelze stornovat ani vrátit.", zavaznost: "kritické" },
    { kategorie: "Výměna lístků", text: "Vstupenky lze maximálně 2x přesunout na jiný termín, ale musíte to stihnout nejpozději 30 minut před začátkem představení.", zavaznost: "pozor" },
  ],
  bonusy: [],
  akce_zruseni: {
    vraceni_pri_zruseni: "Vrací se pouze cena vstupenky, případné servisní poplatky se nevrací.",
    vraceni_pri_presunuti: "Náhradní představení ve stejné hodnotě (do 30 dnů)",
    lhuta_vraceni: "Do 14 dnů",
    voucher_misto_penez: false,
    prevod_na_jinou_osobu: true,
    preprodej: false,
    _citace: { vraceni_pri_zruseni: "Vstupenky nie je možné vrátiť ani stornovať. Vstupenky Vám vieme presunúť maximálne 2x..." },
  },
} as unknown as MockData;

const mockJohnReed: MockData = {
  siteName: "John Reed Fitness",
  kategorie: "predplatne",
  kategorie_label: "Předplatné a členství",
  kategorie_confidence: 0.97,
  kategorie_duvod: "Poskytování dlouhodobých služeb fitness centra na základě členské smlouvy.",
  trustRating: "riziko",
  prodejce: {
    nazev: "RSG Group Česko s.r.o.",
    ico: "06316264",
    sidlo: "Karlovo náměstí 2097/10, Praha 2",
    zeme: "ČR",
    typ: "přímý prodejce",
    zapis_or: "Městský soud v Praze",
    _citace: { nazev: "Poskytovatel: RSG Group Česko s.r.o., Karlovo nám. 2097/10..." },
  },
  nesoulady: null,
  varovani: [
    { kategorie: "Automatické prodloužení", text: "Pozor! Členská smlouva na 12 měsíců se AUTOMATICKY prodlužuje o další rok, pokud ji včas nevypovíte.", zavaznost: "kritické" },
    { kategorie: "Sankce", text: "Při nezaplacení členského poplatku mohou být účtovány poplatky za upomínku.", zavaznost: "pozor" },
  ],
  bonusy: [
    { kategorie: "Přerušení", text: "Členství lze až na 3 měsíce v roce bezplatně pozastavit." },
  ],
  predplatne_info: {
    cena: "Měsíční platba",
    fakturacni_cyklus: "Měsíčně",
    automaticke_obnoveni: true,
    jak_zrusit: "Písemně nebo přes portál",
    vypovedni_lhuta: "Před koncem smluvního období",
    vraci_pomernou_cast: false,
    zkusebni_doba: null,
    trial_automaticky_placeny: null,
    zmena_ceny_predstih: null,
    _citace: { automaticke_obnoveni: "Možnost pozastavení smlouvy až na 3 měsíce v každém kalendářním roce." },
  },
} as unknown as MockData;

const mockCinemaCity: MockData = {
  siteName: "Cinema City",
  kategorie: "vstupenky",
  kategorie_label: "Kina a kulturní akce",
  kategorie_confidence: 0.99,
  kategorie_duvod: "Prodej vstupenek na filmová představení s pevným časem a místem.",
  trustRating: "ok",
  prodejce: {
    nazev: "Cinema City Czech s.r.o.",
    ico: "26457712",
    sidlo: "Vinohradská 2828/151, Praha 3",
    zeme: "ČR",
    typ: "přímý prodejce",
    zapis_or: "Městský soud v Praze",
    _citace: { nazev: "Provozovatelem multikin Cinema City v ČR je Cinema City Czech s.r.o." },
  },
  nesoulady: null,
  varovani: [
    {
      kategorie: "Odstoupení od smlouvy",
      text: "Ze zákona NEMÁTE právo na 14denní odstoupení od smlouvy (§ 1837 písm. j) OZ – výjimka pro volný čas). Vstupenky však lze vrátit do 2 hodin před představením přes účet My Cinema City nebo na pokladně.",
      zavaznost: "info",
    },
    {
      kategorie: "Manipulační poplatek",
      text: "Při vrácení vstupenky zakoupené online se manipulační poplatek za online nákup nevrací.",
      zavaznost: "pozor",
    },
    {
      kategorie: "Podmínka vrácení online",
      text: "Pro storno online je nutné být přihlášen do účtu My Cinema City nebo Cinema City CLUB. Bez účtu lze vstupenku vrátit pouze fyzicky na pokladně kina, kde byla zakoupena.",
      zavaznost: "info",
    },
  ],
  bonusy: [
    { kategorie: "Vrácení", text: "Vstupenky lze vrátit online přes aplikaci nebo účet My Cinema City – bez fyzické návštěvy kina." },
    { kategorie: "Přebookování", text: "Vedoucí provozu může namísto vrácení peněz nabídnout poukaz na jiný termín." },
  ],
  akce_zruseni: {
    vraceni_pri_zruseni: "Cena vstupenky vrácena; manipulační poplatek za online nákup se nevrací.",
    vraceni_pri_presunuti: "Poukaz na náhradní představení ve stejné hodnotě (dle domluvy s vedoucím provozu).",
    lhuta_vraceni: "Nejpozději 2 hodiny před začátkem představení",
    voucher_misto_penez: false,
    prevod_na_jinou_osobu: false,
    preprodej: false,
    _citace: {
      lhuta_vraceni: "Zákazník je oprávněn vrátit zakoupenou Vstupenku nejpozději 2 hodiny před začátkem představení.",
    },
  },
} as unknown as MockData;

const mockCineStar: MockData = {
  siteName: "CineStar",
  kategorie: "vstupenky",
  kategorie_label: "Kina a kulturní akce",
  kategorie_confidence: 0.99,
  kategorie_duvod: "Prodej vstupenek na filmová představení s pevným časem a sálem.",
  trustRating: "obezretni",
  prodejce: {
    nazev: "CineStar s.r.o.",
    ico: "26435675",
    sidlo: "Radlická 3185/1c, Smíchov, Praha 5",
    zeme: "ČR",
    typ: "přímý prodejce",
    zapis_or: "Městský soud v Praze, sp. zn. C 81978",
    _citace: { nazev: "Společnost CineStar s.r.o., se sídlem Radlická 3185/1c, Smíchov, 150 00, Praha 5, IČ: 26435675." },
  },
  nesoulady: null,
  varovani: [
    {
      kategorie: "Nelze stornovat online",
      text: "E-vstupenky zakoupené přes internet NELZE stornovat online ani přes aplikaci. Vrácení je možné výhradně fyzicky na pokladně kina, kde byla vstupenka zakoupena.",
      zavaznost: "kritické",
    },
    {
      kategorie: "Odstoupení od smlouvy",
      text: "Ze zákona NEMÁTE právo na 14denní odstoupení od smlouvy (§ 1837 písm. j) OZ – výjimka pro volný čas). Toto je zákonná výjimka společná pro všechna kina.",
      zavaznost: "info",
    },
    {
      kategorie: "Manipulační poplatek",
      text: "Manipulační poplatek za nákup e-vstupenky online se při vrácení nevrací.",
      zavaznost: "pozor",
    },
  ],
  bonusy: [],
  akce_zruseni: {
    vraceni_pri_zruseni: "Cena vstupenky vrácena; manipulační poplatek za e-vstupenku se nevrací.",
    vraceni_pri_presunuti: null,
    lhuta_vraceni: "Nejpozději 1 hodinu před začátkem představení – pouze fyzicky na pokladně kina",
    voucher_misto_penez: false,
    prevod_na_jinou_osobu: false,
    preprodej: false,
    _citace: {
      lhuta_vraceni: "Zákazník je oprávněn vrátit již zakoupenou vstupenku nejpozději 1 hodinu před začátkem představení na pokladně multikina. Manipulační poplatek za nákup e-vstupenky se nevrací.",
    },
  },
} as unknown as MockData;

const mockRegioJet: MockData = {
  siteName: "RegioJet",
  kategorie: "doprava_jizdenky",
  kategorie_label: "Dopravní jízdenky",
  kategorie_confidence: 0.99,
  kategorie_duvod: "Prodej jízdenek na vlakové a autobusové spoje s konkrétním datem a časem odjezdu.",
  trustRating: "ok",
  prodejce: {
    nazev: "RegioJet a.s.",
    ico: "28333187",
    sidlo: "Nám. Svobody 86/17, Brno",
    zeme: "ČR",
    typ: "přímý prodejce",
    zapis_or: "Krajský soud v Brně",
    _citace: { nazev: "Dopravce: RegioJet a.s., Nám. Svobody 86/17, 602 00 Brno." },
  },
  nesoulady: null,
  varovani: [
    {
      kategorie: "Odstoupení od smlouvy",
      text: "Ze zákona NEMÁTE právo na 14denní odstoupení od smlouvy (§ 1837 písm. j) OZ – výjimka pro přepravu s konkrétním termínem). Toto je zákonná výjimka, nikoli pochybení dopravce.",
      zavaznost: "info",
    },
    {
      kategorie: "Akční jízdenky",
      text: "Pozor: Akční a promo jízdenky mohou mít storno poplatek až 100 %. Podmínky jsou vždy uvedeny přímo u konkrétní akce před nákupem.",
      zavaznost: "pozor",
    },
    {
      kategorie: "Pokladní jízdenky",
      text: "Jízdenky zakoupené na fyzickém prodejním místě podléhají storno poplatku 10 % z ceny.",
      zavaznost: "info",
    },
  ],
  bonusy: [
    { kategorie: "Storno zdarma", text: "Online jízdenky lze stornovat zdarma až do 15 minut před odjezdem – jedny z nejlepších podmínek na českém trhu." },
    { kategorie: "SMS storno", text: "Jízdenku lze stornovat i SMS zprávou bez přístupu k internetu." },
    { kategorie: "Kompenzace zpoždění", text: "Při zpoždění nad 90 minut RegioJet vrátí celou cenu jízdenky. Při zpoždění 31–90 minut (spoje do 1,5 h) vrátí 25 %." },
  ],
  storno: {
    lze_stornovat: true,
    lhuta_bezplatneho_storna: "do 15 minut před odjezdem (online jízdenky zdarma)",
    poplatek_za_storno: "online: 0 Kč; pokladní jízdenky: 10 % z ceny; akční jízdenky: až 100 %",
    nevratna_rezervace: false,
    castecne_storno: false,
    _citace: {
      lhuta_bezplatneho_storna: "Vrácení jízdenky lze provést bezplatně online nejpozději 15 minut před odjezdem spoje z dané zastávky dle JŘ.",
      poplatek_za_storno: "Jízdenky vytvořené online na www.regiojet.cz či přes mobilní aplikaci lze stornovat zdarma.",
    },
  },
} as unknown as MockData;

/**
 * Returns mock analysis data if the URL matches a known demo keyword.
 * Used for investor presentations — bypasses backend entirely.
 */
export function getMockForUrl(url: string): MockData | null {
  const u = url.toLowerCase();
  if (u.includes("netflix")) return mockNetflix;
  if (u.includes("cinemax") || u.includes("cine-max")) return mockCinemax;
  if (u.includes("johnreed") || u.includes("john-reed") || u.includes("john reed")) return mockJohnReed;
  if (u.includes("alza")) return mockAlza;
  if (u.includes("cinemacity") || u.includes("cinema-city") || u.includes("cinema city")) return mockCinemaCity;
  if (u.includes("cinestar") || u.includes("cine-star")) return mockCineStar;
  if (u.includes("regiojet") || u.includes("regio-jet")) return mockRegioJet;
  return null;
}
