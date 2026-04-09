import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Check, Copy } from "lucide-react";
import { AnalysisResult } from "@/types/analysis";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ShareButtonProps {
  result: AnalysisResult;
}

function encodeResult(result: AnalysisResult): string {
  const data = JSON.stringify(result);
  return btoa(encodeURIComponent(data));
}

export const ShareButton = ({ result }: ShareButtonProps) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/share?data=${encodeResult(result)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="w-4 h-4" />
          Sdílet
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-3">
          <p className="text-sm font-medium font-heading">Sdílet výsledky analýzy</p>
          <div className="flex gap-2">
            <code className="flex-1 text-xs bg-muted p-2 rounded-md truncate block">
              {shareUrl.slice(0, 60)}...
            </code>
            <Button size="sm" variant="secondary" onClick={handleCopy} className="gap-1">
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? "Zkopírováno" : "Kopírovat"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
