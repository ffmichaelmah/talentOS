"use client";

import * as React from "react";

import { changePlanAction } from "@/app/actions/subscription";
import { Button } from "@/components/ui/button";

export function ChangePlanButton({
  planId,
  label,
  isCurrent,
  highlighted,
}: {
  planId: string;
  label: string;
  isCurrent: boolean;
  highlighted: boolean;
}) {
  const [pending, startTransition] = React.useTransition();

  return (
    <Button
      className="mt-auto w-full"
      variant={isCurrent || !highlighted ? "outline" : "default"}
      disabled={isCurrent || pending}
      onClick={() =>
        startTransition(async () => {
          await changePlanAction(planId);
        })
      }
    >
      {isCurrent ? "Current plan" : pending ? "Switching…" : label}
    </Button>
  );
}
