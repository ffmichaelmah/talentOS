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
import type {
  AdvanceCategory,
  AdvanceForm as AdvanceFormModel,
  AdvanceFormType,
  CampaignAdvanceDetails,
  EventAdvanceDetails,
} from "@/types";
import { cn } from "@/lib/utils";

interface FieldDef {
  key: string;
  label: string;
  long?: boolean;
  type?: "text" | "date";
}

const eventFields: FieldDef[] = [
  { key: "eventName", label: "Event name" },
  { key: "eventDate", label: "Event date", type: "date" },
  { key: "callTime", label: "Call time" },
  { key: "performanceTime", label: "Performance time" },
  { key: "venueName", label: "Venue name" },
  { key: "venueAddress", label: "Venue address", long: true },
  { key: "contactPerson", label: "Contact person" },
  { key: "contactPhone", label: "Contact phone" },
  { key: "clientCompany", label: "Client company" },
  { key: "expectedCrowd", label: "Expected crowd size" },
  { key: "dressCode", label: "Dress code" },
  { key: "performanceDirection", label: "Music / performance direction", long: true },
  { key: "technicalRider", label: "Technical rider", long: true },
  { key: "soundcheckTime", label: "Soundcheck time" },
  { key: "parkingLoading", label: "Parking / loading info", long: true },
  { key: "hotelDetails", label: "Hotel details" },
  { key: "flightDetails", label: "Flight details" },
  { key: "groundTransport", label: "Ground transport details" },
  { key: "itinerary", label: "Itinerary", long: true },
  { key: "greenRoom", label: "Backstage / green room info", long: true },
  { key: "mealArrangement", label: "Meal arrangement" },
  { key: "hospitalityRider", label: "Hospitality rider", long: true },
  { key: "specialNotes", label: "Special notes", long: true },
];

const campaignFields: FieldDef[] = [
  { key: "brandName", label: "Brand name" },
  { key: "campaignTitle", label: "Campaign title" },
  { key: "deliverables", label: "Deliverables", long: true },
  { key: "appearanceTime", label: "Appearance time" },
  { key: "appearanceDuration", label: "Appearance duration" },
  { key: "postingDate", label: "Posting date", type: "date" },
  { key: "contentFormat", label: "Content format" },
  { key: "captionRequirement", label: "Caption requirement", long: true },
  { key: "hashtags", label: "Hashtags" },
  { key: "tagsMentions", label: "Tags / mentions" },
  { key: "usageRights", label: "Usage rights", long: true },
  { key: "revisionRounds", label: "Revision rounds" },
  { key: "approvalDeadline", label: "Approval deadline", type: "date" },
  { key: "productDelivery", label: "Product delivery details", long: true },
  { key: "paymentStatus", label: "Payment status" },
  { key: "specialNotes", label: "Special notes", long: true },
];

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

export function AdvanceForm() {
  const [category, setCategory] = React.useState<AdvanceCategory>("event");
  const [type, setType] = React.useState<AdvanceFormType>("event-performance");
  const [values, setValues] = React.useState<Record<string, string>>({});

  function chooseCategory(next: AdvanceCategory) {
    setCategory(next);
    setType(typesForCategory(next)[0]);
    setValues({});
  }

  const fields = category === "event" ? eventFields : campaignFields;
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
          </CardContent>
        </Card>

        {/* Step 2 — details */}
        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle>
              2 · {category === "event" ? "Event details" : "Campaign details"}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <div
                key={f.key}
                className={cn("space-y-2", f.long && "sm:col-span-2")}
              >
                <Label htmlFor={`af-${f.key}`}>{f.label}</Label>
                {f.long ? (
                  <Textarea
                    id={`af-${f.key}`}
                    rows={2}
                    value={values[f.key] ?? ""}
                    onChange={(e) => set(f.key, e.target.value)}
                  />
                ) : (
                  <Input
                    id={`af-${f.key}`}
                    type={f.type === "date" ? "date" : "text"}
                    value={values[f.key] ?? ""}
                    onChange={(e) => set(f.key, e.target.value)}
                  />
                )}
              </div>
            ))}
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
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardContent>
            <ShareLink slug="new" />
          </CardContent>
        </Card>

        <AdvanceActions
          preview={<AdvanceDocument form={draft} clientName="Your client" />}
        />
      </div>
    </div>
  );
}
