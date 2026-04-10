import { useSearchParams } from "react-router-dom";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { AnalysisResult } from "@/types/analysis";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

function decodeResult(data: string): AnalysisResult | null {
  try {
    return JSON.parse(decodeURIComponent(atob(data)));
  } catch {
    return null;
  }
}

const SharePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const data = searchParams.get("data");
  const result = data ? decodeResult(data) : null;

  if (!result) {
    return (
      <div className="min-h-screen bg-background">
        <ThemeToggle />
        <div className="container mx-auto px-4 py-16 text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-heading font-bold mb-2">Neplatný odkaz</h1>
          <p className="text-muted-foreground mb-6">Sdílený odkaz je neplatný nebo poškozený.</p>
          <Button onClick={() => navigate("/")}>Nová analýza</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ThemeToggle />
      <div className="container mx-auto px-4 py-8 md:py-16">
        <ResultsDashboard result={result} onReset={() => navigate("/")} onReanalyze={undefined} />
      </div>
    </div>
  );
};

export default SharePage;
