import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Calendar,
  CalendarPlus,
  CircleCheck,
  ClipboardList,
  Clock,
  Coins,
  FileSignature,
  Receipt,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";

import { CreditMeter } from "@/components/cards/credit-meter";
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
import {
  bookings,
  clients,
  contracts,
  creditTransactions,
  currentUser,
  invoices,
} from "@/data";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";
import { canUseAdvancing, canUseContracts, getCurrentPlan } from "@/lib/plan";
import type { Invoice } from "@/types";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardOverviewPage() {
  const plan = getCurrentPlan();
  const contractsUnlocked = canUseContracts(plan);
  const advancingUnlocked = canUseAdvancing(plan);

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
  const recentCredits = [...creditTransactions]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 4);

  const clientName = (id: string) => {
    const c = clients.find((x) => x.id === id);
    return c?.company ?? c?.name ?? "—";
  };

  return (
    <>
      <PageHeader
        title="Overview"
        description="A quick look at your bookings, money, and documents."
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
            currentUser.currency
          )}
          icon={CircleCheck}
        />
        <StatCard
          label="Pending invoices"
          value={String(pendingInvoices.length)}
          hint={`${formatCurrency(
            pendingInvoices.reduce((s, i) => s + (i.total - i.amountPaid), 0),
            currentUser.currency
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
          label="Credit balance"
          value={String(currentUser.creditBalance)}
          hint={`of ${plan.includedCredits} monthly credits`}
          icon={Coins}
        />
        <StatCard
          label="Monthly earnings"
          value={formatCurrency(monthlyEarnings, currentUser.currency)}
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
            icon={FileSignature}
            label="Create Contract"
            href="/dashboard/contracts/new"
            locked={!contractsUnlocked}
            lockNote="Contracts are available on Starter Plan and above."
          />
          <QuickActionCard
            icon={ClipboardList}
            label="Create Advance Form"
            href="/dashboard/advancing"
            locked={!advancingUnlocked}
            lockNote="Advancing is available on Pro Plan and above."
          />
          <QuickActionCard
            icon={UserPlus}
            label="Add Client"
            href="/dashboard/clients"
          />
          <QuickActionCard
            icon={CalendarPlus}
            label="Add Booking"
            href="/dashboard/bookings"
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
              { header: "Client", cell: (i) => clientName(i.clientId) },
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

      {/* Pending contracts + credit usage */}
      <div className="grid items-start gap-5 xl:grid-cols-2">
        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle>Pending contracts</CardTitle>
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
                    {clientName(contract.clientId)} ·{" "}
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
            <CardTitle>Credit usage</CardTitle>
            <CardDescription>
              Documents you generate use credits from your monthly allowance.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CreditMeter
              balance={currentUser.creditBalance}
              included={plan.includedCredits}
              planName={plan.name}
            />
            <div className="space-y-2">
              {recentCredits.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="truncate text-muted-foreground">
                    {tx.description}
                  </span>
                  <span
                    className={
                      tx.amount > 0
                        ? "font-medium text-emerald-600 dark:text-emerald-400"
                        : "font-medium"
                    }
                  >
                    {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upgrade prompt */}
      <UpgradePrompt
        title={`You're on the ${plan.name} plan`}
        description="Upgrade for contracts, advancing forms, custom branding, and watermark-free PDFs."
        cta="View plans"
      />
    </>
  );
}
