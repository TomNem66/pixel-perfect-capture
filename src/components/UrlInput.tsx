import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import vopatrneLogo from "@/assets/vopatrne-icon.svg";

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
    <div className="relative max-w-2xl mx-auto text-center py-16 md:py-24">
      <div className="inline-flex items-center justify-center w-20 h-20 mb-6">
        <img src={vopatrneLogo} alt="VOPatrně!" className="w-20 h-20" />
      </div>

      <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-2">
        VO<span className="text-primary">Patrně!</span>
      </h1>

      <p className="text-xs font-heading tracking-[0.25em] uppercase text-primary/50 mb-4">
        Přečteme to za vás
      </p>

      <p className="text-muted-foreground text-lg mb-10 max-w-md mx-auto">
        Analyzujte obchodní podmínky českých e‑shopů a zjistěte, na co si dát pozor.
      </p>

      <form onSubmit={handleSubmit} className="flex gap-3 max-w-lg mx-auto">
        <Input
          type="url"
          placeholder="Zadejte URL e-shopu"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="h-12 text-base bg-card/80 backdrop-blur-sm border-border/60 focus-visible:ring-primary/40"
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
