import type { Metadata } from "next";

import { CtaBand } from "@/components/marketing/cta-band";
import { PricingPlans } from "@/components/marketing/pricing-plans";
import { SectionHeading } from "@/components/marketing/section-heading";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, flat-rate pricing for modern talents. Start free, then upgrade to Standard or Pro as your business grows.",
};

const faqs = [
  {
    q: "What's the difference between Standard and Pro?",
    a: "Standard covers invoicing and client management. Pro adds bookings, agreements, and advancing forms — the full pipeline from inquiry to signed, paid, and briefed.",
  },
  {
    q: "Can I change plans later?",
    a: "Yes. Upgrade or downgrade whenever you like; access to bookings, agreements, and advancing updates immediately.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes — the Free plan lets you try TalentOS with a few invoices and clients before you upgrade.",
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute -top-32 left-1/2 -z-10 size-[36rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
        />
        <div className="mx-auto max-w-6xl px-6 pt-20 pb-12 sm:pt-28">
          <SectionHeading
            eyebrow="Pricing"
            title="Plans that grow with your bookings."
            description="Start free and upgrade when you're ready. No credits to track — just the tools your plan includes."
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-8">
        <PricingPlans />
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20">
        <SectionHeading title="Frequently asked questions" />
        <div className="mt-10 divide-y divide-border/60 rounded-2xl border border-border/60 bg-card">
          {faqs.map((faq) => (
            <div key={faq.q} className="p-6">
              <h3 className="font-medium">{faq.q}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <CtaBand
        title="Start free. Upgrade when the bookings do."
        description="No credit card required to get started."
        primaryLabel="Start Free"
        secondaryLabel="Browse Templates"
        secondaryHref="/templates"
      />
    </>
  );
}
