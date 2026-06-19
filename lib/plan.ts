import { currentUser, subscriptionPlans } from "@/data";
import type { SubscriptionPlan } from "@/types";

/** Look up a plan from the static catalog by id (falls back to Free). */
export function planById(planId: string): SubscriptionPlan {
  return (
    subscriptionPlans.find((p) => p.id === planId) ?? subscriptionPlans[0]
  );
}

export function getCurrentPlan(): SubscriptionPlan {
  return planById(currentUser.planId);
}

/** Contracts unlock on Starter and above. */
export function canUseContracts(plan: SubscriptionPlan): boolean {
  return plan.limits.contractsPerMonth !== 0;
}

/** Advancing unlocks on Pro and above. */
export function canUseAdvancing(plan: SubscriptionPlan): boolean {
  return plan.limits.advanceFormsPerMonth !== 0;
}
