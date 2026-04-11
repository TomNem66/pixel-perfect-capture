import { AnalysisResult } from "@/types/analysis";
import { CategoryCard } from "@/components/shared/CategoryCard";
import { FactRow } from "@/components/shared/FactRow";
import { BoolRow } from "@/components/shared/BoolRow";
import { VopIcon } from "@/components/shared/VopIcon";

export const LicenceCard = ({ data }: { data: NonNullable<AnalysisResult["licence_digital"]> }) => (
  <CategoryCard icon={<VopIcon name="key" size={20} className="text-primary" />} title="Licence a digitální obsah">
    <FactRow label="Vlastnictví vs. licence" value={data.vlastnictvi_vs_licence} citace={data._citace?.vlastnictvi_vs_licence} />
    <BoolRow label="Přenositelnost" value={data.prenositelnost} citace={data._citace?.prenositelnost} />
    <FactRow label="DRM ochrana" value={data.drm} tooltip="drm" citace={data._citace?.drm} />
    <BoolRow label="Offline přístup" value={data.offline_pristup} citace={data._citace?.offline_pristup} />
    <FactRow label="Regionální omezení" value={data.regionalni_omezeni} citace={data._citace?.regionalni_omezeni} />
  </CategoryCard>
);
