import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";

export interface ChromeUser {
  name: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  planName: string;
}

export function Topbar({ user }: { user: ChromeUser }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-2">
        <MobileNav />
        <div className="hidden text-sm text-muted-foreground sm:block">
          Welcome back,{" "}
          <span className="font-medium text-foreground">
            {user.displayName}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />
        <UserMenu user={user} />
      </div>
    </header>
  );
}
