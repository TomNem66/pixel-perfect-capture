import { AnalysisResult } from "@/types/analysis";
import { CategoryCard } from "@/components/shared/CategoryCard";
import { FactRow } from "@/components/shared/FactRow";
import { BoolRow } from "@/components/shared/BoolRow";
import { Key } from "lucide-react";

export const LicenceCard = ({ data }: { data: NonNullable<AnalysisResult["licence_digital"]> }) => (
  <CategoryCard icon={<Key className="w-5 h-5 text-primary" />} title="Licence a digitální obsah">
    <FactRow label="Vlastnictví vs. licence" value={data.vlastnictvi_vs_licence} />
    <BoolRow label="Přenositelnost" value={data.prenositelnost} />
    <FactRow label="DRM ochrana" value={data.drm} tooltip="drm" />
    <BoolRow label="Offline přístup" value={data.offline_pristup} />
    <FactRow label="Regionální omezení" value={data.regionalni_omezeni} />
  </CategoryCard>
);
