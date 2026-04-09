export interface AnalysisResult {
  url: string;
  siteName: string;
  analyzedAt: string;

  prodejce: {
    nazev: string | null;
    ico: string | null;
    sidlo: string | null;
    zeme: string | null;
    typ: "přímý prodejce" | "zprostředkovatel" | "neuvedeno";
    zapis_or: string | null;
  };

  vraceni: {
    lhuta_dny: number | null;
    kdo_plati_postovne: "zákazník" | "e-shop" | "neuvedeno";
    vyjimky: string[];
    sankce: string | null;
    lhuta_vraceni_penez_dny: number | null;
  };

  reklamace: {
    zarucni_doba_mesice: number | null;
    adresa_reklamace: string | null;
    reklamace_v_zahranici: boolean;
    sberne_misto_cr: boolean | null;
    hradi_dopravu_vadneho: boolean | null;
    lhuta_vyrizeni_dny: number | null;
    lhuta_vraceni_penez_dny: number | null;
  };

  platby: {
    metody: string[];
    ma_dobirku: boolean;
    skryte_poplatky: string[];
    sankce_nevyzvedni: string | null;
    ceny_vcetne_dph: boolean | null;
  };

  doprava: {
    dodaci_lhuta_dny: number | null;
    dodaci_lhuta_text: string | null;
    zpusoby: string[];
    odpovednost_poskozeni: string | null;
    sledovani_zasilky: boolean | null;
  };

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
