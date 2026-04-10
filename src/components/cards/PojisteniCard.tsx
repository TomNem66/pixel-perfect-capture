import { AnalysisResult } from "@/types/analysis";
import { CategoryCard } from "@/components/shared/CategoryCard";
import { FactRow } from "@/components/shared/FactRow";
import { BoolRow } from "@/components/shared/BoolRow";
import { ShieldCheck } from "lucide-react";

export const PojisteniCard = ({ data }: { data: NonNullable<AnalysisResult["pojisteni"]> }) => (
  <CategoryCard icon={<ShieldCheck className="w-5 h-5 text-primary" />} title="Storno pojištění">
    <BoolRow label="Nabízí storno pojištění" value={data.storno_pojisteni} tooltip="storno pojištění" />
    <FactRow label="Co pokrývá" value={data.co_pokryva} />
    <FactRow label="Cena" value={data.cena} />
  </CategoryCard>
);
