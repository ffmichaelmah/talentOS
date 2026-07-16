import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";

import { BookingsTable } from "@/components/bookings/bookings-table";
import { Button } from "@/components/ui/button";
import type { Booking } from "@/types";

const sample: Booking[] = [
  {
    id: "sample-1",
    title: "DJ set — Skyline Summer Festival",
    clientId: "",
    status: "confirmed",
    stage: "contract-sent",
    eventType: "festival",
    venueName: "Riverside Park Main Stage",
    startTime: "2026-08-15T21:00:00Z",
    endTime: "2026-08-15T22:30:00Z",
    fee: 3500,
    currency: "USD",
    depositAmount: 1750,
    balanceAmount: 1750,
    depositPaid: true,
    createdAt: "",
    clientName: "Skyline Events",
    invoiceStatus: "sent",
    contractStatus: "sent",
  },
  {
    id: "sample-2",
    title: "Brand activation — Lumen Launch",
    clientId: "",
    status: "pending",
    stage: "quoted",
    eventType: "brand-activation",
    venueName: "Lumen HQ Rooftop",
    startTime: "2026-09-02T18:00:00Z",
    endTime: "2026-09-02T20:00:00Z",
    fee: 2200,
    currency: "USD",
    depositPaid: false,
    createdAt: "",
    clientName: "Lumen Beverages",
  },
];

/**
 * Free/Standard-plan locked state: a clear upsell over a faded, non-interactive
 * sample of the bookings pipeline.
 */
export function BookingsLocked() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent px-6 py-10 text-center">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <Lock className="size-6" />
        </span>
        <div className="space-y-1.5">
          <h2 className="text-xl font-semibold tracking-tight">
            Bookings are available on Standard and Pro.
          </h2>
          <p className="mx-auto max-w-md text-sm text-muted-foreground">
            Track every gig from inquiry to completed, linked to its invoice,
            agreement, and advancing form in one pipeline.
          </p>
        </div>
        <Button
          size="lg"
          nativeButton={false}
          render={<Link href="/dashboard/billing" />}
        >
          Upgrade to unlock
          <ArrowRight className="size-4" />
        </Button>
      </div>

      <div className="space-y-3">
        <p className="text-center text-sm font-medium text-muted-foreground">
          Here&apos;s what your pipeline will look like:
        </p>
        <div
          aria-hidden
          className="pointer-events-none relative max-h-[32rem] select-none overflow-hidden opacity-60 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
        >
          <BookingsTable bookings={sample} />
        </div>
      </div>
    </div>
  );
}
