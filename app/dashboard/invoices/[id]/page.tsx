import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { InvoiceActions } from "@/components/invoices/invoice-actions";
import { InvoiceDocument } from "@/components/invoices/invoice-document";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { clientDisplayName } from "@/lib/invoices";
import { getClientById, getInvoiceById } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Invoice",
};

export default async function InvoiceDetailPage(
  props: PageProps<"/dashboard/invoices/[id]">
) {
  const { id } = await props.params;
  const user = await requireUser();
  const invoice = await getInvoiceById(user.id, id);
  if (!invoice) notFound();
  const client = await getClientById(user.id, invoice.clientId);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            nativeButton={false}
            render={<Link href="/dashboard/invoices" />}
            aria-label="Back to invoices"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              {invoice.invoiceNumber}
            </h1>
            <p className="text-sm text-muted-foreground">
              {clientDisplayName(invoice)}
            </p>
          </div>
        </div>
        <InvoiceActions actions={["export", "send"]} />
      </div>

      <InvoiceDocument invoice={invoice} user={user} client={client} />
    </>
  );
}
