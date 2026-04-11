import { AnalysisResult, ShopCategory, TrustRating } from "@/types/analysis";
import { CATEGORY_LABELS, CATEGORY_SECTIONS, DOMAIN_CATEGORY_MAP } from "./categoryMapping";

function extractDomain(url: string): string {
  try {
    return new URL(url.startsWith("http") ? url : `https://${url}`).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function dBool(hash: number, seed: number): boolean {
  return ((hash * (seed + 1) * 13) % 100) > 40;
}

function dChoice<T>(hash: number, seed: number, options: T[]): T {
  return options[((hash * (seed + 1) * 7) % options.length)];
}

function detectCategory(domain: string): ShopCategory {
  if (DOMAIN_CATEGORY_MAP[domain]) return DOMAIN_CATEGORY_MAP[domain];
  // Check partial matches
  for (const [key, cat] of Object.entries(DOMAIN_CATEGORY_MAP)) {
    if (domain.includes(key) || key.includes(domain)) return cat;
  }
  return "eshop_zbozi";
}

function computeTrustRating(varovani: AnalysisResult["varovani"]): TrustRating {
  const critical = varovani.filter(v => v.zavaznost === "kritické").length;
  const warnings = varovani.filter(v => v.zavaznost === "pozor").length;
  if (critical > 0) return "riziko";
  if (warnings >= 2) return "obezretni";
  return "ok";
}

export function generateMockAnalysis(url: string, forcedCategory?: ShopCategory): AnalysisResult {
  const domain = extractDomain(url);
  const h = hashCode(domain);
  const kategorie = forcedCategory || detectCategory(domain);
  const sections = CATEGORY_SECTIONS[kategorie];
  const catLabel = CATEGORY_LABELS[kategorie];

  const isMarketplace = kategorie === "marketplace" ? "zprostředkovatel" as const : dChoice(h, 50, ["přímý prodejce", "přímý prodejce", "neuvedeno"] as const);
  const zeme = kategorie === "marketplace" ? dChoice(h, 51, ["ČR", "EU", "mimo EU"] as const) : dChoice(h, 51, ["ČR", "ČR", "EU"] as const);

  const result: AnalysisResult = {
    url,
    siteName: domain,
    analyzedAt: new Date().toISOString(),
    kategorie,
    kategorie_label: catLabel.label,
    kategorie_confidence: 0.85 + (h % 15) / 100,
    trustRating: "ok",

    zdroje: {
      vop_url: `https://${domain}/obchodni-podminky`,
      faq_url: dBool(h, 80) ? `https://${domain}/faq` : null,
      reklamacni_rad_url: dBool(h, 81) ? `https://${domain}/reklamacni-rad` : null,
      kontakt_url: `https://${domain}/kontakt`,
      privacy_url: dBool(h, 82) ? `https://${domain}/ochrana-osobnich-udaju` : null,
    },

    pravni_odkazy: [],
    nesoulady: undefined,

    prodejce: {
      nazev: domain,
      ico: dBool(h, 1) ? "12345678" : null,
      sidlo: dBool(h, 2) ? "Praha 1, Hlavní 123" : null,
      zeme,
      typ: isMarketplace,
      zapis_or: dBool(h, 3) ? "C 12345, Městský soud v Praze" : null,
    },

    varovani: [],
    bonusy: [],
  };

  // Generate sections based on category
  if (sections.includes("vraceni")) {
    const lhutaDny = dBool(h, 5) ? 14 : dBool(h, 6) ? 30 : null;
    const kdoPlatí = dChoice(h, 9, ["zákazník", "e-shop", "neuvedeno"] as const);
    const sankce = dBool(h, 12) ? null : "Poplatek 200 Kč za zpracování vrácení";
    result.vraceni = {
      lhuta_dny: lhutaDny,
      kdo_plati_postovne: kdoPlatí,
      vyjimky: dBool(h, 13) ? ["hygienické zboží", "software po otevření", "zboží na míru"] : [],
      sankce,
      lhuta_vraceni_penez_dny: dBool(h, 10) ? 14 : dBool(h, 11) ? 30 : null,
    };
    if (sankce) result.varovani.push({ kategorie: "Vrácení", text: `E-shop účtuje sankci za vrácení zboží: ${sankce}`, zavaznost: "kritické" });
    if (lhutaDny && lhutaDny > 14) result.bonusy.push({ kategorie: "Vrácení", text: `Prodloužená lhůta na vrácení – ${lhutaDny} dní místo zákonných 14` });
    if (kdoPlatí === "e-shop") result.bonusy.push({ kategorie: "Vrácení", text: "Poštovné při vrácení hradí e-shop" });
    result.pravni_odkazy.push({ paragraf: "§ 1829", zakon: "zákon č. 89/2012 Sb.", url_esbirka: "https://www.e-sbirka.cz/sb/2012/89#par_1829", kontext: "odstoupení od smlouvy" });
  }

  if (sections.includes("reklamace")) {
    const reklamaceZahranici = zeme === "mimo EU" || dBool(h, 60);
    result.reklamace = {
      zarucni_doba_mesice: dBool(h, 14) ? 24 : dBool(h, 15) ? 12 : null,
      adresa_reklamace: dBool(h, 21) ? "Reklamační oddělení, Skladová 45, Praha 5" : null,
      reklamace_v_zahranici: reklamaceZahranici,
      sberne_misto_cr: reklamaceZahranici ? dBool(h, 61) : null,
      hradi_dopravu_vadneho: dBool(h, 62) ? true : dBool(h, 63) ? false : null,
      lhuta_vyrizeni_dny: dBool(h, 17) ? 30 : dBool(h, 18) ? 45 : null,
      lhuta_vraceni_penez_dny: dBool(h, 64) ? 14 : null,
    };
    if (reklamaceZahranici) result.varovani.push({ kategorie: "Reklamace", text: "Reklamace se zasílá do zahraničí", zavaznost: "pozor" });
    if (result.reklamace.hradi_dopravu_vadneho === true) result.bonusy.push({ kategorie: "Reklamace", text: "E-shop hradí dopravu vadného zboží" });
    result.pravni_odkazy.push({ paragraf: "§ 2161–2174", zakon: "zákon č. 89/2012 Sb.", url_esbirka: "https://www.e-sbirka.cz/sb/2012/89#par_2161", kontext: "práva z vadného plnění" });
  }

  if (sections.includes("platby")) {
    const metody = dBool(h, 29) ? ["platební karta", "bankovní převod", "dobírka", "Apple Pay"] : ["platební karta", "bankovní převod"];
    const sankceNevyzvedni = dBool(h, 70) ? null : "Smluvní pokuta 500 Kč za nevyzvednutí dobírky";
    result.platby = {
      metody,
      ma_dobirku: metody.includes("dobírka"),
      skryte_poplatky: dBool(h, 31) ? ["příplatek za platbu kartou 2%", "balné 29 Kč"] : [],
      sankce_nevyzvedni: sankceNevyzvedni,
      ceny_vcetne_dph: dBool(h, 30) ? true : dBool(h, 65) ? false : null,
    };
    if (sankceNevyzvedni) result.varovani.push({ kategorie: "Platby", text: `E-shop účtuje pokutu za nevyzvednutí dobírky: ${sankceNevyzvedni}`, zavaznost: "pozor" });
    if (result.platby.skryte_poplatky.length > 0) result.varovani.push({ kategorie: "Platby", text: `Skryté poplatky: ${result.platby.skryte_poplatky.join(", ")}`, zavaznost: "pozor" });
  }

  if (sections.includes("doprava")) {
    const dodaciLhuta = dBool(h, 34) ? 5 : dBool(h, 35) ? 45 : null;
    result.doprava = {
      dodaci_lhuta_dny: dodaciLhuta,
      dodaci_lhuta_text: dodaciLhuta ? `Zboží expedujeme do ${dodaciLhuta} pracovních dní` : null,
      zpusoby: dBool(h, 36) ? ["Zásilkovna", "PPL", "Česká pošta"] : ["PPL"],
      odpovednost_poskozeni: dBool(h, 37) ? "Riziko přechází na kupujícího převzetím zásilky" : null,
      sledovani_zasilky: dBool(h, 66) ? true : dBool(h, 67) ? false : null,
    };
    if (dodaciLhuta && dodaciLhuta > 30) result.varovani.push({ kategorie: "Doprava", text: `Dodací lhůta až ${dodaciLhuta} dní – typické pro dropshipping`, zavaznost: "pozor" });
  }

  if (sections.includes("storno")) {
    result.storno = {
      lze_stornovat: dBool(h, 40),
      lhuta_bezplatneho_storna: dBool(h, 41) ? "24 hodin před" : dBool(h, 42) ? "48 hodin před" : null,
      poplatek_za_storno: dBool(h, 43) ? "Storno poplatek 20 % z ceny" : null,
      nevratna_rezervace: dBool(h, 44),
      castecne_storno: dBool(h, 45),
    };
    if (result.storno.nevratna_rezervace) result.varovani.push({ kategorie: "Storno", text: "Rezervace je nevratná – při zrušení ztrácíte celou částku", zavaznost: "kritické" });
    if (result.storno.poplatek_za_storno) result.varovani.push({ kategorie: "Storno", text: `Poplatek za storno: ${result.storno.poplatek_za_storno}`, zavaznost: "pozor" });
  }

  if (sections.includes("predplatne_info")) {
    result.predplatne_info = {
      cena: dChoice(h, 90, ["199 Kč/měsíc", "249 Kč/měsíc", "2 490 Kč/rok", null]),
      fakturacni_cyklus: dChoice(h, 91, ["měsíčně", "ročně", null]),
      automaticke_obnoveni: dBool(h, 92),
      jak_zrusit: dBool(h, 93) ? "V nastavení účtu → Předplatné → Zrušit" : null,
      vypovedni_lhuta: dBool(h, 94) ? "Do konce fakturačního období" : null,
      vraci_pomernou_cast: dBool(h, 95) ? false : null,
      zkusebni_doba: dBool(h, 96) ? "30 dní zdarma" : null,
      trial_automaticky_placeny: dBool(h, 97),
      zmena_ceny_predstih: dBool(h, 98) ? "30 dní předem e-mailem" : null,
    };
    if (result.predplatne_info.automaticke_obnoveni) result.varovani.push({ kategorie: "Předplatné", text: "Předplatné se automaticky obnovuje – nezapomeňte ho včas zrušit", zavaznost: "pozor" });
    if (result.predplatne_info.trial_automaticky_placeny) result.varovani.push({ kategorie: "Předplatné", text: "Po skončení zkušební doby se automaticky začne účtovat placená verze", zavaznost: "pozor" });
    if (result.predplatne_info.vraci_pomernou_cast === false) result.varovani.push({ kategorie: "Předplatné", text: "Při zrušení předplatného se nevrací poměrná část", zavaznost: "info" });
    result.pravni_odkazy.push({ paragraf: "§ 1837 písm. l)", zakon: "zákon č. 89/2012 Sb.", url_esbirka: "https://www.e-sbirka.cz/sb/2012/89#par_1837", kontext: "výjimka pro digitální obsah" });
  }

  if (sections.includes("ochrana_kupujiciho")) {
    result.ochrana_kupujiciho = {
      program_ochrany: dBool(h, 100) ? "A-to-Z Guarantee" : dBool(h, 101) ? "Temu Purchase Protection" : null,
      podminky_ochrany: dBool(h, 102) ? "Zboží nedorazilo do 30 dní nebo neodpovídá popisu" : null,
      reseni_sporu: dBool(h, 103) ? "Online platforma pro řešení sporů (ODR)" : null,
    };
    if (result.ochrana_kupujiciho.program_ochrany) result.bonusy.push({ kategorie: "Ochrana", text: `Program ochrany kupujícího: ${result.ochrana_kupujiciho.program_ochrany}` });
  }

  if (sections.includes("licence_digital")) {
    result.licence_digital = {
      vlastnictvi_vs_licence: dChoice(h, 110, ["Licence – nevlastníte, pouze užíváte", "Licence s neomezeným přístupem", null]),
      prenositelnost: dBool(h, 111) ? false : null,
      drm: dBool(h, 112) ? "Ano – DRM ochrana (Steam/Adobe DRM)" : null,
      offline_pristup: dBool(h, 113),
      regionalni_omezeni: dBool(h, 114) ? "Dostupné pouze v ČR/EU" : null,
    };
    if (result.licence_digital.prenositelnost === false) result.varovani.push({ kategorie: "Licence", text: "Zakoupený obsah nelze přenést na jinou osobu", zavaznost: "info" });
    result.pravni_odkazy.push({ paragraf: "celý zákon", zakon: "zákon č. 242/2022 Sb.", url_esbirka: "https://www.e-sbirka.cz/sb/2022/242", kontext: "digitální obsah a služby" });
  }

  if (sections.includes("akce_zruseni")) {
    result.akce_zruseni = {
      vraceni_pri_zruseni: dBool(h, 120) ? "Plná náhrada vstupného" : dBool(h, 121) ? "Voucher na jinou akci" : null,
      vraceni_pri_presunuti: dBool(h, 122) ? "Vstupenka platí na nový termín" : null,
      lhuta_vraceni: dBool(h, 123) ? "Do 30 dní od zrušení" : null,
      voucher_misto_penez: dBool(h, 124),
      prevod_na_jinou_osobu: dBool(h, 125),
      preprodej: dBool(h, 126) ? false : null,
    };
    if (result.akce_zruseni.voucher_misto_penez) result.varovani.push({ kategorie: "Vstupenky", text: "Při zrušení akce nabízí voucher místo vrácení peněz", zavaznost: "pozor" });
    result.pravni_odkazy.push({ paragraf: "§ 1837 písm. j)", zakon: "zákon č. 89/2012 Sb.", url_esbirka: "https://www.e-sbirka.cz/sb/2012/89#par_1837", kontext: "výjimka pro volnočasové aktivity" });
  }

  if (sections.includes("pojisteni")) {
    result.pojisteni = {
      storno_pojisteni: dBool(h, 130),
      co_pokryva: dBool(h, 131) ? "Nemoc, úraz, úmrtí v rodině, živelní pohroma" : null,
      cena: dBool(h, 132) ? "od 49 Kč" : null,
    };
    if (result.pojisteni.storno_pojisteni) result.bonusy.push({ kategorie: "Pojištění", text: "Možnost dokoupení storno pojištění" });
  }

  if (sections.includes("jidlo_kvalita")) {
    result.jidlo_kvalita = {
      kdo_odpovida: dChoice(h, 140, ["Restaurace", "Platforma i restaurace společně", null]),
      lhuta_reklamace: dBool(h, 141) ? "Ihned při převzetí" : null,
      alergeny_info: dBool(h, 142),
      minimalni_objednavka: dBool(h, 143) ? "200 Kč" : null,
      kompenzace_zpozdeni: dBool(h, 144) ? "Kredit na příští objednávku" : null,
    };
    if (result.jidlo_kvalita.minimalni_objednavka) result.varovani.push({ kategorie: "Objednávka", text: `Minimální objednávka: ${result.jidlo_kvalita.minimalni_objednavka}`, zavaznost: "info" });
  }

  if (sections.includes("lekarna_info")) {
    result.lekarna_info = {
      licence_sukl: dBool(h, 150),
      vraceni_leciv_vyjimka: true,
      konzultace_lekarnik: dBool(h, 152),
      teplotni_retezec: dBool(h, 153) ? "Zajištěn – termobox při doručení" : null,
    };
    if (result.lekarna_info.licence_sukl) result.bonusy.push({ kategorie: "Lékárna", text: "Lékárna má platnou licenci SÚKL" });
    if (result.lekarna_info.vraceni_leciv_vyjimka) result.varovani.push({ kategorie: "Lékárna", text: "Léčiva nelze ze zákona vrátit (výjimka z odstoupení od smlouvy)", zavaznost: "info" });
    result.pravni_odkazy.push({ paragraf: "celý zákon", zakon: "zákon č. 378/2007 Sb.", url_esbirka: "https://www.e-sbirka.cz/sb/2007/378", kontext: "léčiva a lékárenská péče" });
  }

  // Global warnings
  if (zeme !== "ČR" && zeme !== "EU") {
    result.varovani.push({ kategorie: "Prodejce", text: "Prodejce sídlí mimo EU – vaše spotřebitelská práva mohou být obtížně vymahatelná", zavaznost: "kritické" });
  }
  if (isMarketplace === "zprostředkovatel") {
    result.varovani.push({ kategorie: "Prodejce", text: "Tento e-shop je zprostředkovatel (marketplace/dropshipping). Reklamace a vrácení zboží řešíte přímo s dodavatelem.", zavaznost: "pozor" });
  }

  // Nesoulady (occasional)
  if (dBool(h, 200) && !dBool(h, 201)) {
    result.nesoulady = [
      {
        tema: "Lhůta na vrácení",
        vop_rika: "14 dní od převzetí",
        faq_rika: "30 dní na vrácení bez udání důvodu",
      },
    ];
  }

  // Global legal reference
  result.pravni_odkazy.push({ paragraf: "§ 1810–1867", zakon: "zákon č. 89/2012 Sb.", url_esbirka: "https://www.e-sbirka.cz/sb/2012/89#par_1810", kontext: "spotřebitelské smlouvy obecně" });

  result.trustRating = computeTrustRating(result.varovani);

  return result;
}
