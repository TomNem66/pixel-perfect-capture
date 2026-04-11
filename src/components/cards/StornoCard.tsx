import { AnalysisResult } from "@/types/analysis";
import { CategoryCard } from "@/components/shared/CategoryCard";
import { FactRow } from "@/components/shared/FactRow";
import { BoolRow } from "@/components/shared/BoolRow";
import { VopIcon } from "@/components/shared/VopIcon";

export const StornoCard = ({ data }: { data: NonNullable<AnalysisResult["storno"]> }) => (
  <CategoryCard icon={<VopIcon name="x-circle" size={20} className="text-primary" />} title="Storno a zrušení">
    <BoolRow label="Lze stornovat" value={data.lze_stornovat} citace={data._citace?.lze_stornovat} />
    <FactRow label="Bezplatné storno do" value={data.lhuta_bezplatneho_storna} citace={data._citace?.lhuta_bezplatneho_storna} />
    <FactRow label="Poplatek za storno" value={data.poplatek_za_storno} variant={data.poplatek_za_storno ? "warning" : undefined} citace={data._citace?.poplatek_za_storno} />
    <BoolRow label="Nevratná rezervace" value={data.nevratna_rezervace} citace={data._citace?.nevratna_rezervace} />
    <BoolRow label="Částečné storno" value={data.castecne_storno} citace={data._citace?.castecne_storno} />
  </CategoryCard>
);
