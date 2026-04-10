import { AnalysisResult } from "@/types/analysis";
import { CategoryCard } from "@/components/shared/CategoryCard";
import { FactRow } from "@/components/shared/FactRow";
import { BoolRow } from "@/components/shared/BoolRow";
import { UtensilsCrossed } from "lucide-react";

export const JidloKvalitaCard = ({ data }: { data: NonNullable<AnalysisResult["jidlo_kvalita"]> }) => (
  <CategoryCard icon={<UtensilsCrossed className="w-5 h-5 text-primary" />} title="Kvalita a reklamace jídla">
    <FactRow label="Kdo odpovídá" value={data.kdo_odpovida} />
    <FactRow label="Lhůta reklamace" value={data.lhuta_reklamace} />
    <BoolRow label="Informace o alergenech" value={data.alergeny_info} />
    <FactRow label="Minimální objednávka" value={data.minimalni_objednavka} />
    <FactRow label="Kompenzace zpoždění" value={data.kompenzace_zpozdeni} />
  </CategoryCard>
);
