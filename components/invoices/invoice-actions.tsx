"use client";

import * as React from "react";
import { Check, Download, Save, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Action = "draft" | "export" | "send";

const confirmations: Record<Action, string> = {
  draft: "Draft saved — prototype only, nothing is persisted yet.",
  export: "PDF export is coming soon — this layout is already print-ready.",
  send: "Invoice marked as sent — email delivery arrives with the backend.",
};

/**
 * Prototype action buttons: each click shows a transient confirmation
 * instead of performing a real save / export / send.
 */
export function InvoiceActions({
  actions = ["draft", "export", "send"],
  disabled = false,
  className,
}: {
  actions?: Action[];
  /** e.g. free-plan invoice limit reached. */
  disabled?: boolean;
  className?: string;
}) {
  const [done, setDone] = React.useState<Action | null>(null);

  function fire(action: Action) {
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
        {actions.includes("export") ? (
          <Button variant="outline" onClick={() => fire("export")}>
            <Download className="size-4" />
            Export PDF
          </Button>
        ) : null}
        {actions.includes("send") ? (
          <Button onClick={() => fire("send")} disabled={disabled}>
            <Send className="size-4" />
            Send Invoice
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
