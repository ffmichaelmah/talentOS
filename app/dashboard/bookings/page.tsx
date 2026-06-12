import type { Metadata } from "next";
import { Calendar, Plus } from "lucide-react";

import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { bookings, clients } from "@/data";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { Booking } from "@/types";

export const metadata: Metadata = {
  title: "Bookings",
};

const clientName = (id: string) => {
  const c = clients.find((x) => x.id === id);
  return c?.company ?? c?.name ?? "—";
};

export default function BookingsPage() {
  return (
    <>
      <PageHeader
        title="Bookings"
        description={`${bookings.length} bookings in your pipeline.`}
        actions={
          <Button>
            <Plus className="size-4" />
            Add Booking
          </Button>
        }
      />
      <DataTable<Booking>
        columns={[
          {
            header: "Booking",
            cell: (b) => (
              <div>
                <p className="font-medium">{b.title}</p>
                <p className="text-xs text-muted-foreground">{b.venueName}</p>
              </div>
            ),
          },
          { header: "Client", cell: (b) => clientName(b.clientId) },
          { header: "Date", cell: (b) => formatDateTime(b.startTime) },
          {
            header: "Fee",
            className: "text-right",
            cell: (b) => formatCurrency(b.fee, b.currency),
          },
          {
            header: "Deposit",
            cell: (b) => (b.depositPaid ? "Paid" : "Pending"),
          },
          {
            header: "Status",
            className: "text-right",
            cell: (b) => <StatusBadge status={b.status} />,
          },
        ]}
        rows={bookings}
        rowKey={(b) => b.id}
        emptyIcon={Calendar}
        emptyTitle="No bookings yet"
        emptyDescription="Log your gigs to track them from inquiry to paid."
      />
    </>
  );
}
