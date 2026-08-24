"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isPaidPlan, nextBillingDate, planById } from "@/lib/plan";

/** Pages whose gating or plan copy depends on the subscription state. */
function revalidatePlanSurfaces() {
  for (const path of [
    "/dashboard",
    "/dashboard/billing",
    "/dashboard/settings",
    "/dashboard/bookings",
    "/dashboard/contracts",
    "/dashboard/advancing",
    "/dashboard/clients",
    "/dashboard/invoices",
  ]) {
    revalidatePath(path);
  }
}

/**
 * Switch plans. Billing is simulated, so this takes effect immediately and
 * clears any pending cancellation.
 * ponytail: no proration or payment step — wire to Stripe when billing is real.
 */
export async function changePlanAction(planId: string): Promise<{ ok: boolean }> {
  const user = await requireUser();
  const plan = planById(planId);
  if (plan.id !== planId) return { ok: false }; // unknown id → planById fell back
  if (plan.id === user.planId) return { ok: false };

  await prisma.user.update({
    where: { id: user.id },
    data: {
      planId: plan.id,
      subscriptionStatus: "active",
      currentPeriodEnd: null,
    },
  });
  revalidatePlanSurfaces();
  return { ok: true };
}

/**
 * Unsubscribe. The plan is kept so the user retains access until the current
 * paid period ends; planForUser() drops them to Free once that date passes.
 */
export async function cancelSubscriptionAction() {
  const user = await requireUser();
  if (!isPaidPlan(planById(user.planId))) return;
  if (user.subscriptionStatus === "cancelled") return;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionStatus: "cancelled",
      // Keep an already-scheduled end date if one exists, so repeated
      // cancel/resume cycles don't extend the paid period.
      currentPeriodEnd:
        user.currentPeriodEnd ?? nextBillingDate().toISOString(),
    },
  });
  revalidatePlanSurfaces();
}

/** Undo a cancellation while the paid period is still running. */
export async function resumeSubscriptionAction() {
  const user = await requireUser();
  if (user.subscriptionStatus !== "cancelled") return;

  await prisma.user.update({
    where: { id: user.id },
    data: { subscriptionStatus: "active", currentPeriodEnd: null },
  });
  revalidatePlanSurfaces();
}
