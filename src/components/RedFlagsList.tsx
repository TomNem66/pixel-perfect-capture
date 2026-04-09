import { RedFlag } from "@/types/analysis";

const severityConfig = {
  "vysoká": { emoji: "🔴", style: "border-l-danger bg-danger/5" },
  "střední": { emoji: "🟡", style: "border-l-warning bg-warning/5" },
  "nízká": { emoji: "⚠️", style: "border-l-muted-foreground bg-muted/50" },
};

export const RedFlagsList = ({ redFlags }: { redFlags: RedFlag[] }) => {
  return (
    <div className="rounded-xl border border-danger/30 bg-danger/5 p-5">
      <h3 className="font-heading font-semibold mb-3 text-danger">⚠️ Varování</h3>
      <div className="space-y-3">
        {redFlags.map((flag, idx) => {
          const config = severityConfig[flag.zavaznost] || severityConfig["nízká"];
          return (
            <div
              key={idx}
              className={`border-l-2 rounded-r-lg p-3 ${config.style}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span>{config.emoji}</span>
                <span className="text-sm font-semibold">{flag.typ}</span>
                <span className="text-xs text-muted-foreground">({flag.zavaznost} závažnost)</span>
              </div>
              <p className="text-xs italic text-muted-foreground mb-1">„{flag.citace}"</p>
              <p className="text-sm">{flag.duvod}</p>
              <p className="text-xs text-muted-foreground mt-1">📖 Zákonný standard: {flag.zakonny_standard}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
