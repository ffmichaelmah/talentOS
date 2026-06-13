import type { Metadata } from "next";

import { AdvanceForm } from "@/components/advancing/advance-form";
import { AdvanceLocked } from "@/components/advancing/advance-locked";
import { PageHeader } from "@/components/layout/page-header";
import { canUseAdvancing, getCurrentPlan } from "@/lib/plan";

export const metadata: Metadata = {
  title: "New advance form",
};

export default function NewAdvancePage() {
  const plan = getCurrentPlan();
  const unlocked = canUseAdvancing(plan);

  return (
    <>
      <PageHeader
        title="New advance form"
        description="Pick a type, fill in what you know, and share a link for the client to complete the rest."
      />
      {unlocked ? <AdvanceForm /> : <AdvanceLocked />}
    </>
  );
}
