"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Minus, Search } from "lucide-react";

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
import { bookings } from "@/data";
import {
  BOOKING_STAGE_LABELS,
  BOOKING_STAGES,
  advanceFor,
  clientDisplayName,
  contractFor,
  invoiceFor,
} from "@/lib/bookings";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Booking, BookingStage } from "@/types";
import { cn } from "@/lib/utils";

type Filter = "all" | BookingStage;

function DocBadge({ status }: { status?: string }) {
  if (!status)
    return (
      <span className="inline-flex items-center text-muted-foreground/50">
        <Minus className="size-3.5" />
      </span>
    );
  return <StatusBadge status={status} />;
}

function timeRange(b: Booking): string {
  const start = new Date(b.startTime);
  const end = new Date(b.endTime);
  const fmt = (d: Date) =>
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }).format(d);
  return `${fmt(start)} – ${fmt(end)}`;
}

export function BookingsTable() {
  const [filter, setFilter] = React.useState<Filter>("all");
  const [query, setQuery] = React.useState("");

  const rows = bookings.filter((booking) => {
    if (filter !== "all" && booking.stage !== filter) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return [booking.title, clientDisplayName(booking), booking.venueName]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });

  const countFor = (f: Filter) =>
    f === "all" ? bookings.length : bookings.filter((b) => b.stage === f).length;

  const filters: { value: Filter; label: string }[] = [
    { value: "all", label: "All" },
    ...BOOKING_STAGES.map((s) => ({ value: s, label: BOOKING_STAGE_LABELS[s] })),
  ];

  return (
    <div className="space-y-4">
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

      <div className="relative w-full sm:w-80">
        <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search booking, client, or venue…"
          className="pl-8"
          aria-label="Search bookings"
        />
      </div>

      {rows.length === 0 ? (
        <EmptyStateCard
          icon={Calendar}
          title="No bookings match"
          description={
            query
              ? `Nothing found for “${query}”.`
              : "No bookings at this stage yet."
          }
        />
      ) : (
        <Card className="shadow-xs">
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Fee</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Contract</TableHead>
                  <TableHead>Advance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="max-w-[14rem]">
                      <Link
                        href={`/dashboard/bookings/${booking.id}`}
                        className="block truncate font-medium hover:underline"
                        title={booking.title}
                      >
                        {booking.title}
                      </Link>
                    </TableCell>
                    <TableCell>{clientDisplayName(booking)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(booking.startTime)}
                    </TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {timeRange(booking)}
                    </TableCell>
                    <TableCell className="max-w-[12rem] truncate text-muted-foreground">
                      {booking.venueName}
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatCurrency(booking.fee, booking.currency)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={booking.stage} />
                    </TableCell>
                    <TableCell>
                      <DocBadge status={invoiceFor(booking)?.status} />
                    </TableCell>
                    <TableCell>
                      <DocBadge status={contractFor(booking)?.status} />
                    </TableCell>
                    <TableCell>
                      <DocBadge status={advanceFor(booking)?.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        nativeButton={false}
                        render={
                          <Link href={`/dashboard/bookings/${booking.id}`} />
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
