import { useState, useCallback } from "react";
import { AnalysisResult, ShopCategory } from "@/types/analysis";
import { addToHistory } from "@/lib/history";
import { supabase } from "@/integrations/supabase/client";
import { getMockForUrl } from "@/lib/mockAnalyses";

type Step = "idle" | "fetching" | "parsing" | "analyzing" | "processing" | "done" | "error";

export interface AnalysisDiagnostics {
  error_stage?: string;
  requested_url?: string;
  vop_url?: string | null;
  processing_time_ms?: number;
  detail?: string;
  mode?: string;
  [key: string]: unknown;
}

export function useAnalysis() {
  const [step, setStep] = useState<Step>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [diagnostics, setDiagnostics] = useState<AnalysisDiagnostics | null>(null);

  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const analyze = useCallback(async (url: string, forcedCategory?: ShopCategory) => {
    setError(null);
    setResult(null);
    setDiagnostics(null);

    try {
      setStep("fetching");

      // Demo/Mock mode for investor presentations — bypass backend entirely
      const mock = getMockForUrl(url);
      if (mock) {
        await delay(400);
        setStep("parsing");
        await delay(350);
        setStep("analyzing");
        await delay(450);
        setStep("processing");
        await delay(300);

        const analysis = {
          ...mock,
          url,
          analyzedAt: new Date().toISOString(),
          zdroje: { vop_url: null, faq_url: null, reklamacni_rad_url: null, kontakt_url: null, privacy_url: null },
          pravni_odkazy: [],
          pravni_texty_stazeny: true,
        } as AnalysisResult;

        setResult(analysis);
        addToHistory({ url: analysis.url, siteName: analysis.siteName, analyzedAt: analysis.analyzedAt });
        setStep("done");
        return;
      }

      const { data, error: fnError } = await supabase.functions.invoke("analyze-vop", {
        body: { url, forcedCategory },
      });

      if (fnError) throw fnError;
      if (data?.error) {
        setDiagnostics(data.diagnostics || null);
        if (data.error === "vop_not_found") throw new Error("vop_not_found");
        throw new Error(data.error);
      }

      setStep("parsing");
      await delay(300);
      setStep("analyzing");
      await delay(300);
      setStep("processing");
      await delay(300);

      const analysis = data as AnalysisResult;

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
    } catch (e) {
      console.error("Analysis error:", e);
      const msg = e instanceof Error ? e.message : "";
      if (msg === "vop_not_found") {
        setError("vop_not_found");
      } else if (msg.includes("Failed to send") || msg.includes("Edge Function") || msg.includes("FunctionsHttpError")) {
        setError("Služba analýzy je momentálně nedostupná. Zkuste to prosím za chvíli.");
        setDiagnostics({ error_stage: "network", detail: msg });
      } else if (msg.includes("API klíč")) {
        setError("API klíč není správně nakonfigurován. Kontaktujte správce.");
      } else {
        setError(msg || "Nepodařilo se analyzovat podmínky. Zkuste to prosím znovu.");
      }
      setStep("error");
    }
  }, []);

  const analyzeRawText = useCallback(async (rawText: string, url?: string, forcedCategory?: ShopCategory) => {
    setError(null);
    setResult(null);
    setDiagnostics(null);

    try {
      setStep("analyzing");

      const { data, error: fnError } = await supabase.functions.invoke("analyze-vop", {
        body: { url: url || "manual-input", rawText, forcedCategory },
      });

      if (fnError) throw fnError;
      if (data?.error) {
        setDiagnostics(data.diagnostics || null);
        throw new Error(data.error);
      }

      setStep("processing");
      await delay(300);

      const analysis = data as AnalysisResult;

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
    } catch (e) {
      console.error("Analysis error (raw text):", e);
      const msg = e instanceof Error ? e.message : "";
      setError(msg || "Nepodařilo se analyzovat vložený text. Zkuste to prosím znovu.");
      setStep("error");
    }
  }, []);

  const reset = useCallback(() => {
    setStep("idle");
    setResult(null);
    setError(null);
    setDiagnostics(null);
  }, []);

  return { step, result, error, diagnostics, analyze, analyzeRawText, reset };
}
