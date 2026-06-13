import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { UpgradePrompt } from "@/components/cards/upgrade-prompt";
import { InvoicesTable } from "@/components/invoices/invoices-table";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { invoices } from "@/data";
import { formatCurrency } from "@/lib/format";
import { balanceFor, hasReachedInvoiceLimit } from "@/lib/invoices";
import { getCurrentPlan } from "@/lib/plan";

export const metadata: Metadata = {
  title: "Invoices",
};

export default function InvoicesPage() {
  const plan = getCurrentPlan();
  const limitReached = hasReachedInvoiceLimit(plan);
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

      <InvoicesTable />
    </>
  );
}
