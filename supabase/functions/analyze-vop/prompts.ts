interface CrawledPage {
  url: string;
  text: string;
}

interface CrawlResult {
  vop: CrawledPage | null;
  reklamacni_rad: CrawledPage | null;
  faq: CrawledPage | null;
  privacy: CrawledPage | null;
  kontakt: CrawledPage | null;
}

export function buildSystemPrompt(legalTexts: string): string {
  return `Jsi analytický systém pro extrakci faktů z obchodních podmínek českých e-shopů.
Analyzuješ dokumenty z pohledu ochrany spotřebitele dle českého práva.

AKTUÁLNÍ ZNĚNÍ RELEVANTNÍCH ZÁKONŮ:
${legalTexts}

KRITICKÁ PRAVIDLA EXTRAKCE:
1. Extrahuj POUZE fakta explicitně uvedená v dodaných textech.
2. Nikdy nevyvozuj ani nepředpokládej typické praktiky e-shopů.
3. Ke každému extrahovanému faktu přidej pole "_citace" — doslovný výtah ze zdrojového textu max 200 znaků. Pokud citaci nelze doložit, nastav null.
4. null = informace v textu není. false = informace explicitně říká ne/není.
5. Surcharge za platební metodu uváděj POUZE pokud je v textu explicitní číslo.
6. Výjimky z vrácení uváděj POUZE pokud jsou v textu explicitně vyjmenovány.
7. IČO, sídlo, zápis v OR — extrahuj POUZE pokud jsou přímo v analyzovaných textech.

SPECIFIKA DLE KATEGORIE:
- marketplace: zaměř se na to, kdo nese odpovědnost (platforma vs. prodejce)
- vstupenky: § 1837 j) OZ — ověř zda VOP správně aplikuje výjimku pro konkrétní datum
- cestovani: ověř zda má pojištění pro případ insolvence (zákon 159/1999 § 6)
- lekarny: ověř zda VOP uvádí registraci u SÚKL a výjimku z vrácení léčiv
- jidlo_rozvoz: ověř informace o alergenech a kdo odpovídá za kvalitu
- predplatne/digitalni_produkt: ověř správnou aplikaci § 1837 l) OZ pro digitální obsah
- doprava_jizdenky: ověř zda VOP odkazuje na práva cestujících dle EU nařízení

FORMÁT CITACÍ:
Ke KAŽDÉ sekci (vraceni, reklamace, platby, doprava, a category-specific sekce) přidej objekt "_citace".
Klíče v _citace odpovídají klíčům v sekci. Hodnota je doslovný výtah z VOP (max 200 znaků) nebo null.

Příklad:
{
  "vraceni": {
    "lhuta_dny": 14,
    "kdo_plati_postovne": "zákazník",
    "_citace": {
      "lhuta_dny": "Spotřebitel má právo odstoupit od smlouvy ve lhůtě 14 dnů ode dne převzetí zboží.",
      "kdo_plati_postovne": "Náklady spojené s vrácením zboží nese spotřebitel."
    }
  }
}

GENEROVÁNÍ VAROVÁNÍ:
Na základě extrahovaných faktů generuj pole "varovani" s automatickými varováními:
- zeme mimo "ČR" a "EU" → zavaznost "kritické", text "Prodejce sídlí mimo EU"
- typ === "zprostředkovatel" → zavaznost "pozor", text o marketplace
- dodaci_lhuta_dny > 30 → zavaznost "pozor", text o dlouhé dodací lhůtě
- sankce_nevyzvedni !== null → zavaznost "pozor", text o pokutě
- reklamace_v_zahranici === true → zavaznost "pozor", text o zahraniční reklamaci

GENEROVÁNÍ BONUSŮ:
- lhuta_dny > 14 → bonus "Prodloužená lhůta na vrácení"
- kdo_plati_postovne === "e-shop" → bonus "Poštovné při vrácení hradí e-shop"

TRUST RATING:
Na základě varování urči trustRating:
- "riziko" pokud existuje jakékoliv kritické varování
- "obezretni" pokud existují 2+ varování typu "pozor"
- "ok" jinak

Odpovídej VÝHRADNĚ validním JSON objektem bez jakéhokoliv textu před ani za ním.`;
}

export function buildUserPrompt(pages: CrawlResult, forcedCategory?: string): string {
  let prompt = "Analyzuj následující dokumenty e-shopu a extrahuj fakta do JSON formátu.\n\n";

  if (forcedCategory) {
    prompt += `Kategorie e-shopu je "${forcedCategory}". Extrahuj fakta s ohledem na tuto kategorii.\n\n`;
  } else {
    prompt += `Nejprve urči kategorii e-shopu (eshop_zbozi, marketplace, predplatne, vstupenky, cestovani, jidlo_rozvoz, doprava_jizdenky, digitalni_produkt, lekarny).\n\n`;
  }

  if (pages.vop) {
    prompt += `=== OBCHODNÍ PODMÍNKY (VOP) ===\nURL: ${pages.vop.url}\n${pages.vop.text.slice(0, 30000)}\n\n`;
  }
  if (pages.reklamacni_rad) {
    prompt += `=== REKLAMAČNÍ ŘÁD ===\nURL: ${pages.reklamacni_rad.url}\n${pages.reklamacni_rad.text.slice(0, 15000)}\n\n`;
  }
  if (pages.faq) {
    prompt += `=== FAQ / ČASTÉ DOTAZY ===\nURL: ${pages.faq.url}\n${pages.faq.text.slice(0, 15000)}\n\n`;
  }
  if (pages.privacy) {
    prompt += `=== OCHRANA OSOBNÍCH ÚDAJŮ ===\nURL: ${pages.privacy.url}\n${pages.privacy.text.slice(0, 10000)}\n\n`;
  }
  if (pages.kontakt) {
    prompt += `=== KONTAKT / O NÁS ===\nURL: ${pages.kontakt.url}\n${pages.kontakt.text.slice(0, 5000)}\n\n`;
  }

  prompt += `

Vrať JSON s touto strukturou:
{
  "siteName": "název e-shopu",
  "kategorie": "jedna z 9 kategorií",
  "kategorie_label": "český název kategorie",
  "kategorie_confidence": 0.0-1.0,
  "kategorie_duvod": "krátké zdůvodnění max 80 znaků",
  "trustRating": "ok" | "obezretni" | "riziko",

  "prodejce": {
    "nazev": string | null,
    "ico": string | null,
    "sidlo": string | null,
    "zeme": "ČR" | "EU" | "mimo EU" | null,
    "typ": "přímý prodejce" | "zprostředkovatel" | "neuvedeno",
    "zapis_or": string | null,
    "_citace": { ... }
  },

  "pravni_odkazy": [
    { "paragraf": "§ XXXX", "zakon": "zákon č. XX/XXXX Sb.", "url_esbirka": "https://e-sbirka.gov.cz/...", "kontext": "popis" }
  ],

  "nesoulady": [ { "tema": string, "vop_rika": string, "faq_rika": string } ] | null,

  "varovani": [ { "kategorie": string, "text": string, "zavaznost": "info" | "pozor" | "kritické" } ],
  "bonusy": [ { "kategorie": string, "text": string } ],

  // Sekce dle kategorie (pouze relevantní):
  "vraceni": { "lhuta_dny": number|null, "kdo_plati_postovne": "zákazník"|"e-shop"|"neuvedeno", "vyjimky": string[], "sankce": string|null, "lhuta_vraceni_penez_dny": number|null, "_citace": {...} } | undefined,
  "reklamace": { "zarucni_doba_mesice": number|null, "adresa_reklamace": string|null, "reklamace_v_zahranici": boolean, "sberne_misto_cr": boolean|null, "hradi_dopravu_vadneho": boolean|null, "lhuta_vyrizeni_dny": number|null, "lhuta_vraceni_penez_dny": number|null, "_citace": {...} } | undefined,
  "platby": { "metody": string[], "ma_dobirku": boolean, "skryte_poplatky": string[], "sankce_nevyzvedni": string|null, "ceny_vcetne_dph": boolean|null, "_citace": {...} } | undefined,
  "doprava": { "dodaci_lhuta_dny": number|null, "dodaci_lhuta_text": string|null, "zpusoby": string[], "odpovednost_poskozeni": string|null, "sledovani_zasilky": boolean|null, "_citace": {...} } | undefined,
  "storno": { "lze_stornovat": boolean|null, "lhuta_bezplatneho_storna": string|null, "poplatek_za_storno": string|null, "nevratna_rezervace": boolean|null, "castecne_storno": boolean|null, "_citace": {...} } | undefined,
  "predplatne_info": { "cena": string|null, "fakturacni_cyklus": string|null, "automaticke_obnoveni": boolean|null, "jak_zrusit": string|null, "vypovedni_lhuta": string|null, "vraci_pomernou_cast": boolean|null, "zkusebni_doba": string|null, "trial_automaticky_placeny": boolean|null, "zmena_ceny_predstih": string|null, "_citace": {...} } | undefined,
  "ochrana_kupujiciho": { "program_ochrany": string|null, "podminky_ochrany": string|null, "reseni_sporu": string|null, "_citace": {...} } | undefined,
  "licence_digital": { "vlastnictvi_vs_licence": string|null, "prenositelnost": boolean|null, "drm": string|null, "offline_pristup": boolean|null, "regionalni_omezeni": string|null, "_citace": {...} } | undefined,
  "akce_zruseni": { "vraceni_pri_zruseni": string|null, "vraceni_pri_presunuti": string|null, "lhuta_vraceni": string|null, "voucher_misto_penez": boolean|null, "prevod_na_jinou_osobu": boolean|null, "preprodej": boolean|null, "_citace": {...} } | undefined,
  "pojisteni": { "storno_pojisteni": boolean|null, "co_pokryva": string|null, "cena": string|null, "_citace": {...} } | undefined,
  "jidlo_kvalita": { "kdo_odpovida": string|null, "lhuta_reklamace": string|null, "alergeny_info": boolean|null, "minimalni_objednavka": string|null, "kompenzace_zpozdeni": string|null, "_citace": {...} } | undefined,
  "lekarna_info": { "licence_sukl": boolean|null, "vraceni_leciv_vyjimka": boolean|null, "konzultace_lekarnik": boolean|null, "teplotni_retezec": string|null, "_citace": {...} } | undefined
}`;

  return prompt;
}
