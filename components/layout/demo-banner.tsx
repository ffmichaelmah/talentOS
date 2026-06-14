"use client";

import * as React from "react";
import { Sparkles, X } from "lucide-react";

/**
 * Slim, dismissible notice making the prototype nature explicit: actions like
 * Save / Send / Export show confirmations but don't persist yet. Dismissal is
 * per page-load (it persists across in-app navigation, resets on reload).
 */
export function DemoBanner() {
  const [dismissed, setDismissed] = React.useState(false);

  if (dismissed) return null;

  return (
    <div className="flex items-center justify-center gap-2 border-b border-primary/15 bg-primary/5 px-4 py-2 text-center text-xs text-muted-foreground">
      <Sparkles className="size-3.5 shrink-0 text-primary" />
      <span>
        <span className="font-medium text-foreground">Demo preview</span> —
        explore freely; your data isn&apos;t saved yet.
      </span>
      <button
        type="button"
        aria-label="Dismiss demo notice"
        onClick={() => setDismissed(true)}
        className="ml-1 rounded-md p-0.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}
