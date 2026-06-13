import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";

import {
  ContractDocument,
  type ContractView,
} from "@/components/contracts/contract-document";
import { Button } from "@/components/ui/button";
import { CONTRACT_REFERENCE_DISCLAIMER_LONG } from "@/lib/contracts";

const sample: ContractView = {
  title: "DJ Booking Contract — Sample Festival Set",
  typeLabel: "DJ Booking Contract",
  status: "draft",
  talentLegalName: "Your name (Your business)",
  clientLegalName: "Sample Promoter",
  clientCompany: "Skyline Events",
  clientEmail: "bookings@skyline.example",
  clientAddress: "Downtown, Your City",
  serviceDescription:
    "DJ performance — 90-minute headline set with full visuals cue sync.",
  deliverables: "One 90-minute live set; set list shared 48h in advance.",
  eventName: "Skyline Summer Festival",
  dateTime: "2026-08-15, 21:00–22:30",
  location: "Riverside Park, Your City",
  fee: 3500,
  depositAmount: 1750,
  balanceAmount: 1750,
  currency: "USD",
  paymentDeadline: "Balance due on or before event day.",
  cancellationPolicy:
    "Cancellation within 14 days of the event forfeits the deposit.",
  usageRights:
    "Promoter may use event content for promotion with creator credit.",
  forceMajeure:
    "Neither party is liable for failure to perform due to events beyond reasonable control.",
};

/**
 * Free-plan locked state: a clear upsell over a faded, non-interactive
 * sample of the contract generator's output.
 */
export function ContractLocked() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent px-6 py-10 text-center">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <Lock className="size-6" />
        </span>
        <div className="space-y-1.5">
          <h2 className="text-xl font-semibold tracking-tight">
            Contracts are available on Starter Plan and above.
          </h2>
          <p className="mx-auto max-w-md text-sm text-muted-foreground">
            Generate DJ bookings, brand collaborations, appearance agreements,
            and more — amend any detail and export a clean, signable document.
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
        <p className="text-xs text-muted-foreground">
          {CONTRACT_REFERENCE_DISCLAIMER_LONG}
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-center text-sm font-medium text-muted-foreground">
          Here&apos;s what you&apos;ll be able to create:
        </p>
        <div
          aria-hidden
          className="pointer-events-none relative max-h-[32rem] select-none overflow-hidden opacity-60 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
        >
          <ContractDocument view={sample} />
        </div>
      </div>
    </div>
  );
}
