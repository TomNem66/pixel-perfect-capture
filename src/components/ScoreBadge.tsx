import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

function getScoreColor(score: number): string {
  if (score >= 75) return "bg-success/15 text-success border-success/30";
  if (score >= 50) return "bg-primary/15 text-primary border-primary/30";
  if (score >= 35) return "bg-warning/15 text-warning border-warning/30";
  return "bg-danger/15 text-danger border-danger/30";
}

const sizes = {
  sm: "w-9 h-9 text-xs",
  md: "w-12 h-12 text-sm",
  lg: "w-20 h-20 text-2xl",
};

export const ScoreBadge = ({ score, size = "md" }: ScoreBadgeProps) => {
  return (
    <div
      className={cn(
        "rounded-xl border font-heading font-bold flex items-center justify-center flex-shrink-0",
        getScoreColor(score),
        sizes[size]
      )}
    >
      {score}
    </div>
  );
};
