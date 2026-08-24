import type { Metadata } from "next";

import { AdvanceForm } from "@/components/advancing/advance-form";
import { AdvanceLocked } from "@/components/advancing/advance-locked";
import { PageHeader } from "@/components/layout/page-header";
import { requireUser } from "@/lib/auth";
import { canUseAdvancing, planForUser } from "@/lib/plan";
import { getClients } from "@/lib/queries";

export const metadata: Metadata = {
  title: "New advance form",
};

export default async function NewAdvancePage(props: {
  searchParams: Promise<{ client?: string }>;
}) {
  const user = await requireUser();
  const unlocked = canUseAdvancing(planForUser(user));
  const clients = unlocked ? await getClients(user.id) : [];
  const { client } = await props.searchParams;

  return (
    <>
      <PageHeader
        title="New advance form"
        description="Pick a type, fill in what you know, and share a link for the client to complete the rest."
      />
      {unlocked ? (
        <AdvanceForm clients={clients} defaultClientId={client} />
      ) : (
        <AdvanceLocked />
      )}
    </>
  );
}
