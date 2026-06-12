import type { Metadata } from "next";

import { CtaBand } from "@/components/marketing/cta-band";
import { PricingPlans } from "@/components/marketing/pricing-plans";
import { SectionHeading } from "@/components/marketing/section-heading";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, credit-based pricing for modern talents. Start free, then upgrade to Starter, Pro, or Agency as your bookings grow.",
};

const faqs = [
  {
    q: "What are credits?",
    a: "Each document you generate — an invoice, contract, or advance form — uses credits. Every plan includes a monthly allowance, and you can top up anytime.",
  },
  {
    q: "Can I change plans later?",
    a: "Yes. Upgrade or downgrade whenever you like; your credits and limits adjust at the start of the next billing cycle.",
  },
  {
    q: "Do unused credits roll over?",
    a: "Your monthly credit allowance refreshes each cycle. Topped-up credits you purchase separately don't expire.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes — the Free plan is free forever and includes everything you need to send your first professional invoice.",
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
            description="Start free and upgrade when you're ready. Every plan includes monthly credits for the documents you generate."
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
