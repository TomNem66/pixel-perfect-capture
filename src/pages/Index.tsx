import { useState, useEffect } from "react";
import { UrlInput } from "@/components/UrlInput";
import { HistoryList } from "@/components/HistoryList";
import { LoadingState } from "@/components/LoadingState";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { ManualUrlDialog } from "@/components/ManualUrlDialog";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAnalysis } from "@/hooks/useAnalysis";
import { getHistory } from "@/lib/history";
import { HistoryItem, ShopCategory } from "@/types/analysis";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { step, result, error, analyze, reset } = useAnalysis();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [manualDialogOpen, setManualDialogOpen] = useState(false);
  const [failedUrl, setFailedUrl] = useState("");

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleAnalyze = async (url: string) => {
    try {
      await analyze(url);
    } catch {
      // handled by useAnalysis error state
    }
    setHistory(getHistory());
  };

  const handleReanalyze = (url: string, category: ShopCategory) => {
    analyze(url, category).then(() => setHistory(getHistory()));
  };

  const handleManualSubmit = (termsUrl: string) => {
    setManualDialogOpen(false);
    handleAnalyze(termsUrl);
  };

  const isLoading = !["idle", "done", "error"].includes(step);

  return (
    <div className="min-h-screen bg-background">
      <ThemeToggle />
      <div className="container mx-auto px-4 py-8 md:py-16">
        {step === "idle" && (
          <>
            <UrlInput onAnalyze={handleAnalyze} isLoading={false} />
            <HistoryList items={history} onSelect={handleAnalyze} />
          </>
        )}

        {isLoading && (
          <>
            <div className="text-center mb-4">
              <h1 className="text-2xl font-heading font-bold">
                VO<span className="text-primary">Patrně!</span>
              </h1>
            </div>
            <LoadingState currentStep={step} />
          </>
        )}

        {step === "error" && (
          <div className="max-w-md mx-auto text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-xl font-heading font-bold mb-2">
              {error === "vop_not_found" ? "Obchodní podmínky nenalezeny" : "Nastala chyba"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {error === "vop_not_found"
                ? "Nepodařilo se automaticky najít obchodní podmínky. Zkuste zadat URL podmínek ručně."
                : error}
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={reset}>Zkusit znovu</Button>
              <Button variant="outline" onClick={() => { setFailedUrl(""); setManualDialogOpen(true); }}>
                Zadat URL podmínek ručně
              </Button>
            </div>
          </div>
        )}

        {step === "done" && result && (
          <>
            {(result as any)._lowData && (
              <div className="max-w-4xl mx-auto mb-6 rounded-xl border border-warning/30 bg-warning/5 p-4 text-center">
                <p className="text-sm text-warning mb-3">
                  Z podmínek tohoto webu se nepodařilo extrahovat dostatek informací. Podmínky mohou být příliš obecné nebo se nepodařilo správně stáhnout obsah stránky.
                </p>
                <Button variant="outline" size="sm" onClick={() => { setFailedUrl(result.url); setManualDialogOpen(true); }}>
                  Zadat URL podmínek ručně
                </Button>
              </div>
            )}
            <ResultsDashboard result={result} onReset={reset} onReanalyze={handleReanalyze} />
          </>
        )}
      </div>

      <ManualUrlDialog
        open={manualDialogOpen}
        onOpenChange={setManualDialogOpen}
        originalUrl={failedUrl}
        onSubmit={handleManualSubmit}
      />
    </div>
  );
};

export default Index;
