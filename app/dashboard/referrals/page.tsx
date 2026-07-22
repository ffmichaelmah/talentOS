import type { Metadata } from "next";
import { Gift, Sparkles, Users } from "lucide-react";

import { ReferralLink } from "@/components/referrals/referral-link";
import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { formatCurrency } from "@/lib/format";
import { AMBASSADOR_RATE, getReferralStats } from "@/lib/referrals";

export const metadata: Metadata = { title: "Referrals" };

export default async function ReferralsPage() {
  const user = await requireUser();
  const stats = await getReferralStats(user.id);

  return (
    <>
      <PageHeader
        title="Referrals"
        description="Share your link and earn a free month for every referral who subscribes to a paid plan."
      />

      <div className="grid items-start gap-5 lg:grid-cols-3">
        <Card className="shadow-xs lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="size-4 text-primary" /> Your referral link
            </CardTitle>
            <CardDescription>
              When someone subscribes to a paid plan with your code, you earn{" "}
              <strong className="text-foreground">1 free month</strong> — no
              limit.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.code ? (
              <>
                <div>
                  <p className="text-xs text-muted-foreground">Your code</p>
                  <p className="mt-0.5 font-mono text-lg font-semibold tracking-tight">
                    {stats.code}
                  </p>
                </div>
                <ReferralLink code={stats.code} />
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Your referral code will appear here.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle className="text-base">Your rewards</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Users className="size-4" />
              </span>
              <div>
                <p className="text-lg font-semibold tracking-tight">
                  {stats.paidSignups}
                  <span className="ml-1 text-xs font-normal text-muted-foreground">
                    / {stats.signups} signups
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Paid subscribers referred
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sparkles className="size-4" />
              </span>
              <div>
                <p className="text-lg font-semibold tracking-tight">
                  {stats.freeMonths}
                </p>
                <p className="text-xs text-muted-foreground">
                  Free months earned
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Internal brand-ambassador program — only shown to flagged accounts. */}
      {stats.isAmbassador ? (
        <Card className="border-primary/30 shadow-xs">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" /> Brand ambassador
            </CardTitle>
            <CardDescription>
              You earn {Math.round(AMBASSADOR_RATE * 100)}% every month from each
              subscriber on your code. Estimated this month:{" "}
              <strong className="text-foreground">
                {formatCurrency(stats.monthlyCommission)}
              </strong>
              .
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.paidReferees.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No paid subscribers on your code yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/60 text-left text-xs text-muted-foreground">
                      <th className="pb-2 font-medium">Subscriber</th>
                      <th className="pb-2 font-medium">Plan</th>
                      <th className="pb-2 text-right font-medium">Monthly</th>
                      <th className="pb-2 text-right font-medium">
                        Your {Math.round(AMBASSADOR_RATE * 100)}%
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.paidReferees.map((r) => (
                      <tr key={r.name} className="border-b border-border/40 last:border-0">
                        <td className="py-2">{r.name}</td>
                        <td className="py-2 text-muted-foreground">{r.plan}</td>
                        <td className="py-2 text-right">
                          {formatCurrency(r.monthly)}
                        </td>
                        <td className="py-2 text-right font-medium">
                          {formatCurrency(r.commission)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}
    </>
  );
}
