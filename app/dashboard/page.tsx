import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Calendar,
  CalendarPlus,
  Check,
  CircleCheck,
  ClipboardList,
  Clock,
  FileSignature,
  Lock,
  Receipt,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";

import { QuickActionCard } from "@/components/cards/quick-action-card";
import { StatCard } from "@/components/cards/stat-card";
import { UpgradePrompt } from "@/components/cards/upgrade-prompt";
import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";
import {
  canUseAdvancing,
  canUseBookings,
  canUseContracts,
  planForUser,
} from "@/lib/plan";
import { cn } from "@/lib/utils";
import { getBookings, getClients, getContracts, getInvoices } from "@/lib/queries";
import type { Invoice } from "@/types";

export const metadata: Metadata = {
  title: "Dashboard",
};

const planFeatures = [
  { label: "Invoices & clients", key: "always" as const, lockedLabel: "" },
  { label: "Bookings", key: "bookings" as const, lockedLabel: "Standard plan" },
  { label: "Agreements", key: "contracts" as const, lockedLabel: "Pro plan" },
  {
    label: "Advancing forms",
    key: "advancing" as const,
    lockedLabel: "Pro plan",
  },
];

export default async function DashboardOverviewPage() {
  const user = await requireUser();
  const plan = planForUser(user);
  const bookingsUnlocked = canUseBookings(plan);
  const contractsUnlocked = canUseContracts(plan);
  const advancingUnlocked = canUseAdvancing(plan);
  const unlockedByKey = {
    always: true,
    bookings: bookingsUnlocked,
    contracts: contractsUnlocked,
    advancing: advancingUnlocked,
  };

  const [invoices, bookings, contracts, clients] = await Promise.all([
    getInvoices(user.id),
    getBookings(user.id),
    getContracts(user.id),
    getClients(user.id),
  ]);

  const paidInvoices = invoices.filter((i) => i.status === "paid");
  const pendingInvoices = invoices.filter((i) =>
    ["draft", "sent", "viewed", "overdue"].includes(i.status)
  );
  const upcomingBookings = bookings.filter((b) =>
    ["confirmed", "pending"].includes(b.status)
  );
  const pendingContracts = contracts.filter((c) =>
    ["draft", "sent"].includes(c.status)
  );
  const monthlyEarnings = invoices.reduce((sum, i) => sum + i.amountPaid, 0);
  const recentInvoices = [...invoices]
    .sort((a, b) => b.issueDate.localeCompare(a.issueDate))
    .slice(0, 5);

  return (
    <>
      <PageHeader
        title="Overview"
        description="Here's where your talent business stands today — bookings, money, and documents in one place."
      />

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total invoices"
          value={String(invoices.length)}
          hint="All time"
          icon={Receipt}
        />
        <StatCard
          label="Paid invoices"
          value={String(paidInvoices.length)}
          hint={formatCurrency(
            paidInvoices.reduce((s, i) => s + i.total, 0),
            user.currency
          )}
          icon={CircleCheck}
        />
        <StatCard
          label="Pending invoices"
          value={String(pendingInvoices.length)}
          hint={`${formatCurrency(
            pendingInvoices.reduce((s, i) => s + (i.total - i.amountPaid), 0),
            user.currency
          )} outstanding`}
          icon={Clock}
        />
        <StatCard
          label="Upcoming jobs"
          value={String(upcomingBookings.length)}
          hint="Confirmed or pending"
          icon={Calendar}
        />
        <StatCard
          label="Active clients"
          value={String(clients.length)}
          hint="Venues, brands & events"
          icon={Users}
        />
        <StatCard
          label="Monthly earnings"
          value={formatCurrency(monthlyEarnings, user.currency)}
          hint="Collected this month"
          icon={TrendingUp}
        />
        <StatCard
          label="Current plan"
          value={plan.name}
          hint={
            plan.monthlyPrice === 0
              ? "Free forever"
              : `$${plan.monthlyPrice}/month`
          }
          icon={BadgeCheck}
        />
      </div>

      {/* Quick actions */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          Quick actions
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
          <QuickActionCard
            icon={Receipt}
            label="Create Invoice"
            href="/dashboard/invoices"
          />
          <QuickActionCard
            icon={UserPlus}
            label="Add Client"
            href="/dashboard/clients"
          />
          <QuickActionCard
            icon={CalendarPlus}
            label="Add Booking"
            href="/dashboard/bookings/new"
            locked={!bookingsUnlocked}
            lockNote="Bookings are available on Standard and Pro."
          />
          <QuickActionCard
            icon={FileSignature}
            label="Create Agreement"
            href="/dashboard/contracts/new"
            locked={!contractsUnlocked}
            lockNote="Agreements are available on Pro plan."
          />
          <QuickActionCard
            icon={ClipboardList}
            label="Create Advance Form"
            href="/dashboard/advancing"
            locked={!advancingUnlocked}
            lockNote="Advancing is available on Pro plan."
          />
        </div>
      </section>

      {/* Recent invoices + upcoming bookings */}
      <div className="grid items-start gap-5 xl:grid-cols-3">
        <div className="space-y-3 xl:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">
              Recent invoices
            </h2>
            <Link
              href="/dashboard/invoices"
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              View all <ArrowRight className="size-3" />
            </Link>
          </div>
          <DataTable<Invoice>
            columns={[
              {
                header: "Invoice",
                cell: (i) => (
                  <span className="font-medium">{i.invoiceNumber}</span>
                ),
              },
              { header: "Client", cell: (i) => i.clientName ?? "—" },
              { header: "Due", cell: (i) => formatDate(i.dueDate) },
              {
                header: "Amount",
                className: "text-right",
                cell: (i) => formatCurrency(i.total, i.currency),
              },
              {
                header: "Status",
                className: "text-right",
                cell: (i) => <StatusBadge status={i.status} />,
              },
            ]}
            rows={recentInvoices}
            rowKey={(i) => i.id}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">
              Upcoming bookings
            </h2>
            <Link
              href="/dashboard/bookings"
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              View all <ArrowRight className="size-3" />
            </Link>
          </div>
          <Card className="shadow-xs">
            <CardContent className="space-y-3">
              {upcomingBookings.slice(0, 4).map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border/60 p-3 transition-colors hover:bg-muted/40"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {booking.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(booking.startTime)} · {booking.venueName}
                    </p>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pending agreements + plan features */}
      <div className="grid items-start gap-5 xl:grid-cols-2">
        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle>Pending agreements</CardTitle>
            <CardDescription>
              Agreements waiting on a signature or still in draft.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingContracts.map((contract) => (
              <div
                key={contract.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border/60 p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {contract.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {contract.clientName ?? "—"} ·{" "}
                    {formatCurrency(contract.fee, contract.currency)}
                  </p>
                </div>
                <StatusBadge status={contract.status} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle>Your plan</CardTitle>
            <CardDescription>
              {plan.name} plan · {plan.tagline}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {planFeatures.map((feature) => {
              const unlocked = unlockedByKey[feature.key];
              return (
                <div
                  key={feature.label}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border/60 px-3 py-2 text-sm"
                >
                  <span
                    className={cn(
                      "flex items-center gap-2",
                      !unlocked && "text-muted-foreground"
                    )}
                  >
                    {unlocked ? (
                      <Check className="size-3.5 text-primary" />
                    ) : (
                      <Lock className="size-3.5" />
                    )}
                    {feature.label}
                  </span>
                  {!unlocked ? (
                    <span className="text-xs text-muted-foreground">
                      {feature.lockedLabel}
                    </span>
                  ) : null}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Upgrade prompt */}
      {plan.id !== "plan-pro" ? (
        <UpgradePrompt
          title={`You're on the ${plan.name} plan`}
          description="Upgrade to Pro for bookings, agreements, advancing forms, and custom branding."
          cta="View plans"
        />
      ) : null}
    </>
  );
}
