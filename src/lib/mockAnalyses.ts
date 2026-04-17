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
  return null;
}
