"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Receipt, Search } from "lucide-react";

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
import { formatCurrency, formatDate } from "@/lib/format";
import { balanceFor, clientDisplayName, eventNameFor } from "@/lib/invoices";
import type { Invoice } from "@/types";
import { cn } from "@/lib/utils";

type Filter = "all" | "draft" | "sent" | "paid" | "overdue";

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
];

function matchesFilter(status: string, filter: Filter): boolean {
  if (filter === "all") return true;
  // "viewed" is a sent invoice the client has opened.
  if (filter === "sent") return status === "sent" || status === "viewed";
  return status === filter;
}

export function InvoicesTable({ invoices }: { invoices: Invoice[] }) {
  const [filter, setFilter] = React.useState<Filter>("all");
  const [query, setQuery] = React.useState("");

  const rows = invoices.filter((invoice) => {
    if (!matchesFilter(invoice.status, filter)) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return [
      invoice.invoiceNumber,
      clientDisplayName(invoice),
      eventNameFor(invoice),
    ]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });

  const countFor = (f: Filter) =>
    invoices.filter((i) => matchesFilter(i.status, f)).length;

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
            placeholder="Search invoice #, client, or event…"
            className="pl-8"
            aria-label="Search invoices"
          />
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyStateCard
          icon={Receipt}
          title="No invoices match"
          description={
            query
              ? `Nothing found for “${query}”. Try a different invoice number, client, or event.`
              : "No invoices with this status yet."
          }
        />
      ) : (
        <Card className="shadow-xs">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Event / campaign</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Deposit</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <Link
                        href={`/dashboard/invoices/${invoice.id}`}
                        className="font-medium hover:underline"
                      >
                        {invoice.invoiceNumber}
                      </Link>
                    </TableCell>
                    <TableCell>{clientDisplayName(invoice)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {eventNameFor(invoice)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(invoice.issueDate)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(invoice.dueDate)}
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatCurrency(invoice.total, invoice.currency)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground tabular-nums">
                      {invoice.depositAmount
                        ? formatCurrency(invoice.depositAmount, invoice.currency)
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(balanceFor(invoice), invoice.currency)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={invoice.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        nativeButton={false}
                        render={
                          <Link href={`/dashboard/invoices/${invoice.id}`} />
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
