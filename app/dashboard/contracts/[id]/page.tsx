import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { ContractActions } from "@/components/contracts/contract-actions";
import {
  ContractDocument,
  contractToView,
} from "@/components/contracts/contract-document";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { clientDisplayName, contractTypeLabel } from "@/lib/contracts";
import { getClientById, getContractById } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Contract",
};

export default async function ContractDetailPage(
  props: PageProps<"/dashboard/contracts/[id]">
) {
  const { id } = await props.params;
  const user = await requireUser();
  const contract = await getContractById(user.id, id);
  if (!contract) notFound();
  const client = await getClientById(user.id, contract.clientId);

  const view = contractToView(
    contract,
    { name: user.name, businessName: user.businessName, email: user.email },
    client
  );

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            nativeButton={false}
            render={<Link href="/dashboard/contracts" />}
            aria-label="Back to contracts"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              {contractTypeLabel(contract.contractType)}
            </h1>
            <p className="text-sm text-muted-foreground">
              {clientDisplayName(contract)}
            </p>
          </div>
        </div>
        <ContractActions actions={["export", "send"]} />
      </div>

      <ContractDocument view={view} />
    </>
  );
}
