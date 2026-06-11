import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { UploadTemplateDialog } from "@/components/forms/upload-template-dialog";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { templates } from "@/data";
import { formatDate } from "@/lib/format";
import type { DocumentTemplate, TemplateStatus } from "@/types";

export const metadata: Metadata = {
  title: "Templates · Admin",
};

const statusVariant: Record<
  TemplateStatus,
  "default" | "secondary" | "outline"
> = {
  published: "default",
  draft: "secondary",
  archived: "outline",
};

const kindLabels: Record<DocumentTemplate["kind"], string> = {
  invoice: "Invoice",
  contract: "Contract",
  "advance-form": "Advance form",
};

function TemplateTable({ rows }: { rows: DocumentTemplate[] }) {
  return (
    <Card className="shadow-xs">
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Kind</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Version</TableHead>
              <TableHead className="text-right">Used</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((template) => (
              <TableRow key={template.id}>
                <TableCell>
                  <Link
                    href={`/admin/templates/${template.id}`}
                    className="font-medium hover:underline"
                  >
                    {template.name}
                  </Link>
                  {template.isDefault ? (
                    <Badge variant="outline" className="ml-2">
                      default
                    </Badge>
                  ) : null}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {kindLabels[template.kind]}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[template.status]}>
                    {template.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  v{template.version}
                </TableCell>
                <TableCell className="text-right">
                  {template.usageCount}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(template.updatedAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default function AdminTemplatesPage() {
  const byKind = (kind: DocumentTemplate["kind"]) =>
    templates.filter((t) => t.kind === kind);

  return (
    <>
      <PageHeader
        title="Templates"
        description="The invoice, contract, and advance form templates available to users."
        actions={
          <>
            <UploadTemplateDialog />
            <Button
              nativeButton={false}
              render={<Link href="/admin/templates/new" />}
            >
              <Plus className="size-4" />
              New template
            </Button>
          </>
        }
      />

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({templates.length})</TabsTrigger>
          <TabsTrigger value="invoice">
            Invoices ({byKind("invoice").length})
          </TabsTrigger>
          <TabsTrigger value="contract">
            Contracts ({byKind("contract").length})
          </TabsTrigger>
          <TabsTrigger value="advance-form">
            Advancing ({byKind("advance-form").length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <TemplateTable rows={templates} />
        </TabsContent>
        <TabsContent value="invoice" className="mt-4">
          <TemplateTable rows={byKind("invoice")} />
        </TabsContent>
        <TabsContent value="contract" className="mt-4">
          <TemplateTable rows={byKind("contract")} />
        </TabsContent>
        <TabsContent value="advance-form" className="mt-4">
          <TemplateTable rows={byKind("advance-form")} />
        </TabsContent>
      </Tabs>
    </>
  );
}
