import type { Metadata } from "next";

import { TemplateEditor } from "@/components/forms/template-editor";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "New template · Admin",
};

export default function NewTemplatePage() {
  return (
    <>
      <PageHeader
        title="New template"
        description="Create an invoice, contract, or advance form template for users."
      />
      <TemplateEditor />
    </>
  );
}
