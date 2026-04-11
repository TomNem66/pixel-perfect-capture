import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { crawlShopPages } from "./crawler.ts";
import { fetchLegalTexts } from "./legal-fetcher.ts";
import { buildSystemPrompt, buildUserPrompt } from "./prompts.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, forcedCategory } = await req.json();
    if (!url) {
      return new Response(JSON.stringify({ error: "URL je povinné" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) {
      return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY není nakonfigurován" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Step 1: Crawl shop pages
    console.log("Crawling:", url);
    const pages = await crawlShopPages(url);

    if (!pages.vop) {
      return new Response(JSON.stringify({ error: "vop_not_found" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Step 2: Fetch legal texts
    console.log("Fetching legal texts...");
    const { legalTexts, success: legalSuccess } = await fetchLegalTexts(forcedCategory);

    // Step 3: Call Claude API
    console.log("Calling Claude API...");
    const systemPrompt = buildSystemPrompt(legalTexts);
    const userPrompt = buildUserPrompt(pages, forcedCategory);

    const claudeResponse = await callClaude(ANTHROPIC_API_KEY, systemPrompt, userPrompt);

    if (!claudeResponse) {
      return new Response(JSON.stringify({ error: "ai_error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse response
    let analysis;
    try {
      analysis = JSON.parse(claudeResponse);
    } catch {
      // Try to extract JSON from response
      const match = claudeResponse.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          analysis = JSON.parse(match[0]);
        } catch {
          // Retry once
          console.log("Retrying Claude with stricter prompt...");
          const retryResponse = await callClaude(
            ANTHROPIC_API_KEY,
            systemPrompt,
            userPrompt + "\n\nDŮLEŽITÉ: Odpověz POUZE validním JSON, bez jakéhokoli dalšího textu."
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
      return new Response(JSON.stringify({ error: "ai_invalid_json" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Enrich with metadata
    analysis.url = url;
    analysis.analyzedAt = new Date().toISOString();
    analysis.pravni_texty_stazeny = legalSuccess;

    // Set zdroje from crawled pages
    analysis.zdroje = {
      vop_url: pages.vop?.url || null,
      faq_url: pages.faq?.url || null,
      reklamacni_rad_url: pages.reklamacni_rad?.url || null,
      kontakt_url: pages.kontakt?.url || null,
      privacy_url: pages.privacy?.url || null,
    };

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-vop error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Neznámá chyba" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function callClaude(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  retryCount = 0
): Promise<string | null> {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "content-type": "application/json",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 8192,
        temperature: 0,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Claude API error:", response.status, errText);
      if (retryCount === 0) {
        await new Promise((r) => setTimeout(r, 2000));
        return callClaude(apiKey, systemPrompt, userPrompt, 1);
      }
      return null;
    }

    const data = await response.json();
    return data.content?.[0]?.text || null;
  } catch (e) {
    console.error("Claude API fetch error:", e);
    if (retryCount === 0) {
      await new Promise((r) => setTimeout(r, 2000));
      return callClaude(apiKey, systemPrompt, userPrompt, 1);
    }
    return null;
  }
}
