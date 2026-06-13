"use client";

import * as React from "react";
import Link from "next/link";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Save / cancel bar for the prototype create forms. Save shows a transient
 * confirmation instead of persisting.
 */
export function PrototypeSave({
  saveLabel = "Save",
  cancelHref,
  note = "Prototype — nothing is persisted yet.",
  className,
}: {
  saveLabel?: string;
  cancelHref: string;
  note?: string;
  className?: string;
}) {
  const [saved, setSaved] = React.useState(false);

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <Button
        onClick={() => {
          setSaved(true);
          window.setTimeout(() => setSaved(false), 3500);
        }}
      >
        {saveLabel}
      </Button>
      <Button variant="ghost" nativeButton={false} render={<Link href={cancelHref} />}>
        Cancel
      </Button>
      {saved ? (
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Check className="size-3.5 text-primary" />
          {note}
        </span>
      ) : null}
    </div>
  );
}
