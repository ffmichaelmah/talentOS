import type { Metadata } from "next";

import { AdvanceForm } from "@/components/advancing/advance-form";
import { AdvanceLocked } from "@/components/advancing/advance-locked";
import { PageHeader } from "@/components/layout/page-header";
import { requireUser } from "@/lib/auth";
import { canUseAdvancing, planById } from "@/lib/plan";

export const metadata: Metadata = {
  title: "New advance form",
};

export default async function NewAdvancePage() {
  const user = await requireUser();
  const unlocked = canUseAdvancing(planById(user.planId));

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
