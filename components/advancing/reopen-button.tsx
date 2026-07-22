"use client";

import * as React from "react";
import { LockOpen } from "lucide-react";

import { reopenAdvanceForClient } from "@/app/actions/advance-share";
import { Button } from "@/components/ui/button";

/** Shown when a client has locked their submission — reopens it for editing. */
export function ReopenButton({ id }: { id: string }) {
  const [pending, startTransition] = React.useTransition();
  return (
    <div className="space-y-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
      <p className="text-xs text-muted-foreground">
        The client confirmed and locked their details. Reopen to let them edit
        again with a fresh link.
      </p>
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await reopenAdvanceForClient(id);
          })
        }
      >
        <LockOpen className="size-4" />
        {pending ? "Reopening…" : "Reopen for client editing"}
      </Button>
    </div>
  );
}
