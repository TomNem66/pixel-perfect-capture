import { AnalysisResult } from "@/types/analysis";
import { CategoryCard } from "@/components/shared/CategoryCard";
import { FactRow } from "@/components/shared/FactRow";
import { BoolRow } from "@/components/shared/BoolRow";
import { RefreshCw } from "lucide-react";

export const PredplatneCard = ({ data }: { data: NonNullable<AnalysisResult["predplatne_info"]> }) => (
  <CategoryCard icon={<RefreshCw className="w-5 h-5 text-primary" />} title="Předplatné">
    <FactRow label="Cena" value={data.cena} />
    <FactRow label="Fakturační cyklus" value={data.fakturacni_cyklus} />
    <BoolRow label="Automatické obnovení" value={data.automaticke_obnoveni} tooltip="automatické obnovení" />
    <FactRow label="Jak zrušit" value={data.jak_zrusit} />
    <FactRow label="Výpovědní lhůta" value={data.vypovedni_lhuta} />
    <BoolRow label="Vrací poměrnou část" value={data.vraci_pomernou_cast} />
    <FactRow label="Zkušební doba" value={data.zkusebni_doba} />
    <BoolRow label="Trial → automaticky placený" value={data.trial_automaticky_placeny} />
    <FactRow label="Oznámení změny ceny" value={data.zmena_ceny_predstih} />
  </CategoryCard>
);
