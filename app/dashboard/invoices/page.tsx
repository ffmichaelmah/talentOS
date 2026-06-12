import type { Metadata } from "next";
import { Plus, Receipt } from "lucide-react";

import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { clients, invoices } from "@/data";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Invoice } from "@/types";

export const metadata: Metadata = {
  title: "Invoices",
};

const clientName = (id: string) => {
  const c = clients.find((x) => x.id === id);
  return c?.company ?? c?.name ?? "—";
};

export default function InvoicesPage() {
  const outstanding = invoices
    .filter((i) => i.status !== "paid" && i.status !== "cancelled")
    .reduce((sum, i) => sum + (i.total - i.amountPaid), 0);

  return (
    <>
      <PageHeader
        title="Invoices"
        description={`${invoices.length} invoices · ${formatCurrency(outstanding)} outstanding.`}
        actions={
          <Button>
            <Plus className="size-4" />
            Create Invoice
          </Button>
        }
      />
      <DataTable<Invoice>
        columns={[
          {
            header: "Invoice",
            cell: (i) => <span className="font-medium">{i.invoiceNumber}</span>,
          },
          { header: "Client", cell: (i) => clientName(i.clientId) },
          { header: "Issued", cell: (i) => formatDate(i.issueDate) },
          { header: "Due", cell: (i) => formatDate(i.dueDate) },
          {
            header: "Amount",
            className: "text-right",
            cell: (i) => formatCurrency(i.total, i.currency),
          },
          {
            header: "Paid",
            className: "text-right",
            cell: (i) => formatCurrency(i.amountPaid, i.currency),
          },
          {
            header: "Status",
            className: "text-right",
            cell: (i) => <StatusBadge status={i.status} />,
          },
        ]}
        rows={invoices}
        rowKey={(i) => i.id}
        emptyIcon={Receipt}
        emptyTitle="No invoices yet"
        emptyDescription="Create your first invoice to start getting paid professionally."
      />
    </>
  );
}
