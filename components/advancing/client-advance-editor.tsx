"use client";

import * as React from "react";
import { BadgeCheck, Check, MinusCircle, Pencil } from "lucide-react";

import {
  setAdvanceSection,
  updateSharedAdvance,
} from "@/app/actions/advance-share";
import { AdvanceDocument } from "@/components/advancing/advance-document";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  clientEditableSections,
  sectionSlug,
  type SectionState,
  type SectionStates,
} from "@/lib/advance-sections";
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
  const [states, setStates] = React.useState<SectionStates>({
    ...(form.sectionStates ?? {}),
  });
  const [pending, startTransition] = React.useTransition();
  const [busySlug, setBusySlug] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);

  const editable = clientEditableSections(form.category);
  const set = (k: string, v: string) => setValues((p) => ({ ...p, [k]: v }));

  function mark(sectionTitle: string, keys: string[], state: SectionState | "open") {
    const slug = sectionSlug(sectionTitle);
    const sectionValues = Object.fromEntries(
      keys.map((k) => [k, values[k] ?? ""])
    );
    setBusySlug(slug);
    startTransition(async () => {
      await setAdvanceSection(form.id, slug, state, sectionValues);
      setStates((prev) => {
        const next = { ...prev };
        if (state === "open") delete next[slug];
        else next[slug] = state;
        return next;
      });
      setBusySlug(null);
    });
  }

  function saveAll(extra?: Record<string, string>) {
    const next = { ...values, ...extra };
    if (extra) setValues(next);
    startTransition(async () => {
      await updateSharedAdvance(form.id, next);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    });
  }

  const approved = values.draftApproved === "yes";
  const canApprove = form.category === "campaign" && !!values.draftLink;
  const allDone = editable.every((s) => states[sectionSlug(s.title)]);

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
          Fill in each section, then mark it{" "}
          <strong className="text-foreground">Complete</strong> to confirm — or{" "}
          <strong className="text-foreground">Skip</strong> any that don&apos;t
          apply. You can reopen a section any time to change it.
        </p>
      </div>

      {allDone ? (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm">
          <BadgeCheck className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span className="text-muted-foreground">
            <strong className="text-foreground">All sections confirmed.</strong>{" "}
            Thanks — the artist has everything they need.
          </span>
        </div>
      ) : null}

      {canApprove ? (
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
              onClick={() => saveAll({ draftApproved: "yes" })}
            >
              <Check className="size-4" />
              {approved ? "Approved" : "Approve draft"}
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {editable.map((section) => {
        const slug = sectionSlug(section.title);
        const state = states[slug];
        const busy = busySlug === slug && pending;
        const keys = section.fields.map((f) => f.key);
        return (
          <Card key={section.title} className="shadow-xs">
            <CardHeader className="flex flex-row items-start justify-between gap-3 border-b">
              <div>
                <CardTitle className="text-base">{section.title}</CardTitle>
                {section.blurb ? (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {section.blurb}
                  </p>
                ) : null}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {state === "complete" ? (
                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <Check className="size-3.5" /> Complete
                  </span>
                ) : state === "skipped" ? (
                  <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    <MinusCircle className="size-3.5" /> Skipped
                  </span>
                ) : null}
                {state ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={busy}
                    onClick={() => mark(section.title, keys, "open")}
                  >
                    <Pencil className="size-3.5" />
                    Edit
                  </Button>
                ) : null}
              </div>
            </CardHeader>

            {state !== "skipped" ? (
              <CardContent className="grid gap-4 sm:grid-cols-2">
                {section.fields.map((f) => {
                  const locked = state === "complete";
                  return (
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
                            disabled={locked}
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
                          disabled={locked}
                          placeholder={f.placeholder}
                          value={values[f.key] ?? ""}
                          onChange={(e) => set(f.key, e.target.value)}
                        />
                      ) : (
                        <Input
                          id={`c-${f.key}`}
                          type={f.type ?? "text"}
                          disabled={locked}
                          placeholder={f.placeholder}
                          value={values[f.key] ?? ""}
                          onChange={(e) => set(f.key, e.target.value)}
                        />
                      )}
                    </div>
                  );
                })}
                {!state ? (
                  <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
                    <Button
                      size="sm"
                      disabled={busy}
                      onClick={() => mark(section.title, keys, "complete")}
                    >
                      <Check className="size-4" />
                      Mark complete
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={busy}
                      onClick={() => mark(section.title, keys, "skipped")}
                    >
                      <MinusCircle className="size-4" />
                      Skip — not needed
                    </Button>
                  </div>
                ) : null}
              </CardContent>
            ) : null}
          </Card>
        );
      })}

      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={() => saveAll()} disabled={pending}>
          {pending ? "Saving…" : "Save progress"}
        </Button>
        {saved ? (
          <span className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
            <Check className="size-4" /> Saved
          </span>
        ) : null}
      </div>

      <div className="pt-2">
        <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Full brief
        </p>
        <AdvanceDocument form={preview} clientName={form.clientName} />
      </div>
    </div>
  );
}
