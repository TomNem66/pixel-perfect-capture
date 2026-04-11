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
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI API key není nakonfigurován", fallback: true }), {
        status: 200,
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

    // Step 3: Call AI
    console.log("Calling AI Gateway...");
    const systemPrompt = buildSystemPrompt(legalTexts);
    const userPrompt = buildUserPrompt(pages, forcedCategory);

    const aiResponse = await callAI(LOVABLE_API_KEY, systemPrompt, userPrompt);

    if (!aiResponse) {
      return new Response(JSON.stringify({ error: "ai_error", fallback: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
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
            LOVABLE_API_KEY,
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
      return new Response(JSON.stringify({ error: "ai_invalid_json", fallback: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Enrich with metadata
    analysis.url = url;
    analysis.analyzedAt = new Date().toISOString();
    analysis.pravni_texty_stazeny = legalSuccess;

    analysis.zdroje = {
      vop_url: pages.vop?.url || null,
      faq_url: pages.faq?.url || null,
      reklamacni_rad_url: pages.reklamacni_rad?.url || null,
      kontakt_url: pages.kontakt?.url || null,
      privacy_url: pages.privacy?.url || null,
    };

    return new Response(JSON.stringify(analysis), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-vop error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Neznámá chyba", fallback: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function callAI(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  retryCount = 0
): Promise<string | null> {
  try {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0,
        max_tokens: 8192,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI Gateway error:", response.status, errText);
      if (retryCount === 0 && response.status !== 402) {
        await new Promise((r) => setTimeout(r, 2000));
        return callAI(apiKey, systemPrompt, userPrompt, 1);
      }
      return null;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (e) {
    console.error("AI Gateway fetch error:", e);
    if (retryCount === 0) {
      await new Promise((r) => setTimeout(r, 2000));
      return callAI(apiKey, systemPrompt, userPrompt, 1);
    }
    return null;
  }
}
