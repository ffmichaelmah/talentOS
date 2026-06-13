import type { Metadata } from "next";

import { UpgradePrompt } from "@/components/cards/upgrade-prompt";
import { InvoiceForm } from "@/components/invoices/invoice-form";
import { PageHeader } from "@/components/layout/page-header";
import { hasReachedInvoiceLimit } from "@/lib/invoices";
import { getCurrentPlan } from "@/lib/plan";

export const metadata: Metadata = {
  title: "New invoice",
};

export default function NewInvoicePage() {
  const plan = getCurrentPlan();
  const limitReached = hasReachedInvoiceLimit(plan);

  return (
    <>
      <PageHeader
        title="New invoice"
        description="Fill in the details — the preview updates as you type."
      />

      {limitReached ? (
        <UpgradePrompt
          variant="banner"
          description="You've reached your free monthly invoice limit. Upgrade to create more invoices."
          cta="Upgrade"
        />
      ) : null}

      <InvoiceForm />
    </>
  );
}
