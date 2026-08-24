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
  export: "PDF export is coming soon — this briefing is already print-ready.",
  send: "Advance sent — the client gets the share link once the backend is wired up.",
};

/**
 * Prototype advance-form actions. "Preview" opens the full briefing in a
 * dialog; the rest show a transient confirmation.
 */
export function AdvanceActions({
  actions = ["draft", "preview", "send"],
  preview,
  className,
  onSubmit,
  pending = false,
  disabled = false,
}: {
  actions?: Action[];
  preview?: React.ReactNode;
  className?: string;
  /** When provided, Save/Send persist the advance instead of a fake toast. */
  onSubmit?: (status: "draft" | "sent") => void;
  pending?: boolean;
  disabled?: boolean;
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
          <Button
            variant="outline"
            disabled={disabled || pending}
            onClick={() => (onSubmit ? onSubmit("draft") : fire("draft"))}
          >
            <Save className="size-4" />
            Save Draft
          </Button>
        ) : null}
        {actions.includes("preview") && preview ? (
          <Dialog>
            <DialogTrigger render={<Button variant="outline" />}>
              <Eye className="size-4" />
              Preview
            </DialogTrigger>
            <DialogContent className="max-h-[88vh] max-w-3xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Advance preview</DialogTitle>
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
          <Button
            disabled={disabled || pending}
            onClick={() => (onSubmit ? onSubmit("sent") : fire("send"))}
          >
            <Send className="size-4" />
            {pending ? "Saving…" : "Send to Client"}
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
