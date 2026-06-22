import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { UpgradePrompt } from "@/components/cards/upgrade-prompt";
import { InvoicesTable } from "@/components/invoices/invoices-table";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { formatCurrency } from "@/lib/format";
import { balanceFor, isOverInvoiceLimit } from "@/lib/invoices";
import { planById } from "@/lib/plan";
import { getInvoices, invoiceCountThisMonth } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Invoices",
};

export default async function InvoicesPage() {
  const user = await requireUser();
  const [invoices, monthCount] = await Promise.all([
    getInvoices(user.id),
    invoiceCountThisMonth(user.id),
  ]);
  const plan = planById(user.planId);
  const limitReached = isOverInvoiceLimit(plan, monthCount);
  const outstanding = invoices
    .filter((i) => i.status !== "paid" && i.status !== "cancelled")
    .reduce((sum, i) => sum + balanceFor(i), 0);

  return (
    <>
      <PageHeader
        title="Invoices"
        description={`${invoices.length} invoices · ${formatCurrency(outstanding)} outstanding.`}
        actions={
          <Button
            nativeButton={false}
            render={<Link href="/dashboard/invoices/new" />}
          >
            <Plus className="size-4" />
            Create Invoice
          </Button>
        }
      />

      {limitReached ? (
        <UpgradePrompt
          variant="banner"
          description="You've reached your free monthly invoice limit. Upgrade to create more invoices."
          cta="Upgrade"
        />
      ) : null}

      <InvoicesTable invoices={invoices} />
    </>
  );
}
