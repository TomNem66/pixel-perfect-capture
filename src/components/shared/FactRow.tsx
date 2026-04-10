import { LegalComplianceLevel } from "@/types/analysis";
import { InfoTooltip } from "@/components/InfoTooltip";

interface FactRowProps {
  label: string;
  value: string | null | undefined;
  variant?: "warning" | "bonus" | "muted";
  compliance?: LegalComplianceLevel;
  legalRef?: { paragraf: string; url: string };
  tooltip?: string;
}

const complianceIcons: Record<LegalComplianceLevel, string> = {
  better: "✅",
  standard: "➡️",
  worse: "⚠️",
  unknown: "❓",
};

const complianceLabels: Record<LegalComplianceLevel, string> = {
  better: "Lepší než zákon vyžaduje",
  standard: "Zákonný standard",
  worse: "Horší než zákon / hraniční",
  unknown: "Neuvedeno v podmínkách",
};

export const FactRow = ({ label, value, variant, compliance, legalRef, tooltip }: FactRowProps) => {
  const displayValue = value || "ℹ️ Nebylo v podmínkách uvedeno";
  const isMissing = !value;

  return (
    <div className="flex items-start gap-2 text-sm py-1.5">
      <span className="text-muted-foreground min-w-[160px] flex-shrink-0 flex items-center gap-1">
        {label}
        {tooltip && <InfoTooltip term={tooltip} />}
      </span>
      <span className={
        variant === "warning" ? "text-warning font-medium" :
        variant === "bonus" ? "text-success font-medium" :
        isMissing ? "text-muted-foreground italic" :
        ""
      }>
        {variant === "warning" && "⚠️ "}{variant === "bonus" && "🌟 "}{displayValue}
      </span>
      {compliance && (
        <span className="ml-auto flex-shrink-0 text-xs" title={complianceLabels[compliance]}>
          {complianceIcons[compliance]}
        </span>
      )}
      {legalRef && (
        <a
          href={legalRef.url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-1 flex-shrink-0 text-xs text-muted-foreground hover:text-primary transition-colors"
          title={legalRef.paragraf}
        >
          📖
        </a>
      )}
    </div>
  );
};
