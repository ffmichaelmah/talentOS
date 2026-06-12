import Link from "next/link";
import { Lock, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function QuickActionCard({
  icon: Icon,
  label,
  href,
  locked = false,
  lockNote,
}: {
  icon: LucideIcon;
  label: string;
  href: string;
  locked?: boolean;
  /** e.g. "Contracts are available on Starter Plan and above." */
  lockNote?: string;
}) {
  return (
    <Link
      href={locked ? "/dashboard/billing" : href}
      title={locked ? lockNote : undefined}
      className={cn(
        "group flex flex-col items-start gap-3 rounded-xl border border-border/60 bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md hover:shadow-primary/5",
        locked && "opacity-80"
      )}
    >
      <span
        className={cn(
          "flex size-9 items-center justify-center rounded-lg transition-colors",
          locked
            ? "bg-muted text-muted-foreground"
            : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
        )}
      >
        {locked ? <Lock className="size-4" /> : <Icon className="size-4" />}
      </span>
      <span className="text-sm font-medium leading-tight">{label}</span>
      {locked && lockNote ? (
        <span className="text-xs text-muted-foreground">{lockNote}</span>
      ) : null}
    </Link>
  );
}
