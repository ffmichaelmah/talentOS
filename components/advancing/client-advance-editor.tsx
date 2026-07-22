"use client";

import * as React from "react";
import { BadgeCheck, Check, Lock } from "lucide-react";

import {
  confirmSharedAdvance,
  updateSharedAdvance,
} from "@/app/actions/advance-share";
import { AdvanceDocument } from "@/components/advancing/advance-document";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sectionsFor } from "@/lib/advance-sections";
import { cn } from "@/lib/utils";
import type { AdvanceForm } from "@/types";

export function ClientAdvanceEditor({ form }: { form: AdvanceForm }) {
  const details = (form.eventDetails ?? form.campaignDetails ?? {}) as Record<
    string,
    string
  >;
  const [values, setValues] = React.useState<Record<string, string>>({
    ...details,
  });
  const [pending, startTransition] = React.useTransition();
  const [saved, setSaved] = React.useState(false);
  const [locked, setLocked] = React.useState(!!form.clientLocked);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const editable = sectionsFor(form.category).filter((s) => s.clientEditable);
  const set = (k: string, v: string) =>
    setValues((p) => ({ ...p, [k]: v }));

  function save(extra?: Record<string, string>) {
    const next = { ...values, ...extra };
    if (extra) setValues(next);
    startTransition(async () => {
      await updateSharedAdvance(form.id, next);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    });
  }

  function confirmLock() {
    startTransition(async () => {
      await updateSharedAdvance(form.id, values); // persist latest edits first
      const res = await confirmSharedAdvance(form.id);
      if (res.ok) setLocked(true);
      setConfirmOpen(false);
    });
  }

  const approved = values.draftApproved === "yes";
  const canApprove = form.category === "campaign" && !!values.draftLink;

  const preview: AdvanceForm = {
    ...form,
    eventDetails: form.category === "event" ? values : undefined,
    campaignDetails: form.category === "campaign" ? values : undefined,
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          {form.reference || form.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {locked
            ? "These details are confirmed and locked."
            : "Please review the brief and fill in the details you're providing."}
        </p>
      </div>

      {locked ? (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
          <Lock className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Submitted & locked.</span>{" "}
            You&apos;ve confirmed these details, so they can no longer be edited
            here. Need a change? Ask the artist to reopen this form and send you
            a fresh link.
          </p>
        </div>
      ) : null}

      {!locked && canApprove ? (
        <Card className="shadow-xs">
          <CardHeader className="border-b">
            <CardTitle className="text-base">Draft approval</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-4">
            {approved ? (
              <p className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                <BadgeCheck className="size-4" /> You approved this draft.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Reviewed the draft? Approve it here.
              </p>
            )}
            <Button
              disabled={pending || approved}
              onClick={() => save({ draftApproved: "yes" })}
            >
              <Check className="size-4" />
              {approved ? "Approved" : "Approve draft"}
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {!locked
        ? editable.map((section) => (
            <Card key={section.title} className="shadow-xs">
              <CardHeader>
                <CardTitle className="text-base">{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                {section.fields.map((f) => (
                  <div
                    key={f.key}
                    className={cn("space-y-2", f.long && "sm:col-span-2")}
                  >
                    {f.type !== "check" ? (
                      <Label htmlFor={`c-${f.key}`}>{f.label}</Label>
                    ) : null}
                    {f.type === "check" ? (
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          className="size-4 accent-emerald-500"
                          checked={values[f.key] === "yes"}
                          onChange={(e) =>
                            set(f.key, e.target.checked ? "yes" : "")
                          }
                        />
                        {f.label}
                      </label>
                    ) : f.long ? (
                      <Textarea
                        id={`c-${f.key}`}
                        rows={2}
                        placeholder={f.placeholder}
                        value={values[f.key] ?? ""}
                        onChange={(e) => set(f.key, e.target.value)}
                      />
                    ) : (
                      <Input
                        id={`c-${f.key}`}
                        type={f.type ?? "text"}
                        placeholder={f.placeholder}
                        value={values[f.key] ?? ""}
                        onChange={(e) => set(f.key, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))
        : null}

      {!locked ? (
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={() => save()} disabled={pending}>
            {pending ? "Saving…" : "Save details"}
          </Button>
          {saved ? (
            <span className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
              <Check className="size-4" /> Saved
            </span>
          ) : null}

          <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <DialogTrigger render={<Button className="ml-auto" />}>
              <Lock className="size-4" />
              Confirm & submit
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Confirm these details?</DialogTitle>
                <DialogDescription>
                  This locks your submission — you won&apos;t be able to edit it
                  from this link afterwards. If something changes, the artist can
                  reopen the form and send you a new link. Continue?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>
                  Keep editing
                </DialogClose>
                <Button onClick={confirmLock} disabled={pending}>
                  {pending ? "Confirming…" : "Confirm & lock"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      ) : null}

      <div className="pt-2">
        <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Full brief
        </p>
        <AdvanceDocument form={preview} clientName={form.clientName} />
      </div>
    </div>
  );
}
