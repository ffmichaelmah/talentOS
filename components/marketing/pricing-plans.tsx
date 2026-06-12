"use client";

import * as React from "react";
import Link from "next/link";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { subscriptionPlans } from "@/data";
import { cn } from "@/lib/utils";

type Period = "monthly" | "yearly";

function priceLabel(
  plan: (typeof subscriptionPlans)[number],
  period: Period
) {
  if (plan.monthlyPrice === 0) return { amount: "$0", sub: "forever" };
  if (period === "yearly") {
    const perMonth = Math.round(plan.yearlyPrice / 12);
    return { amount: `$${perMonth}`, sub: "/mo · billed yearly" };
  }
  return { amount: `$${plan.monthlyPrice}`, sub: "/month" };
}

export function PricingPlans() {
  const [period, setPeriod] = React.useState<Period>("monthly");

  return (
    <div className="space-y-10">
      <div className="flex justify-center">
        <div className="inline-flex items-center rounded-full border border-border/60 bg-card p-1 text-sm">
          {(["monthly", "yearly"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={cn(
                "rounded-full px-4 py-1.5 font-medium capitalize transition-colors",
                period === p
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {p}
              {p === "yearly" ? (
                <span
                  className={cn(
                    "ml-1.5 text-xs",
                    period === p ? "text-primary-foreground/80" : "text-primary"
                  )}
                >
                  −17%
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <div className="grid items-stretch gap-6 lg:grid-cols-4">
        {subscriptionPlans.map((plan) => {
          const price = priceLabel(plan, period);
          return (
            <div
              key={plan.id}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-card p-6",
                plan.highlighted
                  ? "border-primary/40 shadow-xl shadow-primary/10 ring-1 ring-primary/30"
                  : "border-border/60"
              )}
            >
              {plan.highlighted ? (
                <>
                  <div
                    aria-hidden
                    className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-b from-primary/5 to-transparent"
                  />
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    Most Popular
                  </span>
                </>
              ) : null}

              <div className="space-y-1">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="min-h-10 text-sm text-muted-foreground">
                  {plan.tagline}
                </p>
              </div>

              <div className="mt-5 flex items-baseline gap-1.5">
                <span className="text-4xl font-semibold tracking-tight">
                  {price.amount}
                </span>
                <span className="text-sm text-muted-foreground">
                  {price.sub}
                </span>
              </div>

              <Button
                className="mt-6 w-full"
                variant={plan.highlighted ? "default" : "outline"}
                nativeButton={false}
                render={<Link href="/signup" />}
              >
                {plan.cta}
              </Button>

              <ul className="mt-6 space-y-3 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
