import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ClientAdvanceEditor } from "@/components/advancing/client-advance-editor";
import { getSharedAdvance } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Advance — TalentOS",
  robots: { index: false },
};

export default async function SharedAdvancePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const form = await getSharedAdvance(id);
  if (!form) notFound();
  return <ClientAdvanceEditor form={form} />;
}
