import { ExtractedData, ScoreCategory, ScoreResult } from "@/types/analysis";

export function calculateScore(data: ExtractedData): ScoreResult {
  const categories: Record<string, ScoreCategory> = {};

  // A: ODSTOUPENÍ OD SMLOUVY (max 20)
  let a = 0;
  const od = data.odstoupeni;
  if (od.lhuta_dny != null && od.lhuta_dny >= 14) a += 5;
  if (od.lhuta_dny != null && od.lhuta_dny > 14) a += 2;
  if (od.postup_popsan === true) a += 3;
  if (od.formular_prilozen === true) a += 3;
  if (od.kdo_hradi_postovne_vraceni && od.kdo_hradi_postovne_vraceni !== "neuvedeno") a += 3;
  if (od.lhuta_vraceni_penez_dny != null) {
    a += od.lhuta_vraceni_penez_dny <= 14 ? 3 : 1;
  }
  if (!od.sankce_za_odstoupeni) a += 3;
  categories["odstoupeni"] = {
    score: Math.min(a, 20), max: 20,
    label: "Odstoupení od smlouvy", icon: "🛒",
    color: a >= 16 ? "#10B981" : a >= 10 ? "#F59E0B" : "#EF4444"
  };

  // B: REKLAMACE (max 20)
  let b = 0;
  const rek = data.reklamace;
  if (rek.reklamacni_lhuta_mesice != null && rek.reklamacni_lhuta_mesice >= 24) b += 5;
  if (rek.postup_popsan === true) b += 3;
  if (rek.lhuta_vyrizeni_dny != null && rek.lhuta_vyrizeni_dny <= 30) b += 3;
  const pravaCount = Array.isArray(rek.prava_z_vadneho_plneni) ? rek.prava_z_vadneho_plneni.length : 0;
  if (pravaCount >= 4) b += 4; else if (pravaCount >= 2) b += 2;
  if (rek.kontakt_pro_reklamaci === true) b += 3;
  if (!rek.neprimerene_podminky) b += 2;
  categories["reklamace"] = {
    score: Math.min(b, 20), max: 20,
    label: "Reklamace a záruka", icon: "🔧",
    color: b >= 16 ? "#10B981" : b >= 10 ? "#F59E0B" : "#EF4444"
  };

  // C: GDPR (max 15)
  let c = 0;
  const gdpr = data.gdpr;
  if (gdpr.spravce_identifikovan === true) c += 3;
  if (gdpr.ucel_zpracovani === true) c += 3;
  if (gdpr.pravni_zaklad === true) c += 2;
  if (gdpr.doba_uchovavani === true) c += 2;
  if (gdpr.prava_subjektu === true) c += 3;
  if (gdpr.cookies_reseny === true) c += 2;
  categories["gdpr"] = {
    score: c, max: 15,
    label: "Ochrana soukromí", icon: "🔒",
    color: c >= 12 ? "#10B981" : c >= 7 ? "#F59E0B" : "#EF4444"
  };

  // D: PLATBY (max 10)
  let d = 0;
  const plat = data.platby;
  if (plat.zpusoby_platby_uvedeny === true) d += 3;
  if (plat.ceny_vcetne_dph === true) d += 3;
  if (!plat.skryte_poplatky) d += 2;
  if (plat.bezpecnost_plateb === true) d += 2;
  categories["platby"] = {
    score: d, max: 10,
    label: "Platební podmínky", icon: "💳",
    color: d >= 8 ? "#10B981" : d >= 5 ? "#F59E0B" : "#EF4444"
  };

  // E: DODÁNÍ (max 10)
  let e = 0;
  const dod = data.dodani;
  if (dod.dodaci_lhuta_uvedena === true) e += 3;
  if (dod.dodaci_lhuta_dny != null && dod.dodaci_lhuta_dny <= 30) e += 2;
  if (dod.zpusoby_dopravy_uvedeny === true) e += 3;
  if (dod.prechod_rizika_popsan === true) e += 2;
  categories["dodani"] = {
    score: e, max: 10,
    label: "Dodací podmínky", icon: "📦",
    color: e >= 8 ? "#10B981" : e >= 5 ? "#F59E0B" : "#EF4444"
  };

  // F: SPORY (max 10)
  let f = 0;
  const sp = data.spory;
  if (sp.coi_uvedena === true) f += 3;
  if (sp.mimosoudni_reseni_adr === true) f += 3;
  if (sp.odr_platforma_odkaz === true) f += 2;
  if (sp.kontakt_pro_stiznosti === true) f += 2;
  categories["spory"] = {
    score: f, max: 10,
    label: "Řešení sporů", icon: "⚖️",
    color: f >= 8 ? "#10B981" : f >= 5 ? "#F59E0B" : "#EF4444"
  };

  // G: TRANSPARENTNOST (max 15)
  let g = 0;
  const ob = data.obecne;
  if (ob.identifikace_kompletni === "kompletní") g += 4;
  else if (ob.identifikace_kompletni === "částečná") g += 2;
  if (data.meta?.datum_ucinnosti_vop) g += 2;
  if (ob.srozumitelnost === "dobrá") g += 3;
  else if (ob.srozumitelnost === "průměrná") g += 1;
  const redFlagCount = Array.isArray(data.red_flags) ? data.red_flags.length : 0;
  if (redFlagCount === 0) g += 4; else if (redFlagCount <= 2) g += 2;
  if (ob.informace_o_uzavreni_smlouvy === true) g += 2;
  categories["transparentnost"] = {
    score: Math.min(g, 15), max: 15,
    label: "Transparentnost", icon: "📋",
    color: g >= 12 ? "#10B981" : g >= 7 ? "#F59E0B" : "#EF4444"
  };

  // MALUS za red flags
  let malus = 0;
  if (Array.isArray(data.red_flags)) {
    for (const flag of data.red_flags) {
      if (flag.zavaznost === "vysoká") malus -= 5;
      else if (flag.zavaznost === "střední") malus -= 3;
      else malus -= 1;
    }
  }

  // BONUS za nadstandard
  const bonus = Math.min((Array.isArray(data.bonusy) ? data.bonusy.length : 0) * 2, 5);

  // CELKOVÉ SKÓRE
  const rawTotal = Object.values(categories).reduce((s, c) => s + c.score, 0);
  const total = Math.max(0, Math.min(100, rawTotal + malus + bonus));

  let grade: string, gradeColor: string, gradeText: string;
  if (total >= 90) { grade = "A+"; gradeColor = "#10B981"; gradeText = "Vynikající podmínky, plně v souladu se zákonem"; }
  else if (total >= 80) { grade = "A"; gradeColor = "#10B981"; gradeText = "Vynikající podmínky, plně v souladu se zákonem"; }
  else if (total >= 70) { grade = "B"; gradeColor = "#3B82F6"; gradeText = "Dobré podmínky s drobnými nedostatky"; }
  else if (total >= 60) { grade = "C"; gradeColor = "#F59E0B"; gradeText = "Průměrné podmínky, věnujte pozornost varováním"; }
  else if (total >= 45) { grade = "D"; gradeColor = "#F97316"; gradeText = "Podprůměrné podmínky, doporučujeme opatrnost"; }
  else { grade = "F"; gradeColor = "#EF4444"; gradeText = "Nedostatečné podmínky, zvažte nákup jinde"; }

  return { total, grade, gradeColor, gradeText, categories };
}
