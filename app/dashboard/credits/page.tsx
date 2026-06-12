import type { Metadata } from "next";
import { Coins, Plus } from "lucide-react";

import { CreditMeter } from "@/components/cards/credit-meter";
import { UpgradePrompt } from "@/components/cards/upgrade-prompt";
import { DataTable } from "@/components/data-table";
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
import { creditTransactions, currentUser } from "@/data";
import { formatDateTime } from "@/lib/format";
import { getCurrentPlan } from "@/lib/plan";
import type { CreditTransaction } from "@/types";

export const metadata: Metadata = {
  title: "Credits",
};

const typeVariant: Record<
  CreditTransaction["type"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  purchase: "default",
  bonus: "secondary",
  refund: "secondary",
  spend: "outline",
};

export default function CreditsPage() {
  const plan = getCurrentPlan();
  const sorted = [...creditTransactions].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );

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

      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle>This month</CardTitle>
          <CardDescription>
            {plan.name} plan · {plan.includedCredits} credits included monthly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreditMeter
            balance={currentUser.creditBalance}
            included={plan.includedCredits}
            planName={plan.name}
          />
        </CardContent>
      </Card>

      <UpgradePrompt
        variant="banner"
        description="Need more credits every month? Starter includes 50, Pro includes 200."
        cta="View plans"
      />

      <DataTable<CreditTransaction>
        columns={[
          {
            header: "Activity",
            cell: (tx) => <span className="font-medium">{tx.description}</span>,
          },
          {
            header: "Type",
            cell: (tx) => (
              <Badge variant={typeVariant[tx.type]} className="capitalize">
                {tx.type}
              </Badge>
            ),
          },
          { header: "When", cell: (tx) => formatDateTime(tx.createdAt) },
          {
            header: "Credits",
            className: "text-right",
            cell: (tx) => (
              <span
                className={
                  tx.amount > 0
                    ? "font-medium text-emerald-600 dark:text-emerald-400"
                    : "font-medium"
                }
              >
                {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
              </span>
            ),
          },
          {
            header: "Balance",
            className: "text-right",
            cell: (tx) => tx.balanceAfter,
          },
        ]}
        rows={sorted}
        rowKey={(tx) => tx.id}
        emptyIcon={Coins}
        emptyTitle="No credit activity yet"
        emptyDescription="Purchases and document generation will show up here."
      />
    </>
  );
}
