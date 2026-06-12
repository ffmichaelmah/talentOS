import type { Metadata } from "next";

import { ContractBuilder } from "@/components/forms/contract-builder";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "New contract",
};

export default function NewContractPage() {
  return (
    <>
      <PageHeader
        title="New contract"
        description="Generate a contract from a reference template, amend the details, and edit the content to fit your deal."
      />
      <ContractBuilder />
    </>
  );
}
