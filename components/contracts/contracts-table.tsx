"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, FileSignature, Search } from "lucide-react";

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
import { clientDisplayName, contractTypeLabel } from "@/lib/contracts";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Contract, ContractStatus } from "@/types";
import { cn } from "@/lib/utils";

type Filter = "all" | ContractStatus;

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "pending-client", label: "Pending Client" },
  { value: "signed", label: "Signed" },
  { value: "expired", label: "Expired" },
  { value: "cancelled", label: "Cancelled" },
];

export function ContractsTable({ contracts }: { contracts: Contract[] }) {
  const [filter, setFilter] = React.useState<Filter>("all");
  const [query, setQuery] = React.useState("");

  const rows = contracts.filter((contract) => {
    if (filter !== "all" && contract.status !== filter) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return [
      contract.title,
      clientDisplayName(contract),
      contractTypeLabel(contract.contractType),
    ]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });

  const countFor = (f: Filter) =>
    f === "all"
      ? contracts.length
      : contracts.filter((c) => c.status === f).length;

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
            aria-label="Search contracts"
          />
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyStateCard
          icon={FileSignature}
          title="No contracts match"
          description={
            query
              ? `Nothing found for “${query}”. Try a different title, client, or type.`
              : "No contracts with this status yet."
          }
        />
      ) : (
        <Card className="shadow-xs">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contract</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Fee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell className="max-w-[18rem]">
                      <Link
                        href={`/dashboard/contracts/${contract.id}`}
                        className="block truncate font-medium hover:underline"
                        title={contract.title}
                      >
                        {contract.title}
                      </Link>
                    </TableCell>
                    <TableCell>{clientDisplayName(contract)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {contractTypeLabel(contract.contractType)}
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatCurrency(contract.fee, contract.currency)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={contract.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(contract.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        nativeButton={false}
                        render={
                          <Link href={`/dashboard/contracts/${contract.id}`} />
                        }
                      >
                        View
                        <ArrowRight className="size-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
