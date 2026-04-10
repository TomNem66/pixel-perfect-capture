import { TOOLTIPS } from "@/lib/tooltips";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface InfoTooltipProps {
  term: string;
}

export const InfoTooltip = ({ term }: InfoTooltipProps) => {
  const explanation = TOOLTIPS[term];
  if (!explanation) return null;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center justify-center w-4 h-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Info className="w-3 h-3" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs text-xs">
          {explanation}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
