import { useState } from "react";
import { AnalysisResult, TrustRating } from "@/types/analysis";
import { Button } from "@/components/ui/button";
import { ShareButton } from "./ShareButton";
import { Badge } from "@/components/ui/badge";
import { CategoryCard } from "@/components/shared/CategoryCard";
import { FactRow } from "@/components/shared/FactRow";
import { BoolRow } from "@/components/shared/BoolRow";
import { StornoCard } from "@/components/cards/StornoCard";
import { PredplatneCard } from "@/components/cards/PredplatneCard";
import { OchranaKupujicihoCard } from "@/components/cards/OchranaKupujicihoCard";
import { LicenceCard } from "@/components/cards/LicenceCard";
import { AkceZruseniCard } from "@/components/cards/AkceZruseniCard";
import { PojisteniCard } from "@/components/cards/PojisteniCard";
import { JidloKvalitaCard } from "@/components/cards/JidloKvalitaCard";
import { LekarnaCard } from "@/components/cards/LekarnaCard";
import { CATEGORY_SECTIONS, CATEGORY_LABELS, CATEGORY_DESCRIPTIONS } from "@/lib/categoryMapping";
import type { SectionKey } from "@/lib/categoryMapping";
import type { ShopCategory } from "@/types/analysis";
import {
  ArrowLeft, ExternalLink, Store, Package, Wrench, CreditCard, Truck,
  AlertTriangle, Star, FileText, ChevronDown, ChevronUp, Download,
} from "lucide-react";

interface ResultsDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
  onReanalyze?: (url: string, category: ShopCategory) => void;
}

const trustConfig: Record<TrustRating, { emoji: string; label: string; className: string }> = {
  ok: { emoji: "🟢", label: "Podmínky v pořádku", className: "border-success/40 bg-success/10 text-success" },
  obezretni: { emoji: "🟡", label: "Buďte obezřetní", className: "border-warning/40 bg-warning/10 text-warning" },
  riziko: { emoji: "🔴", label: "Zvýšené riziko", className: "border-danger/40 bg-danger/10 text-danger" },
};

const WarningBanner = ({ varovani }: { varovani: AnalysisResult["varovani"] }) => {
  if (varovani.length === 0) return null;
  const critical = varovani.filter(v => v.zavaznost === "kritické");
  const warnings = varovani.filter(v => v.zavaznost === "pozor");
  const infos = varovani.filter(v => v.zavaznost === "info");

  return (
    <div className="space-y-2 mb-6">
      {critical.length > 0 && (
        <div className="rounded-xl border border-danger/30 bg-danger/5 p-4">
          <h4 className="font-heading font-semibold text-danger flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4" /> Kritická varování
          </h4>
          <ul className="space-y-1">
            {critical.map((v, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span className="text-danger mt-0.5">🔴</span>
                <span><span className="text-muted-foreground text-xs">[{v.kategorie}]</span> {v.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {warnings.length > 0 && (
        <div className="rounded-xl border border-warning/30 bg-warning/5 p-4">
          <h4 className="font-heading font-semibold text-warning flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4" /> Na co si dát pozor
          </h4>
          <ul className="space-y-1">
            {warnings.map((v, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span className="text-warning mt-0.5">⚠️</span>
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
                <span className="text-primary mt-0.5">ℹ️</span>
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
  if (bonusy.length === 0) return null;
  return (
    <div className="rounded-xl border border-success/30 bg-success/5 p-4 mb-6">
      <h4 className="font-heading font-semibold text-success flex items-center gap-2 mb-2">
        <Star className="w-4 h-4" /> Nadstandardní podmínky
      </h4>
      <ul className="space-y-1">
        {bonusy.map((b, i) => (
          <li key={i} className="text-sm flex items-start gap-2">
            <span className="text-success mt-0.5">🌟</span>
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
        <AlertTriangle className="w-4 h-4" /> Nesoulad mezi FAQ a VOP
      </h4>
      {nesoulady.map((n, i) => (
        <div key={i} className="text-sm mt-2">
          <p className="font-medium">{n.tema}</p>
          <p className="text-muted-foreground">VOP uvádí: <span className="text-foreground">„{n.vop_rika}"</span></p>
          <p className="text-muted-foreground">FAQ uvádí: <span className="text-foreground">„{n.faq_rika}"</span></p>
          <p className="text-xs text-warning mt-1">⚠️ Právně závazné jsou VOP.</p>
        </div>
      ))}
    </div>
  );
};

const ProdejceCard = ({ prodejce }: { prodejce: AnalysisResult["prodejce"] }) => (
  <CategoryCard icon={<Store className="w-5 h-5 text-primary" />} title="Kdo vám prodává">
    <FactRow label="Název firmy" value={prodejce.nazev} />
    <FactRow label="IČO" value={prodejce.ico} />
    <FactRow label="Sídlo" value={prodejce.sidlo} />
    <FactRow label="Země sídla" value={prodejce.zeme} variant={prodejce.zeme === "mimo EU" ? "warning" : undefined} />
    <FactRow label="Typ prodejce" value={prodejce.typ === "neuvedeno" ? null : prodejce.typ} variant={prodejce.typ === "zprostředkovatel" ? "warning" : undefined} tooltip={prodejce.typ === "zprostředkovatel" ? "zprostředkovatel" : undefined} />
    <FactRow label="Zápis v OR" value={prodejce.zapis_or} />
  </CategoryCard>
);

const VraceniCard = ({ vraceni }: { vraceni: NonNullable<AnalysisResult["vraceni"]> }) => (
  <CategoryCard icon={<Package className="w-5 h-5 text-primary" />} title="Vrácení zboží">
    <FactRow
      label="Lhůta na vrácení" value={vraceni.lhuta_dny != null ? `${vraceni.lhuta_dny} dní` : null}
      variant={vraceni.lhuta_dny != null && vraceni.lhuta_dny > 14 ? "bonus" : undefined}
      compliance={vraceni.lhuta_dny != null ? (vraceni.lhuta_dny > 14 ? "better" : "standard") : "unknown"}
      tooltip="odstoupení od smlouvy"
    />
    <FactRow label="Poštovné při vrácení" value={vraceni.kdo_plati_postovne === "neuvedeno" ? null : `hradí ${vraceni.kdo_plati_postovne}`} variant={vraceni.kdo_plati_postovne === "e-shop" ? "bonus" : undefined} />
    <FactRow label="Výjimky z vrácení" value={vraceni.vyjimky.length > 0 ? vraceni.vyjimky.join(", ") : "Žádné speciální výjimky"} />
    <FactRow label="Sankce za vrácení" value={vraceni.sankce || "Žádné"} variant={vraceni.sankce ? "warning" : undefined} />
    <FactRow label="Vrácení peněz" value={vraceni.lhuta_vraceni_penez_dny != null ? `do ${vraceni.lhuta_vraceni_penez_dny} dní` : null} />
  </CategoryCard>
);

const ReklamaceCard = ({ reklamace }: { reklamace: NonNullable<AnalysisResult["reklamace"]> }) => (
  <CategoryCard icon={<Wrench className="w-5 h-5 text-primary" />} title="Reklamace a záruka">
    <FactRow
      label="Záruční doba" value={reklamace.zarucni_doba_mesice != null ? `${reklamace.zarucni_doba_mesice} měsíců` : null}
      compliance={reklamace.zarucni_doba_mesice != null ? (reklamace.zarucni_doba_mesice >= 24 ? "standard" : "worse") : "unknown"}
      tooltip="záruční doba"
    />
    <FactRow label="Adresa pro reklamaci" value={reklamace.adresa_reklamace} />
    <FactRow label="Reklamace v zahraničí" value={reklamace.reklamace_v_zahranici ? "Ano – zasílá se do zahraničí" : "Ne – v ČR"} variant={reklamace.reklamace_v_zahranici ? "warning" : undefined} />
    <BoolRow label="Sběrné místo v ČR" value={reklamace.sberne_misto_cr} />
    <BoolRow label="Hradí dopravu vadného" value={reklamace.hradi_dopravu_vadneho} />
    <FactRow label="Lhůta vyřízení" value={reklamace.lhuta_vyrizeni_dny != null ? `${reklamace.lhuta_vyrizeni_dny} dní` : null}
      compliance={reklamace.lhuta_vyrizeni_dny != null ? (reklamace.lhuta_vyrizeni_dny <= 30 ? "standard" : "worse") : "unknown"}
      variant={reklamace.lhuta_vyrizeni_dny != null && reklamace.lhuta_vyrizeni_dny > 30 ? "warning" : undefined}
    />
    <FactRow label="Vrácení peněz" value={reklamace.lhuta_vraceni_penez_dny != null ? `do ${reklamace.lhuta_vraceni_penez_dny} dní` : null} />
  </CategoryCard>
);

const PlatbyCard = ({ platby }: { platby: NonNullable<AnalysisResult["platby"]> }) => (
  <CategoryCard icon={<CreditCard className="w-5 h-5 text-primary" />} title="Platby a poplatky">
    <FactRow label="Platební metody" value={platby.metody.length > 0 ? platby.metody.join(", ") : null} />
    <FactRow label="Dobírka" value={platby.ma_dobirku ? "Ano" : "Ne"} />
    <FactRow label="Skryté poplatky" value={platby.skryte_poplatky.length > 0 ? platby.skryte_poplatky.join(", ") : "Žádné"} variant={platby.skryte_poplatky.length > 0 ? "warning" : undefined} />
    <FactRow label="Sankce za nevyzvednutí" value={platby.sankce_nevyzvedni || "Žádné"} variant={platby.sankce_nevyzvedni ? "warning" : undefined} tooltip={platby.sankce_nevyzvedni ? "smluvní pokuta" : undefined} />
    <FactRow label="Ceny vč. DPH" value={platby.ceny_vcetne_dph === true ? "Ano" : platby.ceny_vcetne_dph === false ? "Ne" : null} variant={platby.ceny_vcetne_dph === false ? "warning" : undefined} />
  </CategoryCard>
);

const DopravaCard = ({ doprava }: { doprava: NonNullable<AnalysisResult["doprava"]> }) => (
  <CategoryCard icon={<Truck className="w-5 h-5 text-primary" />} title="Doprava a dodání">
    <FactRow label="Dodací lhůta" value={doprava.dodaci_lhuta_dny != null ? `${doprava.dodaci_lhuta_dny} dní` : null} variant={doprava.dodaci_lhuta_dny != null && doprava.dodaci_lhuta_dny > 30 ? "warning" : undefined} />
    {doprava.dodaci_lhuta_text && <FactRow label="Formulace z VOP" value={`„${doprava.dodaci_lhuta_text}"`} />}
    <FactRow label="Způsoby dopravy" value={doprava.zpusoby.length > 0 ? doprava.zpusoby.join(", ") : null} />
    <FactRow label="Odpovědnost za poškození" value={doprava.odpovednost_poskozeni} />
    <BoolRow label="Sledování zásilky" value={doprava.sledovani_zasilky} />
  </CategoryCard>
);

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
        <span className="text-2xl">{trust.emoji}</span>
        <div>
          <p className="font-heading font-bold text-lg">{trust.label}</p>
          <p className="text-sm opacity-80">
            {result.trustRating === "ok" && "Podmínky odpovídají standardu nebo jsou nadstandardní."}
            {result.trustRating === "obezretni" && "Některé body vyžadují vaši pozornost."}
            {result.trustRating === "riziko" && "Podmínky obsahují problematické body nebo chybí důležité informace."}
          </p>
        </div>
      </div>

      {/* Title + Category */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl md:text-3xl font-heading font-bold">{result.siteName}</h1>
          <Badge variant="secondary" className="text-xs font-normal">{result.kategorie_label}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Analyzováno {new Date(result.analyzedAt).toLocaleDateString("cs-CZ")} · Zde je to, co potřebujete vědět
        </p>
      </div>

      {/* Banners */}
      <WarningBanner varovani={result.varovani} />
      <NesouladyBanner nesoulady={result.nesoulady} />
      <BonusBanner bonusy={result.bonusy} />

      {/* Dynamic Cards */}
      <div className="grid gap-4">
        {sections.map(key => renderSection(key, result))}
      </div>

      {/* Legal References */}
      {result.pravni_odkazy.length > 0 && (
        <div className="mt-8 rounded-xl border border-border/60 bg-card p-5">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="font-heading font-semibold text-lg">Právní odkazy</h3>
          </div>
          <div className="space-y-2">
            {result.pravni_odkazy.map((ref, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span>📖</span>
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

      {/* Category Override */}
      {onReanalyze && (
        <div className="mt-6 text-center print:hidden">
          <button
            onClick={() => setCategoryOverrideOpen(!categoryOverrideOpen)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
          >
            Jedná se o jiný typ obchodu?
            {categoryOverrideOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          {categoryOverrideOpen && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-w-2xl mx-auto">
              {allCategories.filter(c => c !== result.kategorie).map(cat => {
                const label = CATEGORY_LABELS[cat];
                return (
                  <button
                    key={cat}
                    onClick={() => { onReanalyze(result.url, cat); setCategoryOverrideOpen(false); }}
                    className="text-left p-3 rounded-lg border border-border/60 hover:border-primary/40 hover:bg-accent/50 transition-colors"
                  >
                    <span className="text-sm font-medium">{label.emoji} {label.label}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">{CATEGORY_DESCRIPTIONS[cat]}</p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-8 mb-4 p-4 rounded-xl border border-border/40 bg-muted/30">
        <p className="text-xs text-muted-foreground leading-relaxed">
          ⚠️ <strong>VOPatrně!</strong> je informační nástroj a může obsahovat nepřesnosti.
          Výstupy nepředstavují právní poradenství. Vždy si ověřte informace
          přímo u prodejce a v případě potřeby se obraťte na právníka
          nebo{" "}
          <a href="https://www.coi.cz/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            Českou obchodní inspekci (ČOI)
          </a>.
        </p>
      </div>
    </div>
  );
};
