import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, ArrowRight } from "lucide-react";

interface UrlInputProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

export const UrlInput = ({ onAnalyze, isLoading }: UrlInputProps) => {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) onAnalyze(url.trim());
  };

  return (
    <div className="max-w-2xl mx-auto text-center py-16 md:py-24">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
        <Shield className="w-8 h-8 text-primary" />
      </div>

      <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-4">
        VO<span className="text-primary">Patrně!</span>
      </h1>

      <p className="text-muted-foreground text-lg mb-10 max-w-md mx-auto">
        Analyzujte obchodní podmínky jakékoliv webové stránky a zjistěte, na co si dát pozor.
      </p>

      <form onSubmit={handleSubmit} className="flex gap-3 max-w-lg mx-auto">
        <Input
          type="url"
          placeholder="https://example.com/terms"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="h-12 text-base bg-card border-border/60 focus-visible:ring-primary/40"
          disabled={isLoading}
          required
        />
        <Button type="submit" size="lg" disabled={isLoading || !url.trim()} className="h-12 px-6 gap-2">
          Analyzovat
          <ArrowRight className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};
