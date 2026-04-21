import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { crawlShopPages } from "./crawler.ts";
import { fetchLegalTexts } from "./legal-fetcher.ts";
import { buildSystemPrompt, buildUserPrompt } from "./prompts.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function respond(data: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const { url, forcedCategory, rawText } = await req.json();
    if (!url && !rawText) {
      return respond({ error: "URL nebo text je povinný", diagnostics: { error_stage: "validation" } });
    }

    // SSRF protection: validate URL before processing
    if (url && !isPublicUrl(url)) {
      return respond({ error: "Neplatná URL adresa.", diagnostics: { error_stage: "validation" } }, 400);
    }

    const API_KEY = Deno.env.get("GEMINI_API_KEY");
    console.log("Using Google Gemini API, key available:", !!API_KEY);
    if (!API_KEY) {
      return respond({ error: "Gemini API klíč není nakonfigurován", diagnostics: { error_stage: "config" } });
    }

    let pages: any = null;
    let crawlDiagnostics: Record<string, unknown> = {};

    if (rawText) {
      // User pasted text directly — skip crawling
      console.log("Using raw text input, length:", rawText.length);
      pages = {
        vop: { url: url || "manual-input", text: rawText.slice(0, 50000) },
        reklamacni_rad: null,
        faq: null,
        privacy: null,
        kontakt: null,
      };
      crawlDiagnostics = { mode: "manual_text", text_length: rawText.length };
    } else {
      // Step 1: Crawl shop pages
      console.log("Crawling:", url);
      pages = await crawlShopPages(url);
      crawlDiagnostics = {
        mode: "crawl",
        requested_url: url,
        vop_found: !!pages.vop,
        vop_url: pages.vop?.url || null,
        processing_time_ms: Date.now() - startTime,
      };

      if (!pages.vop) {
        return respond({
          error: "vop_not_found",
          diagnostics: {
            ...crawlDiagnostics,
            error_stage: "crawl",
            detail: "Nepodařilo se najít stránku s obchodními podmínkami na zadané URL.",
          },
        });
      }
    }

    // Step 2: Fetch legal texts
    console.log("Fetching legal texts...");
    const { legalTexts, success: legalSuccess } = await fetchLegalTexts(forcedCategory);

    // Step 3: Call Gemini API
    console.log("Calling Gemini API...");
    const systemPrompt = buildSystemPrompt(legalTexts);
    const userPrompt = buildUserPrompt(pages, forcedCategory);

    const aiResponse = await callAI(API_KEY, systemPrompt, userPrompt);

    if (!aiResponse) {
      return respond({
        error: "Služba AI je momentálně přetížená. Zkuste to prosím za chvíli.",
        diagnostics: {
          ...crawlDiagnostics,
          error_stage: "ai_call",
          processing_time_ms: Date.now() - startTime,
        },
      });
    }

    // Parse response
    let analysis;
    try {
      analysis = JSON.parse(aiResponse);
    } catch {
      const match = aiResponse.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          analysis = JSON.parse(match[0]);
        } catch {
          console.log("Retrying AI with stricter prompt...");
          const retryResponse = await callAI(
            API_KEY,
            systemPrompt,
            userPrompt + "\n\nDŮLEŽITÉ: Odpověz POUZE validním JSON, bez jakéhokoli dalšího textu.",
          );
          if (retryResponse) {
            try {
              analysis = JSON.parse(retryResponse);
            } catch {
              const retryMatch = retryResponse.match(/\{[\s\S]*\}/);
              if (retryMatch) analysis = JSON.parse(retryMatch[0]);
            }
          }
        }
      }
    }

    if (!analysis) {
      return respond({
        error: "AI vrátila neplatnou odpověď. Zkuste to prosím znovu.",
        diagnostics: {
          ...crawlDiagnostics,
          error_stage: "ai_parse",
          processing_time_ms: Date.now() - startTime,
        },
      });
    }

    // Enrich with metadata
    analysis.url = url || "manual-input";
    analysis.analyzedAt = new Date().toISOString();
    analysis.pravni_texty_stazeny = legalSuccess;

    analysis.zdroje = {
      vop_url: pages.vop?.url || null,
      faq_url: pages.faq?.url || null,
      reklamacni_rad_url: pages.reklamacni_rad?.url || null,
      kontakt_url: pages.kontakt?.url || null,
      privacy_url: pages.privacy?.url || null,
    };

    return respond(analysis);
  } catch (e) {
    console.error("analyze-vop error:", e);
    return respond({
      error: "Interní chyba. Zkuste to prosím znovu.",
      diagnostics: {
        error_stage: "unhandled",
        processing_time_ms: Date.now() - startTime,
      },
    });
  }
});

function isPublicUrl(input: string): boolean {
  try {
    const u = new URL(input.startsWith("http") ? input : `https://${input}`);
    if (!["http:", "https:"].includes(u.protocol)) return false;
    const h = u.hostname.toLowerCase();
    if (
      h === "localhost" ||
      /^127\./.test(h) ||
      /^10\./.test(h) ||
      /^192\.168\./.test(h) ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(h) ||
      /^169\.254\./.test(h) ||
      h.endsWith(".internal") ||
      h.endsWith(".local") ||
      /^\[/.test(h) ||
      h === "0.0.0.0" ||
      h === "[::1]"
    ) return false;
    return true;
  } catch {
    return false;
  }
}

const MODELS = ["gemini-2.5-flash", "gemini-2.5-flash-lite"];

async function callAI(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  modelIndex = 0,
  retryCount = 0,
): Promise<string | null> {
  const model = MODELS[modelIndex] || MODELS[MODELS.length - 1];
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: "user", parts: [{ text: userPrompt }] }],
          generationConfig: {
            temperature: 0,
            maxOutputTokens: 8192,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Gemini API error (${model}):`, response.status, errText);

      if ((response.status === 503 || response.status === 429) && modelIndex < MODELS.length - 1) {
        console.log(`Falling back to ${MODELS[modelIndex + 1]}...`);
        return callAI(apiKey, systemPrompt, userPrompt, modelIndex + 1, 0);
      }

      if (retryCount === 0 && response.status >= 500) {
        await new Promise((r) => setTimeout(r, 2000));
        return callAI(apiKey, systemPrompt, userPrompt, modelIndex, 1);
      }
      return null;
    }

    console.log(`Gemini response OK from model: ${model}`);
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (e) {
    console.error(`Gemini API fetch error (${model}):`, e);
    if (modelIndex < MODELS.length - 1) {
      return callAI(apiKey, systemPrompt, userPrompt, modelIndex + 1, 0);
    }
    if (retryCount === 0) {
      await new Promise((r) => setTimeout(r, 2000));
      return callAI(apiKey, systemPrompt, userPrompt, modelIndex, 1);
    }
    return null;
  }
}
