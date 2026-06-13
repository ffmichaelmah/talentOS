"use client";

import * as React from "react";
import { Check, Download, Eye, Save, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type Action = "draft" | "preview" | "export" | "send";

const confirmations: Record<Exclude<Action, "preview">, string> = {
  draft: "Draft saved — prototype only, nothing is persisted yet.",
  export: "PDF export is coming soon — this layout is already print-ready.",
  send: "Contract marked as sent — e-signature delivery arrives with the backend.",
};

/**
 * Prototype contract action buttons. "Preview Contract" opens the full
 * document in a dialog; the rest show a transient confirmation.
 */
export function ContractActions({
  actions = ["draft", "preview", "export", "send"],
  preview,
  disabled = false,
  className,
}: {
  actions?: Action[];
  /** Full-document preview rendered inside the Preview Contract dialog. */
  preview?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}) {
  const [done, setDone] = React.useState<Exclude<Action, "preview"> | null>(
    null
  );

  function fire(action: Exclude<Action, "preview">) {
    setDone(action);
    window.setTimeout(() => setDone((d) => (d === action ? null : d)), 3500);
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap gap-2">
        {actions.includes("draft") ? (
          <Button variant="outline" onClick={() => fire("draft")} disabled={disabled}>
            <Save className="size-4" />
            Save Draft
          </Button>
        ) : null}
        {actions.includes("preview") && preview ? (
          <Dialog>
            <DialogTrigger render={<Button variant="outline" />}>
              <Eye className="size-4" />
              Preview Contract
            </DialogTrigger>
            <DialogContent className="max-h-[88vh] max-w-3xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Contract preview</DialogTitle>
              </DialogHeader>
              {preview}
            </DialogContent>
          </Dialog>
        ) : null}
        {actions.includes("export") ? (
          <Button variant="outline" onClick={() => fire("export")}>
            <Download className="size-4" />
            Export PDF
          </Button>
        ) : null}
        {actions.includes("send") ? (
          <Button onClick={() => fire("send")} disabled={disabled}>
            <Send className="size-4" />
            Send to Client
          </Button>
        ) : null}
      </div>
      {done ? (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Check className="size-3.5 text-primary" />
          {confirmations[done]}
        </p>
      ) : null}
    </div>
  );
}
