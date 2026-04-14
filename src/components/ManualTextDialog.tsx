import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText } from "lucide-react";

interface ManualTextDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  originalUrl: string;
  onSubmit: (rawText: string, url: string) => void;
}

export const ManualTextDialog = ({
  open,
  onOpenChange,
  originalUrl,
  onSubmit,
}: ManualTextDialogProps) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length > 50) {
      onSubmit(text.trim(), originalUrl);
      setText("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <DialogTitle className="font-heading">
              Vložit text podmínek ručně
            </DialogTitle>
          </div>
          <DialogDescription>
            Zkopírujte celý text obchodních podmínek z webu{" "}
            <span className="font-medium text-foreground">{originalUrl}</span>{" "}
            a vložte ho sem. Systém ho analyzuje místo automatického stahování.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Textarea
            placeholder="Vložte sem celý text obchodních podmínek (VOP)..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mb-2 min-h-[250px] text-sm"
            required
          />
          <p className="text-xs text-muted-foreground mb-4">
            {text.length > 0 ? `${text.length} znaků` : "Minimálně 50 znaků"}
          </p>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Zrušit
            </Button>
            <Button type="submit" disabled={text.trim().length < 50}>
              Analyzovat text
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
