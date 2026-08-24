"use client";

import * as React from "react";
import { BadgeCheck, Check, Send } from "lucide-react";

import { updateContractStatusAction } from "@/app/actions/contracts";
import { Button } from "@/components/ui/button";

/** Move an agreement along: draft → sent → signed. */
export function ContractStatusActions({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const [pending, startTransition] = React.useTransition();
  const set = (next: string) =>
    startTransition(async () => {
      await updateContractStatusAction(id, next);
    });

  if (status === "signed") {
    return (
      <span className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
        <BadgeCheck className="size-4" /> Signed
      </span>
    );
  }

  return (
    <>
      {status === "draft" ? (
        <Button variant="outline" disabled={pending} onClick={() => set("sent")}>
          <Send className="size-4" />
          Mark as sent
        </Button>
      ) : null}
      <Button disabled={pending} onClick={() => set("signed")}>
        <Check className="size-4" />
        {pending ? "Saving…" : "Mark as signed"}
      </Button>
    </>
  );
}
