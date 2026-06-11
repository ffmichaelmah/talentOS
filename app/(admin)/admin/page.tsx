import type { Metadata } from "next";
import Link from "next/link";
import { FileStack, LayoutTemplate, ShieldCheck, Users } from "lucide-react";

import { StatCard } from "@/components/cards/stat-card";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { templates } from "@/data";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Admin",
};

export default function AdminOverviewPage() {
  const published = templates.filter((t) => t.status === "published");
  const drafts = templates.filter((t) => t.status === "draft");
  const totalGenerated = templates.reduce((sum, t) => sum + t.usageCount, 0);
  const recentlyUpdated = [...templates]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 4);

  return (
    <>
      <PageHeader
        title="Admin overview"
        description="Manage the templates, users, and plans behind TalentOS."
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Templates"
          value={String(templates.length)}
          hint={`${published.length} published · ${drafts.length} draft`}
          icon={LayoutTemplate}
        />
        <StatCard
          label="Documents generated"
          value={String(totalGenerated)}
          hint="Across all templates"
          icon={FileStack}
        />
        <StatCard
          label="Active users"
          value="1"
          hint="Prototype — single dummy user"
          icon={Users}
        />
        <StatCard
          label="Default templates"
          value={String(templates.filter((t) => t.isDefault).length)}
          hint="One per document kind"
          icon={ShieldCheck}
        />
      </div>

      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle>Recently updated templates</CardTitle>
          <CardDescription>
            Latest changes across the template library.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentlyUpdated.map((template) => (
            <Link
              key={template.id}
              href={`/admin/templates/${template.id}`}
              className="flex items-center justify-between gap-4 rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{template.name}</p>
                <p className="text-xs text-muted-foreground">
                  v{template.version} · updated {formatDate(template.updatedAt)}
                </p>
              </div>
              <Badge
                variant={
                  template.status === "published" ? "default" : "secondary"
                }
              >
                {template.status}
              </Badge>
            </Link>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
