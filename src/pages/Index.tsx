import { useState, useEffect } from "react";
import { UrlInput } from "@/components/UrlInput";
import { HistoryList } from "@/components/HistoryList";
import { LoadingState } from "@/components/LoadingState";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { ManualUrlDialog } from "@/components/ManualUrlDialog";
import { ManualTextDialog } from "@/components/ManualTextDialog";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAnalysis } from "@/hooks/useAnalysis";
import { getHistory } from "@/lib/history";
import { HistoryItem, ShopCategory } from "@/types/analysis";
import { Button } from "@/components/ui/button";
import { VopIcon } from "@/components/shared/VopIcon";
import { ChevronDown, ChevronUp } from "lucide-react";
import { HeroBackground } from "@/components/HeroBackground";

const Index = () => {
  const { step, result, error, diagnostics, analyze, analyzeRawText, reset } = useAnalysis();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [manualDialogOpen, setManualDialogOpen] = useState(false);
  const [manualTextDialogOpen, setManualTextDialogOpen] = useState(false);
  const [failedUrl, setFailedUrl] = useState("");
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleAnalyze = async (url: string) => {
    setFailedUrl(url);
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

  const handleManualTextSubmit = (rawText: string, url: string) => {
    setManualTextDialogOpen(false);
    analyzeRawText(rawText, url).then(() => setHistory(getHistory()));
  };

  const isLoading = !["idle", "done", "error"].includes(step);

  const getErrorTitle = () => {
    if (error === "vop_not_found") return "Obchodní podmínky nenalezeny";
    if (error?.includes("blokují")) return "Web blokuje automatické čtení";
    if (error?.includes("nedostupná") || error?.includes("nenalezena")) return "Stránka nedostupná";
    if (error?.includes("přetížená")) return "Služba dočasně přetížená";
    return "Nastala chyba";
  };

  const getErrorMessage = () => {
    if (error === "vop_not_found") {
      return "Nepodařilo se automaticky najít obchodní podmínky. Zkuste zadat URL podmínek ručně nebo vložte text podmínek.";
    }
    return error;
  };

  return (
    <div className="min-h-screen bg-background relative">
      <ThemeToggle />
      <HeroBackground animated={isLoading} />
      <div className="container mx-auto px-4 py-8 md:py-16 relative z-10">
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
            <VopIcon name="circle-x" size={48} className="mx-auto mb-4" />
            <h2 className="text-xl font-heading font-bold mb-2">
              {getErrorTitle()}
            </h2>
            <p className="text-muted-foreground mb-6">
              {getErrorMessage()}
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button variant="outline" onClick={reset}>Zpět</Button>
              {error !== "vop_not_found" && (
                <Button variant="outline" onClick={() => handleAnalyze(failedUrl)}>Zkusit znovu</Button>
              )}
              <Button variant="outline" onClick={() => setManualDialogOpen(true)}>
                Zadat URL ručně
              </Button>
              <Button onClick={() => setManualTextDialogOpen(true)}>
                Vložit text podmínek
              </Button>
            </div>

            {/* Technical diagnostics toggle */}
            {diagnostics && (
              <div className="mt-6">
                <button
                  onClick={() => setShowDiagnostics(!showDiagnostics)}
                  className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
                >
                  Technické detaily
                  {showDiagnostics ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
                {showDiagnostics && (
                  <div className="mt-2 p-3 rounded-lg bg-muted/50 text-left text-xs font-mono text-muted-foreground max-w-sm mx-auto">
                    {Object.entries(diagnostics).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-foreground/60">{key}:</span>{" "}
                        {String(value ?? "–")}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {step === "done" && result && (
          <>
            {(result as any)._lowData && (
              <div className="max-w-4xl mx-auto mb-6 rounded-xl border border-warning/30 bg-warning/5 p-4 text-center">
                <p className="text-sm text-warning mb-3">
                  Z podmínek tohoto webu se nepodařilo extrahovat dostatek informací. Podmínky mohou být příliš obecné nebo se nepodařilo správně stáhnout obsah stránky.
                </p>
                <div className="flex gap-2 justify-center flex-wrap">
                  <Button variant="outline" size="sm" onClick={() => { setFailedUrl(result.url); setManualDialogOpen(true); }}>
                    Zadat URL podmínek ručně
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => { setFailedUrl(result.url); setManualTextDialogOpen(true); }}>
                    Vložit text podmínek
                  </Button>
                </div>
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
      <ManualTextDialog
        open={manualTextDialogOpen}
        onOpenChange={setManualTextDialogOpen}
        originalUrl={failedUrl}
        onSubmit={handleManualTextSubmit}
      />
    </div>
  );
};

export default Index;
