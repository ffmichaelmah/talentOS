"use client";

import Link from "next/link";
import { CreditCard, LogOut, Settings, UserRound } from "lucide-react";

import { logoutAction } from "@/app/actions/auth";
import type { ChromeUser } from "@/components/layout/topbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu({ user }: { user: ChromeUser }) {
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            aria-label="Open user menu"
            className="h-auto gap-2.5 rounded-full px-1.5 py-1"
          />
        }
      >
        <Avatar className="size-8">
          <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <span className="hidden text-left text-sm leading-tight sm:block">
          <span className="block font-medium">{user.displayName}</span>
          <span className="block text-xs text-muted-foreground">
            {user.planName} plan
          </span>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
          <Badge variant="secondary" className="mt-1.5">
            {user.planName} plan
          </Badge>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/dashboard/settings" />}>
          <UserRound className="size-4" />
          Profile & settings
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/dashboard/billing" />}>
          <CreditCard className="size-4" />
          Billing & plan
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/dashboard/credits" />}>
          <Settings className="size-4" />
          Credits
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logoutAction()}>
          <LogOut className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
