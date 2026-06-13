import { cn } from "@/lib/utils";

type Tone = "success" | "info" | "warning" | "danger" | "neutral";

/** Shared status → tone mapping across invoices, contracts, bookings, and forms. */
const tones: Record<string, Tone> = {
  // success
  paid: "success",
  signed: "success",
  confirmed: "success",
  completed: "success",
  published: "success",
  "job-completed": "success",
  "balance-paid": "success",
  // info
  sent: "info",
  viewed: "info",
  refunded: "info",
  quoted: "info",
  "contract-sent": "info",
  "deposit-paid": "info",
  "advance-completed": "info",
  // warning
  pending: "warning",
  "pending-client": "warning",
  incomplete: "warning",
  inquiry: "warning",
  // danger
  overdue: "danger",
  declined: "danger",
  // neutral
  draft: "neutral",
  cancelled: "neutral",
  expired: "neutral",
  archived: "neutral",
  closed: "neutral",
};

/** Statuses whose stored key isn't the same as the human label. */
const labels: Record<string, string> = {
  "pending-client": "Pending client",
  "contract-sent": "Contract sent",
  "deposit-paid": "Deposit paid",
  "advance-completed": "Advance completed",
  "job-completed": "Job completed",
  "balance-paid": "Balance paid",
};

const toneClasses: Record<Tone, string> = {
  success:
    "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 dark:text-emerald-400",
  info: "bg-primary/10 text-primary ring-primary/20",
  warning:
    "bg-amber-500/10 text-amber-600 ring-amber-500/20 dark:text-amber-400",
  danger: "bg-destructive/10 text-destructive ring-destructive/20",
  neutral: "bg-muted text-muted-foreground ring-border",
};

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const tone = tones[status] ?? "neutral";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ring-1 ring-inset",
        toneClasses[tone],
        className
      )}
    >
      {labels[status] ?? status}
    </span>
  );
}
