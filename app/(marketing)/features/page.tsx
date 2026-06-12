import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Calendar,
  ClipboardList,
  Coins,
  Download,
  FileSignature,
  Palette,
  Receipt,
  Users,
  Wallet,
} from "lucide-react";

import { CtaBand } from "@/components/marketing/cta-band";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Invoices, contracts, booking advances, client management, payment tracking, and more — every tool a modern talent needs to run their business.",
};

const spotlights = [
  {
    icon: Receipt,
    eyebrow: "Invoicing",
    title: "Send invoices that get you paid on time.",
    description:
      "Build professional invoices with line items, deposits, and tax in minutes. Track what's paid, pending, and overdue without a spreadsheet.",
    points: [
      "Line items, deposits, and tax handling",
      "Status tracking from draft to paid",
      "Branded PDF export your clients can keep",
    ],
    preview: (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">INV-2026-015</p>
            <p className="text-xs text-muted-foreground">Lumen Beverages</p>
          </div>
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            Sent
          </span>
        </div>
        {[
          ["DJ performance — 2 × 90-min sets", "$3,000"],
          ["Custom branded playlist", "$500"],
        ].map(([label, amt]) => (
          <div key={label} className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium">{amt}</span>
          </div>
        ))}
        <div className="border-t border-border/60 pt-3 flex items-center justify-between">
          <span className="text-sm font-medium">Total due</span>
          <span className="text-base font-semibold">$3,500</span>
        </div>
      </div>
    ),
  },
  {
    icon: FileSignature,
    eyebrow: "Contracts",
    title: "Contracts built for talent, ready to send.",
    description:
      "Generate performance and collaboration agreements from reference templates, amend any detail, and edit the content to fit your deal.",
    points: [
      "Reference templates for every kind of gig",
      "Editable client, fee, and terms",
      "Legal review available on higher tiers",
    ],
    preview: (
      <div className="space-y-2.5 font-mono text-[11px] leading-relaxed">
        <p className="font-semibold">PERFORMANCE AGREEMENT</p>
        <p className="text-muted-foreground">
          Between{" "}
          <span className="rounded bg-primary/10 px-1 text-primary">
            {"{{client.company}}"}
          </span>{" "}
          and{" "}
          <span className="rounded bg-primary/10 px-1 text-primary">
            {"{{talent.displayName}}"}
          </span>
          .
        </p>
        <p className="text-muted-foreground">
          1. FEE. Purchaser agrees to pay{" "}
          <span className="rounded bg-primary/10 px-1 text-primary">
            {"{{document.total}}"}
          </span>
          , deposit due on signing.
        </p>
        <p className="text-muted-foreground">
          2. CANCELLATION. Within 14 days forfeits the deposit.
        </p>
      </div>
    ),
  },
  {
    icon: ClipboardList,
    eyebrow: "Advancing",
    title: "Never show up to a gig under-prepared.",
    description:
      "Send booking advance forms that lock in timings, technical needs, hospitality, and on-site contacts well before show day.",
    points: [
      "Load-in, soundcheck, and set times",
      "Tech rider and equipment checklist",
      "On-site contact and parking details",
    ],
    preview: (
      <div className="space-y-2 text-xs">
        {[
          ["Load-in", "21:30"],
          ["Soundcheck", "22:00"],
          ["Set time", "23:00 · 120 min"],
          ["On-site contact", "Tina Alvarez"],
        ].map(([label, val]) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-lg border border-border/60 bg-background/60 px-3 py-2"
          >
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium">{val}</span>
          </div>
        ))}
      </div>
    ),
  },
];

const capabilities = [
  { icon: Users, title: "Client Management", description: "Every venue, brand, and promoter with full booking history." },
  { icon: Wallet, title: "Payment Tracking", description: "Paid, pending, and overdue — always at a glance." },
  { icon: Coins, title: "Credit-Based Tools", description: "Pay per document, or subscribe and stop counting." },
  { icon: Download, title: "PDF Export", description: "Polished, branded documents ready to send and sign." },
  { icon: Palette, title: "Custom Branding", description: "Your logo and colors on everything you send." },
  { icon: Calendar, title: "Booking Pipeline", description: "Track every gig from inquiry to completed." },
];

export default function FeaturesPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute -top-32 left-1/2 -z-10 size-[36rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
        />
        <div className="mx-auto max-w-6xl px-6 pt-20 pb-12 text-center sm:pt-28">
          <SectionHeading
            eyebrow="Features"
            title="Every tool a modern talent needs to run their business."
            description="From the first inquiry to the final payment — TalentOS replaces the spreadsheets, screenshots, and chat threads with one clean workspace."
          />
          <div className="mt-8 flex justify-center">
            <Button size="lg" nativeButton={false} render={<Link href="/signup" />}>
              Start Free
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-20 px-6 py-12 sm:space-y-28 sm:py-16">
        {spotlights.map((item, i) => (
          <div
            key={item.title}
            className="grid items-center gap-10 lg:grid-cols-2"
          >
            <div className={cn(i % 2 === 1 && "lg:order-2")}>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium tracking-wide text-primary uppercase">
                <item.icon className="size-3.5" />
                {item.eyebrow}
              </span>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
                {item.title}
              </h2>
              <p className="mt-3 text-muted-foreground text-pretty">
                {item.description}
              </p>
              <ul className="mt-6 space-y-3">
                {item.points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-sm">
                    <BadgeCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className={cn("relative", i % 2 === 1 && "lg:order-1")}>
              <div
                aria-hidden
                className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-tr from-primary/15 to-transparent blur-xl"
              />
              <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xl shadow-primary/5">
                {item.preview}
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="border-t border-border/60 bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHeading
            eyebrow="And more"
            title="The rest of your back office, handled."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border/60 bg-card p-5"
              >
                <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <item.icon className="size-5" />
                </span>
                <h3 className="font-medium">{item.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Ready to look like you have a team behind you?"
        description="Start free today — upgrade when the bookings do."
        primaryLabel="Start Free"
        secondaryLabel="See Pricing"
        secondaryHref="/pricing"
      />
    </>
  );
}
