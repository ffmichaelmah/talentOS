import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TemplateEditor } from "@/components/forms/template-editor";
import { PageHeader } from "@/components/layout/page-header";
import { templates } from "@/data";

export async function generateMetadata(
  props: PageProps<"/admin/templates/[id]">
): Promise<Metadata> {
  const { id } = await props.params;
  const template = templates.find((t) => t.id === id);
  return { title: `${template?.name ?? "Template"} · Admin` };
}

export function generateStaticParams() {
  return templates.map((t) => ({ id: t.id }));
}

export default async function EditTemplatePage(
  props: PageProps<"/admin/templates/[id]">
) {
  const { id } = await props.params;
  const template = templates.find((t) => t.id === id);
  if (!template) notFound();

  return (
    <>
      <PageHeader
        title={template.name}
        description={`Editing v${template.version} · used ${template.usageCount} times.`}
      />
      <TemplateEditor template={template} />
    </>
  );
}
