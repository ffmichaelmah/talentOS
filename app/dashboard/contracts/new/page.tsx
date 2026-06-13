import type { Metadata } from "next";

import { ContractForm } from "@/components/contracts/contract-form";
import { ContractLocked } from "@/components/contracts/contract-locked";
import { PageHeader } from "@/components/layout/page-header";
import { canUseContracts, getCurrentPlan } from "@/lib/plan";

export const metadata: Metadata = {
  title: "New contract",
};

export default function NewContractPage() {
  const plan = getCurrentPlan();
  const unlocked = canUseContracts(plan);

  return (
    <>
      <PageHeader
        title="New contract"
        description="Guided generator — fill in the details and the preview builds as you go."
      />
      {unlocked ? <ContractForm /> : <ContractLocked />}
    </>
  );
}
