import type { Metadata } from "next";
import { CreditCard } from "lucide-react";

import { EmptyStateCard } from "@/components/cards/empty-state-card";
import { PageHeader } from "@/components/layout/page-header";
import { subscriptionPlans } from "@/data";

export const metadata: Metadata = {
  title: "Plans · Admin",
};

export default function AdminPlansPage() {
  return (
    <>
      <PageHeader
        title="Plans"
        description={`${subscriptionPlans.length} subscription plans configured.`}
      />
      <EmptyStateCard
        icon={CreditCard}
        title="Plan management coming soon"
        description="This view will manage pricing, included credits, limits, and feature flags per plan."
      />
    </>
  );
}
