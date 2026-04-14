import { useState } from "react";
import { AnalysisResult, TrustRating } from "@/types/analysis";
import { Button } from "@/components/ui/button";
import { ShareButton } from "./ShareButton";
import { Badge } from "@/components/ui/badge";
import { CategoryCard } from "@/components/shared/CategoryCard";
import { FactRow } from "@/components/shared/FactRow";
import { BoolRow } from "@/components/shared/BoolRow";
import { VopIcon } from "@/components/shared/VopIcon";
import { StornoCard } from "@/components/cards/StornoCard";
import { PredplatneCard } from "@/components/cards/PredplatneCard";
import { OchranaKupujicihoCard } from "@/components/cards/OchranaKupujicihoCard";
import { LicenceCard } from "@/components/cards/LicenceCard";
import { AkceZruseniCard } from "@/components/cards/AkceZruseniCard";
import { PojisteniCard } from "@/components/cards/PojisteniCard";
import { JidloKvalitaCard } from "@/components/cards/JidloKvalitaCard";
import { LekarnaCard } from "@/components/cards/LekarnaCard";
import { SmartDisplayCard } from "@/components/shared/SmartDisplayCard";
import { CATEGORY_SECTIONS, CATEGORY_LABELS, CATEGORY_DESCRIPTIONS } from "@/lib/categoryMapping";
import type { SectionKey } from "@/lib/categoryMapping";
import type { ShopCategory } from "@/types/analysis";
import { isDefaultValue, isBetterThanDefault } from "@/lib/displayDefaults";
import { ArrowLeft, ExternalLink, Download } from "lucide-react";

interface ResultsDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
  onReanalyze?: (url: string, category: ShopCategory) => void;
}

const trustConfig: Record<TrustRating, { icon: string; label: string; className: string }> = {
  ok: { icon: "badge-ok", label: "Podmínky v pořádku", className: "border-success/40 bg-success/10 text-success" },
  obezretni: { icon: "badge-warn", label: "Buďte obezřetní", className: "border-warning/40 bg-warning/10 text-warning" },
  riziko: { icon: "badge-risk", label: "Zvýšené riziko", className: "border-danger/40 bg-danger/10 text-danger" },
};

const WarningBanner = ({ varovani }: { varovani: AnalysisResult["varovani"] }) => {
  if (!varovani || varovani.length === 0) return null;
  const critical = varovani.filter(v => v.zavaznost === "kritické");
  const warnings = varovani.filter(v => v.zavaznost === "pozor");
  const infos = varovani.filter(v => v.zavaznost === "info");

  return (
    <div className="space-y-2 mb-6">
      {critical.length > 0 && (
        <div className="rounded-xl border border-danger/30 bg-danger/5 p-4">
          <h4 className="font-heading font-semibold text-danger flex items-center gap-2 mb-2">
            <VopIcon name="shield-alert" size={16} className="text-danger" /> Kritická varování
          </h4>
          <ul className="space-y-1">
            {critical.map((v, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <VopIcon name="shield-alert" size={14} className="text-danger mt-0.5 flex-shrink-0" />
                <span><span className="text-muted-foreground text-xs">[{v.kategorie}]</span> {v.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {warnings.length > 0 && (
        <div className="rounded-xl border border-warning/30 bg-warning/5 p-4">
          <h4 className="font-heading font-semibold text-warning flex items-center gap-2 mb-2">
            <VopIcon name="triangle-alert" size={16} className="text-warning" /> Na co si dát pozor
          </h4>
          <ul className="space-y-1">
            {warnings.map((v, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <VopIcon name="triangle-alert" size={14} className="text-warning mt-0.5 flex-shrink-0" />
                <span><span className="text-muted-foreground text-xs">[{v.kategorie}]</span> {v.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {infos.length > 0 && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
          <ul className="space-y-1">
            {infos.map((v, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <VopIcon name="circle-info" size={14} className="text-primary mt-0.5 flex-shrink-0" />
                <span>{v.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const BonusBanner = ({ bonusy }: { bonusy: AnalysisResult["bonusy"] }) => {
  if (!bonusy || bonusy.length === 0) return null;
  return (
    <div className="rounded-xl border border-success/30 bg-success/5 p-4 mb-6">
      <h4 className="font-heading font-semibold text-success flex items-center gap-2 mb-2">
        <VopIcon name="star-diamond" size={16} className="text-success" /> Nadstandardní podmínky
      </h4>
      <ul className="space-y-1">
        {bonusy.map((b, i) => (
          <li key={i} className="text-sm flex items-start gap-2">
            <VopIcon name="star-diamond" size={14} className="text-success mt-0.5 flex-shrink-0" />
            <span><span className="text-muted-foreground text-xs">[{b.kategorie}]</span> {b.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const NesouladyBanner = ({ nesoulady }: { nesoulady: AnalysisResult["nesoulady"] }) => {
  if (!nesoulady || nesoulady.length === 0) return null;
  return (
    <div className="rounded-xl border border-warning/30 bg-warning/5 p-4 mb-6">
      <h4 className="font-heading font-semibold text-warning flex items-center gap-2 mb-2">
        <VopIcon name="triangle-alert" size={16} className="text-warning" /> Nesoulad mezi FAQ a VOP
      </h4>
      {nesoulady.map((n, i) => (
        <div key={i} className="text-sm mt-2">
          <p className="font-medium">{n.tema}</p>
          <p className="text-muted-foreground">VOP uvádí: <span className="text-foreground">„{n.vop_rika}"</span></p>
          <p className="text-muted-foreground">FAQ uvádí: <span className="text-foreground">„{n.faq_rika}"</span></p>
          <p className="text-xs text-warning mt-1 flex items-center gap-1">
            <VopIcon name="triangle-alert" size={12} className="text-warning" /> Právně závazné jsou VOP.
          </p>
        </div>
      ))}
    </div>
  );
};

// Per spec 3.1: show only nazev, zeme, typ — NOT sidlo, ico, zapis_or
const ProdejceCard = ({ prodejce }: { prodejce: AnalysisResult["prodejce"] }) => (
  <CategoryCard icon={<VopIcon name="seller" size={20} className="text-primary" />} title="Kdo vám prodává">
    <FactRow label="Název firmy" value={prodejce.nazev} citace={prodejce._citace?.nazev} />
    <FactRow label="Země sídla" value={prodejce.zeme} variant={prodejce.zeme === "mimo EU" ? "warning" : undefined} citace={prodejce._citace?.zeme} />
    <FactRow label="Typ prodejce" value={prodejce.typ === "neuvedeno" ? null : prodejce.typ} variant={prodejce.typ === "zprostředkovatel" ? "warning" : undefined} tooltip={prodejce.typ === "zprostředkovatel" ? "zprostředkovatel" : undefined} citace={prodejce._citace?.typ} />
  </CategoryCard>
);

const VraceniCard = ({ vraceni }: { vraceni: NonNullable<AnalysisResult["vraceni"]> }) => {
  const rows = [
    { key: "lhuta_dny", label: "Lhůta na vrácení", value: vraceni.lhuta_dny != null ? `${vraceni.lhuta_dny} dní` : null, variant: (vraceni.lhuta_dny != null && vraceni.lhuta_dny > 14 ? "bonus" : undefined) as "bonus" | undefined, compliance: (vraceni.lhuta_dny != null ? (vraceni.lhuta_dny > 14 ? "better" : "standard") : "unknown") as any, tooltip: "odstoupení od smlouvy", rawValue: vraceni.lhuta_dny },
    { key: "kdo_plati_postovne", label: "Poštovné při vrácení", value: vraceni.kdo_plati_postovne === "neuvedeno" ? null : `hradí ${vraceni.kdo_plati_postovne}`, variant: (vraceni.kdo_plati_postovne === "e-shop" ? "bonus" : undefined) as "bonus" | undefined, rawValue: vraceni.kdo_plati_postovne },
    { key: "vyjimky", label: "Výjimky z vrácení", value: (vraceni.vyjimky ?? []).length > 0 ? vraceni.vyjimky.join(", ") : "Žádné speciální výjimky", rawValue: vraceni.vyjimky ?? [] },
    { key: "sankce", label: "Sankce za vrácení", value: vraceni.sankce || "Žádné", variant: (vraceni.sankce ? "warning" : undefined) as "warning" | undefined, rawValue: vraceni.sankce },
    { key: "lhuta_vraceni_penez_dny", label: "Vrácení peněz", value: vraceni.lhuta_vraceni_penez_dny != null ? `do ${vraceni.lhuta_vraceni_penez_dny} dní` : null, rawValue: vraceni.lhuta_vraceni_penez_dny },
  ];

  const interesting = rows.filter(r => isBetterThanDefault("vraceni", r.key, r.rawValue as any) || !isDefaultValue("vraceni", r.key, r.rawValue as any));
  const standard = rows.filter(r => !interesting.includes(r));

  return (
    <SmartDisplayCard
      icon={<VopIcon name="return-box" size={20} className="text-primary" />}
      title="Vrácení zboží"
      interestingRows={interesting}
      standardRows={standard}
      citace={vraceni._citace}
    />
  );
};

const ReklamaceCard = ({ reklamace }: { reklamace: NonNullable<AnalysisResult["reklamace"]> }) => {
  // Per spec 3.1: don't show adresa_reklamace as row, don't show reklamace_v_zahranici as row
  const rows = [
    { key: "zarucni_doba_mesice", label: "Záruční doba", value: reklamace.zarucni_doba_mesice != null ? `${reklamace.zarucni_doba_mesice} měsíců` : null, compliance: (reklamace.zarucni_doba_mesice != null ? (reklamace.zarucni_doba_mesice >= 24 ? "standard" : "worse") : "unknown") as any, tooltip: "záruční doba", rawValue: reklamace.zarucni_doba_mesice },
    { key: "sberne_misto_cr", label: "Sběrné místo v ČR", value: reklamace.sberne_misto_cr === true ? "Ano" : reklamace.sberne_misto_cr === false ? "Ne" : null, rawValue: reklamace.sberne_misto_cr },
    { key: "hradi_dopravu_vadneho", label: "Hradí dopravu vadného", value: reklamace.hradi_dopravu_vadneho === true ? "Ano" : reklamace.hradi_dopravu_vadneho === false ? "Ne" : null, rawValue: reklamace.hradi_dopravu_vadneho },
    { key: "lhuta_vyrizeni_dny", label: "Lhůta vyřízení", value: reklamace.lhuta_vyrizeni_dny != null ? `${reklamace.lhuta_vyrizeni_dny} dní` : null, compliance: (reklamace.lhuta_vyrizeni_dny != null ? (reklamace.lhuta_vyrizeni_dny <= 30 ? "standard" : "worse") : "unknown") as any, variant: (reklamace.lhuta_vyrizeni_dny != null && reklamace.lhuta_vyrizeni_dny > 30 ? "warning" : undefined) as "warning" | undefined, rawValue: reklamace.lhuta_vyrizeni_dny },
    { key: "lhuta_vraceni_penez_dny", label: "Vrácení peněz", value: reklamace.lhuta_vraceni_penez_dny != null ? `do ${reklamace.lhuta_vraceni_penez_dny} dní` : null, rawValue: reklamace.lhuta_vraceni_penez_dny },
  ];

  const interesting = rows.filter(r => isBetterThanDefault("reklamace", r.key, r.rawValue as any) || !isDefaultValue("reklamace", r.key, r.rawValue as any));
  const standard = rows.filter(r => !interesting.includes(r));

  return (
    <SmartDisplayCard
      icon={<VopIcon name="wrench" size={20} className="text-primary" />}
      title="Reklamace a záruka"
      interestingRows={interesting}
      standardRows={standard}
      citace={reklamace._citace}
    />
  );
};

// Per spec 3.1: don't show ceny_vcetne_dph (always true in CZ, legal requirement)
const PlatbyCard = ({ platby }: { platby: NonNullable<AnalysisResult["platby"]> }) => {
  const rows = [
    { key: "metody", label: "Platební metody", value: (platby.metody ?? []).length > 0 ? platby.metody.join(", ") : null, rawValue: platby.metody ?? [] },
    ...(platby.ma_dobirku !== null ? [{ key: "ma_dobirku", label: "Dobírka", value: platby.ma_dobirku ? "Ano" : "Ne", rawValue: platby.ma_dobirku }] : []),
    { key: "skryte_poplatky", label: "Skryté poplatky", value: (platby.skryte_poplatky ?? []).length > 0 ? platby.skryte_poplatky.join(", ") : "Žádné", variant: ((platby.skryte_poplatky ?? []).length > 0 ? "warning" : undefined) as "warning" | undefined, rawValue: platby.skryte_poplatky ?? [] },
    { key: "sankce_nevyzvedni", label: "Sankce za nevyzvednutí", value: platby.sankce_nevyzvedni || "Žádné", variant: (platby.sankce_nevyzvedni ? "warning" : undefined) as "warning" | undefined, tooltip: platby.sankce_nevyzvedni ? "smluvní pokuta" : undefined, rawValue: platby.sankce_nevyzvedni },
  ];

  const interesting = rows.filter(r => isBetterThanDefault("platby", r.key, r.rawValue as any) || !isDefaultValue("platby", r.key, r.rawValue as any));
  const standard = rows.filter(r => !interesting.includes(r));

  return (
    <SmartDisplayCard
      icon={<VopIcon name="credit-card" size={20} className="text-primary" />}
      title="Platby a poplatky"
      interestingRows={interesting}
      standardRows={standard}
      citace={platby._citace}
    />
  );
};

const DopravaCard = ({ doprava }: { doprava: NonNullable<AnalysisResult["doprava"]> }) => {
  // Per spec 3.1: odpovednost_poskozeni shown only as warning if risk transfers before physical receipt
  const rows = [
    { key: "dodaci_lhuta_dny", label: "Dodací lhůta", value: doprava.dodaci_lhuta_dny != null ? `${doprava.dodaci_lhuta_dny} dní` : (doprava.dodaci_lhuta_text || null), variant: (doprava.dodaci_lhuta_dny != null && doprava.dodaci_lhuta_dny > 30 ? "warning" : undefined) as "warning" | undefined, rawValue: doprava.dodaci_lhuta_dny },
    { key: "zpusoby", label: "Způsoby dopravy", value: (doprava.zpusoby ?? []).length > 0 ? doprava.zpusoby.join(", ") : null, rawValue: doprava.zpusoby ?? [] },
    { key: "sledovani_zasilky", label: "Sledování zásilky", value: doprava.sledovani_zasilky === true ? "Ano" : doprava.sledovani_zasilky === false ? "Ne" : null, rawValue: doprava.sledovani_zasilky },
  ];

  const interesting = rows.filter(r => !isDefaultValue("doprava", r.key, r.rawValue as any));
  const standard = rows.filter(r => !interesting.includes(r));

  return (
    <SmartDisplayCard
      icon={<VopIcon name="truck" size={20} className="text-primary" />}
      title="Doprava a dodání"
      interestingRows={interesting}
      standardRows={standard}
      citace={doprava._citace}
    />
  );
};

function renderSection(key: SectionKey, result: AnalysisResult) {
  switch (key) {
    case "prodejce": return <ProdejceCard key={key} prodejce={result.prodejce} />;
    case "vraceni": return result.vraceni ? <VraceniCard key={key} vraceni={result.vraceni} /> : null;
    case "reklamace": return result.reklamace ? <ReklamaceCard key={key} reklamace={result.reklamace} /> : null;
    case "platby": return result.platby ? <PlatbyCard key={key} platby={result.platby} /> : null;
    case "doprava": return result.doprava ? <DopravaCard key={key} doprava={result.doprava} /> : null;
    case "storno": return result.storno ? <StornoCard key={key} data={result.storno} /> : null;
    case "predplatne_info": return result.predplatne_info ? <PredplatneCard key={key} data={result.predplatne_info} /> : null;
    case "ochrana_kupujiciho": return result.ochrana_kupujiciho ? <OchranaKupujicihoCard key={key} data={result.ochrana_kupujiciho} /> : null;
    case "licence_digital": return result.licence_digital ? <LicenceCard key={key} data={result.licence_digital} /> : null;
    case "akce_zruseni": return result.akce_zruseni ? <AkceZruseniCard key={key} data={result.akce_zruseni} /> : null;
    case "pojisteni": return result.pojisteni ? <PojisteniCard key={key} data={result.pojisteni} /> : null;
    case "jidlo_kvalita": return result.jidlo_kvalita ? <JidloKvalitaCard key={key} data={result.jidlo_kvalita} /> : null;
    case "lekarna_info": return result.lekarna_info ? <LekarnaCard key={key} data={result.lekarna_info} /> : null;
    default: return null;
  }
}

export const ResultsDashboard = ({ result, onReset, onReanalyze }: ResultsDashboardProps) => {
  const [categoryOverrideOpen, setCategoryOverrideOpen] = useState(false);
  const sections = CATEGORY_SECTIONS[result.kategorie];
  const trust = trustConfig[result.trustRating];
  const catLabel = CATEGORY_LABELS[result.kategorie];
  const allCategories = Object.keys(CATEGORY_LABELS) as ShopCategory[];

  const handlePrint = () => window.print();

  return (
    <div id="results-dashboard" className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 print:hidden">
        <Button variant="ghost" onClick={onReset} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Nová analýza
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5">
            <Download className="w-3.5 h-3.5" /> PDF
          </Button>
          <ShareButton result={result} />
          <a href={result.url.startsWith("http") ? result.url : `https://${result.url}`} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
            {result.siteName} <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Trust Badge */}
      <div className={`rounded-xl border p-4 mb-6 flex items-center gap-3 ${trust.className}`}>
        <VopIcon name={trust.icon} size={32} />
        <div>
          <p className="font-heading font-bold text-lg">{trust.label}</p>
          <p className="text-sm opacity-80">
            {result.trustRating === "ok" && "Podmínky odpovídají standardu nebo jsou nadstandardní."}
            {result.trustRating === "obezretni" && "Některé body vyžadují vaši pozornost."}
            {result.trustRating === "riziko" && "Podmínky obsahují problematické body nebo chybí důležité informace."}
          </p>
        </div>
      </div>

      {/* Title + Category + Category Switcher (moved up per spec 3.6) */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl md:text-3xl font-heading font-bold">{result.siteName}</h1>
          <Badge variant="secondary" className="text-xs font-normal gap-1.5">
            <VopIcon name={catLabel.icon} size={14} />
            {catLabel.label}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-2">
          Analyzováno {new Date(result.analyzedAt).toLocaleDateString("cs-CZ")} · Zde je to, co potřebujete vědět
        </p>

        {/* Category override — compact row under title */}
        {onReanalyze && (
          <div className="print:hidden">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Detekováno jako: <span className="font-medium text-foreground">{catLabel.label}</span></span>
              <button
                onClick={() => setCategoryOverrideOpen(!categoryOverrideOpen)}
                className="text-primary hover:text-primary/80 transition-colors font-medium inline-flex items-center gap-0.5"
              >
                Změnit <VopIcon name={categoryOverrideOpen ? "chevron-up" : "chevron-down"} size={10} />
              </button>
            </div>
            {categoryOverrideOpen && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-w-2xl">
                {allCategories.filter(c => c !== result.kategorie).map(cat => {
                  const label = CATEGORY_LABELS[cat];
                  return (
                    <button
                      key={cat}
                      onClick={() => { onReanalyze(result.url, cat); setCategoryOverrideOpen(false); }}
                      className="text-left p-3 rounded-lg border border-border/60 hover:border-primary/40 hover:bg-accent/50 transition-colors"
                    >
                      <span className="text-sm font-medium flex items-center gap-1.5">
                        <VopIcon name={label.icon} size={16} /> {label.label}
                      </span>
                      <p className="text-xs text-muted-foreground mt-0.5">{CATEGORY_DESCRIPTIONS[cat]}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Banners */}
      <WarningBanner varovani={result.varovani ?? []} />
      <NesouladyBanner nesoulady={result.nesoulady} />
      <BonusBanner bonusy={result.bonusy ?? []} />

      {/* Dynamic Cards */}
      <div className="grid gap-4">
        {sections.map(key => renderSection(key, result))}
      </div>

      {/* Legal References */}
      {(result.pravni_odkazy ?? []).length > 0 && (
        <div className="mt-8 rounded-xl border border-border/60 bg-card p-5">
          <div className="flex items-center gap-3 mb-4">
            <VopIcon name="file-text" size={20} className="text-primary" />
            <h3 className="font-heading font-semibold text-lg">Právní odkazy</h3>
          </div>
          <div className="space-y-2">
            {(result.pravni_odkazy ?? []).map((ref, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <a href={ref.url_esbirka} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {ref.paragraf} {ref.zakon}
                </a>
                <span className="text-muted-foreground">— {ref.kontext}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Zdroje */}
      {result.zdroje && (
        <div className="mt-4 rounded-xl border border-border/60 bg-card p-5">
          <h3 className="font-heading font-semibold text-sm mb-3 text-muted-foreground">Analyzované stránky</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(result.zdroje).filter(([, url]) => url).map(([key, url]) => (
              <a key={key} href={url!} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                <ExternalLink className="w-3 h-3" /> {key.replace(/_/g, " ").replace("url", "").trim() || key}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-8 mb-4 p-4 rounded-xl border border-border/40 bg-muted/30">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <VopIcon name="triangle-alert" size={12} className="text-muted-foreground inline-block mr-1 -mt-0.5" />
          <strong>VOPatrně!</strong> poskytuje informační přehled podmínek, nikoliv právní poradenství.
          Pro právní radu se obraťte na odborníka nebo{" "}
          <a href="https://www.coi.cz/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            ČOI (coi.cz)
          </a>.
        </p>
      </div>
    </div>
  );
};
