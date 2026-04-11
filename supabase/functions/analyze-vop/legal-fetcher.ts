// Legal text sources from e-Sbírka
const LEGAL_SOURCES: Record<string, Array<{ id: string; url: string; section: string; label: string }>> = {
  core: [
    { id: "oz_1810_1867", url: "https://e-sbirka.gov.cz/sb/2012/89", section: "§ 1810–1867", label: "OZ — spotřebitelské smlouvy" },
    { id: "oz_2099_2174", url: "https://e-sbirka.gov.cz/sb/2012/89", section: "§ 2099–2174", label: "OZ — koupě, práva z vadného plnění" },
    { id: "zos", url: "https://e-sbirka.gov.cz/sb/2023/634", section: "celý zákon", label: "Zákon o ochraně spotřebitele" },
  ],
  predplatne: [
    { id: "zds", url: "https://e-sbirka.gov.cz/sb/2022/242", section: "celý zákon", label: "ZDS — digitální obsah a služby" },
  ],
  digitalni_produkt: [
    { id: "zds", url: "https://e-sbirka.gov.cz/sb/2022/242", section: "celý zákon", label: "ZDS — digitální obsah a služby" },
  ],
  cestovani: [
    { id: "cesr", url: "https://e-sbirka.gov.cz/sb/1999/159", section: "celý zákon, zejména § 6", label: "CesR — cestovní ruch" },
  ],
  lekarny: [
    { id: "zol", url: "https://e-sbirka.gov.cz/sb/2007/378", section: "celý zákon", label: "ZoL — léčiva" },
  ],
  jidlo_rozvoz: [
    { id: "zop", url: "https://e-sbirka.gov.cz/sb/1997/110", section: "celý zákon", label: "ZoP — potraviny" },
  ],
  doprava_jizdenky: [],
};

// Simple in-memory cache with TTL
const cache = new Map<string, { text: string; fetchedAt: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 100000); // Allow larger legal texts
}

async function fetchLegalText(url: string): Promise<string | null> {
  // Check cache
  const cached = cache.get(url);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
    return cached.text;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; VOPatrne/1.0)",
        Accept: "text/html",
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      console.warn(`Legal fetch failed: ${url} -> ${response.status}`);
      return null;
    }

    const html = await response.text();
    const text = stripHtml(html);

    // Cache result
    cache.set(url, { text, fetchedAt: Date.now() });

    return text;
  } catch (e) {
    console.warn(`Legal fetch error: ${url}`, e);
    return null;
  }
}

export async function fetchLegalTexts(
  category?: string
): Promise<{ legalTexts: string; success: boolean }> {
  const sources = [...LEGAL_SOURCES.core];

  if (category && LEGAL_SOURCES[category]) {
    sources.push(...LEGAL_SOURCES[category]);
  }

  // Deduplicate by URL
  const uniqueSources = sources.filter(
    (s, i, arr) => arr.findIndex((x) => x.url === s.url) === i
  );

  const results = await Promise.all(
    uniqueSources.map(async (source) => {
      const text = await fetchLegalText(source.url);
      return { ...source, text };
    })
  );

  const successful = results.filter((r) => r.text);
  const failed = results.filter((r) => !r.text);

  if (failed.length > 0) {
    console.warn(`Failed to fetch ${failed.length} legal sources:`, failed.map((f) => f.label));
  }

  let legalTexts = "";
  for (const r of successful) {
    // Truncate each legal text to ~15000 chars to stay within token limits
    const truncated = r.text!.slice(0, 15000);
    legalTexts += `\n\n=== ${r.label} (${r.section}) ===\n${truncated}\n`;
  }

  // Add EU regulation notes for transport
  if (category === "doprava_jizdenky") {
    legalTexts += `\n\n=== EU nařízení o právech cestujících (textová zmínka) ===
Pro kategorii doprava/jízdenky jsou relevantní tato EU nařízení o právech cestujících:
- Nařízení (ES) č. 261/2004 — letecká doprava (kompenzace za zpoždění/zrušení)
- Nařízení (EU) č. 1371/2007 — železniční doprava
- Nařízení (EU) č. 181/2011 — autobusová doprava
Ověř, zda VOP na tato nařízení odkazují.\n`;
  }

  return {
    legalTexts: legalTexts || "Právní texty se nepodařilo stáhnout.",
    success: successful.length > 0,
  };
}
