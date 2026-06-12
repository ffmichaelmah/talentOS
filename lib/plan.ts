import { currentUser, subscriptionPlans } from "@/data";
import type { SubscriptionPlan } from "@/types";

export function getCurrentPlan(): SubscriptionPlan {
  return (
    subscriptionPlans.find((p) => p.id === currentUser.planId) ??
    subscriptionPlans[0]
  );
}

/** Contracts unlock on Starter and above. */
export function canUseContracts(plan: SubscriptionPlan): boolean {
  return plan.limits.contractsPerMonth !== 0;
}

/** Advancing unlocks on Pro and above. */
export function canUseAdvancing(plan: SubscriptionPlan): boolean {
  return plan.limits.advanceFormsPerMonth !== 0;
}
