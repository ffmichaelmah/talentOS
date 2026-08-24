"use client";

import * as React from "react";
import {
  CalendarClock,
  Megaphone,
  type LucideIcon,
} from "lucide-react";

import { AdvanceActions } from "@/components/advancing/advance-actions";
import { AdvanceDocument } from "@/components/advancing/advance-document";
import { ShareLink } from "@/components/advancing/share-link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { Textarea } from "@/components/ui/textarea";
import {
  ADVANCE_CATEGORY_LABELS,
  ADVANCE_TYPE_LABELS,
  advanceTypeLabel,
  typesForCategory,
} from "@/lib/advancing";
import {
  campaignSections,
  eventSections,
  type FieldDef,
} from "@/lib/advance-sections";
import type {
  AdvanceCategory,
  AdvanceForm as AdvanceFormModel,
  AdvanceFormType,
  CampaignAdvanceDetails,
  Client,
  EventAdvanceDetails,
} from "@/types";
import { createAdvanceAction } from "@/app/actions/advances";
import { cn } from "@/lib/utils";

/**
 * a-boss-style completeness signal for a section:
 * red = nothing gathered, amber = in progress, green = every field filled.
 */
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

function sectionStatus(
  fields: FieldDef[],
  values: Record<string, string>
): { label: string; dot: string; text: string } {
  const filled = fields.filter((f) => values[f.key]?.trim()).length;
  if (filled === 0)
    return { label: "Not started", dot: "bg-rose-400", text: "text-muted-foreground" };
  if (filled === fields.length)
    return { label: "Complete", dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" };
  return { label: "In progress", dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" };
}

const categoryCards: {
  value: AdvanceCategory;
  icon: LucideIcon;
  blurb: string;
}[] = [
  {
    value: "event",
    icon: CalendarClock,
    blurb: "Shows, performances, and bookings — timings, venue, tech, and travel.",
  },
  {
    value: "campaign",
    icon: Megaphone,
    blurb: "Influencer & creator deals — deliverables, posting, and usage rights.",
  },
];

export function AdvanceForm({
  clients,
  defaultClientId,
}: {
  clients: Client[];
  defaultClientId?: string;
}) {
  const [category, setCategory] = React.useState<AdvanceCategory>("event");
  const [type, setType] = React.useState<AdvanceFormType>("event-performance");
  const [values, setValues] = React.useState<Record<string, string>>({});
  const [clientId, setClientId] = React.useState(
    (defaultClientId && clients.some((c) => c.id === defaultClientId)
      ? defaultClientId
      : clients[0]?.id) ?? ""
  );
  const [pending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);

  function chooseCategory(next: AdvanceCategory) {
    setCategory(next);
    setType(typesForCategory(next)[0]);
    setValues({});
  }

  function save(status: "draft" | "sent") {
    setError(null);
    startTransition(async () => {
      const res = await createAdvanceAction({
        clientId,
        type,
        values,
        status,
      });
      if (res?.error) setError(res.error);
    });
  }

  const sectionsForCategory =
    category === "event" ? eventSections : campaignSections;
  const fields = sectionsForCategory.flatMap((s) => s.fields);
  const set = (key: string, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const filledCount = fields.filter((f) => values[f.key]?.trim()).length;
  const reference =
    values[category === "event" ? "eventName" : "campaignTitle"] || "";

  // Draft model for the live preview + Preview dialog.
  const draft: AdvanceFormModel = {
    id: "draft",
    title: reference
      ? `${advanceTypeLabel(type)} — ${reference}`
      : advanceTypeLabel(type),
    type,
    category,
    clientId: "",
    reference,
    status: "draft",
    date: values[category === "event" ? "eventDate" : "postingDate"],
    shareEnabled: false,
    eventDetails:
      category === "event" ? (values as EventAdvanceDetails) : undefined,
    campaignDetails:
      category === "campaign" ? (values as CampaignAdvanceDetails) : undefined,
    createdAt: "",
    updatedAt: "",
  };

  return (
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-5">
        {/* Step 1 — category */}
        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle>1 · Advance type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {categoryCards.map((c) => {
                const active = category === c.value;
                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => chooseCategory(c.value)}
                    className={cn(
                      "flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-colors",
                      active
                        ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                        : "border-border/60 hover:border-primary/30"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-9 items-center justify-center rounded-lg",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-primary/10 text-primary"
                      )}
                    >
                      <c.icon className="size-5" />
                    </span>
                    <span className="text-sm font-medium">
                      {ADVANCE_CATEGORY_LABELS[c.value]}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {c.blurb}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="space-y-2">
              <Label>Form type</Label>
              <Select
                items={ADVANCE_TYPE_LABELS}
                value={type}
                onValueChange={(v) =>
                  setType((v as AdvanceFormType) ?? typesForCategory(category)[0])
                }
              >
                <SelectTrigger className="w-full sm:w-96">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {typesForCategory(category).map((t) => (
                    <SelectItem key={t} value={t}>
                      {ADVANCE_TYPE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Client</Label>
              <Select
                items={Object.fromEntries(
                  clients.map((c) => [c.id, c.company ?? c.name])
                )}
                value={clientId}
                onValueChange={(v) => setClientId(v ?? clients[0]?.id ?? "")}
              >
                <SelectTrigger className="w-full sm:w-96">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.company ?? c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Step 2 — details, grouped into advancing sections */}
        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle>
              2 · {category === "event" ? "Advancing details" : "Campaign details"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-7">
            {sectionsForCategory.map((section) => {
              const status = sectionStatus(section.fields, values);
              return (
                <section key={section.title} id={slug(section.title)} className="scroll-mt-24 space-y-3">
                  <div className="flex items-start justify-between gap-3 border-b border-border/60 pb-2">
                    <div>
                      <h3 className="text-sm font-semibold">{section.title}</h3>
                      {section.blurb ? (
                        <p className="text-xs text-muted-foreground">
                          {section.blurb}
                        </p>
                      ) : null}
                    </div>
                    <span
                      className={cn(
                        "mt-0.5 flex shrink-0 items-center gap-1.5 text-xs font-medium",
                        status.text
                      )}
                    >
                      <span className={cn("size-1.5 rounded-full", status.dot)} />
                      {status.label}
                    </span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {section.fields.map((f) => (
                      <div
                        key={f.key}
                        className={cn("space-y-2", f.long && "sm:col-span-2")}
                      >
                        {f.type !== "check" ? (
                          <Label htmlFor={`af-${f.key}`}>{f.label}</Label>
                        ) : null}
                        {f.type === "check" ? (
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              className="size-4 accent-emerald-500"
                              checked={values[f.key] === "yes"}
                              onChange={(e) => set(f.key, e.target.checked ? "yes" : "")}
                            />
                            {f.label}
                          </label>
                        ) : f.long ? (
                          <Textarea
                            id={`af-${f.key}`}
                            rows={2}
                            placeholder={f.placeholder}
                            value={values[f.key] ?? ""}
                            onChange={(e) => set(f.key, e.target.value)}
                          />
                        ) : (
                          <Input
                            id={`af-${f.key}`}
                            type={f.type ?? "text"}
                            placeholder={f.placeholder}
                            value={values[f.key] ?? ""}
                            onChange={(e) => set(f.key, e.target.value)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Preview + share + actions */}
      <div className="space-y-4 xl:sticky xl:top-24">
        <Card className="shadow-xs">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center justify-between">
              Preview
              <StatusBadge status="draft" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {advanceTypeLabel(type)}
              </p>
              <p className="mt-0.5 font-semibold">
                {reference || "Untitled advance"}
              </p>
            </div>
            <div className="rounded-lg border border-border/60 p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Details filled</span>
                <span className="font-medium tabular-nums">
                  {filledCount} of {fields.length}
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${(filledCount / fields.length) * 100}%`,
                  }}
                />
              </div>
            </div>
            {/* Section checklist — jump to any section, see its status. */}
            <nav className="space-y-0.5">
              {sectionsForCategory.map((section) => {
                const status = sectionStatus(section.fields, values);
                return (
                  <a
                    key={section.title}
                    href={`#${slug(section.title)}`}
                    className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-xs hover:bg-muted"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span className={cn("size-1.5 shrink-0 rounded-full", status.dot)} />
                      <span className="truncate">{section.title}</span>
                    </span>
                    <span className={cn("shrink-0 font-medium", status.text)}>
                      {status.label}
                    </span>
                  </a>
                );
              })}
            </nav>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardContent>
            <ShareLink slug="new" />
          </CardContent>
        </Card>

        {error ? (
          <p role="alert" className="text-sm text-destructive">{error}</p>
        ) : null}
        <AdvanceActions
          preview={<AdvanceDocument form={draft} clientName="Your client" />}
          onSubmit={save}
          pending={pending}
          disabled={!clientId}
        />
      </div>
    </div>
  );
}
