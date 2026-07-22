import "server-only";

import { randomBytes } from "node:crypto";

import { prisma } from "@/lib/db";
import { planById } from "@/lib/plan";

/** Standard program: referrer earns this many free months per paid conversion. */
export const FREE_MONTHS_PER_PAID = 1;
/** Ambassador program (internal): monthly cut of each referred subscription. */
export const AMBASSADOR_RATE = 0.2;

/** Short, shareable, uppercase code. 8 base36 chars ≈ collision-safe here.
 *  ponytail: relies on the @unique constraint; a collision fails the signup,
 *  which is astronomically unlikely at this scale. Add a retry if it ever bites. */
export function generateReferralCode(): string {
  return randomBytes(6).toString("hex").slice(0, 8).toUpperCase();
}

export interface ReferralStats {
  code: string | null;
  signups: number;
  /** Referees who converted to a paid plan — what the free-month reward counts. */
  paidSignups: number;
  freeMonths: number;
  isAmbassador: boolean;
  /** Ambassador only: paid referees + this month's 20% commission. */
  paidReferees: { name: string; plan: string; monthly: number; commission: number }[];
  monthlyCommission: number;
}

export async function getReferralStats(userId: string): Promise<ReferralStats> {
  const me = await prisma.user.findUnique({ where: { id: userId } });
  const referees = await prisma.user.findMany({ where: { referredById: userId } });

  const paid = referees
    .map((r) => ({ r, plan: planById(r.planId) }))
    .filter(({ plan }) => plan.monthlyPrice > 0);

  const paidReferees = me?.isAmbassador
    ? paid.map(({ r, plan }) => ({
        name: r.name,
        plan: plan.name,
        monthly: plan.monthlyPrice,
        commission: Math.round(plan.monthlyPrice * AMBASSADOR_RATE * 100) / 100,
      }))
    : [];

  return {
    code: me?.referralCode ?? null,
    signups: referees.length,
    paidSignups: paid.length,
    freeMonths: paid.length * FREE_MONTHS_PER_PAID,
    isAmbassador: !!me?.isAmbassador,
    paidReferees,
    monthlyCommission: paidReferees.reduce((s, r) => s + r.commission, 0),
  };
}
