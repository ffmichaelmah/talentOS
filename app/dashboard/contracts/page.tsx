import type { Metadata } from "next";
import Link from "next/link";
import { FileSignature, Plus } from "lucide-react";

import { UpgradePrompt } from "@/components/cards/upgrade-prompt";
import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { clients, contracts } from "@/data";
import { formatCurrency, formatDate } from "@/lib/format";
import { canUseContracts, getCurrentPlan } from "@/lib/plan";
import type { Contract } from "@/types";

export const metadata: Metadata = {
  title: "Contracts",
};

const clientName = (id: string) => {
  const c = clients.find((x) => x.id === id);
  return c?.company ?? c?.name ?? "—";
};

export default function ContractsPage() {
  const plan = getCurrentPlan();
  const unlocked = canUseContracts(plan);

  return (
    <>
      <PageHeader
        title="Contracts"
        description={`${contracts.length} agreements drafted or signed. Templates are for reference only — not legal advice.`}
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

      <DataTable<Contract>
        columns={[
          {
            header: "Contract",
            cell: (c) => <span className="font-medium">{c.title}</span>,
          },
          { header: "Client", cell: (c) => clientName(c.clientId) },
          {
            header: "Fee",
            className: "text-right",
            cell: (c) => formatCurrency(c.fee, c.currency),
          },
          { header: "Created", cell: (c) => formatDate(c.createdAt) },
          {
            header: "Status",
            className: "text-right",
            cell: (c) => <StatusBadge status={c.status} />,
          },
        ]}
        rows={contracts}
        rowKey={(c) => c.id}
        emptyIcon={FileSignature}
        emptyTitle="No contracts yet"
        emptyDescription="Generate your first agreement from a reference template."
      />
    </>
  );
}
