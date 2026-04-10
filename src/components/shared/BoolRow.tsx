import { FactRow } from "./FactRow";
import { LegalComplianceLevel } from "@/types/analysis";

interface BoolRowProps {
  label: string;
  value: boolean | null | undefined;
  compliance?: LegalComplianceLevel;
  tooltip?: string;
}

export const BoolRow = ({ label, value, compliance, tooltip }: BoolRowProps) => (
  <FactRow
    label={label}
    value={value === true ? "Ano" : value === false ? "Ne" : null}
    compliance={compliance}
    tooltip={tooltip}
  />
);
