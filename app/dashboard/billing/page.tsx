import type { Metadata } from "next";
import { BadgeCheck, Check, CreditCard, Receipt } from "lucide-react";

import { EmptyStateCard } from "@/components/cards/empty-state-card";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { subscriptionPlans } from "@/data";
import { requireUser } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { planById } from "@/lib/plan";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Billing",
};

function priceLabel(monthly: number): string {
  return monthly === 0 ? "Free forever" : `$${monthly}/month`;
}

export default async function BillingPage() {
  const user = await requireUser();
  const currentPlan = planById(user.planId);
  const now = new Date();
  const renewal = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return (
    <>
      <PageHeader
        title="Billing"
        description="Your plan, payment method, and invoices for TalentOS itself."
      />

      {/* Current subscription */}
      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BadgeCheck className="size-4 text-primary" />
            Current subscription
          </CardTitle>
          <CardDescription>{currentPlan.tagline}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-4">
          <div>
            <p className="text-xs text-muted-foreground">Plan</p>
            <p className="mt-0.5 text-lg font-semibold tracking-tight">
              {currentPlan.name}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Monthly price</p>
            <p className="mt-0.5 text-lg font-semibold tracking-tight">
              {currentPlan.monthlyPrice === 0
                ? "$0"
                : `$${currentPlan.monthlyPrice}`}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Credits included</p>
            <p className="mt-0.5 text-lg font-semibold tracking-tight">
              {currentPlan.includedCredits}/mo
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Renews</p>
            <p className="mt-0.5 text-lg font-semibold tracking-tight">
              {formatDate(renewal.toISOString())}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Plan comparison */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          Compare plans
        </h2>
        <div className="grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {subscriptionPlans.map((plan) => {
            const isCurrent = plan.id === currentPlan.id;
            return (
              <Card
                key={plan.id}
                className={cn(
                  "relative flex flex-col shadow-xs",
                  isCurrent && "ring-2 ring-primary",
                  plan.highlighted && !isCurrent && "border-primary/40"
                )}
              >
                {plan.highlighted ? (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
                    Most Popular
                  </span>
                ) : null}
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-2">
                    {plan.name}
                    {isCurrent ? <Badge variant="secondary">Current</Badge> : null}
                  </CardTitle>
                  <CardDescription>
                    {priceLabel(plan.monthlyPrice)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-4">
                  <ul className="space-y-2 text-sm">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-primary" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="mt-auto w-full"
                    variant={
                      isCurrent
                        ? "outline"
                        : plan.highlighted
                          ? "default"
                          : "outline"
                    }
                    disabled={isCurrent}
                  >
                    {isCurrent ? "Current plan" : plan.cta}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          Prototype — plan changes and payments aren&apos;t connected yet.
        </p>
      </section>

      {/* Payment method + billing history */}
      <div className="grid items-start gap-5 lg:grid-cols-2">
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">
            Payment method
          </h2>
          <EmptyStateCard
            icon={CreditCard}
            title="No payment method on file"
            description="Add a card when you upgrade — the Free plan never needs one."
          >
            <Button variant="outline">Add payment method</Button>
          </EmptyStateCard>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">
            Billing history
          </h2>
          <EmptyStateCard
            icon={Receipt}
            title="No billing history yet"
            description="Your TalentOS subscription invoices will appear here once you upgrade to a paid plan."
          />
        </section>
      </div>
    </>
  );
}
