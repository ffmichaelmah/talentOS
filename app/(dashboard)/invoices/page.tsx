import type { Metadata } from "next";
import { Receipt } from "lucide-react";

import { EmptyStateCard } from "@/components/cards/empty-state-card";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { invoices } from "@/data";

export const metadata: Metadata = {
  title: "Invoices",
};

export default function InvoicesPage() {
  return (
    <>
      <PageHeader
        title="Invoices"
        description={`${invoices.length} invoices issued.`}
        actions={<Button>New invoice</Button>}
      />
      <EmptyStateCard
        icon={Receipt}
        title="Invoice builder coming soon"
        description="This view will list all invoices with status, payment tracking, and a builder for new documents."
      />
    </>
  );
}
