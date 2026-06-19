import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  FileSignature,
  Mail,
  MapPin,
  Phone,
  Receipt,
} from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { StatCard } from "@/components/cards/stat-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireUser } from "@/lib/auth";
import { CLIENT_TYPE_LABELS } from "@/lib/clients";
import { contractTypeLabel } from "@/lib/contracts";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  getBookingsForClient,
  getClientById,
  getContractsForClient,
  getInvoicesForClient,
} from "@/lib/queries";

export const metadata: Metadata = {
  title: "Client",
};

export default async function ClientDetailPage(
  props: PageProps<"/dashboard/clients/[id]">
) {
  const { id } = await props.params;
  const user = await requireUser();
  const client = await getClientById(user.id, id);
  if (!client) notFound();

  const [pastBookings, clientInvoices, clientContracts] = await Promise.all([
    getBookingsForClient(user.id, id),
    getInvoicesForClient(user.id, id),
    getContractsForClient(user.id, id),
  ]);
  const last = pastBookings[0]?.startTime;
  const collected = clientInvoices.reduce((sum, i) => sum + i.amountPaid, 0);
  const outstanding = clientInvoices.reduce(
    (sum, i) => sum + (i.total - i.amountPaid),
    0
  );

  return (
    <>
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          nativeButton={false}
          render={<Link href="/dashboard/clients" />}
          aria-label="Back to clients"
        >
          <ArrowLeft className="size-4" />
        </Button>
        <PageHeader title={client.name} />
      </div>

      {/* Profile */}
      <Card className="shadow-xs">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="text-lg">
                {client.company ?? client.name}
              </CardTitle>
              <CardDescription>
                {client.company ? client.name : "Individual client"}
              </CardDescription>
            </div>
            <Badge variant="outline">{CLIENT_TYPE_LABELS[client.type]}</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
          <p className="flex items-center gap-2 text-muted-foreground">
            <Mail className="size-4 shrink-0" /> {client.email}
          </p>
          <p className="flex items-center gap-2 text-muted-foreground">
            <Phone className="size-4 shrink-0" /> {client.phone ?? "—"}
          </p>
          <p className="flex items-center gap-2 text-muted-foreground sm:col-span-2">
            <MapPin className="size-4 shrink-0" />{" "}
            {client.address ?? client.location ?? "—"}
          </p>
          {client.taxNumber ? (
            <p className="text-muted-foreground">
              Tax no: <span className="text-foreground">{client.taxNumber}</span>
            </p>
          ) : null}
          <p className="text-muted-foreground">
            Client since {formatDate(client.createdAt)}
          </p>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total bookings"
          value={String(client.totalBookings)}
          icon={Calendar}
        />
        <StatCard
          label="Total revenue"
          value={formatCurrency(client.totalBilled)}
          hint={`${formatCurrency(collected)} collected`}
          icon={Receipt}
        />
        <StatCard
          label="Outstanding"
          value={formatCurrency(outstanding)}
          icon={Receipt}
        />
        <StatCard
          label="Last booking"
          value={last ? formatDate(last) : "—"}
          icon={Calendar}
        />
      </div>

      {/* Past bookings */}
      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle>Past & upcoming bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {pastBookings.length === 0 ? (
            <p className="py-4 text-sm text-muted-foreground">No bookings yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Fee</TableHead>
                  <TableHead>Stage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pastBookings.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>
                      <Link
                        href={`/dashboard/bookings/${b.id}`}
                        className="font-medium hover:underline"
                      >
                        {b.title}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(b.startTime)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(b.fee, b.currency)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={b.stage} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="grid items-start gap-5 xl:grid-cols-2">
        {/* Invoice + payment history */}
        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="size-4 text-primary" /> Invoice & payment
              history
            </CardTitle>
          </CardHeader>
          <CardContent>
            {clientInvoices.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">
                No invoices yet.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Paid</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientInvoices.map((i) => (
                    <TableRow key={i.id}>
                      <TableCell>
                        <Link
                          href={`/dashboard/invoices/${i.id}`}
                          className="font-medium hover:underline"
                        >
                          {i.invoiceNumber}
                        </Link>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCurrency(i.total, i.currency)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCurrency(i.amountPaid, i.currency)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={i.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Contract history */}
        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSignature className="size-4 text-primary" /> Contract history
            </CardTitle>
          </CardHeader>
          <CardContent>
            {clientContracts.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">
                No contracts yet.
              </p>
            ) : (
              <div className="space-y-3">
                {clientContracts.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border/60 p-3"
                  >
                    <div className="min-w-0">
                      <Link
                        href={`/dashboard/contracts/${c.id}`}
                        className="block truncate text-sm font-medium hover:underline"
                      >
                        {contractTypeLabel(c.contractType)}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(c.fee, c.currency)} ·{" "}
                        {formatDate(c.createdAt)}
                      </p>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      {client.notes ? (
        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{client.notes}</p>
          </CardContent>
        </Card>
      ) : null}
    </>
  );
}
