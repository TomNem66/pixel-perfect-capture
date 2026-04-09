import { ScoreCategory, ExtractedData } from "@/types/analysis";
import { Progress } from "@/components/ui/progress";

interface CategoryCardProps {
  category: ScoreCategory;
  categoryKey: string;
  extractedData: ExtractedData;
}

function getCategoryDetails(key: string, data: ExtractedData): { label: string; value: string }[] {
  const details: { label: string; value: string }[] = [];

  switch (key) {
    case "odstoupeni": {
      const od = data.odstoupeni;
      details.push({ label: "Lhůta pro odstoupení", value: od.lhuta_dny != null ? `${od.lhuta_dny} dní` : "Neuvedeno" });
      details.push({ label: "Postup popsán", value: od.postup_popsan ? "Ano" : "Ne" });
      details.push({ label: "Formulář přiložen", value: od.formular_prilozen ? "Ano" : "Ne" });
      details.push({ label: "Poštovné při vrácení", value: od.kdo_hradi_postovne_vraceni });
      if (od.lhuta_vraceni_penez_dny != null) details.push({ label: "Vrácení peněz", value: `do ${od.lhuta_vraceni_penez_dny} dní` });
      if (od.sankce_za_odstoupeni) details.push({ label: "⚠️ Sankce", value: od.sankce_za_odstoupeni });
      if (od.presna_citace) details.push({ label: "Citace", value: od.presna_citace });
      break;
    }
    case "reklamace": {
      const rek = data.reklamace;
      details.push({ label: "Reklamační lhůta", value: rek.reklamacni_lhuta_mesice != null ? `${rek.reklamacni_lhuta_mesice} měsíců` : "Neuvedeno" });
      details.push({ label: "Postup popsán", value: rek.postup_popsan ? "Ano" : "Ne" });
      if (rek.lhuta_vyrizeni_dny != null) details.push({ label: "Lhůta vyřízení", value: `${rek.lhuta_vyrizeni_dny} dní` });
      if (rek.prava_z_vadneho_plneni.length > 0) details.push({ label: "Nároky", value: rek.prava_z_vadneho_plneni.join(", ") });
      details.push({ label: "Kontakt pro reklamaci", value: rek.kontakt_pro_reklamaci ? "Ano" : "Ne" });
      if (rek.neprimerene_podminky) details.push({ label: "⚠️ Nepřiměřené", value: rek.neprimerene_podminky });
      break;
    }
    case "gdpr": {
      const g = data.gdpr;
      details.push({ label: "Správce identifikován", value: g.spravce_identifikovan ? "Ano" : "Ne" });
      details.push({ label: "Účel zpracování", value: g.ucel_zpracovani ? "Ano" : "Ne" });
      details.push({ label: "Právní základ", value: g.pravni_zaklad ? "Ano" : "Ne" });
      details.push({ label: "Doba uchovávání", value: g.doba_uchovavani ? "Ano" : "Ne" });
      details.push({ label: "Práva subjektu", value: g.prava_subjektu ? "Ano" : "Ne" });
      details.push({ label: "Cookies řešeny", value: g.cookies_reseny ? "Ano" : "Ne" });
      break;
    }
    case "platby": {
      const p = data.platby;
      details.push({ label: "Způsoby platby uvedeny", value: p.zpusoby_platby_uvedeny ? "Ano" : "Ne" });
      details.push({ label: "Ceny vč. DPH", value: p.ceny_vcetne_dph ? "Ano" : "Ne" });
      if (p.skryte_poplatky) details.push({ label: "⚠️ Skryté poplatky", value: p.skryte_poplatky });
      details.push({ label: "Bezpečnost plateb", value: p.bezpecnost_plateb ? "Ano" : "Ne" });
      break;
    }
    case "dodani": {
      const d = data.dodani;
      details.push({ label: "Dodací lhůta uvedena", value: d.dodaci_lhuta_uvedena ? "Ano" : "Ne" });
      if (d.dodaci_lhuta_dny != null) details.push({ label: "Dodací lhůta", value: `${d.dodaci_lhuta_dny} dní` });
      details.push({ label: "Způsoby dopravy", value: d.zpusoby_dopravy_uvedeny ? "Ano" : "Ne" });
      details.push({ label: "Přechod rizika", value: d.prechod_rizika_popsan ? "Ano" : "Ne" });
      break;
    }
    case "spory": {
      const s = data.spory;
      details.push({ label: "ČOI uvedena", value: s.coi_uvedena ? "Ano" : "Ne" });
      details.push({ label: "Mimosoudní řešení (ADR)", value: s.mimosoudni_reseni_adr ? "Ano" : "Ne" });
      details.push({ label: "ODR platforma odkaz", value: s.odr_platforma_odkaz ? "Ano" : "Ne" });
      details.push({ label: "Kontakt pro stížnosti", value: s.kontakt_pro_stiznosti ? "Ano" : "Ne" });
      break;
    }
    case "transparentnost": {
      const ob = data.obecne;
      details.push({ label: "Identifikace", value: ob.identifikace_kompletni });
      details.push({ label: "Srozumitelnost", value: ob.srozumitelnost });
      details.push({ label: "Info o uzavření smlouvy", value: ob.informace_o_uzavreni_smlouvy ? "Ano" : "Ne" });
      if (data.meta.datum_ucinnosti_vop) details.push({ label: "Datum účinnosti VOP", value: data.meta.datum_ucinnosti_vop });
      break;
    }
  }
  return details;
}

export const CategoryCard = ({ category, categoryKey, extractedData }: CategoryCardProps) => {
  const percentage = Math.round((category.score / category.max) * 100);
  const details = getCategoryDetails(categoryKey, extractedData);

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xl">{category.icon}</span>
        <h3 className="font-heading font-semibold flex-1">{category.label}</h3>
        <span className="text-sm font-bold" style={{ color: category.color }}>
          {category.score}/{category.max}
        </span>
      </div>

      <Progress
        value={percentage}
        className="h-2 mb-4"
        style={{ ["--progress-color" as string]: category.color } as React.CSSProperties}
      />

      <div className="space-y-1.5">
        {details.map((d, i) => (
          <div key={i} className="flex items-start gap-2 text-sm">
            <span className="text-muted-foreground min-w-[140px] flex-shrink-0">{d.label}:</span>
            <span className={d.label.startsWith("⚠️") ? "text-warning font-medium" : d.value === "Ne" || d.value === "Neuvedeno" || d.value === "neuvedeno" ? "text-muted-foreground" : ""}>
              {d.label === "Citace" ? <em className="text-xs opacity-70">{d.value}</em> : d.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
