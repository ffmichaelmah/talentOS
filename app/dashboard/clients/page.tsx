import type { Metadata } from "next";
import { Plus, Users } from "lucide-react";

import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { clients } from "@/data";
import { formatCurrency } from "@/lib/format";
import type { Client } from "@/types";

export const metadata: Metadata = {
  title: "Clients",
};

export default function ClientsPage() {
  return (
    <>
      <PageHeader
        title="Clients"
        description={`${clients.length} venues, brands, promoters, and planners.`}
        actions={
          <Button>
            <Plus className="size-4" />
            Add Client
          </Button>
        }
      />
      <DataTable<Client>
        columns={[
          {
            header: "Client",
            cell: (c) => (
              <div>
                <p className="font-medium">{c.name}</p>
                {c.company ? (
                  <p className="text-xs text-muted-foreground">{c.company}</p>
                ) : null}
              </div>
            ),
          },
          {
            header: "Type",
            cell: (c) => (
              <Badge variant="outline" className="capitalize">
                {c.type}
              </Badge>
            ),
          },
          { header: "Email", cell: (c) => c.email },
          { header: "Location", cell: (c) => c.location ?? "—" },
          {
            header: "Bookings",
            className: "text-right",
            cell: (c) => c.totalBookings,
          },
          {
            header: "Total billed",
            className: "text-right",
            cell: (c) => formatCurrency(c.totalBilled),
          },
        ]}
        rows={clients}
        rowKey={(c) => c.id}
        emptyIcon={Users}
        emptyTitle="No clients yet"
        emptyDescription="Add the venues, brands, and promoters you work with."
      />
    </>
  );
}
