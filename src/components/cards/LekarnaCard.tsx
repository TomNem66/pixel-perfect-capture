import { AnalysisResult } from "@/types/analysis";
import { CategoryCard } from "@/components/shared/CategoryCard";
import { FactRow } from "@/components/shared/FactRow";
import { BoolRow } from "@/components/shared/BoolRow";
import { Pill } from "lucide-react";

export const LekarnaCard = ({ data }: { data: NonNullable<AnalysisResult["lekarna_info"]> }) => (
  <CategoryCard icon={<Pill className="w-5 h-5 text-primary" />} title="Lékárna">
    <BoolRow label="Licence SÚKL" value={data.licence_sukl} tooltip="SÚKL" />
    <BoolRow label="Výjimka z vrácení léčiv" value={data.vraceni_leciv_vyjimka} />
    <BoolRow label="Konzultace s lékárníkem" value={data.konzultace_lekarnik} />
    <FactRow label="Teplotní řetězec" value={data.teplotni_retezec} />
  </CategoryCard>
);
