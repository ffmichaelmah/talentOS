import { currentUser, subscriptionPlans } from "@/data";
import type { SubscriptionPlan } from "@/types";

export const FREE_PLAN_ID = "plan-free";

/** Look up a plan from the static catalog by id (falls back to Free). */
export function planById(planId: string): SubscriptionPlan {
  return (
    subscriptionPlans.find((p) => p.id === planId) ?? subscriptionPlans[0]
  );
}

export function getCurrentPlan(): SubscriptionPlan {
  return planById(currentUser.planId);
}

/** The subscription fields plan resolution depends on. */
export interface PlanSubject {
  planId: string;
  subscriptionStatus: string;
  currentPeriodEnd?: string | null;
}

/** True once a cancelled subscription's paid period has elapsed. */
function periodHasEnded(user: PlanSubject, now: Date): boolean {
  if (!user.currentPeriodEnd) return false;
  return new Date(user.currentPeriodEnd).getTime() <= now.getTime();
}

/**
 * The plan a user can actually use right now. Cancelling keeps the paid plan
 * until the period ends — only then does access drop to Free. Every gate reads
 * the plan through here so the grace period is honored app-wide.
 */
export function planForUser(
  user: PlanSubject,
  now: Date = new Date()
): SubscriptionPlan {
  if (user.subscriptionStatus === "cancelled" && periodHasEnded(user, now)) {
    return planById(FREE_PLAN_ID);
  }
  return planById(user.planId);
}

/** Cancelled, but still inside the paid period — the "winding down" state. */
export function isCancelledButActive(
  user: PlanSubject,
  now: Date = new Date()
): boolean {
  return (
    user.subscriptionStatus === "cancelled" &&
    !!user.currentPeriodEnd &&
    !periodHasEnded(user, now)
  );
}

/** Paid plans can be cancelled; Free has nothing to unsubscribe from. */
export function isPaidPlan(plan: SubscriptionPlan): boolean {
  return plan.monthlyPrice > 0;
}

/**
 * The end of the current paid month — when a cancellation takes effect.
 * Mirrors the renewal date shown on the billing page.
 */
export function nextBillingDate(now: Date = new Date()): Date {
  return new Date(now.getFullYear(), now.getMonth() + 1, 1);
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
