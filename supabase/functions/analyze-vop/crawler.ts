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
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[\s\S]*?<\/nav>/gi, (match) => match)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 50000);
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

const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";

const FETCH_HEADERS = {
  "User-Agent": BROWSER_UA,
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "cs-CZ,cs;q=0.9,en;q=0.5",
  "Accept-Encoding": "identity",
  "Cache-Control": "no-cache",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
};

// Patterns to find relevant pages
const VOP_PATTERNS = [
  /obchodni[\s-]?podminky/i, /vop/i, /terms/i, /podminky[\s-]?nakupu/i,
  /podminky[\s-]?uzivani/i, /terms[\s-]?of[\s-]?service/i, /obchodni-podminky/i,
  /vseobecne[\s-]?podminky/i, /conditions/i,
];
const REKLAMACE_PATTERNS = [/reklamacni[\s-]?rad/i, /reklamace/i, /complaints/i, /warranty/i];
const FAQ_PATTERNS = [/faq/i, /casto[\s-]?kladene/i, /dotazy/i, /help/i, /napoveda/i];
const PRIVACY_PATTERNS = [/ochrana[\s-]?osobnich/i, /gdpr/i, /privacy/i, /soukromi/i, /zasady[\s-]?ochrany/i];
const KONTAKT_PATTERNS = [/kontakt/i, /contact/i, /o[\s-]?nas/i, /about/i];

// Patterns to detect if a page has meaningful content (not just a JS shell)
const CONTENT_INDICATOR_PATTERNS = [
  /obchodni/i, /podminky/i, /terms/i, /conditions/i, /vop/i,
  /reklamac/i, /vraceni/i, /doprava/i, /platba/i, /kontakt/i,
  /copyright/i, /cookies/i, /privacy/i, /gdpr/i,
];

function looksLikeJsRendered(text: string): boolean {
  if (text.length < 500) return true;
  const hasContentIndicator = CONTENT_INDICATOR_PATTERNS.some(p => p.test(text));
  if (!hasContentIndicator) return true;
  return false;
}

function findLinks(html: string, baseUrl: string): { href: string; text: string }[] {
  const links: { href: string; text: string }[] = [];
  const regex = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const href = match[1];
    const text = match[2].replace(/<[^>]+>/g, "").trim();
    if (href && !href.startsWith("#") && !href.startsWith("javascript:") && !href.startsWith("mailto:")) {
      links.push({ href: resolveUrl(baseUrl, href), text: text || href });
    }
  }
  return links;
}

function matchLink(links: { href: string; text: string }[], patterns: RegExp[]): string | null {
  for (const pattern of patterns) {
    const found = links.find((l) => pattern.test(l.text));
    if (found) return found.href;
  }
  for (const pattern of patterns) {
    const found = links.find((l) => pattern.test(l.href));
    if (found) return found.href;
  }
  return null;
}

async function fetchViaScraperApi(url: string): Promise<string | null> {
  const scraperApiKey = Deno.env.get("SCRAPER_API_KEY");
  if (!scraperApiKey) return null;
  try {
    console.log("Trying ScraperAPI for:", url);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    const response = await fetch(
      `http://api.scraperapi.com?api_key=${scraperApiKey}&url=${encodeURIComponent(url)}&render=true`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);
    if (!response.ok) {
      console.warn(`ScraperAPI failed: ${url} -> ${response.status}`);
      return null;
    }
    const html = await response.text();
    const text = stripHtml(html);
    if (text.length < 100) return null;
    return text;
  } catch (e) {
    console.warn("ScraperAPI error:", url, e);
    return null;
  }
}

async function fetchViaJina(url: string): Promise<string | null> {
  try {
    console.log("Falling back to Jina Reader for:", url);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    const response = await fetch(`https://r.jina.ai/${url}`, {
      headers: { Accept: "text/plain" },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!response.ok) {
      console.warn(`Jina fetch failed: ${url} -> ${response.status}`);
      return null;
    }
    const text = await response.text();
    if (text.length < 100) return null;
    return text.slice(0, 50000);
  } catch (e) {
    console.warn("Jina fetch error:", url, e);
    return null;
  }
}

async function fetchPage(url: string): Promise<CrawledPage | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const response = await fetch(url, {
      headers: FETCH_HEADERS,
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(timeout);

    if (!response.ok) {
      console.warn(`Page fetch failed: ${url} -> ${response.status}`);
      // Try Jina as fallback for failed fetches
      const jinaText = await fetchViaJina(url);
      if (jinaText) return { url, text: jinaText };
      return null;
    }
    const html = await response.text();
    const text = stripHtml(html);

    // Check if the page looks JS-rendered (thin content)
    if (looksLikeJsRendered(text)) {
      console.log("Page appears JS-rendered, trying Jina:", url);
      const jinaText = await fetchViaJina(url);
      if (jinaText && jinaText.length > text.length) {
        return { url, text: jinaText };
      }
    }

    if (text.length < 100) {
      // Last resort: try Jina
      const jinaText = await fetchViaJina(url);
      if (jinaText) return { url, text: jinaText };
      return null;
    }
    return { url, text };
  } catch (e) {
    console.warn(`Page fetch error: ${url}`, e);
    // Try Jina as fallback for network errors
    const jinaText = await fetchViaJina(url);
    if (jinaText) return { url, text: jinaText };
    return null;
  }
}

async function fetchHomepage(url: string): Promise<{ html: string; text: string } | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    const response = await fetch(url, {
      headers: FETCH_HEADERS,
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(timeout);
    if (!response.ok) return null;
    const html = await response.text();
    const text = stripHtml(html);
    return { html, text };
  } catch {
    return null;
  }
}

export async function crawlShopPages(inputUrl: string): Promise<CrawlResult> {
  const baseUrl = extractBaseUrl(inputUrl);
  const normalizedUrl = inputUrl.startsWith("http") ? inputUrl : `https://${inputUrl}`;
  const result: CrawlResult = {
    vop: null,
    reklamacni_rad: null,
    faq: null,
    privacy: null,
    kontakt: null,
  };

  // Fetch homepage (direct fetch first, then Jina fallback)
  let homepageData = await fetchHomepage(normalizedUrl);

  // If direct fetch failed or looks JS-rendered, try Jina for homepage
  if (!homepageData || looksLikeJsRendered(homepageData.text)) {
    console.log("Homepage appears JS-rendered or failed, trying Jina Reader...");
    const jinaText = await fetchViaJina(normalizedUrl);
    if (jinaText && jinaText.length > (homepageData?.text?.length || 0)) {
      // Jina returns plain text, we can still try to find links in it (markdown-style)
      // But we also need the original HTML for link discovery if available
      if (!homepageData) {
        // No HTML at all — try common VOP URLs directly
        const commonVopUrls = [
          `${baseUrl}/obchodni-podminky`,
          `${baseUrl}/vseobecne-obchodni-podminky`,
          `${baseUrl}/terms`,
          `${baseUrl}/podminky`,
          `${baseUrl}/terms-and-conditions`,
        ];
        for (const vopUrl of commonVopUrls) {
          const page = await fetchPage(vopUrl);
          if (page) {
            result.vop = page;
            break;
          }
        }
        return result;
      }
    }
  }

  if (!homepageData) {
    // Complete failure — try common URLs
    const commonVopUrls = [
      `${baseUrl}/obchodni-podminky`,
      `${baseUrl}/vseobecne-obchodni-podminky`,
      `${baseUrl}/terms`,
      `${baseUrl}/podminky`,
      `${baseUrl}/terms-and-conditions`,
    ];
    for (const vopUrl of commonVopUrls) {
      const page = await fetchPage(vopUrl);
      if (page) {
        result.vop = page;
        break;
      }
    }
    return result;
  }

  const links = findLinks(homepageData.html, baseUrl);

  // Find relevant page URLs
  const vopUrl = matchLink(links, VOP_PATTERNS);
  const reklamaceUrl = matchLink(links, REKLAMACE_PATTERNS);
  const faqUrl = matchLink(links, FAQ_PATTERNS);
  const privacyUrl = matchLink(links, PRIVACY_PATTERNS);
  const kontaktUrl = matchLink(links, KONTAKT_PATTERNS);

  console.log("Found links:", { vop: vopUrl, reklamace: reklamaceUrl, faq: faqUrl, privacy: privacyUrl, kontakt: kontaktUrl });

  // Fetch all found pages in parallel (each with built-in Jina fallback)
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

  // If VOP not found via links, try common URL patterns
  if (!result.vop) {
    const commonVopUrls = [
      `${baseUrl}/obchodni-podminky`,
      `${baseUrl}/obchodni-podminky.htm`,
      `${baseUrl}/obchodni-podminky.html`,
      `${baseUrl}/vseobecne-obchodni-podminky`,
      `${baseUrl}/vseobecne-obchodni-podminky.htm`,
      `${baseUrl}/terms`,
      `${baseUrl}/podminky`,
      `${baseUrl}/terms-and-conditions`,
      `${baseUrl}/vseobecne-obchodni-podminky/`,
      `${baseUrl}/pages/obchodni-podminky`,
      `${baseUrl}/info/obchodni-podminky`,
      `${baseUrl}/clanky/obchodni-podminky`,
      `${baseUrl}/stranky/obchodni-podminky`,
    ];
    for (const url of commonVopUrls) {
      const page = await fetchPage(url);
      if (page) {
        result.vop = page;
        break;
      }
    }
  }

  return result;
}
