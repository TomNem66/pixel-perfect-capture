import { useState } from "react";
import React from "react";
import { CategoryCard } from "@/components/shared/CategoryCard";
import { FactRow } from "@/components/shared/FactRow";
import { VopIcon } from "@/components/shared/VopIcon";
import { CitaceMap } from "@/types/analysis";
import { LegalComplianceLevel } from "@/types/analysis";

interface RowData {
  key: string;
  label: string;
  value: string | null | undefined;
  variant?: "warning" | "bonus" | "muted";
  compliance?: LegalComplianceLevel;
  tooltip?: string;
  rawValue?: unknown;
}

interface SmartDisplayCardProps {
  icon: React.ReactNode;
  title: string;
  interestingRows: RowData[];
  standardRows: RowData[];
  citace?: CitaceMap;
}

export const SmartDisplayCard = ({ icon, title, interestingRows, standardRows, citace }: SmartDisplayCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const allStandard = interestingRows.length === 0;

  return (
    <CategoryCard icon={icon} title={title}>
      {allStandard ? (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-sm py-1.5 w-full text-left text-success hover:text-success/80 transition-colors"
          >
            <VopIcon name="circle-check" size={14} className="text-success" />
            <span className="font-medium">Vše odpovídá zákonnému standardu</span>
            <VopIcon name={expanded ? "chevron-up" : "chevron-down"} size={12} className="ml-auto text-muted-foreground" />
          </button>
          {expanded && (
            <div className="print:block">
              {standardRows.map(row => (
                <FactRow
                  key={row.key}
                  label={row.label}
                  value={row.value}
                  variant={row.variant}
                  compliance={row.compliance}
                  tooltip={row.tooltip}
                  citace={citace?.[row.key]}
                  isDefault
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {interestingRows.map(row => (
            <FactRow
              key={row.key}
              label={row.label}
              value={row.value}
              variant={row.variant}
              compliance={row.compliance}
              tooltip={row.tooltip}
              citace={citace?.[row.key]}
            />
          ))}
          {standardRows.length > 0 && (
            <>
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-2 text-xs py-1.5 w-full text-left text-muted-foreground hover:text-foreground transition-colors"
              >
                <VopIcon name="circle-check" size={12} className="text-muted-foreground" />
                <span>{standardRows.length} {standardRows.length === 1 ? "další bod odpovídá" : "dalších bodů odpovídá"} zákonnému standardu</span>
                <VopIcon name={expanded ? "chevron-up" : "chevron-down"} size={12} className="ml-auto" />
              </button>
              {expanded && (
                <div className="print:block">
                  {standardRows.map(row => (
                    <FactRow
                      key={row.key}
                      label={row.label}
                      value={row.value}
                      variant={row.variant}
                      compliance={row.compliance}
                      tooltip={row.tooltip}
                      citace={citace?.[row.key]}
                      isDefault
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </CategoryCard>
  );
};
