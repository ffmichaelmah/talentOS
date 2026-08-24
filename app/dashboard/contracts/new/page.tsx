import type { Metadata } from "next";

import { ContractForm } from "@/components/contracts/contract-form";
import { ContractLocked } from "@/components/contracts/contract-locked";
import { PageHeader } from "@/components/layout/page-header";
import { requireUser } from "@/lib/auth";
import { canUseContracts, planForUser } from "@/lib/plan";
import { getClients } from "@/lib/queries";

export const metadata: Metadata = {
  title: "New agreement",
};

export default async function NewContractPage(props: {
  searchParams: Promise<{ client?: string }>;
}) {
  const user = await requireUser();
  const unlocked = canUseContracts(planForUser(user));
  const clients = unlocked ? await getClients(user.id) : [];
  const { client } = await props.searchParams;

  return (
    <>
      <PageHeader
        title="New agreement"
        description="Guided generator — fill in the details and the preview builds as you go."
      />
      {unlocked ? (
        <ContractForm
          clients={clients}
          defaultClientId={client}
          talent={{
            name: user.name,
            businessName: user.businessName,
            email: user.email,
            currency: user.currency,
          }}
        />
      ) : (
        <ContractLocked />
      )}
    </>
  );
}
