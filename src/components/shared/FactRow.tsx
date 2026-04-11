import { LegalComplianceLevel } from "@/types/analysis";
import { InfoTooltip } from "@/components/InfoTooltip";
import { CitaceTooltip } from "@/components/shared/CitaceTooltip";
import { VopIcon } from "@/components/shared/VopIcon";

interface FactRowProps {
  label: string;
  value: string | null | undefined;
  variant?: "warning" | "bonus" | "muted";
  compliance?: LegalComplianceLevel;
  legalRef?: { paragraf: string; url: string };
  tooltip?: string;
  citace?: string | null;
  isDefault?: boolean;
}

const complianceIcons: Record<LegalComplianceLevel, string> = {
  better: "circle-check",
  standard: "circle-check",
  worse: "triangle-alert",
  unknown: "question-circle",
};

const complianceColors: Record<LegalComplianceLevel, string> = {
  better: "text-success",
  standard: "text-muted-foreground",
  worse: "text-warning",
  unknown: "text-muted-foreground",
};

const complianceLabels: Record<LegalComplianceLevel, string> = {
  better: "Lepší než zákon vyžaduje",
  standard: "Zákonný standard",
  worse: "Horší než zákon / hraniční",
  unknown: "Neuvedeno v podmínkách",
};

export const FactRow = ({ label, value, variant, compliance, legalRef, tooltip, citace, isDefault }: FactRowProps) => {
  const displayValue = value || "Nebylo v podmínkách uvedeno";
  const isMissing = !value;

  return (
    <div className={`flex items-start gap-2 text-sm py-1.5 ${isDefault ? "text-muted-foreground text-xs" : ""}`}>
      <span className={`min-w-[160px] flex-shrink-0 flex items-center gap-1 ${isDefault ? "text-muted-foreground" : "text-muted-foreground"}`}>
        {label}
        {tooltip && <InfoTooltip term={tooltip} />}
      </span>
      <span className={
        variant === "warning" ? "text-warning font-medium" :
        variant === "bonus" ? "text-success font-medium" :
        isMissing ? "text-muted-foreground italic" :
        ""
      }>
        {variant === "warning" && <VopIcon name="triangle-alert" size={14} className="text-warning inline-block mr-1 -mt-0.5" />}
        {variant === "bonus" && <VopIcon name="star-diamond" size={14} className="text-success inline-block mr-1 -mt-0.5" />}
        {isMissing && <VopIcon name="circle-info" size={14} className="text-muted-foreground inline-block mr-1 -mt-0.5" />}
        {displayValue}
      </span>
      {citace !== undefined && <CitaceTooltip citace={citace} />}
      {compliance && (
        <span className={`ml-auto flex-shrink-0 ${complianceColors[compliance]}`} title={complianceLabels[compliance]}>
          <VopIcon name={complianceIcons[compliance]} size={14} className={complianceColors[compliance]} />
        </span>
      )}
      {legalRef && (
        <span className="ml-1 flex-shrink-0 text-xs text-muted-foreground" title={legalRef.paragraf}>
          {legalRef.paragraf}
        </span>
      )}
    </div>
  );
};
