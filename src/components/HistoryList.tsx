import { HistoryItem } from "@/types/analysis";
import { Clock, ExternalLink } from "lucide-react";

interface HistoryListProps {
  items: HistoryItem[];
  onSelect: (url: string) => void;
}

export const HistoryList = ({ items, onSelect }: HistoryListProps) => {
  if (items.length === 0) return null;

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Historie analýz
        </h2>
      </div>

      <div className="grid gap-2">
        {items.map((item) => (
          <button
            key={item.url + item.analyzedAt}
            onClick={() => onSelect(item.url)}
            className="flex items-center justify-between p-3 rounded-lg bg-card border border-border/60 hover:border-primary/30 hover:bg-accent/30 transition-all text-left group"
          >
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">{item.siteName}</p>
              <p className="text-xs text-muted-foreground truncate">{item.url}</p>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
};
