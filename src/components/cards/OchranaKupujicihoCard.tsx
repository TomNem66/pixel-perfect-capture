import { AnalysisResult } from "@/types/analysis";
import { CategoryCard } from "@/components/shared/CategoryCard";
import { FactRow } from "@/components/shared/FactRow";
import { VopIcon } from "@/components/shared/VopIcon";

export const OchranaKupujicihoCard = ({ data }: { data: NonNullable<AnalysisResult["ochrana_kupujiciho"]> }) => (
  <CategoryCard icon={<VopIcon name="shield" size={20} className="text-primary" />} title="Ochrana kupujícího">
    <FactRow label="Program ochrany" value={data.program_ochrany} tooltip="ochrana kupujícího" citace={data._citace?.program_ochrany} />
    <FactRow label="Podmínky ochrany" value={data.podminky_ochrany} citace={data._citace?.podminky_ochrany} />
    <FactRow label="Řešení sporů" value={data.reseni_sporu} citace={data._citace?.reseni_sporu} />
  </CategoryCard>
);
