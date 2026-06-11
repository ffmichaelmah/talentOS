import type { Metadata } from "next";
import { Users } from "lucide-react";

import { EmptyStateCard } from "@/components/cards/empty-state-card";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { clients } from "@/data";

export const metadata: Metadata = {
  title: "Clients",
};

export default function ClientsPage() {
  return (
    <>
      <PageHeader
        title="Clients"
        description={`${clients.length} venues, brands, promoters, and planners.`}
        actions={<Button>Add client</Button>}
      />
      <EmptyStateCard
        icon={Users}
        title="Client list coming soon"
        description="This view will show every client with contact details, booking history, and lifetime billing."
      />
    </>
  );
}
