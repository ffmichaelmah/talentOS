import type { Metadata } from "next";

import { UpgradePrompt } from "@/components/cards/upgrade-prompt";
import { InvoiceForm } from "@/components/invoices/invoice-form";
import { PageHeader } from "@/components/layout/page-header";
import { requireUser } from "@/lib/auth";
import { isOverInvoiceLimit } from "@/lib/invoices";
import { planById } from "@/lib/plan";
import { getClients, invoiceCountThisMonth, nextInvoiceNumber } from "@/lib/queries";

export const metadata: Metadata = {
  title: "New invoice",
};

export default async function NewInvoicePage() {
  const user = await requireUser();
  const [clients, monthCount, defaultNumber] = await Promise.all([
    getClients(user.id),
    invoiceCountThisMonth(user.id),
    nextInvoiceNumber(user.id),
  ]);
  const plan = planById(user.planId);
  const limitReached = isOverInvoiceLimit(plan, monthCount);

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

      <InvoiceForm
        clients={clients}
        defaultNumber={defaultNumber}
        talent={{
          businessName: user.businessName,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          paymentDetails: user.paymentDetails,
          currency: user.currency,
        }}
      />
    </>
  );
}
