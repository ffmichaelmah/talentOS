import type { Metadata } from "next";

import { PlanCard } from "@/components/cards/plan-card";
import { subscriptionPlans } from "@/data";

export const metadata: Metadata = {
  title: "Pricing",
};

export default function PricingPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto mb-12 max-w-xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight">
          Plans that grow with your bookings
        </h1>
        <p className="mt-3 text-muted-foreground">
          Every plan includes monthly document credits. Need more? Top up
          anytime.
        </p>
      </div>
      <div className="grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-4">
        {subscriptionPlans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </section>
  );
}
