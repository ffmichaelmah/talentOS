import type { Metadata } from "next";

import { UpgradePrompt } from "@/components/cards/upgrade-prompt";
import { ClientForm } from "@/components/clients/client-form";
import { PageHeader } from "@/components/layout/page-header";
import { requireUser } from "@/lib/auth";
import { isOverClientLimit, planForUser } from "@/lib/plan";
import { clientCount } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Add client",
};

export default async function NewClientPage() {
  const user = await requireUser();
  const count = await clientCount(user.id);
  const limitReached = isOverClientLimit(planForUser(user), count);

  return (
    <>
      <PageHeader
        title="Add client"
        description="Save a venue, brand, promoter, or planner you work with."
      />

      {limitReached ? (
        <UpgradePrompt
          variant="banner"
          description="You've reached your free client limit. Upgrade to add more clients."
          cta="Upgrade"
        />
      ) : null}

      <ClientForm />
    </>
  );
}
