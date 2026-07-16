"use client";

import * as React from "react";
import { RotateCcw } from "lucide-react";

import {
  cancelSubscriptionAction,
  resumeSubscriptionAction,
} from "@/app/actions/subscription";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function CancelSubscriptionButton({
  planName,
  periodEndLabel,
}: {
  planName: string;
  periodEndLabel: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [pending, startTransition] = React.useTransition();

  // Close only after the action commits, so the dialog can show a pending
  // state instead of vanishing while the request is still in flight.
  function confirm() {
    startTransition(async () => {
      await cancelSubscriptionAction();
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="text-muted-foreground"
          />
        }
      >
        Cancel subscription
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cancel your {planName} subscription?</DialogTitle>
          <DialogDescription>
            You&apos;ll keep full {planName} access until{" "}
            <strong className="text-foreground">{periodEndLabel}</strong>, the
            end of the period you&apos;ve already paid for. After that your
            account moves to the Free plan — your data stays, but paid features
            lock. You can resume any time before then.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Keep subscription
          </DialogClose>
          <Button variant="destructive" disabled={pending} onClick={confirm}>
            {pending ? "Cancelling…" : "Cancel subscription"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ResumeSubscriptionButton() {
  const [pending, startTransition] = React.useTransition();

  return (
    <Button
      size="sm"
      disabled={pending}
      onClick={() => startTransition(() => resumeSubscriptionAction())}
    >
      <RotateCcw className="size-4" />
      {pending ? "Resuming…" : "Resume subscription"}
    </Button>
  );
}
