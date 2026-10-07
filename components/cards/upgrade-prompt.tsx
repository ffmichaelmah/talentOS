import Link from "next/link";
import { ArrowRight, Lock, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Soft plan-limit nudges. "banner" is a slim inline notice for locked
 * features; "card" is the richer prompt for the overview page.
 */
export function UpgradePrompt({
  variant = "card",
  title = "Get more out of TalentOS",
  description = "Upgrade for contracts, advancing forms, custom branding, and watermark-free PDFs.",
  cta = "View plans",
  href = "/dashboard/billing",
}: {
  variant?: "card" | "banner";
  title?: string;
  description?: string;
  cta?: string;
  href?: string;
}) {
  if (variant === "banner") {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
        <p className="flex items-center gap-2.5 text-sm">
          <Lock className="size-4 shrink-0 text-primary" />
          <span className="text-muted-foreground">{description}</span>
        </p>
        <Button
          size="sm"
          variant="outline"
          nativeButton={false}
          render={<Link href={href} />}
        >
          {cta}
        </Button>
      </div>
    );
  }

  return (
    <Card className="relative overflow-hidden border-primary/20 shadow-xs">
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent"
      />
      <CardContent className="relative flex flex-wrap items-center justify-between gap-4 py-2">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Sparkles className="size-5" />
          </span>
          <div>
            <p className="font-medium">{title}</p>
            <p className="mt-0.5 max-w-xl text-sm text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
        <Button nativeButton={false} render={<Link href={href} />}>
          {cta}
          <ArrowRight className="size-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
