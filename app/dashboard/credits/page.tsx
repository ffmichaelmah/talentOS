import type { Metadata } from "next";
import Link from "next/link";
import { Coins, Gauge, Plus, TrendingDown, Wallet } from "lucide-react";

import { CreditMeter } from "@/components/cards/credit-meter";
import { StatCard } from "@/components/cards/stat-card";
import { UpgradePrompt } from "@/components/cards/upgrade-prompt";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  CREDIT_COSTS,
  creditStats,
  relatedDocument,
  transactionStatus,
} from "@/lib/credits";
import { formatDateTime } from "@/lib/format";
import { requireUser } from "@/lib/auth";
import { planById } from "@/lib/plan";
import { getCreditTransactions } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Credits",
};

export default async function CreditsPage() {
  const user = await requireUser();
  const plan = planById(user.planId);
  const stats = creditStats(user.creditBalance, plan.includedCredits);
  const history = await getCreditTransactions(user.id);

  return (
    <>
      <PageHeader
        title="Credits"
        description="Every document you generate uses credits from your monthly allowance."
        actions={
          <Button>
            <Plus className="size-4" />
            Buy credits
          </Button>
        }
      />

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Current balance"
          value={String(stats.balance)}
          hint="Credits available now"
          icon={Coins}
        />
        <StatCard
          label="Monthly credits"
          value={String(stats.included)}
          hint={`Included in ${plan.name}`}
          icon={Wallet}
        />
        <StatCard
          label="Used this month"
          value={String(stats.used)}
          hint={`${stats.usedPercent}% of allowance`}
          icon={TrendingDown}
        />
        <StatCard
          label="Remaining"
          value={String(stats.remaining)}
          hint="Refreshes next cycle"
          icon={Gauge}
        />
      </div>

      {/* Low-credit nudge — helpful, not aggressive */}
      {stats.low ? (
        <UpgradePrompt
          variant="banner"
          description="You're close to your monthly credit limit. Upgrade when you're ready to unlock more documents and automation."
          cta="See plans"
        />
      ) : null}

      <div className="grid items-start gap-5 lg:grid-cols-2">
        {/* This month */}
        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle>This month</CardTitle>
            <CardDescription>
              {plan.name} plan · {plan.includedCredits} credits included monthly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreditMeter
              balance={stats.balance}
              included={stats.included}
              planName={plan.name}
            />
          </CardContent>
        </Card>

        {/* What uses credits */}
        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle>What uses credits</CardTitle>
            <CardDescription>
              Pay only for the documents and automations you generate.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {CREDIT_COSTS.map((item) => (
              <div
                key={item.action}
                className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 text-sm"
              >
                <span>{item.action}</span>
                <span className="font-medium tabular-nums text-primary">
                  {item.cost} {item.cost === 1 ? "credit" : "credits"}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Usage history */}
      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle>Usage history</CardTitle>
          <CardDescription>
            Every credit in and out of your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
                <TableHead className="text-right">Credits used</TableHead>
                <TableHead>Related document</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((tx) => {
                const doc = relatedDocument(tx);
                return (
                  <TableRow key={tx.id}>
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {formatDateTime(tx.createdAt)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {tx.description}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={
                          tx.amount > 0
                            ? "font-medium text-emerald-600 tabular-nums dark:text-emerald-400"
                            : "font-medium tabular-nums"
                        }
                      >
                        {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                      </span>
                    </TableCell>
                    <TableCell>
                      {doc ? (
                        <Link
                          href={doc.href}
                          className="text-primary hover:underline"
                        >
                          {doc.label}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={transactionStatus(tx)} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
