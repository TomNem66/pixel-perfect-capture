export interface ExtractedData {
  meta: {
    shop_name: string | null;
    ico: string | null;
    sidlo: string | null;
    rejstrik: string | null;
    datum_ucinnosti_vop: string | null;
    nalezene_dokumenty: string[];
  };
  odstoupeni: {
    lhuta_dny: number | null;
    postup_popsan: boolean;
    formular_prilozen: boolean;
    kdo_hradi_postovne_vraceni: string;
    lhuta_vraceni_penez_dny: number | null;
    sankce_za_odstoupeni: string | null;
    vyjimky_uvedeny: boolean;
    presna_citace: string;
  };
  reklamace: {
    reklamacni_lhuta_mesice: number | null;
    postup_popsan: boolean;
    lhuta_vyrizeni_dny: number | null;
    prava_z_vadneho_plneni: string[];
    kontakt_pro_reklamaci: boolean;
    neprimerene_podminky: string | null;
    presna_citace: string;
  };
  gdpr: {
    spravce_identifikovan: boolean;
    ucel_zpracovani: boolean;
    pravni_zaklad: boolean;
    doba_uchovavani: boolean;
    prava_subjektu: boolean;
    cookies_reseny: boolean;
  };
  platby: {
    zpusoby_platby_uvedeny: boolean;
    ceny_vcetne_dph: boolean;
    skryte_poplatky: string | null;
    bezpecnost_plateb: boolean;
  };
  dodani: {
    dodaci_lhuta_uvedena: boolean;
    dodaci_lhuta_dny: number | null;
    zpusoby_dopravy_uvedeny: boolean;
    prechod_rizika_popsan: boolean;
  };
  spory: {
    coi_uvedena: boolean;
    mimosoudni_reseni_adr: boolean;
    odr_platforma_odkaz: boolean;
    kontakt_pro_stiznosti: boolean;
  };
  obecne: {
    identifikace_kompletni: string;
    srozumitelnost: string;
    informace_o_uzavreni_smlouvy: boolean;
  };
  red_flags: RedFlag[];
  bonusy: Bonus[];
}

export interface RedFlag {
  typ: string;
  zavaznost: "vysoká" | "střední" | "nízká";
  citace: string;
  duvod: string;
  zakonny_standard: string;
}

export interface Bonus {
  typ: string;
  popis: string;
}

export interface ScoreCategory {
  score: number;
  max: number;
  label: string;
  icon: string;
  color: string;
}

export interface ScoreResult {
  total: number;
  grade: string;
  gradeColor: string;
  gradeText: string;
  categories: Record<string, ScoreCategory>;
}

export interface AnalysisResult {
  url: string;
  siteName: string;
  analyzedAt: string;
  extractedData: ExtractedData;
  scoreResult: ScoreResult;
  summary: string;
}

export interface HistoryItem {
  url: string;
  siteName: string;
  score: number;
  grade: string;
  analyzedAt: string;
}
