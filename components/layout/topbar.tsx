import Link from "next/link";
import { Coins } from "lucide-react";

import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { currentUser } from "@/data";

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-2">
        <MobileNav />
        <div className="hidden text-sm text-muted-foreground sm:block">
          Welcome back,{" "}
          <span className="font-medium text-foreground">
            {currentUser.displayName}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/dashboard/credits"
          className="flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary/30"
        >
          <Coins className="size-3.5 text-primary" />
          {currentUser.creditBalance} credits
        </Link>
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
