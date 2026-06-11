import type { Metadata } from "next";
import { Calendar, Coins, Receipt, Users } from "lucide-react";

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
import { bookings, clients, currentUser, invoices } from "@/data";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { InvoiceStatus } from "@/types";

export const metadata: Metadata = {
  title: "Dashboard",
};

const invoiceStatusVariant: Record<
  InvoiceStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  draft: "outline",
  sent: "secondary",
  viewed: "secondary",
  paid: "default",
  overdue: "destructive",
  cancelled: "outline",
};

export default function DashboardPage() {
  const outstanding = invoices
    .filter((i) => i.status !== "paid" && i.status !== "cancelled")
    .reduce((sum, i) => sum + (i.total - i.amountPaid), 0);
  const upcoming = bookings.filter(
    (b) => b.status === "confirmed" || b.status === "pending"
  );

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="A quick look at your bookings, money, and documents."
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Outstanding"
          value={formatCurrency(outstanding, currentUser.currency)}
          hint={`${invoices.filter((i) => i.status === "overdue").length} invoice overdue`}
          icon={Receipt}
        />
        <StatCard
          label="Upcoming gigs"
          value={String(upcoming.length)}
          hint="Confirmed or pending"
          icon={Calendar}
        />
        <StatCard
          label="Active clients"
          value={String(clients.length)}
          hint="Across venues, brands & events"
          icon={Users}
        />
        <StatCard
          label="Credit balance"
          value={String(currentUser.creditBalance)}
          hint="Document credits remaining"
          icon={Coins}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle>Upcoming bookings</CardTitle>
            <CardDescription>Your next confirmed dates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcoming.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between gap-4 rounded-lg border p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{booking.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(booking.startTime)} · {booking.venueName}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-medium">
                    {formatCurrency(booking.fee, booking.currency)}
                  </p>
                  <Badge
                    variant={
                      booking.status === "confirmed" ? "default" : "secondary"
                    }
                    className="mt-1"
                  >
                    {booking.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle>Recent invoices</CardTitle>
            <CardDescription>Latest documents and their status.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {invoices.map((invoice) => {
              const client = clients.find((c) => c.id === invoice.clientId);
              return (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between gap-4 rounded-lg border p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {invoice.invoiceNumber}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {client?.company ?? client?.name ?? "Unknown client"}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-medium">
                      {formatCurrency(invoice.total, invoice.currency)}
                    </p>
                    <Badge
                      variant={invoiceStatusVariant[invoice.status]}
                      className="mt-1"
                    >
                      {invoice.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
