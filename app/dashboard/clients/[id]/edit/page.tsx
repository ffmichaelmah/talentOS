import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ClientForm } from "@/components/clients/client-form";
import { PageHeader } from "@/components/layout/page-header";
import { requireUser } from "@/lib/auth";
import { getClientById } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Edit client",
};

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const client = await getClientById(user.id, id);
  if (!client) notFound();

  return (
    <>
      <PageHeader title="Edit client" description={`Update ${client.name}.`} />
      <ClientForm client={client} />
    </>
  );
}
