import type { Metadata } from "next";
import { FileSignature } from "lucide-react";

import { EmptyStateCard } from "@/components/cards/empty-state-card";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { contracts } from "@/data";

export const metadata: Metadata = {
  title: "Contracts",
};

export default function ContractsPage() {
  return (
    <>
      <PageHeader
        title="Contracts"
        description={`${contracts.length} agreements drafted or signed.`}
        actions={<Button>New contract</Button>}
      />
      <EmptyStateCard
        icon={FileSignature}
        title="Contract templates coming soon"
        description="This view will hold performance, collab, and appearance agreements with send-for-signature tracking."
      />
    </>
  );
}
