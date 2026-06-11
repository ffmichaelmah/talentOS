import type { Metadata } from "next";
import { Settings } from "lucide-react";

import { EmptyStateCard } from "@/components/cards/empty-state-card";
import { PageHeader } from "@/components/layout/page-header";
import { currentUser, subscriptionPlans } from "@/data";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  const plan = subscriptionPlans.find((p) => p.id === currentUser.planId);

  return (
    <>
      <PageHeader
        title="Settings"
        description={`Signed in as ${currentUser.email} · ${plan?.name ?? "No"} plan.`}
      />
      <EmptyStateCard
        icon={Settings}
        title="Settings coming soon"
        description="Profile, branding, document defaults, and subscription management will live here."
      />
    </>
  );
}
