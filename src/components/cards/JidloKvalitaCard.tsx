import { AnalysisResult } from "@/types/analysis";
import { CategoryCard } from "@/components/shared/CategoryCard";
import { FactRow } from "@/components/shared/FactRow";
import { BoolRow } from "@/components/shared/BoolRow";
import { VopIcon } from "@/components/shared/VopIcon";

export const JidloKvalitaCard = ({ data }: { data: NonNullable<AnalysisResult["jidlo_kvalita"]> }) => (
  <CategoryCard icon={<VopIcon name="utensils" size={20} className="text-primary" />} title="Kvalita a reklamace jídla">
    <FactRow label="Kdo odpovídá" value={data.kdo_odpovida} citace={data._citace?.kdo_odpovida} />
    <FactRow label="Lhůta reklamace" value={data.lhuta_reklamace} citace={data._citace?.lhuta_reklamace} />
    <BoolRow label="Informace o alergenech" value={data.alergeny_info} citace={data._citace?.alergeny_info} />
    <FactRow label="Minimální objednávka" value={data.minimalni_objednavka} citace={data._citace?.minimalni_objednavka} />
    <FactRow label="Kompenzace zpoždění" value={data.kompenzace_zpozdeni} citace={data._citace?.kompenzace_zpozdeni} />
  </CategoryCard>
);
