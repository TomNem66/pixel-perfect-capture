import { AnalysisResult } from "@/types/analysis";
import { CategoryCard } from "@/components/shared/CategoryCard";
import { FactRow } from "@/components/shared/FactRow";
import { BoolRow } from "@/components/shared/BoolRow";
import { VopIcon } from "@/components/shared/VopIcon";

export const PredplatneCard = ({ data }: { data: NonNullable<AnalysisResult["predplatne_info"]> }) => (
  <CategoryCard icon={<VopIcon name="refresh-circle" size={20} className="text-primary" />} title="Předplatné">
    {/* Priority rows first */}
    <BoolRow label="Automatické obnovení" value={data.automaticke_obnoveni} tooltip="automatické obnovení" citace={data._citace?.automaticke_obnoveni} />
    <FactRow label="Jak zrušit" value={data.jak_zrusit} citace={data._citace?.jak_zrusit} />
    <FactRow label="Výpovědní lhůta" value={data.vypovedni_lhuta} citace={data._citace?.vypovedni_lhuta} />
    <BoolRow label="Trial → automaticky placený" value={data.trial_automaticky_placeny} citace={data._citace?.trial_automaticky_placeny} />
    {/* Secondary rows */}
    <FactRow label="Cena" value={data.cena} citace={data._citace?.cena} />
    <FactRow label="Fakturační cyklus" value={data.fakturacni_cyklus} citace={data._citace?.fakturacni_cyklus} />
    <BoolRow label="Vrací poměrnou část" value={data.vraci_pomernou_cast} citace={data._citace?.vraci_pomernou_cast} />
    <FactRow label="Zkušební doba" value={data.zkusebni_doba} citace={data._citace?.zkusebni_doba} />
    <FactRow label="Oznámení změny ceny" value={data.zmena_ceny_predstih} citace={data._citace?.zmena_ceny_predstih} />
  </CategoryCard>
);
