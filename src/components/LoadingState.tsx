import { cn } from "@/lib/utils";
import { Globe, FileText, Brain, BarChart3, Check, Loader2 } from "lucide-react";

interface LoadingStateProps {
  currentStep: string;
}

const steps = [
  { key: "fetching", label: "Stahování stránky", icon: Globe },
  { key: "parsing", label: "Parsování podmínek", icon: FileText },
  { key: "analyzing", label: "AI analýza obsahu", icon: Brain },
  { key: "scoring", label: "Vyhodnocování skóre", icon: BarChart3 },
];

export const LoadingState = ({ currentStep }: LoadingStateProps) => {
  const currentIdx = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="max-w-sm mx-auto py-12">
      <div className="space-y-3">
        {steps.map((step, idx) => {
          const isActive = idx === currentIdx;
          const isCompleted = idx < currentIdx;
          const Icon = step.icon;

          return (
            <div
              key={step.key}
              className={cn(
                "step-indicator",
                isActive && "active",
                isCompleted && "completed"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                isActive && "bg-primary text-primary-foreground",
                isCompleted && "bg-primary/20 text-primary",
                !isActive && !isCompleted && "bg-muted text-muted-foreground"
              )}>
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : isActive ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              <span className={cn(
                "text-sm font-medium transition-colors",
                isActive && "text-foreground",
                isCompleted && "text-primary",
                !isActive && !isCompleted && "text-muted-foreground"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
