import { advanceForms, contracts, creditTransactions, currentUser, invoices } from "@/data";
import { getCurrentPlan } from "@/lib/plan";
import type { CreditTransaction } from "@/types";

/** Per-action credit prices shown in the "what uses credits" reference. */
export const CREDIT_COSTS: { action: string; cost: number }[] = [
  { action: "Generate invoice", cost: 1 },
  { action: "Export invoice PDF", cost: 1 },
  { action: "Generate contract", cost: 3 },
  { action: "Generate advance form", cost: 2 },
  { action: "AI rewrite terms", cost: 2 },
  { action: "Client share link", cost: 1 },
];

export interface CreditStats {
  balance: number;
  included: number;
  used: number;
  remaining: number;
  usedPercent: number;
  low: boolean;
}

export function creditStats(): CreditStats {
  const plan = getCurrentPlan();
  const balance = currentUser.creditBalance;
  const included = plan.includedCredits;
  const used = Math.min(Math.max(included - balance, 0), included);
  const remaining = balance;
  const usedPercent = included > 0 ? Math.round((used / included) * 100) : 0;
  // "Low" once 60%+ of the monthly allowance is used (or 2 or fewer left).
  const low = included > 0 && (usedPercent >= 60 || remaining <= 2);
  return { balance, included, used, remaining, usedPercent, low };
}

export function transactionStatus(tx: CreditTransaction): string {
  return tx.type === "refund" ? "refunded" : "completed";
}

/** Resolve a transaction's related document to a label + link. */
export function relatedDocument(
  tx: CreditTransaction
): { label: string; href: string } | undefined {
  const ref = tx.relatedDocument;
  if (!ref) return undefined;
  if (ref.kind === "invoice") {
    const inv = invoices.find((i) => i.id === ref.id);
    return {
      label: inv?.invoiceNumber ?? "Invoice",
      href: `/dashboard/invoices/${ref.id}`,
    };
  }
  if (ref.kind === "contract") {
    const c = contracts.find((x) => x.id === ref.id);
    return {
      label: c?.title ?? "Contract",
      href: `/dashboard/contracts/${ref.id}`,
    };
  }
  const a = advanceForms.find((x) => x.id === ref.id);
  return {
    label: a?.reference ?? a?.title ?? "Advance form",
    href: `/dashboard/advancing/${ref.id}`,
  };
}

export function creditHistory(): CreditTransaction[] {
  return [...creditTransactions].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
}
