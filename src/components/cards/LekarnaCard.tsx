import { AnalysisResult } from "@/types/analysis";
import { CategoryCard } from "@/components/shared/CategoryCard";
import { FactRow } from "@/components/shared/FactRow";
import { BoolRow } from "@/components/shared/BoolRow";
import { VopIcon } from "@/components/shared/VopIcon";

export const LekarnaCard = ({ data }: { data: NonNullable<AnalysisResult["lekarna_info"]> }) => (
  <CategoryCard icon={<VopIcon name="pill" size={20} className="text-primary" />} title="Lékárna">
    <BoolRow label="Licence SÚKL" value={data.licence_sukl} tooltip="SÚKL" citace={data._citace?.licence_sukl} />
    <BoolRow label="Výjimka z vrácení léčiv" value={data.vraceni_leciv_vyjimka} citace={data._citace?.vraceni_leciv_vyjimka} />
    <BoolRow label="Konzultace s lékárníkem" value={data.konzultace_lekarnik} citace={data._citace?.konzultace_lekarnik} />
    <FactRow label="Teplotní řetězec" value={data.teplotni_retezec} citace={data._citace?.teplotni_retezec} />
  </CategoryCard>
);
