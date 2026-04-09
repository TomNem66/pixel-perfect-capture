import { AnalysisResult, ExtractedData } from "@/types/analysis";
import { calculateScore } from "./scoring";

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
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function deterministicBool(hash: number, seed: number): boolean {
  return ((hash * (seed + 1) * 13) % 100) > 40;
}

function deterministicChoice<T>(hash: number, seed: number, options: T[]): T {
  return options[((hash * (seed + 1) * 7) % options.length)];
}

export function generateMockAnalysis(url: string): AnalysisResult {
  const domain = extractDomain(url);
  const h = hashCode(domain);

  const extractedData: ExtractedData = {
    meta: {
      shop_name: domain,
      ico: deterministicBool(h, 1) ? "12345678" : null,
      sidlo: deterministicBool(h, 2) ? "Praha 1, Hlavní 123" : null,
      rejstrik: deterministicBool(h, 3) ? "C 12345, Městský soud v Praze" : null,
      datum_ucinnosti_vop: deterministicBool(h, 4) ? "1.1.2024" : null,
      nalezene_dokumenty: ["Obchodní podmínky", "Ochrana osobních údajů"],
    },
    odstoupeni: {
      lhuta_dny: deterministicBool(h, 5) ? 14 : deterministicBool(h, 6) ? 30 : null,
      postup_popsan: deterministicBool(h, 7),
      formular_prilozen: deterministicBool(h, 8),
      kdo_hradi_postovne_vraceni: deterministicChoice(h, 9, ["spotřebitel", "prodejce", "neuvedeno"]),
      lhuta_vraceni_penez_dny: deterministicBool(h, 10) ? 14 : deterministicBool(h, 11) ? 30 : null,
      sankce_za_odstoupeni: deterministicBool(h, 12) ? null : "Poplatek 200 Kč za zpracování vrácení",
      vyjimky_uvedeny: deterministicBool(h, 13),
      presna_citace: "\"Spotřebitel má právo odstoupit od smlouvy ve lhůtě 14 dnů od převzetí zboží bez udání důvodu.\"",
    },
    reklamace: {
      reklamacni_lhuta_mesice: deterministicBool(h, 14) ? 24 : deterministicBool(h, 15) ? 12 : null,
      postup_popsan: deterministicBool(h, 16),
      lhuta_vyrizeni_dny: deterministicBool(h, 17) ? 30 : deterministicBool(h, 18) ? 45 : null,
      prava_z_vadneho_plneni: deterministicBool(h, 19)
        ? ["oprava", "výměna", "sleva", "odstoupení"]
        : deterministicBool(h, 20) ? ["oprava", "výměna"] : [],
      kontakt_pro_reklamaci: deterministicBool(h, 21),
      neprimerene_podminky: deterministicBool(h, 22) ? null : "Reklamace pouze s původním obalem",
      presna_citace: "\"Reklamaci lze uplatnit ve lhůtě 24 měsíců od převzetí zboží.\"",
    },
    gdpr: {
      spravce_identifikovan: deterministicBool(h, 23),
      ucel_zpracovani: deterministicBool(h, 24),
      pravni_zaklad: deterministicBool(h, 25),
      doba_uchovavani: deterministicBool(h, 26),
      prava_subjektu: deterministicBool(h, 27),
      cookies_reseny: deterministicBool(h, 28),
    },
    platby: {
      zpusoby_platby_uvedeny: deterministicBool(h, 29),
      ceny_vcetne_dph: deterministicBool(h, 30),
      skryte_poplatky: deterministicBool(h, 31) ? "Příplatek za platbu kartou 2%" : null,
      bezpecnost_plateb: deterministicBool(h, 32),
    },
    dodani: {
      dodaci_lhuta_uvedena: deterministicBool(h, 33),
      dodaci_lhuta_dny: deterministicBool(h, 34) ? 5 : deterministicBool(h, 35) ? 14 : null,
      zpusoby_dopravy_uvedeny: deterministicBool(h, 36),
      prechod_rizika_popsan: deterministicBool(h, 37),
    },
    spory: {
      coi_uvedena: deterministicBool(h, 38),
      mimosoudni_reseni_adr: deterministicBool(h, 39),
      odr_platforma_odkaz: deterministicBool(h, 40),
      kontakt_pro_stiznosti: deterministicBool(h, 41),
    },
    obecne: {
      identifikace_kompletni: deterministicChoice(h, 42, ["kompletní", "částečná", "chybí"]),
      srozumitelnost: deterministicChoice(h, 43, ["dobrá", "průměrná", "špatná"]),
      informace_o_uzavreni_smlouvy: deterministicBool(h, 44),
    },
    red_flags: [],
    bonusy: [],
  };

  if (extractedData.odstoupeni.sankce_za_odstoupeni) {
    extractedData.red_flags.push({
      typ: "Sankce za odstoupení",
      zavaznost: "vysoká",
      citace: extractedData.odstoupeni.sankce_za_odstoupeni,
      duvod: "Spotřebitel nesmí být sankcionován za využití zákonného práva na odstoupení od smlouvy.",
      zakonny_standard: "§ 1829 OZ – odstoupení bez sankce",
    });
  }
  if (extractedData.reklamace.neprimerene_podminky) {
    extractedData.red_flags.push({
      typ: "Nepřiměřená podmínka reklamace",
      zavaznost: "střední",
      citace: extractedData.reklamace.neprimerene_podminky,
      duvod: "Podmínka původního obalu omezuje zákonná práva spotřebitele z vadného plnění.",
      zakonny_standard: "§ 2165 OZ – práva z vadného plnění nelze omezovat",
    });
  }
  if (extractedData.platby.skryte_poplatky) {
    extractedData.red_flags.push({
      typ: "Skryté poplatky",
      zavaznost: "střední",
      citace: extractedData.platby.skryte_poplatky,
      duvod: "Příplatky za běžné platební metody nejsou transparentní.",
      zakonny_standard: "§ 1820 OZ – povinnost uvést celkovou cenu",
    });
  }

  if (extractedData.odstoupeni.lhuta_dny != null && extractedData.odstoupeni.lhuta_dny > 14) {
    extractedData.bonusy.push({ typ: "Prodloužená lhůta pro odstoupení", popis: `${extractedData.odstoupeni.lhuta_dny} dní místo zákonných 14` });
  }
  if (deterministicBool(h, 50)) {
    extractedData.bonusy.push({ typ: "Doprava zdarma nad limit", popis: "Doprava zdarma při objednávce nad 1000 Kč" });
  }

  const scoreResult = calculateScore(extractedData);
  const summary = `Obchodní podmínky ${domain} získaly hodnocení ${scoreResult.grade} (${scoreResult.total}/100). ${scoreResult.gradeText}.`;

  return {
    url,
    siteName: domain,
    analyzedAt: new Date().toISOString(),
    extractedData,
    scoreResult,
    summary,
  };
}
