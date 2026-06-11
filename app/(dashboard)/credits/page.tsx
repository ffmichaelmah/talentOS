import type { Metadata } from "next";
import { Coins } from "lucide-react";

import { EmptyStateCard } from "@/components/cards/empty-state-card";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { creditTransactions, currentUser } from "@/data";

export const metadata: Metadata = {
  title: "Credits",
};

export default function CreditsPage() {
  return (
    <>
      <PageHeader
        title="Credits"
        description={`Balance: ${currentUser.creditBalance} credits · ${creditTransactions.length} transactions.`}
        actions={<Button>Buy credits</Button>}
      />
      <EmptyStateCard
        icon={Coins}
        title="Credit history coming soon"
        description="This view will show purchases, document spends, bonuses, and your running balance."
      />
    </>
  );
}
