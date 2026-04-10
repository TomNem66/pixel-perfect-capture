import { AnalysisResult } from "@/types/analysis";
import { CategoryCard } from "@/components/shared/CategoryCard";
import { FactRow } from "@/components/shared/FactRow";
import { BoolRow } from "@/components/shared/BoolRow";
import { XCircle } from "lucide-react";

export const StornoCard = ({ data }: { data: NonNullable<AnalysisResult["storno"]> }) => (
  <CategoryCard icon={<XCircle className="w-5 h-5 text-primary" />} title="Storno a zrušení">
    <BoolRow label="Lze stornovat" value={data.lze_stornovat} />
    <FactRow label="Bezplatné storno do" value={data.lhuta_bezplatneho_storna} />
    <FactRow label="Poplatek za storno" value={data.poplatek_za_storno} variant={data.poplatek_za_storno ? "warning" : undefined} />
    <BoolRow label="Nevratná rezervace" value={data.nevratna_rezervace} />
    <BoolRow label="Částečné storno" value={data.castecne_storno} />
  </CategoryCard>
);
