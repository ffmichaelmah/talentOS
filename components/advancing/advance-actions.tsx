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
}: {
  actions?: Action[];
  preview?: React.ReactNode;
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
          <Button variant="outline" onClick={() => fire("draft")}>
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
          <Button onClick={() => fire("send")}>
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
