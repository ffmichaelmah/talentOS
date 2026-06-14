import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Building2,
  CalendarPlus,
  ClipboardList,
  Coins,
  Disc3,
  Download,
  FileSignature,
  Mic,
  Music,
  Palette,
  PartyPopper,
  Receipt,
  Send,
  Sparkles,
  Star,
  UserPlus,
  Users,
  Video,
  Wallet,
  X,
} from "lucide-react";

import { CtaBand } from "@/components/marketing/cta-band";
import { HeroDashboard } from "@/components/marketing/hero-dashboard";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";

const painPoints = [
  "No proper invoice format",
  "No contract template",
  "Unclear client terms",
  "Late payments",
  "Missing event details",
  "Messy WhatsApp follow-ups",
  "No booking workflow",
];

const solutions = [
  {
    icon: Receipt,
    title: "Invoice Generator",
    description: "Professional invoices with line items, deposits, and tax — in minutes.",
  },
  {
    icon: FileSignature,
    title: "Contract Templates",
    description: "Performance and collab agreements built for talent, ready to send.",
  },
  {
    icon: ClipboardList,
    title: "Booking Advance Forms",
    description: "Lock in timings, tech, and hospitality before show day.",
  },
  {
    icon: Users,
    title: "Client Management",
    description: "Venues, brands, and promoters with full history per relationship.",
  },
  {
    icon: Wallet,
    title: "Payment Tracking",
    description: "See what's paid, pending, and overdue at a glance.",
  },
  {
    icon: Coins,
    title: "Credit-Based Tools",
    description: "Pay for the documents you generate — or subscribe and stop counting.",
  },
  {
    icon: Download,
    title: "PDF Export",
    description: "Polished, branded PDFs your clients can sign and keep.",
  },
  {
    icon: Palette,
    title: "Custom Branding",
    description: "Your logo, your colors — documents that look unmistakably yours.",
  },
];

const userTypes = [
  { icon: Disc3, label: "DJs" },
  { icon: Sparkles, label: "Influencers" },
  { icon: Music, label: "Musicians" },
  { icon: Video, label: "Content Creators" },
  { icon: Mic, label: "Event Hosts" },
  { icon: Star, label: "Performers" },
  { icon: Briefcase, label: "Talent Managers" },
  { icon: Building2, label: "Small Agencies" },
];

const workflow = [
  { icon: UserPlus, title: "Add client", description: "Save venue, brand, or promoter details once." },
  { icon: CalendarPlus, title: "Create booking", description: "Log the event, date, venue, and fee." },
  { icon: FileSignature, title: "Generate contract", description: "Pick a template and send for signature." },
  { icon: Send, title: "Send invoice", description: "Bill the deposit and the balance professionally." },
  { icon: ClipboardList, title: "Collect advance details", description: "Gather timings, tech, and hospitality." },
  { icon: Wallet, title: "Track payment", description: "Know exactly what's been paid and what's due." },
  { icon: PartyPopper, title: "Close job professionally", description: "Wrap up looking like you have a team." },
];

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,var(--color-primary)/8%,transparent_70%)]"
        />
        <div
          aria-hidden
          className="absolute -top-32 left-1/2 -z-10 size-[40rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
        />
        <div className="mx-auto max-w-6xl px-6 pt-20 pb-12 text-center sm:pt-28">
          <Link
            href="/features"
            className="mx-auto inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
          >
            <Sparkles className="size-3.5 text-primary" />
            Business tools for modern talents
            <ArrowRight className="size-3" />
          </Link>
          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            Run your talent career like a real business.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground text-pretty sm:text-xl">
            Create professional invoices, contracts, and booking advance forms in
            minutes — built for DJs, influencers, musicians, creators, and
            freelance talents.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" nativeButton={false} render={<Link href="/signup" />}>
              Start Free
              <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<Link href="/templates" />}
            >
              View Templates
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            No credit card required · Free plan forever
          </p>
        </div>

        <div className="mx-auto max-w-5xl px-6 pb-20">
          <HeroDashboard />
        </div>
      </section>

      {/* Problem */}
      <section className="border-t border-border/60 bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHeading
            eyebrow="The problem"
            title="Talent work is creative. Admin should be simple."
            description="Most independent talents juggle their business in screenshots and chat threads. It costs you time, money, and credibility."
          />
          <div className="mx-auto mt-12 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {painPoints.map((point) => (
              <div
                key={point}
                className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-4 py-3.5 text-sm"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <X className="size-3.5" />
                </span>
                <span className="text-muted-foreground">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <SectionHeading
          eyebrow="The solution"
          title="Everything your talent business needs, in one place."
          description="One workspace for the paperwork side of being booked — so you can focus on the work."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {solutions.map((item) => (
            <div
              key={item.title}
              className="group rounded-2xl border border-border/60 bg-card p-5 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <item.icon className="size-5" />
              </span>
              <h3 className="font-medium">{item.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* User types */}
      <section className="border-y border-border/60 bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHeading
            eyebrow="Who it's for"
            title="Built for modern independent talents."
            description="If you get booked, get paid, and sign deals — TalentOS is built for you."
          />
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {userTypes.map((type) => (
              <div
                key={type.label}
                className="flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-card p-6 text-center transition-colors hover:border-primary/30"
              >
                <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary">
                  <type.icon className="size-6" />
                </span>
                <span className="text-sm font-medium">{type.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <SectionHeading
          eyebrow="How it works"
          title="From inquiry to payment — professionally."
          description="A clear workflow that takes every booking from first hello to paid and done."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {workflow.map((step, i) => (
            <div
              key={step.title}
              className="relative rounded-2xl border border-border/60 bg-card p-5"
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <step.icon className="size-5 text-muted-foreground" />
              </div>
              <h3 className="font-medium">{step.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <CtaBand
        title="Stop sending messy invoices. Start looking professional."
        description="Join the talents running their business the modern way. Your first invoice is free."
        primaryLabel="Create Your First Invoice Free"
        primaryHref="/signup"
        secondaryLabel="View Pricing"
        secondaryHref="/pricing"
      />
    </>
  );
}
