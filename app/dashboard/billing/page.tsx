import type { Metadata } from "next";
import { BadgeCheck, Check, CreditCard } from "lucide-react";

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
import { getCurrentPlan } from "@/lib/plan";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Billing",
};

export default function BillingPage() {
  const currentPlan = getCurrentPlan();

  return (
    <>
      <PageHeader
        title="Billing"
        description="Your plan, payment method, and invoices for TalentOS itself."
      />

      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BadgeCheck className="size-4 text-primary" />
            Current plan
          </CardTitle>
          <CardDescription>{currentPlan.tagline}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-2xl font-semibold tracking-tight">
              {currentPlan.name}
              <span className="ml-2 text-base font-normal text-muted-foreground">
                {currentPlan.monthlyPrice === 0
                  ? "Free forever"
                  : `$${currentPlan.monthlyPrice}/month`}
              </span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {currentPlan.includedCredits} credits included each month.
            </p>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          Change plan
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {subscriptionPlans.map((plan) => {
            const isCurrent = plan.id === currentPlan.id;
            return (
              <Card
                key={plan.id}
                className={cn(
                  "shadow-xs",
                  isCurrent && "ring-2 ring-primary",
                  plan.highlighted && !isCurrent && "border-primary/30"
                )}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-2">
                    {plan.name}
                    {isCurrent ? (
                      <Badge>Current</Badge>
                    ) : plan.highlighted ? (
                      <Badge variant="secondary">Popular</Badge>
                    ) : null}
                  </CardTitle>
                  <CardDescription>
                    {plan.monthlyPrice === 0
                      ? "$0 forever"
                      : `$${plan.monthlyPrice}/month`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-4">
                  <ul className="space-y-2 text-sm">
                    {plan.features.slice(0, 4).map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-primary" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="mt-auto w-full"
                    variant={isCurrent ? "outline" : "default"}
                    disabled={isCurrent}
                  >
                    {isCurrent ? "Current plan" : plan.cta}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

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
    </>
  );
}
