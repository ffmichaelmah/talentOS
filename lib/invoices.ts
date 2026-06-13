import { bookings, clients, invoices } from "@/data";
import type { Invoice, SubscriptionPlan } from "@/types";

export function clientFor(invoice: Invoice) {
  return clients.find((c) => c.id === invoice.clientId);
}

export function clientDisplayName(invoice: Invoice): string {
  const client = clientFor(invoice);
  return client?.company ?? client?.name ?? "—";
}

export function eventNameFor(invoice: Invoice): string {
  if (invoice.job?.eventName) return invoice.job.eventName;
  return bookings.find((b) => b.id === invoice.bookingId)?.title ?? "—";
}

export function balanceFor(invoice: Invoice): number {
  return invoice.total - invoice.amountPaid;
}

export function invoicesThisMonth(): number {
  const now = new Date();
  const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  return invoices.filter((i) => i.issueDate.startsWith(prefix)).length;
}

/** True when the plan caps monthly invoices and the user has hit the cap. */
export function hasReachedInvoiceLimit(plan: SubscriptionPlan): boolean {
  const limit = plan.limits.invoicesPerMonth;
  return limit !== null && invoicesThisMonth() >= limit;
}

export function nextInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const max = invoices
    .map((i) => {
      const match = i.invoiceNumber.match(/(\d+)$/);
      return match ? Number(match[1]) : 0;
    })
    .reduce((a, b) => Math.max(a, b), 0);
  return `INV-${year}-${String(max + 1).padStart(3, "0")}`;
}
