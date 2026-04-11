import { AnalysisResult } from "@/types/analysis";
import { CategoryCard } from "@/components/shared/CategoryCard";
import { FactRow } from "@/components/shared/FactRow";
import { BoolRow } from "@/components/shared/BoolRow";
import { VopIcon } from "@/components/shared/VopIcon";

export const AkceZruseniCard = ({ data }: { data: NonNullable<AnalysisResult["akce_zruseni"]> }) => (
  <CategoryCard icon={<VopIcon name="calendar-x" size={20} className="text-primary" />} title="Zrušení / přesunutí akce">
    <FactRow label="Vrácení při zrušení" value={data.vraceni_pri_zruseni} citace={data._citace?.vraceni_pri_zruseni} />
    <FactRow label="Při přesunutí" value={data.vraceni_pri_presunuti} citace={data._citace?.vraceni_pri_presunuti} />
    <FactRow label="Lhůta vrácení" value={data.lhuta_vraceni} citace={data._citace?.lhuta_vraceni} />
    <BoolRow label="Voucher místo peněz" value={data.voucher_misto_penez} citace={data._citace?.voucher_misto_penez} />
    <BoolRow label="Převod na jinou osobu" value={data.prevod_na_jinou_osobu} citace={data._citace?.prevod_na_jinou_osobu} />
    <BoolRow label="Přeprodej" value={data.preprodej} citace={data._citace?.preprodej} />
  </CategoryCard>
);
