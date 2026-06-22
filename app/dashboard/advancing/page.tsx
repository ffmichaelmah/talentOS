import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { AdvancingTable } from "@/components/advancing/advancing-table";
import { UpgradePrompt } from "@/components/cards/upgrade-prompt";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { canUseAdvancing, planById } from "@/lib/plan";
import { getAdvanceForms } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Advancing",
};

export default async function AdvancingPage() {
  const user = await requireUser();
  const advanceForms = await getAdvanceForms(user.id);
  const unlocked = canUseAdvancing(planById(user.planId));

  return (
    <>
      <PageHeader
        title="Advancing"
        description={`${advanceForms.length} advance forms — collect job details from clients before the event.`}
        actions={
          <Button
            nativeButton={false}
            render={<Link href="/dashboard/advancing/new" />}
          >
            <Plus className="size-4" />
            New advance form
          </Button>
        }
      />

      {!unlocked ? (
        <UpgradePrompt
          variant="banner"
          description="Client advancing forms are available on Pro Plan and above."
          cta="Upgrade"
        />
      ) : null}

      <AdvancingTable advanceForms={advanceForms} />
    </>
  );
}
