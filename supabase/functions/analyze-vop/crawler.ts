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

function stripHtml(html: string): string {
  // Remove scripts, styles, and HTML tags
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 50000); // Limit text size
}

function extractBaseUrl(url: string): string {
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    return `${u.protocol}//${u.hostname}`;
  } catch {
    return `https://${url}`;
  }
}

function resolveUrl(base: string, href: string): string {
  try {
    return new URL(href, base).href;
  } catch {
    return href;
  }
}

// Patterns to find relevant pages in navigation/footer
const VOP_PATTERNS = [
  /obchodni.podminky/i, /vop/i, /terms/i, /podminky.nakupu/i,
  /podminky.uzivani/i, /terms.of.service/i, /obchodni-podminky/i,
];
const REKLAMACE_PATTERNS = [/reklamacni.rad/i, /reklamace/i, /complaints/i];
const FAQ_PATTERNS = [/faq/i, /casto.kladene/i, /dotazy/i, /help/i, /napoveda/i];
const PRIVACY_PATTERNS = [/ochrana.osobnich/i, /gdpr/i, /privacy/i, /soukromi/i, /zasady.ochrany/i];
const KONTAKT_PATTERNS = [/kontakt/i, /contact/i, /o.nas/i, /about/i];

function findLinks(html: string, baseUrl: string): { href: string; text: string }[] {
  const links: { href: string; text: string }[] = [];
  const regex = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const href = match[1];
    const text = match[2].replace(/<[^>]+>/g, "").trim();
    if (href && text && !href.startsWith("#") && !href.startsWith("javascript:") && !href.startsWith("mailto:")) {
      links.push({ href: resolveUrl(baseUrl, href), text });
    }
  }
  return links;
}

function matchLink(links: { href: string; text: string }[], patterns: RegExp[]): string | null {
  for (const pattern of patterns) {
    const found = links.find((l) => pattern.test(l.text) || pattern.test(l.href));
    if (found) return found.href;
  }
  return null;
}

async function fetchPage(url: string): Promise<CrawledPage | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; VOPatrne/1.0; +https://vopatrne.cz)",
        Accept: "text/html",
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) return null;
    const html = await response.text();
    return { url, text: stripHtml(html) };
  } catch {
    return null;
  }
}

export async function crawlShopPages(inputUrl: string): Promise<CrawlResult> {
  const baseUrl = extractBaseUrl(inputUrl);
  const result: CrawlResult = {
    vop: null,
    reklamacni_rad: null,
    faq: null,
    privacy: null,
    kontakt: null,
  };

  // Fetch homepage to discover links
  let homepageHtml: string;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const response = await fetch(baseUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; VOPatrne/1.0; +https://vopatrne.cz)",
        Accept: "text/html",
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    homepageHtml = await response.text();
  } catch (e) {
    console.error("Failed to fetch homepage:", e);
    // Try common VOP URL patterns directly
    const commonVopUrls = [
      `${baseUrl}/obchodni-podminky`,
      `${baseUrl}/vseobecne-obchodni-podminky`,
      `${baseUrl}/terms`,
      `${baseUrl}/podminky`,
    ];
    for (const vopUrl of commonVopUrls) {
      const page = await fetchPage(vopUrl);
      if (page && page.text.length > 200) {
        result.vop = page;
        break;
      }
    }
    return result;
  }

  const links = findLinks(homepageHtml, baseUrl);

  // Find relevant page URLs
  const vopUrl = matchLink(links, VOP_PATTERNS);
  const reklamaceUrl = matchLink(links, REKLAMACE_PATTERNS);
  const faqUrl = matchLink(links, FAQ_PATTERNS);
  const privacyUrl = matchLink(links, PRIVACY_PATTERNS);
  const kontaktUrl = matchLink(links, KONTAKT_PATTERNS);

  // Fetch all found pages in parallel
  const [vop, reklamacni_rad, faq, privacy, kontakt] = await Promise.all([
    vopUrl ? fetchPage(vopUrl) : Promise.resolve(null),
    reklamaceUrl ? fetchPage(reklamaceUrl) : Promise.resolve(null),
    faqUrl ? fetchPage(faqUrl) : Promise.resolve(null),
    privacyUrl ? fetchPage(privacyUrl) : Promise.resolve(null),
    kontaktUrl ? fetchPage(kontaktUrl) : Promise.resolve(null),
  ]);

  result.vop = vop;
  result.reklamacni_rad = reklamacni_rad;
  result.faq = faq;
  result.privacy = privacy;
  result.kontakt = kontakt;

  // If VOP not found, try common URLs
  if (!result.vop) {
    const commonVopUrls = [
      `${baseUrl}/obchodni-podminky`,
      `${baseUrl}/vseobecne-obchodni-podminky`,
      `${baseUrl}/terms`,
      `${baseUrl}/podminky`,
    ];
    for (const url of commonVopUrls) {
      const page = await fetchPage(url);
      if (page && page.text.length > 200) {
        result.vop = page;
        break;
      }
    }
  }

  return result;
}
