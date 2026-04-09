import { useState, useCallback } from "react";
import { AnalysisResult } from "@/types/analysis";
import { generateMockAnalysis } from "@/lib/mockAnalysis";
import { addToHistory } from "@/lib/history";

type Step = "idle" | "fetching" | "parsing" | "analyzing" | "scoring" | "done" | "error";

export function useAnalysis() {
  const [step, setStep] = useState<Step>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const analyze = useCallback(async (url: string) => {
    setError(null);
    setResult(null);

    try {
      setStep("fetching");
      await delay(1200);
      setStep("parsing");
      await delay(1000);
      setStep("analyzing");
      await delay(1500);
      setStep("scoring");
      await delay(800);

      const analysis = generateMockAnalysis(url);
      setResult(analysis);

      addToHistory({
        url: analysis.url,
        siteName: analysis.siteName,
        score: analysis.scoreResult.total,
        grade: analysis.scoreResult.grade,
        analyzedAt: analysis.analyzedAt,
      });

      setStep("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Nepodařilo se analyzovat podmínky.");
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
