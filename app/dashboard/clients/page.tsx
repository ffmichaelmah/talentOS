import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { UpgradePrompt } from "@/components/cards/upgrade-prompt";
import { ClientsTable } from "@/components/clients/clients-table";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { isOverClientLimit, planForUser } from "@/lib/plan";
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
  const limitReached = isOverClientLimit(planForUser(user), clients.length);

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

      {limitReached ? (
        <UpgradePrompt
          variant="banner"
          description="You've reached your free client limit. Upgrade to add more clients."
          cta="Upgrade"
        />
      ) : null}

      <ClientsTable clients={clients} lastBooking={lastBooking} />
    </>
  );
}
