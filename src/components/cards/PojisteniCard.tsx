import { AnalysisResult } from "@/types/analysis";
import { CategoryCard } from "@/components/shared/CategoryCard";
import { FactRow } from "@/components/shared/FactRow";
import { BoolRow } from "@/components/shared/BoolRow";
import { VopIcon } from "@/components/shared/VopIcon";

export const PojisteniCard = ({ data }: { data: NonNullable<AnalysisResult["pojisteni"]> }) => (
  <CategoryCard icon={<VopIcon name="shield-check" size={20} className="text-primary" />} title="Storno pojištění">
    <BoolRow label="Nabízí storno pojištění" value={data.storno_pojisteni} tooltip="storno pojištění" citace={data._citace?.storno_pojisteni} />
    <FactRow label="Co pokrývá" value={data.co_pokryva} citace={data._citace?.co_pokryva} />
    <FactRow label="Cena" value={data.cena} citace={data._citace?.cena} />
  </CategoryCard>
);
