import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";

import { AdvanceDocument } from "@/components/advancing/advance-document";
import { Button } from "@/components/ui/button";
import type { AdvanceForm } from "@/types";

const sample: AdvanceForm = {
  id: "sample",
  title: "Event / Performance Advance — Sample Festival",
  type: "event-performance",
  category: "event",
  clientId: "",
  reference: "Skyline Summer Festival",
  status: "completed",
  date: "2026-08-15",
  shareEnabled: true,
  shareViewed: true,
  eventDetails: {
    eventName: "Skyline Summer Festival",
    eventDate: "2026-08-15",
    callTime: "19:00",
    performanceTime: "21:00–22:30",
    venueName: "Riverside Park Main Stage",
    venueAddress: "Riverside Park, Your City",
    contactPerson: "Sample Stage Manager",
    contactPhone: "+1 (555) 010-2030",
    expectedCrowd: "5,000",
    dressCode: "Festival casual",
    performanceDirection: "High-energy headline set to close the main stage.",
    technicalRider: "4× CDJ-3000, DJM-V10, two wedge monitors.",
    soundcheckTime: "18:00",
    parkingLoading: "Artist lot behind the main stage; pass at the gate.",
    itinerary: "19:00 arrival · 18:00 soundcheck · 21:00 set · 22:30 wrap.",
    greenRoom: "Shared artist trailer, stage-right.",
    hospitalityRider: "Water, towels, fruit platter.",
    specialNotes: "Pyro cue at the final track — confirm with stage manager.",
  },
  createdAt: "",
  updatedAt: "",
};

/**
 * Free-plan locked state: a clear upsell over a faded, non-interactive
 * sample of a completed advance briefing.
 */
export function AdvanceLocked() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent px-6 py-10 text-center">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <Lock className="size-6" />
        </span>
        <div className="space-y-1.5">
          <h2 className="text-xl font-semibold tracking-tight">
            Client advancing forms are available on Pro Plan and above.
          </h2>
          <p className="mx-auto max-w-md text-sm text-muted-foreground">
            Collect every detail from your client before the event — timings,
            venue, tech, travel, hospitality, and campaign requirements — with a
            shareable form they fill in themselves.
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
          Here&apos;s the kind of briefing you&apos;ll collect:
        </p>
        <div
          aria-hidden
          className="pointer-events-none relative max-h-[32rem] select-none overflow-hidden opacity-60 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
        >
          <AdvanceDocument form={sample} clientName="Skyline Events" />
        </div>
      </div>
    </div>
  );
}
