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
  "contract-sent": "Agreement sent",
  "deposit-paid": "Deposit paid",
  "advance-completed": "Advance completed",
  "job-completed": "Job completed",
  "balance-paid": "Balance paid",
};

const toneClasses: Record<Tone, string> = {
  success: "bg-success/14 text-success ring-success/30",
  info: "bg-primary/14 text-accent-foreground ring-primary/30",
  warning: "bg-warning/14 text-warning ring-warning/30",
  danger: "bg-destructive/14 text-destructive ring-destructive/30",
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
