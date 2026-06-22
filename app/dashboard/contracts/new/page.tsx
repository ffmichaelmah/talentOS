import type { Metadata } from "next";

import { ContractForm } from "@/components/contracts/contract-form";
import { ContractLocked } from "@/components/contracts/contract-locked";
import { PageHeader } from "@/components/layout/page-header";
import { requireUser } from "@/lib/auth";
import { canUseContracts, planById } from "@/lib/plan";
import { getClients } from "@/lib/queries";

export const metadata: Metadata = {
  title: "New contract",
};

export default async function NewContractPage() {
  const user = await requireUser();
  const unlocked = canUseContracts(planById(user.planId));
  const clients = unlocked ? await getClients(user.id) : [];

  return (
    <>
      <PageHeader
        title="New contract"
        description="Guided generator — fill in the details and the preview builds as you go."
      />
      {unlocked ? (
        <ContractForm
          clients={clients}
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
