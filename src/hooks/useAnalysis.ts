import { useState, useCallback } from "react";
import { AnalysisResult, ShopCategory } from "@/types/analysis";
import { generateMockAnalysis } from "@/lib/mockAnalysis";
import { addToHistory } from "@/lib/history";
import { supabase } from "@/integrations/supabase/client";

type Step = "idle" | "fetching" | "parsing" | "analyzing" | "processing" | "done" | "error";

export function useAnalysis() {
  const [step, setStep] = useState<Step>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const analyze = useCallback(async (url: string, forcedCategory?: ShopCategory) => {
    setError(null);
    setResult(null);

    try {
      setStep("fetching");

      // Try the real edge function first
      try {
        const { data, error: fnError } = await supabase.functions.invoke("analyze-vop", {
          body: { url, forcedCategory },
        });

        if (fnError) throw fnError;
        if (data?.error) {
          if (data.error === "vop_not_found") throw new Error("vop_not_found");
          throw new Error(data.error);
        }

        // Show progress steps while waiting
        setStep("parsing");
        await delay(300);
        setStep("analyzing");
        await delay(300);
        setStep("processing");
        await delay(300);

        const analysis = data as AnalysisResult;
        
        // Check if analysis has enough data (point 9)
        let nonNullCount = 0;
        const sections = [analysis.vraceni, analysis.reklamace, analysis.platby, analysis.doprava, analysis.storno, analysis.predplatne_info, analysis.ochrana_kupujiciho, analysis.licence_digital, analysis.akce_zruseni, analysis.pojisteni, analysis.jidlo_kvalita, analysis.lekarna_info];
        for (const section of sections) {
          if (!section) continue;
          for (const [k, v] of Object.entries(section)) {
            if (k === "_citace") continue;
            if (v !== null && v !== undefined) nonNullCount++;
          }
        }
        analysis._lowData = nonNullCount < 3;
        
        setResult(analysis);
        addToHistory({
          url: analysis.url,
          siteName: analysis.siteName,
          analyzedAt: analysis.analyzedAt,
        });
        setStep("done");
        return;
      } catch {
        // Edge function not available — fall back to mock
        console.info("Edge function not available, using mock data");
      }

      // Fallback: mock analysis
      await delay(1200);
      setStep("parsing");
      await delay(1000);
      setStep("analyzing");
      await delay(1500);
      setStep("processing");
      await delay(800);

      const analysis = generateMockAnalysis(url, forcedCategory);
      setResult(analysis);

      addToHistory({
        url: analysis.url,
        siteName: analysis.siteName,
        analyzedAt: analysis.analyzedAt,
      });

      setStep("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Nepodařilo se analyzovat podmínky. Zkuste to prosím znovu.");
      setStep("error");
    }
  }, []);

  const reset = useCallback(() => {
    setStep("idle");
    setResult(null);
    setError(null);
  }, []);

  return { step, result, error, analyze, reset };
}
