export type ShopCategory =
  | "eshop_zbozi"
  | "marketplace"
  | "predplatne"
  | "vstupenky"
  | "cestovani"
  | "jidlo_rozvoz"
  | "doprava_jizdenky"
  | "digitalni_produkt"
  | "lekarny";

export type TrustRating = "ok" | "obezretni" | "riziko";

export type LegalComplianceLevel = "better" | "standard" | "worse" | "unknown";

export interface CitaceMap {
  [key: string]: string | null;
}

export interface AnalysisResult {
  url: string;
  siteName: string;
  analyzedAt: string;

  kategorie: ShopCategory;
  kategorie_label: string;
  kategorie_confidence: number;
  trustRating: TrustRating;

  pravni_texty_stazeny?: boolean;

  zdroje: {
    vop_url: string | null;
    faq_url: string | null;
    reklamacni_rad_url: string | null;
    kontakt_url: string | null;
    privacy_url: string | null;
  };

  pravni_odkazy: Array<{
    paragraf: string;
    zakon: string;
    url_esbirka: string;
    kontext: string;
  }>;

  nesoulady?: Array<{
    tema: string;
    vop_rika: string;
    faq_rika: string;
  }>;

  prodejce: {
    nazev: string | null;
    ico: string | null;
    sidlo: string | null;
    zeme: string | null;
    typ: "přímý prodejce" | "zprostředkovatel" | "neuvedeno";
    zapis_or: string | null;
    _citace?: CitaceMap;
  };

  vraceni?: {
    lhuta_dny: number | null;
    kdo_plati_postovne: "zákazník" | "e-shop" | "neuvedeno";
    vyjimky: string[];
    sankce: string | null;
    lhuta_vraceni_penez_dny: number | null;
    _citace?: CitaceMap;
  };

  reklamace?: {
    zarucni_doba_mesice: number | null;
    adresa_reklamace: string | null;
    reklamace_v_zahranici: boolean;
    sberne_misto_cr: boolean | null;
    hradi_dopravu_vadneho: boolean | null;
    lhuta_vyrizeni_dny: number | null;
    lhuta_vraceni_penez_dny: number | null;
    _citace?: CitaceMap;
  };

  platby?: {
    metody: string[];
    ma_dobirku: boolean | null;
    skryte_poplatky: string[];
    sankce_nevyzvedni: string | null;
    ceny_vcetne_dph: boolean | null;
    _citace?: CitaceMap;
  };

  doprava?: {
    dodaci_lhuta_dny: number | null;
    dodaci_lhuta_text: string | null;
    zpusoby: string[];
    odpovednost_poskozeni: string | null;
    sledovani_zasilky: boolean | null;
    _citace?: CitaceMap;
  };

  storno?: {
    lze_stornovat: boolean | null;
    lhuta_bezplatneho_storna: string | null;
    poplatek_za_storno: string | null;
    nevratna_rezervace: boolean | null;
    castecne_storno: boolean | null;
    _citace?: CitaceMap;
  };

  predplatne_info?: {
    cena: string | null;
    fakturacni_cyklus: string | null;
    automaticke_obnoveni: boolean | null;
    jak_zrusit: string | null;
    vypovedni_lhuta: string | null;
    vraci_pomernou_cast: boolean | null;
    zkusebni_doba: string | null;
    trial_automaticky_placeny: boolean | null;
    zmena_ceny_predstih: string | null;
    _citace?: CitaceMap;
  };

  ochrana_kupujiciho?: {
    program_ochrany: string | null;
    podminky_ochrany: string | null;
    reseni_sporu: string | null;
    _citace?: CitaceMap;
  };

  licence_digital?: {
    vlastnictvi_vs_licence: string | null;
    prenositelnost: boolean | null;
    drm: string | null;
    offline_pristup: boolean | null;
    regionalni_omezeni: string | null;
    _citace?: CitaceMap;
  };

  akce_zruseni?: {
    vraceni_pri_zruseni: string | null;
    vraceni_pri_presunuti: string | null;
    lhuta_vraceni: string | null;
    voucher_misto_penez: boolean | null;
    prevod_na_jinou_osobu: boolean | null;
    preprodej: boolean | null;
    _citace?: CitaceMap;
  };

  pojisteni?: {
    storno_pojisteni: boolean | null;
    co_pokryva: string | null;
    cena: string | null;
    _citace?: CitaceMap;
  };

  jidlo_kvalita?: {
    kdo_odpovida: string | null;
    lhuta_reklamace: string | null;
    alergeny_info: boolean | null;
    minimalni_objednavka: string | null;
    kompenzace_zpozdeni: string | null;
    _citace?: CitaceMap;
  };

  lekarna_info?: {
    licence_sukl: boolean | null;
    vraceni_leciv_vyjimka: boolean | null;
    konzultace_lekarnik: boolean | null;
    teplotni_retezec: string | null;
    _citace?: CitaceMap;
  };

  _lowData?: boolean;

  varovani: Array<{
    kategorie: string;
    text: string;
    zavaznost: "info" | "pozor" | "kritické";
  }>;

  bonusy: Array<{
    kategorie: string;
    text: string;
  }>;
}

export interface HistoryItem {
  url: string;
  siteName: string;
  analyzedAt: string;
}
