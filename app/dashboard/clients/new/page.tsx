import type { Metadata } from "next";

import { ClientForm } from "@/components/clients/client-form";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Add client",
};

export default function NewClientPage() {
  return (
    <>
      <PageHeader
        title="Add client"
        description="Save a venue, brand, promoter, or planner you work with."
      />
      <ClientForm />
    </>
  );
}
