import { BadgeCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import type { SubscriptionPlan } from "@/types";
import { cn } from "@/lib/utils";

export function PlanCard({ plan }: { plan: SubscriptionPlan }) {
  return (
    <Card
      className={cn(
        "relative shadow-xs",
        plan.highlighted && "ring-2 ring-primary"
      )}
    >
      {plan.highlighted ? (
        <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2">
          Most popular
        </Badge>
      ) : null}
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
        <CardDescription>{plan.tagline}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-5">
        <div>
          <span className="text-3xl font-semibold tracking-tight">
            {formatCurrency(plan.monthlyPrice, plan.currency)}
          </span>
          <span className="text-sm text-muted-foreground"> / month</span>
        </div>
        <ul className="space-y-2.5 text-sm">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <BadgeCheck className="mt-0.5 size-4 shrink-0 text-primary" />
              {feature}
            </li>
          ))}
        </ul>
        <Button
          className="mt-auto w-full"
          variant={plan.highlighted ? "default" : "outline"}
        >
          {plan.cta}
        </Button>
      </CardContent>
    </Card>
  );
}
