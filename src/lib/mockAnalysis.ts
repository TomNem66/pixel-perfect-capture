import { AnalysisResult } from "@/types/analysis";

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

export function generateMockAnalysis(url: string): AnalysisResult {
  const domain = extractDomain(url);
  const h = hashCode(domain);

  const isMarketplace = dChoice(h, 50, ["přímý prodejce", "přímý prodejce", "zprostředkovatel", "neuvedeno"] as const);
  const zeme = dChoice(h, 51, ["ČR", "ČR", "EU", "mimo EU"] as const);
  const lhutaDny = dBool(h, 5) ? 14 : dBool(h, 6) ? 30 : null;
  const kdoPlatí = dChoice(h, 9, ["zákazník", "e-shop", "neuvedeno"] as const);
  const sankce = dBool(h, 12) ? null : "Poplatek 200 Kč za zpracování vrácení";
  const reklamaceZahranici = zeme === "mimo EU" || dChoice(h, 60, [false, false, true]);
  const dodaciLhuta = dBool(h, 34) ? 5 : dBool(h, 35) ? 45 : null;
  const sankceNevyzvedni = dBool(h, 70) ? null : "Smluvní pokuta 500 Kč za nevyzvednutí dobírky";
  const metody = dBool(h, 29)
    ? ["platební karta", "bankovní převod", "dobírka", "Apple Pay"]
    : ["platební karta", "bankovní převod"];
  const maDobirku = metody.includes("dobírka");

  const result: AnalysisResult = {
    url,
    siteName: domain,
    analyzedAt: new Date().toISOString(),

    prodejce: {
      nazev: domain,
      ico: dBool(h, 1) ? "12345678" : null,
      sidlo: dBool(h, 2) ? "Praha 1, Hlavní 123" : null,
      zeme,
      typ: isMarketplace,
      zapis_or: dBool(h, 3) ? "C 12345, Městský soud v Praze" : null,
    },

    vraceni: {
      lhuta_dny: lhutaDny,
      kdo_plati_postovne: kdoPlatí,
      vyjimky: dBool(h, 13) ? ["hygienické zboží", "software po otevření", "zboží na míru"] : [],
      sankce,
      lhuta_vraceni_penez_dny: dBool(h, 10) ? 14 : dBool(h, 11) ? 30 : null,
    },

    reklamace: {
      zarucni_doba_mesice: dBool(h, 14) ? 24 : dBool(h, 15) ? 12 : null,
      adresa_reklamace: dBool(h, 21) ? "Reklamační oddělení, Skladová 45, Praha 5" : null,
      reklamace_v_zahranici: reklamaceZahranici,
      sberne_misto_cr: reklamaceZahranici ? dBool(h, 61) : null,
      hradi_dopravu_vadneho: dBool(h, 62) ? true : dBool(h, 63) ? false : null,
      lhuta_vyrizeni_dny: dBool(h, 17) ? 30 : dBool(h, 18) ? 45 : null,
      lhuta_vraceni_penez_dny: dBool(h, 64) ? 14 : null,
    },

    platby: {
      metody,
      ma_dobirku: maDobirku,
      skryte_poplatky: dBool(h, 31) ? ["příplatek za platbu kartou 2%", "balné 29 Kč"] : [],
      sankce_nevyzvedni: sankceNevyzvedni,
      ceny_vcetne_dph: dBool(h, 30) ? true : dBool(h, 65) ? false : null,
    },

    doprava: {
      dodaci_lhuta_dny: dodaciLhuta,
      dodaci_lhuta_text: dodaciLhuta ? `Zboží expedujeme do ${dodaciLhuta} pracovních dní` : null,
      zpusoby: dBool(h, 36) ? ["Zásilkovna", "PPL", "Česká pošta"] : ["PPL"],
      odpovednost_poskozeni: dBool(h, 37) ? "Riziko přechází na kupujícího převzetím zásilky" : null,
      sledovani_zasilky: dBool(h, 66) ? true : dBool(h, 67) ? false : null,
    },

    varovani: [],
    bonusy: [],
  };

  // Auto-generate warnings
  if (zeme !== "ČR" && zeme !== "EU") {
    result.varovani.push({ kategorie: "Prodejce", text: "Prodejce sídlí mimo EU – vaše spotřebitelská práva mohou být obtížně vymahatelná", zavaznost: "kritické" });
  }
  if (isMarketplace === "zprostředkovatel") {
    result.varovani.push({ kategorie: "Prodejce", text: "Tento e-shop je zprostředkovatel (marketplace/dropshipping). Reklamace a vrácení zboží řešíte přímo s dodavatelem, kterým může být zahraniční firma.", zavaznost: "pozor" });
  }
  if (dodaciLhuta && dodaciLhuta > 30) {
    result.varovani.push({ kategorie: "Doprava", text: `Dodací lhůta až ${dodaciLhuta} dní – typické pro dropshipping`, zavaznost: "pozor" });
  }
  if (sankceNevyzvedni) {
    result.varovani.push({ kategorie: "Platby", text: `E-shop účtuje pokutu za nevyzvednutí dobírky: ${sankceNevyzvedni}`, zavaznost: "pozor" });
  }
  if (reklamaceZahranici) {
    result.varovani.push({ kategorie: "Reklamace", text: "Reklamace se zasílá do zahraničí", zavaznost: "pozor" });
  }
  if (sankce) {
    result.varovani.push({ kategorie: "Vrácení", text: `E-shop účtuje sankci za vrácení zboží: ${sankce}`, zavaznost: "kritické" });
  }
  if (result.platby.skryte_poplatky.length > 0) {
    result.varovani.push({ kategorie: "Platby", text: `Skryté poplatky: ${result.platby.skryte_poplatky.join(", ")}`, zavaznost: "pozor" });
  }

  // Auto-generate bonuses
  if (lhutaDny && lhutaDny > 14) {
    result.bonusy.push({ kategorie: "Vrácení", text: `Prodloužená lhůta na vrácení – ${lhutaDny} dní místo zákonných 14` });
  }
  if (kdoPlatí === "e-shop") {
    result.bonusy.push({ kategorie: "Vrácení", text: "Poštovné při vrácení hradí e-shop" });
  }
  if (result.reklamace.hradi_dopravu_vadneho === true) {
    result.bonusy.push({ kategorie: "Reklamace", text: "E-shop hradí dopravu vadného zboží" });
  }

  return result;
}
