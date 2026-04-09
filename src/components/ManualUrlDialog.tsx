import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";

interface ManualUrlDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  originalUrl: string;
  onSubmit: (termsUrl: string) => void;
}

export const ManualUrlDialog = ({
  open,
  onOpenChange,
  originalUrl,
  onSubmit,
}: ManualUrlDialogProps) => {
  const [termsUrl, setTermsUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (termsUrl.trim()) {
      onSubmit(termsUrl.trim());
      setTermsUrl("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-warning" />
            <DialogTitle className="font-heading">
              Podmínky nenalezeny
            </DialogTitle>
          </div>
          <DialogDescription>
            Nepodařilo se automaticky najít obchodní podmínky pro{" "}
            <span className="font-medium text-foreground">{originalUrl}</span>.
            Zadejte prosím URL stránky s obchodními podmínkami přímo.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            type="url"
            placeholder="https://example.com/obchodni-podminky"
            value={termsUrl}
            onChange={(e) => setTermsUrl(e.target.value)}
            className="mb-4"
            required
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Zrušit
            </Button>
            <Button type="submit" disabled={!termsUrl.trim()}>
              Analyzovat
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
