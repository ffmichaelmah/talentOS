import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  ClipboardList,
  Clock,
  FileSignature,
  MapPin,
  Receipt,
} from "lucide-react";

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
import { bookings } from "@/data";
import {
  EVENT_TYPE_LABELS,
  advanceFor,
  clientFor,
  contractFor,
  invoiceFor,
} from "@/lib/bookings";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";
import type { Booking } from "@/types";

export async function generateMetadata(
  props: PageProps<"/dashboard/bookings/[id]">
): Promise<Metadata> {
  const { id } = await props.params;
  const booking = bookings.find((b) => b.id === id);
  return { title: booking ? booking.title : "Booking" };
}

export function generateStaticParams() {
  return bookings.map((b) => ({ id: b.id }));
}

function buildTimeline(booking: Booking) {
  const events: { date: string; label: string }[] = [];
  events.push({ date: booking.createdAt, label: "Booking created" });
  const contract = contractFor(booking);
  if (contract?.sentAt)
    events.push({ date: contract.sentAt, label: "Contract sent to client" });
  if (contract?.signedAt)
    events.push({ date: contract.signedAt, label: "Contract signed" });
  const invoice = invoiceFor(booking);
  if (invoice)
    events.push({
      date: `${invoice.issueDate}T09:00:00Z`,
      label: `Invoice ${invoice.invoiceNumber} issued`,
    });
  if (booking.depositPaid && invoice)
    events.push({
      date: `${invoice.issueDate}T12:00:00Z`,
      label: "Deposit received",
    });
  const advance = advanceFor(booking);
  if (advance?.status === "completed")
    events.push({ date: advance.updatedAt, label: "Advance form completed" });
  return events.sort((a, b) => a.date.localeCompare(b.date));
}

function LinkedDoc({
  icon: Icon,
  label,
  href,
  status,
  createHref,
}: {
  icon: typeof Receipt;
  label: string;
  href?: string;
  status?: string;
  createHref: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 p-3">
      <div className="flex items-center gap-2.5">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4" />
        </span>
        <div>
          <p className="text-sm font-medium">{label}</p>
          {status ? (
            <StatusBadge status={status} className="mt-0.5" />
          ) : (
            <p className="text-xs text-muted-foreground">Not created yet</p>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        nativeButton={false}
        render={<Link href={href ?? createHref} />}
      >
        {href ? "View" : "Create"}
        <ArrowRight className="size-3.5" />
      </Button>
    </div>
  );
}

export default async function BookingDetailPage(
  props: PageProps<"/dashboard/bookings/[id]">
) {
  const { id } = await props.params;
  const booking = bookings.find((b) => b.id === id);
  if (!booking) notFound();

  const client = clientFor(booking);
  const invoice = invoiceFor(booking);
  const contract = contractFor(booking);
  const advance = advanceFor(booking);
  const timeline = buildTimeline(booking);

  const deposit = booking.depositAmount ?? 0;
  const balance = booking.balanceAmount ?? booking.fee - deposit;
  const paid = invoice?.amountPaid ?? (booking.depositPaid ? deposit : 0);
  const outstanding = booking.fee - paid;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            nativeButton={false}
            render={<Link href="/dashboard/bookings" />}
            aria-label="Back to bookings"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              {booking.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {client?.company ?? client?.name}
            </p>
          </div>
        </div>
        <StatusBadge status={booking.stage} />
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-3">
        {/* Left: overview + linked + timeline */}
        <div className="space-y-5 xl:col-span-2">
          {/* Overview */}
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>Booking overview</CardTitle>
              <CardDescription>
                {EVENT_TYPE_LABELS[booking.eventType]}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
              <p className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="size-4 shrink-0" />
                {formatDate(booking.startTime)}
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Clock className="size-4 shrink-0" />
                {formatDateTime(booking.startTime)} –{" "}
                {new Intl.DateTimeFormat("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                }).format(new Date(booking.endTime))}
              </p>
              <p className="flex items-center gap-2 text-muted-foreground sm:col-span-2">
                <MapPin className="size-4 shrink-0" />
                {booking.venueName}
                {booking.venueAddress ? ` · ${booking.venueAddress}` : ""}
              </p>
            </CardContent>
          </Card>

          {/* Linked documents */}
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>Linked documents</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              <LinkedDoc
                icon={Receipt}
                label="Invoice"
                status={invoice?.status}
                href={
                  invoice ? `/dashboard/invoices/${invoice.id}` : undefined
                }
                createHref="/dashboard/invoices/new"
              />
              <LinkedDoc
                icon={FileSignature}
                label="Contract"
                status={contract?.status}
                href={
                  contract ? `/dashboard/contracts/${contract.id}` : undefined
                }
                createHref="/dashboard/contracts/new"
              />
              <LinkedDoc
                icon={ClipboardList}
                label="Advance"
                status={advance?.status}
                href={
                  advance ? `/dashboard/advancing/${advance.id}` : undefined
                }
                createHref="/dashboard/advancing/new"
              />
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>Timeline & activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="relative space-y-5 border-l border-border/60 pl-5">
                {timeline.map((event, i) => (
                  <li key={i} className="relative">
                    <span className="absolute top-1 -left-[1.42rem] size-2.5 rounded-full bg-primary ring-4 ring-background" />
                    <p className="text-sm font-medium">{event.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(event.date)}
                    </p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {booking.notes ? (
            <Card className="shadow-xs">
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{booking.notes}</p>
              </CardContent>
            </Card>
          ) : null}
        </div>

        {/* Right: fee breakdown + client + payment */}
        <div className="space-y-5">
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>Fee breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total fee</span>
                <span className="font-medium tabular-nums">
                  {formatCurrency(booking.fee, booking.currency)}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Deposit</span>
                <span className="tabular-nums">
                  {formatCurrency(deposit, booking.currency)}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Balance</span>
                <span className="tabular-nums">
                  {formatCurrency(balance, booking.currency)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>Payment status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Deposit</span>
                <Badge variant={booking.depositPaid ? "default" : "secondary"}>
                  {booking.depositPaid ? "Paid" : "Unpaid"}
                </Badge>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Collected</span>
                <span className="tabular-nums">
                  {formatCurrency(paid, booking.currency)}
                </span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Outstanding</span>
                <span className="tabular-nums">
                  {formatCurrency(outstanding, booking.currency)}
                </span>
              </div>
            </CardContent>
          </Card>

          {client ? (
            <Card className="shadow-xs">
              <CardHeader>
                <CardTitle>Client</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5 text-sm">
                <Link
                  href={`/dashboard/clients/${client.id}`}
                  className="font-medium hover:underline"
                >
                  {client.company ?? client.name}
                </Link>
                <p className="text-muted-foreground">{client.email}</p>
                <p className="text-muted-foreground">{client.phone ?? "—"}</p>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </>
  );
}
