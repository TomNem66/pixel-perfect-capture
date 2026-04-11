import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { VopIcon } from "@/components/shared/VopIcon";

interface CitaceTooltipProps {
  citace: string | null | undefined;
}

export const CitaceTooltip = ({ citace }: CitaceTooltipProps) => {
  const text = citace
    ? `Přesné znění: „${citace}"`
    : "Informace nebyla v podmínkách nalezena";

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center justify-center flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          >
            <VopIcon name="question-circle" size={12} className="text-muted-foreground" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs text-xs">
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
