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

/** Bookings unlock on Standard and above. */
export function canUseBookings(plan: SubscriptionPlan): boolean {
  return plan.limits.bookingsPerMonth !== 0;
}

/** Agreements unlock on Pro only. */
export function canUseContracts(plan: SubscriptionPlan): boolean {
  return plan.limits.contractsPerMonth !== 0;
}

/** Advancing unlocks on Pro only. */
export function canUseAdvancing(plan: SubscriptionPlan): boolean {
  return plan.limits.advanceFormsPerMonth !== 0;
}

/** True when the plan caps total clients and the user has hit the cap. */
export function isOverClientLimit(
  plan: SubscriptionPlan,
  clientCount: number
): boolean {
  const limit = plan.limits.clients;
  return limit !== null && clientCount >= limit;
}
