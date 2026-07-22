import { Check } from "lucide-react";

import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/format";
import { advanceTypeLabel, clientDisplayName } from "@/lib/advancing";
import type { AdvanceForm } from "@/types";

interface Row {
  label: string;
  value?: string;
  full?: boolean;
  link?: boolean;
}

function Section({ title, rows }: { title: string; rows: Row[] }) {
  const filled = rows.filter((r) => r.value && r.value.trim() !== "");
  if (filled.length === 0) return null;
  return (
    <section className="border-b border-border/60 py-5 last:border-b-0">
      <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {title}
      </p>
      <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
        {filled.map((r) => (
          <div key={r.label} className={r.full ? "sm:col-span-2" : undefined}>
            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Check className="size-3 text-primary" />
              {r.label}
            </dt>
            <dd className="mt-0.5 text-sm">
              {r.link ? (
                <a
                  href={r.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-primary underline underline-offset-2"
                >
                  {r.value}
                </a>
              ) : (
                r.value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/**
 * Clean, checklist-style briefing of a completed (or in-progress) advance.
 * Pure markup so it backs the detail page, the builder preview, and the
 * locked-state sample.
 */
export function AdvanceDocument({
  form,
  clientName,
}: {
  form: AdvanceForm;
  clientName?: string;
}) {
  const name = clientName ?? clientDisplayName(form);
  const e = form.eventDetails ?? {};
  const c = form.campaignDetails ?? {};

  // Join structured date/time/airport parts into one readable value.
  const join = (...parts: (string | undefined)[]) =>
    parts.filter((p) => p && p.trim() !== "").join(" · ") || undefined;
  const checkIn = join(e.checkInDate, e.checkInTime);
  const checkOut = join(e.checkOutDate, e.checkOutTime);
  const outDepart = join(e.outDepartAirport, e.outDepartDate, e.outDepartTime);
  const outArrive = join(e.outArriveAirport, e.outArriveDate, e.outArriveTime);
  const retDepart = join(e.retDepartAirport, e.retDepartDate, e.retDepartTime);
  const retArrive = join(e.retArriveAirport, e.retArriveDate, e.retArriveTime);

  const eventSections: { title: string; rows: Row[] }[] = [
    {
      title: "Schedule & performance",
      rows: [
        { label: "Event name", value: e.eventName },
        { label: "Event date", value: e.eventDate },
        { label: "Call time", value: e.callTime },
        { label: "Soundcheck time", value: e.soundcheckTime },
        { label: "Performance time", value: e.performanceTime },
        { label: "Set duration", value: e.setDuration },
        { label: "Expected crowd size", value: e.expectedCrowd },
        { label: "Dress code", value: e.dressCode },
        { label: "Music / performance direction", value: e.performanceDirection, full: true },
      ],
    },
    {
      title: "Artist / manager contact",
      rows: [
        { label: "Name", value: e.advancingPic },
        { label: "Contact number", value: e.advancingPicPhone },
        { label: "Email", value: e.advancingPicEmail },
      ],
    },
    {
      title: "Client-side PIC",
      rows: [
        { label: "Name", value: e.contactPerson },
        { label: "Contact number", value: e.contactPhone },
        { label: "Email", value: e.contactEmail },
        { label: "On-site / day-of contact", value: e.onSiteContact, full: true },
      ],
    },
    {
      title: "Venue",
      rows: [
        { label: "Venue name", value: e.venueName },
        { label: "Client company", value: e.clientCompany },
        { label: "Venue address", value: e.venueAddress, full: true },
        { label: "Parking / loading", value: e.parkingLoading, full: true },
      ],
    },
    {
      title: "Technical rider",
      rows: [
        { label: "DJ setup / equipment", value: e.djEquipment, full: true },
        { label: "Monitors", value: e.monitors },
        { label: "Additional technical notes", value: e.technicalRider, full: true },
      ],
    },
    {
      title: "Hospitality rider",
      rows: [
        { label: "Backstage / green room", value: e.greenRoom, full: true },
        { label: "Meal arrangement", value: e.mealArrangement },
        { label: "Guest-list places", value: e.guestList },
        { label: "Drinks / catering rider", value: e.hospitalityRider, full: true },
      ],
    },
    {
      title: "Accommodation",
      rows: [
        { label: "Hotel name", value: e.hotelName },
        { label: "Confirmation number", value: e.hotelConfirmation },
        { label: "Hotel phone", value: e.hotelPhone },
        { label: "Room type / nights", value: e.roomType },
        { label: "Hotel address", value: e.hotelAddress, full: true },
        { label: "Check-in", value: checkIn },
        { label: "Check-out", value: checkOut },
        { label: "Accommodation notes", value: e.hotelDetails, full: true },
      ],
    },
    {
      title: "Departure flight",
      rows: [
        { label: "Flight number", value: e.outFlightNumber },
        { label: "Departs", value: outDepart },
        { label: "Arrives", value: outArrive },
      ],
    },
    {
      title: "Return flight",
      rows: [
        { label: "Flight number", value: e.retFlightNumber },
        { label: "Departs", value: retDepart },
        { label: "Arrives", value: retArrive },
      ],
    },
    {
      title: "Ground transport",
      rows: [
        { label: "Ground transport", value: e.groundTransport },
        { label: "Driver / transfer contact", value: e.driverContact },
        { label: "Itinerary", value: e.itinerary, full: true },
      ],
    },
    {
      title: "Notes",
      rows: [{ label: "Special notes", value: e.specialNotes, full: true }],
    },
  ];

  const campaignSections: { title: string; rows: Row[] }[] = [
    {
      title: "Campaign",
      rows: [
        { label: "Brand name", value: c.brandName },
        { label: "Campaign title", value: c.campaignTitle },
        { label: "Posting date", value: c.postingDate },
        { label: "Approval deadline", value: c.approvalDeadline },
      ],
    },
    {
      title: "Deliverables & format",
      rows: [
        { label: "Deliverables", value: c.deliverables, full: true },
        { label: "Content format", value: c.contentFormat },
        { label: "Appearance time", value: c.appearanceTime },
        { label: "Appearance duration", value: c.appearanceDuration },
        { label: "Revision rounds", value: c.revisionRounds },
      ],
    },
    {
      title: "Content requirements",
      rows: [
        { label: "Caption requirement", value: c.captionRequirement, full: true },
        { label: "Hashtags", value: c.hashtags },
        { label: "Tags / mentions", value: c.tagsMentions },
        { label: "Usage rights", value: c.usageRights, full: true },
      ],
    },
    {
      title: "Draft & post",
      rows: [
        { label: "Draft submission & approval link", value: c.draftLink, full: true, link: true },
        { label: "Draft status", value: c.draftApproved === "yes" ? "✓ Approved by client" : undefined },
        { label: "Published post link", value: c.postLink, full: true, link: true },
      ],
    },
    {
      title: "Logistics",
      rows: [
        { label: "Product delivery", value: c.productDelivery, full: true },
        { label: "Payment status", value: c.paymentStatus },
      ],
    },
    {
      title: "Notes",
      rows: [{ label: "Special notes", value: c.specialNotes, full: true }],
    },
  ];

  const sections =
    form.category === "event" ? eventSections : campaignSections;

  return (
    <article className="mx-auto w-full max-w-3xl rounded-2xl border border-border/60 bg-card p-6 shadow-xs sm:p-8">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {advanceTypeLabel(form.type)}
          </p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight">
            {form.reference || form.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {name}
            {form.date ? ` · ${formatDate(form.date)}` : ""}
          </p>
        </div>
        <StatusBadge status={form.status} />
      </header>

      {sections.map((s) => (
        <Section key={s.title} title={s.title} rows={s.rows} />
      ))}
    </article>
  );
}
