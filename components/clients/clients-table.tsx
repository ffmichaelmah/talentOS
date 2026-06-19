"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Search, Users } from "lucide-react";

import { EmptyStateCard } from "@/components/cards/empty-state-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CLIENT_TYPE_LABELS } from "@/lib/clients";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Client, ClientType } from "@/types";
import { cn } from "@/lib/utils";

type Filter = "all" | ClientType;

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "venue", label: "Venues" },
  { value: "brand", label: "Brands" },
  { value: "agency", label: "Agencies" },
  { value: "promoter", label: "Promoters" },
  { value: "private", label: "Private" },
];

export function ClientsTable({
  clients,
  lastBooking,
}: {
  clients: Client[];
  lastBooking: Record<string, string | undefined>;
}) {
  const [filter, setFilter] = React.useState<Filter>("all");
  const [query, setQuery] = React.useState("");

  const rows = clients.filter((client) => {
    if (filter !== "all" && client.type !== filter) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return [client.name, client.company ?? "", client.email]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });

  const countFor = (f: Filter) =>
    f === "all" ? clients.length : clients.filter((c) => c.type === f).length;

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
            placeholder="Search name, company, or email…"
            className="pl-8"
            aria-label="Search clients"
          />
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyStateCard
          icon={Users}
          title="No clients match"
          description={
            query
              ? `Nothing found for “${query}”.`
              : "No clients of this type yet."
          }
        />
      ) : (
        <Card className="shadow-xs">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="text-right">Bookings</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead>Last booking</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((client) => {
                  const last = lastBooking[client.id];
                  return (
                    <TableRow key={client.id}>
                      <TableCell>
                        <Link
                          href={`/dashboard/clients/${client.id}`}
                          className="font-medium hover:underline"
                        >
                          {client.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {client.company ?? CLIENT_TYPE_LABELS[client.type]}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {client.email}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {client.phone ?? "—"}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {client.totalBookings}
                      </TableCell>
                      <TableCell className="text-right font-medium tabular-nums">
                        {formatCurrency(client.totalBilled)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {last ? formatDate(last) : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          nativeButton={false}
                          render={
                            <Link href={`/dashboard/clients/${client.id}`} />
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
