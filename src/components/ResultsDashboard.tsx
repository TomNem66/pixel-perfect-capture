import { AnalysisResult } from "@/types/analysis";
import { Button } from "@/components/ui/button";
import { ScoreBadge } from "./ScoreBadge";
import { CategoryCard } from "./CategoryCard";
import { RedFlagsList } from "./RedFlagsList";
import { ShareButton } from "./ShareButton";
import { ArrowLeft, ExternalLink, Award } from "lucide-react";

interface ResultsDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
}

export const ResultsDashboard = ({ result, onReset }: ResultsDashboardProps) => {
  const { scoreResult, extractedData } = result;
  const categoryOrder = ["odstoupeni", "reklamace", "gdpr", "platby", "dodani", "spory", "transparentnost"];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" onClick={onReset} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Nová analýza
        </Button>
        <div className="flex items-center gap-2">
          <ShareButton result={result} />
          <a
            href={result.url.startsWith("http") ? result.url : `https://${result.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            {result.siteName}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-10">
        <div className="flex items-center gap-4">
          <ScoreBadge score={scoreResult.total} size="lg" />
          <div
            className="w-16 h-16 rounded-xl font-heading font-bold text-2xl flex items-center justify-center border-2"
            style={{ color: scoreResult.gradeColor, borderColor: scoreResult.gradeColor, backgroundColor: `${scoreResult.gradeColor}15` }}
          >
            {scoreResult.grade}
          </div>
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold mb-1">
            Analýza: {result.siteName}
          </h1>
          <p className="text-muted-foreground">{scoreResult.gradeText}</p>
          <p className="text-sm text-muted-foreground mt-1">{result.summary}</p>
        </div>
      </div>

      {extractedData.bonusy.length > 0 && (
        <div className="rounded-xl border border-success/30 bg-success/5 p-5 mb-6">
          <h3 className="font-heading font-semibold mb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-success" />
            Nadstandardní podmínky
          </h3>
          <div className="space-y-2">
            {extractedData.bonusy.map((b, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-success">✓</span>
                <div>
                  <span className="text-sm font-medium">{b.typ}</span>
                  <span className="text-sm text-muted-foreground ml-2">{b.popis}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {extractedData.red_flags.length > 0 && (
        <RedFlagsList redFlags={extractedData.red_flags} />
      )}

      <div className="grid md:grid-cols-2 gap-4 mt-8">
        {categoryOrder.map((key) => {
          const cat = scoreResult.categories[key];
          if (!cat) return null;
          return <CategoryCard key={key} category={cat} categoryKey={key} extractedData={extractedData} />;
        })}
      </div>
    </div>
  );
};
