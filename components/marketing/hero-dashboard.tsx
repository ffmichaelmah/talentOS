import {
  Calendar,
  ClipboardList,
  Coins,
  FileSignature,
  LayoutDashboard,
  Receipt,
  TrendingUp,
} from "lucide-react";

import { cn } from "@/lib/utils";

const stats = [
  {
    label: "Invoices",
    value: "$6,750",
    hint: "outstanding",
    icon: Receipt,
  },
  {
    label: "Contracts",
    value: "4",
    hint: "signed",
    icon: FileSignature,
  },
  {
    label: "Advancing",
    value: "3",
    hint: "in progress",
    icon: ClipboardList,
  },
  {
    label: "Bookings",
    value: "5",
    hint: "upcoming",
    icon: Calendar,
  },
];

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Bookings", icon: Calendar },
  { label: "Invoices", icon: Receipt },
  { label: "Contracts", icon: FileSignature },
  { label: "Advancing", icon: ClipboardList },
];

/**
 * Decorative, non-interactive product mockup for the hero. Pure markup so it
 * renders on the server and stays crisp on any screen.
 */
export function HeroDashboard() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -inset-x-8 -top-8 bottom-0 -z-10 rounded-[2rem] bg-gradient-to-tr from-primary/20 via-primary/5 to-transparent blur-2xl"
      />
      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-2xl shadow-primary/10 ring-1 ring-foreground/5">
        {/* window chrome */}
        <div className="flex items-center gap-2 border-b border-border/60 bg-muted/40 px-4 py-3">
          <span className="size-3 rounded-full bg-destructive/40" />
          <span className="size-3 rounded-full bg-chart-4/50" />
          <span className="size-3 rounded-full bg-primary/40" />
          <div className="ml-3 hidden h-5 w-64 items-center rounded-md bg-background/60 px-2 text-[10px] text-muted-foreground sm:flex">
            app.talentos.com/dashboard
          </div>
        </div>

        <div className="flex">
          {/* sidebar */}
          <div className="hidden w-44 shrink-0 flex-col gap-1 border-r border-border/60 bg-sidebar/60 p-3 sm:flex">
            <div className="mb-2 flex items-center gap-2 px-2">
              <span className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <span className="text-xs font-bold">T</span>
              </span>
              <span className="text-sm font-semibold">TalentOS</span>
            </div>
            {sidebarItems.map((item) => (
              <div
                key={item.label}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium",
                  item.active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="size-3.5" />
                {item.label}
              </div>
            ))}
          </div>

          {/* main */}
          <div className="min-w-0 flex-1 space-y-4 p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Dashboard</p>
                <p className="text-[11px] text-muted-foreground">
                  Welcome back, DJ NOVA
                </p>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-2.5 py-1 text-[11px] font-medium">
                <Coins className="size-3.5 text-primary" />
                42 credits
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-border/60 bg-card p-3"
                >
                  <div className="mb-2 flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <stat.icon className="size-4" />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-base font-semibold tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {stat.hint}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid gap-3 lg:grid-cols-5">
              <div className="rounded-xl border border-border/60 bg-card p-4 lg:col-span-3">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-medium">Revenue</p>
                  <span className="flex items-center gap-1 text-[11px] font-medium text-primary">
                    <TrendingUp className="size-3.5" /> +18%
                  </span>
                </div>
                <div className="flex h-20 items-end gap-1.5">
                  {[40, 55, 35, 70, 50, 85, 65, 95, 75, 88].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t bg-gradient-to-t from-primary/30 to-primary"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2 rounded-xl border border-border/60 bg-card p-4 lg:col-span-2">
                <p className="text-xs font-medium">Recent invoices</p>
                {[
                  { id: "INV-014", amt: "$1,800", tone: "bg-chart-4/60" },
                  { id: "INV-015", amt: "$3,500", tone: "bg-primary/60" },
                  { id: "INV-009", amt: "$1,500", tone: "bg-primary" },
                ].map((row) => (
                  <div
                    key={row.id}
                    className="flex items-center justify-between text-[11px]"
                  >
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <span className={cn("size-2 rounded-full", row.tone)} />
                      {row.id}
                    </span>
                    <span className="font-medium">{row.amt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
