import type { Invoice, SubscriptionPlan } from "@/types";

export function clientDisplayName(invoice: Invoice): string {
  return invoice.clientName ?? "—";
}

export function eventNameFor(invoice: Invoice): string {
  return invoice.job?.eventName ?? invoice.eventName ?? "—";
}

export function balanceFor(invoice: Invoice): number {
  return invoice.total - invoice.amountPaid;
}

/** True when the plan caps monthly invoices and the user has hit the cap. */
export function isOverInvoiceLimit(
  plan: SubscriptionPlan,
  countThisMonth: number
): boolean {
  const limit = plan.limits.invoicesPerMonth;
  return limit !== null && countThisMonth >= limit;
}
