"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/layout/logo";
import { Badge } from "@/components/ui/badge";
import {
  adminNav,
  adminSecondaryNav,
  dashboardNav,
  dashboardSecondaryNav,
  type NavItem,
} from "@/lib/navigation";
import { cn } from "@/lib/utils";

// Nav configs contain icon components, which can't cross the server→client
// boundary as props — so the (client) sidebar picks its config by variant.
const variants = {
  app: {
    nav: dashboardNav,
    secondaryNav: dashboardSecondaryNav,
    homeHref: "/dashboard",
    badge: undefined as string | undefined,
    showPlan: true,
  },
  admin: {
    nav: adminNav,
    secondaryNav: adminSecondaryNav,
    homeHref: "/admin",
    badge: "Admin" as string | undefined,
    showPlan: false,
  },
};

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
      )}
    >
      <Icon className="size-4 shrink-0" />
      {item.label}
    </Link>
  );
}

export function Sidebar({
  variant = "app",
  planName = "Free",
  isTopPlan = false,
}: {
  variant?: "app" | "admin";
  planName?: string;
  /** Hides the upgrade link once the user is already on the top plan. */
  isTopPlan?: boolean;
}) {
  const { nav, secondaryNav, homeHref, badge, showPlan } = variants[variant];
  const pathname = usePathname();
  // The section home ("/admin", "/dashboard") only matches exactly, so it
  // doesn't stay highlighted while a sibling like "/dashboard/invoices" is open.
  const isActive = (href: string) =>
    href === homeHref
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r bg-sidebar lg:flex">
      <div className="flex h-16 items-center gap-2 border-b px-5">
        <Logo href={homeHref} />
        {badge ? <Badge variant="outline">{badge}</Badge> : null}
      </div>
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {nav.map((item) => (
          <NavLink key={item.href} item={item} active={isActive(item.href)} />
        ))}
        <div className="mt-auto space-y-2 pt-4">
          {showPlan ? (
            <div className="flex items-center justify-between rounded-xl border bg-card p-3.5">
              <Badge variant="secondary">{planName} plan</Badge>
              {!isTopPlan ? (
                <Link
                  href="/dashboard/billing"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Upgrade
                </Link>
              ) : null}
            </div>
          ) : null}
          {secondaryNav.map((item) => (
            <NavLink key={item.href} item={item} active={isActive(item.href)} />
          ))}
        </div>
      </nav>
    </aside>
  );
}
