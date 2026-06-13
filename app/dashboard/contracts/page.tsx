import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { UpgradePrompt } from "@/components/cards/upgrade-prompt";
import { ContractsTable } from "@/components/contracts/contracts-table";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { contracts } from "@/data";
import { canUseContracts, getCurrentPlan } from "@/lib/plan";

export const metadata: Metadata = {
  title: "Contracts",
};

export default function ContractsPage() {
  const plan = getCurrentPlan();
  const unlocked = canUseContracts(plan);

  return (
    <>
      <PageHeader
        title="Contracts"
        description={`${contracts.length} agreements. Templates are for reference only — not legal advice.`}
        actions={
          <Button
            nativeButton={false}
            render={<Link href="/dashboard/contracts/new" />}
          >
            <Plus className="size-4" />
            New contract
          </Button>
        }
      />

      {!unlocked ? (
        <UpgradePrompt
          variant="banner"
          description="Contracts are available on Starter Plan and above."
          cta="Upgrade"
        />
      ) : null}

      <ContractsTable />
    </>
  );
}
