import { AnalysisResult } from "@/types/analysis";
import { Button } from "@/components/ui/button";
import { ShareButton } from "./ShareButton";
import { ArrowLeft, ExternalLink, Store, Package, Wrench, CreditCard, Truck, AlertTriangle, Star } from "lucide-react";

interface ResultsDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
}

const FactRow = ({ label, value, variant }: { label: string; value: string | null | undefined; variant?: "warning" | "bonus" | "muted" }) => {
  const displayValue = value || "Neuvedeno ve VOP";
  const isMissing = !value;

  return (
    <div className="flex items-start gap-2 text-sm py-1.5">
      <span className="text-muted-foreground min-w-[160px] flex-shrink-0">{label}</span>
      <span className={
        variant === "warning" ? "text-warning font-medium" :
        variant === "bonus" ? "text-success font-medium" :
        isMissing ? "text-muted-foreground italic" :
        ""
      }>
        {variant === "warning" && "⚠️ "}{variant === "bonus" && "🌟 "}{displayValue}
      </span>
    </div>
  );
};

const BoolRow = ({ label, value }: { label: string; value: boolean | null | undefined }) => (
  <FactRow
    label={label}
    value={value === true ? "Ano" : value === false ? "Ne" : null}
  />
);

const CategoryCard = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <div className="rounded-xl border border-border/60 bg-card p-5">
    <div className="flex items-center gap-3 mb-4">
      {icon}
      <h3 className="font-heading font-semibold text-lg">{title}</h3>
    </div>
    <div className="divide-y divide-border/30">
      {children}
    </div>
  </div>
);

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

export const ResultsDashboard = ({ result, onReset }: ResultsDashboardProps) => {
  const { prodejce, vraceni, reklamace, platby, doprava } = result;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" onClick={onReset} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Nová analýza
        </Button>
        <div className="flex items-center gap-2">
          <ShareButton result={result} />
          <a
            href={result.url.startsWith("http") ? result.url : `https://${result.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            {result.siteName}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Title */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold mb-1">
          {result.siteName}
        </h1>
        <p className="text-sm text-muted-foreground">
          Analyzováno {new Date(result.analyzedAt).toLocaleDateString("cs-CZ")} · Zde je to, co potřebujete vědět, než tu nakoupíte
        </p>
      </div>

      {/* Warnings & Bonuses */}
      <WarningBanner varovani={result.varovani} />
      <BonusBanner bonusy={result.bonusy} />

      {/* Cards */}
      <div className="grid gap-4">
        {/* 1. Prodejce */}
        <CategoryCard icon={<Store className="w-5 h-5 text-primary" />} title="Kdo vám prodává">
          <FactRow label="Název firmy" value={prodejce.nazev} />
          <FactRow label="IČO" value={prodejce.ico} />
          <FactRow label="Sídlo" value={prodejce.sidlo} />
          <FactRow
            label="Země sídla"
            value={prodejce.zeme}
            variant={prodejce.zeme === "mimo EU" ? "warning" : undefined}
          />
          <FactRow
            label="Typ prodejce"
            value={prodejce.typ === "neuvedeno" ? null : prodejce.typ}
            variant={prodejce.typ === "zprostředkovatel" ? "warning" : undefined}
          />
          <FactRow label="Zápis v OR" value={prodejce.zapis_or} />
        </CategoryCard>

        {/* 2. Vrácení */}
        <CategoryCard icon={<Package className="w-5 h-5 text-primary" />} title="Vrácení zboží">
          <FactRow
            label="Lhůta na vrácení"
            value={vraceni.lhuta_dny != null ? `${vraceni.lhuta_dny} dní` : null}
            variant={vraceni.lhuta_dny != null && vraceni.lhuta_dny > 14 ? "bonus" : undefined}
          />
          <FactRow
            label="Poštovné při vrácení"
            value={vraceni.kdo_plati_postovne === "neuvedeno" ? null : `hradí ${vraceni.kdo_plati_postovne}`}
            variant={vraceni.kdo_plati_postovne === "e-shop" ? "bonus" : undefined}
          />
          <FactRow
            label="Výjimky z vrácení"
            value={vraceni.vyjimky.length > 0 ? vraceni.vyjimky.join(", ") : "Žádné speciální výjimky"}
          />
          <FactRow
            label="Sankce za vrácení"
            value={vraceni.sankce || "Žádné"}
            variant={vraceni.sankce ? "warning" : undefined}
          />
          <FactRow
            label="Vrácení peněz"
            value={vraceni.lhuta_vraceni_penez_dny != null ? `do ${vraceni.lhuta_vraceni_penez_dny} dní` : null}
          />
        </CategoryCard>

        {/* 3. Reklamace */}
        <CategoryCard icon={<Wrench className="w-5 h-5 text-primary" />} title="Reklamace a záruka">
          <FactRow
            label="Záruční doba"
            value={reklamace.zarucni_doba_mesice != null ? `${reklamace.zarucni_doba_mesice} měsíců` : null}
          />
          <FactRow label="Adresa pro reklamaci" value={reklamace.adresa_reklamace} />
          <FactRow
            label="Reklamace v zahraničí"
            value={reklamace.reklamace_v_zahranici ? "Ano – reklamace se zasílá do zahraničí" : "Ne – v ČR"}
            variant={reklamace.reklamace_v_zahranici ? "warning" : undefined}
          />
          <BoolRow label="Sběrné místo v ČR" value={reklamace.sberne_misto_cr} />
          <BoolRow label="Hradí dopravu vadného" value={reklamace.hradi_dopravu_vadneho} />
          <FactRow
            label="Lhůta vyřízení"
            value={reklamace.lhuta_vyrizeni_dny != null ? `${reklamace.lhuta_vyrizeni_dny} dní` : null}
            variant={reklamace.lhuta_vyrizeni_dny != null && reklamace.lhuta_vyrizeni_dny > 30 ? "warning" : undefined}
          />
          <FactRow
            label="Vrácení peněz"
            value={reklamace.lhuta_vraceni_penez_dny != null ? `do ${reklamace.lhuta_vraceni_penez_dny} dní` : null}
          />
        </CategoryCard>

        {/* 4. Platby */}
        <CategoryCard icon={<CreditCard className="w-5 h-5 text-primary" />} title="Platby a poplatky">
          <FactRow
            label="Platební metody"
            value={platby.metody.length > 0 ? platby.metody.join(", ") : null}
          />
          <FactRow
            label="Dobírka"
            value={platby.ma_dobirku ? "Ano" : "Ne"}
          />
          <FactRow
            label="Skryté poplatky"
            value={platby.skryte_poplatky.length > 0 ? platby.skryte_poplatky.join(", ") : "Žádné"}
            variant={platby.skryte_poplatky.length > 0 ? "warning" : undefined}
          />
          <FactRow
            label="Sankce za nevyzvednutí"
            value={platby.sankce_nevyzvedni || "Žádné"}
            variant={platby.sankce_nevyzvedni ? "warning" : undefined}
          />
          <FactRow
            label="Ceny vč. DPH"
            value={platby.ceny_vcetne_dph === true ? "Ano" : platby.ceny_vcetne_dph === false ? "Ne" : null}
            variant={platby.ceny_vcetne_dph === false ? "warning" : undefined}
          />
        </CategoryCard>

        {/* 5. Doprava */}
        <CategoryCard icon={<Truck className="w-5 h-5 text-primary" />} title="Doprava a dodání">
          <FactRow
            label="Dodací lhůta"
            value={doprava.dodaci_lhuta_dny != null ? `${doprava.dodaci_lhuta_dny} dní` : null}
            variant={doprava.dodaci_lhuta_dny != null && doprava.dodaci_lhuta_dny > 30 ? "warning" : undefined}
          />
          {doprava.dodaci_lhuta_text && (
            <FactRow label="Formulace z VOP" value={`„${doprava.dodaci_lhuta_text}"`} />
          )}
          <FactRow
            label="Způsoby dopravy"
            value={doprava.zpusoby.length > 0 ? doprava.zpusoby.join(", ") : null}
          />
          <FactRow label="Odpovědnost za poškození" value={doprava.odpovednost_poskozeni} />
          <BoolRow label="Sledování zásilky" value={doprava.sledovani_zasilky} />
        </CategoryCard>
      </div>
    </div>
  );
};
