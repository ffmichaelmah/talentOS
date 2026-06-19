import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { ClientsTable } from "@/components/clients/clients-table";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { getClients, lastBookingByClient } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Clients",
};

export default async function ClientsPage() {
  const user = await requireUser();
  const [clients, lastBooking] = await Promise.all([
    getClients(user.id),
    lastBookingByClient(user.id),
  ]);

  return (
    <>
      <PageHeader
        title="Clients"
        description={`${clients.length} venues, brands, promoters, and planners.`}
        actions={
          <Button
            nativeButton={false}
            render={<Link href="/dashboard/clients/new" />}
          >
            <Plus className="size-4" />
            Add Client
          </Button>
        }
      />
      <ClientsTable clients={clients} lastBooking={lastBooking} />
    </>
  );
}
