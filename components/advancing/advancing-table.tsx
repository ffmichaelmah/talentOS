"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, ClipboardList, Search } from "lucide-react";

import { EmptyStateCard } from "@/components/cards/empty-state-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  advanceTypeLabel,
  clientDisplayName,
  shareStatusLabel,
} from "@/lib/advancing";
import { formatDate } from "@/lib/format";
import type { AdvanceForm, AdvanceFormStatus } from "@/types";
import { cn } from "@/lib/utils";

type Filter = "all" | AdvanceFormStatus;

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "completed", label: "Completed" },
  { value: "incomplete", label: "Incomplete" },
  { value: "expired", label: "Expired" },
];

const shareToneClasses: Record<string, string> = {
  viewed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  active: "bg-primary/10 text-primary",
  none: "bg-muted text-muted-foreground",
};

export function AdvancingTable({
  advanceForms,
}: {
  advanceForms: AdvanceForm[];
}) {
  const [filter, setFilter] = React.useState<Filter>("all");
  const [query, setQuery] = React.useState("");

  const rows = advanceForms.filter((form) => {
    if (filter !== "all" && form.status !== filter) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return [
      form.title,
      clientDisplayName(form),
      form.reference ?? "",
      advanceTypeLabel(form.type),
    ]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });

  const countFor = (f: Filter) =>
    f === "all"
      ? advanceForms.length
      : advanceForms.filter((x) => x.status === f).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                filter === f.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/60 bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
              )}
            >
              {f.label}
              <span
                className={cn(
                  "ml-1.5 text-xs",
                  filter === f.value
                    ? "text-primary-foreground/75"
                    : "text-muted-foreground/70"
                )}
              >
                {countFor(f.value)}
              </span>
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, client, or type…"
            className="pl-8"
            aria-label="Search advance forms"
          />
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyStateCard
          icon={ClipboardList}
          title="No advance forms match"
          description={
            query
              ? `Nothing found for “${query}”. Try a different title, client, or type.`
              : "No advance forms with this status yet."
          }
        />
      ) : (
        <Card className="shadow-xs">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Advance form</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Booking / campaign</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Share link</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((form) => {
                  const share = shareStatusLabel(form);
                  return (
                    <TableRow key={form.id}>
                      <TableCell className="max-w-[16rem]">
                        <Link
                          href={`/dashboard/advancing/${form.id}`}
                          className="block truncate font-medium hover:underline"
                          title={form.title}
                        >
                          {form.title}
                        </Link>
                      </TableCell>
                      <TableCell>{clientDisplayName(form)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {form.reference ?? "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {form.date ? formatDate(form.date) : "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {advanceTypeLabel(form.type)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={form.status} />
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
                            shareToneClasses[share.tone]
                          )}
                        >
                          <span
                            className={cn(
                              "size-1.5 rounded-full",
                              share.tone === "viewed"
                                ? "bg-emerald-500"
                                : share.tone === "active"
                                  ? "bg-primary"
                                  : "bg-muted-foreground/50"
                            )}
                          />
                          {share.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          nativeButton={false}
                          render={
                            <Link href={`/dashboard/advancing/${form.id}`} />
                          }
                        >
                          View
                          <ArrowRight className="size-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
