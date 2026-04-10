import { AnalysisResult } from "@/types/analysis";
import { CategoryCard } from "@/components/shared/CategoryCard";
import { FactRow } from "@/components/shared/FactRow";
import { BoolRow } from "@/components/shared/BoolRow";
import { CalendarX } from "lucide-react";

export const AkceZruseniCard = ({ data }: { data: NonNullable<AnalysisResult["akce_zruseni"]> }) => (
  <CategoryCard icon={<CalendarX className="w-5 h-5 text-primary" />} title="Zrušení / přesunutí akce">
    <FactRow label="Vrácení při zrušení" value={data.vraceni_pri_zruseni} />
    <FactRow label="Při přesunutí" value={data.vraceni_pri_presunuti} />
    <FactRow label="Lhůta vrácení" value={data.lhuta_vraceni} />
    <BoolRow label="Voucher místo peněz" value={data.voucher_misto_penez} />
    <BoolRow label="Převod na jinou osobu" value={data.prevod_na_jinou_osobu} />
    <BoolRow label="Přeprodej" value={data.preprodej} />
  </CategoryCard>
);
