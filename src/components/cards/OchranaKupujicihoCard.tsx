import { AnalysisResult } from "@/types/analysis";
import { CategoryCard } from "@/components/shared/CategoryCard";
import { FactRow } from "@/components/shared/FactRow";
import { Shield } from "lucide-react";

export const OchranaKupujicihoCard = ({ data }: { data: NonNullable<AnalysisResult["ochrana_kupujiciho"]> }) => (
  <CategoryCard icon={<Shield className="w-5 h-5 text-primary" />} title="Ochrana kupujícího">
    <FactRow label="Program ochrany" value={data.program_ochrany} tooltip="ochrana kupujícího" />
    <FactRow label="Podmínky ochrany" value={data.podminky_ochrany} />
    <FactRow label="Řešení sporů" value={data.reseni_sporu} />
  </CategoryCard>
);
