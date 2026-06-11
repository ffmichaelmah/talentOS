import type { Metadata } from "next";
import { Users } from "lucide-react";

import { EmptyStateCard } from "@/components/cards/empty-state-card";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Users · Admin",
};

export default function AdminUsersPage() {
  return (
    <>
      <PageHeader
        title="Users"
        description="Manage talent accounts, roles, and access."
      />
      <EmptyStateCard
        icon={Users}
        title="User management coming soon"
        description="This view will list registered talents with their plan, credit balance, and account status."
      />
    </>
  );
}
