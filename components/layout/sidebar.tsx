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
import { currentUser } from "@/data";
import { cn } from "@/lib/utils";

// Nav configs contain icon components, which can't cross the server→client
// boundary as props — so the (client) sidebar picks its config by variant.
const variants = {
  app: {
    nav: dashboardNav,
    secondaryNav: dashboardSecondaryNav,
    homeHref: "/dashboard",
    badge: undefined as string | undefined,
    showCredits: true,
  },
  admin: {
    nav: adminNav,
    secondaryNav: adminSecondaryNav,
    homeHref: "/admin",
    badge: "Admin" as string | undefined,
    showCredits: false,
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

export function Sidebar({ variant = "app" }: { variant?: "app" | "admin" }) {
  const { nav, secondaryNav, homeHref, badge, showCredits } =
    variants[variant];
  const pathname = usePathname();
  // The section home ("/admin", "/dashboard") only matches exactly, so it
  // doesn't stay highlighted while a sibling like "/admin/templates" is open.
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
        <div className="mt-auto space-y-1 pt-4">
          {showCredits ? (
            <div className="flex items-center justify-between rounded-lg border bg-card px-3 py-2.5">
              <span className="text-xs font-medium text-muted-foreground">
                Credits
              </span>
              <Badge variant="secondary">{currentUser.creditBalance}</Badge>
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
