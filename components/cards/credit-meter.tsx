import { Coins } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function CreditMeter({
  balance,
  included,
  planName,
  compact = false,
  className,
}: {
  balance: number;
  included: number;
  planName?: string;
  /** Tight version for the sidebar. */
  compact?: boolean;
  className?: string;
}) {
  const used = Math.min(Math.max(included - balance, 0), included);
  const usedPercent = included > 0 ? Math.round((used / included) * 100) : 0;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "flex items-center gap-1.5 font-medium",
            compact ? "text-xs" : "text-sm"
          )}
        >
          <Coins className={cn("text-primary", compact ? "size-3.5" : "size-4")} />
          Credits
        </span>
        <span
          className={cn(
            "text-muted-foreground tabular-nums",
            compact ? "text-xs" : "text-sm"
          )}
        >
          {balance} of {included} left
        </span>
      </div>
      <Progress value={usedPercent} aria-label="Credits used this month" />
      {!compact ? (
        <p className="text-xs text-muted-foreground">
          {used} used this month{planName ? ` on the ${planName} plan` : ""}.
          Credits refresh at the start of each cycle.
        </p>
      ) : null}
    </div>
  );
}
