"use client";

import Link from "next/link";
import { CreditCard, LogOut, Settings, UserRound } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { currentUser } from "@/data";
import { getCurrentPlan } from "@/lib/plan";

export function UserMenu() {
  const plan = getCurrentPlan();
  const initials = currentUser.name
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
          <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <span className="hidden text-left text-sm leading-tight sm:block">
          <span className="block font-medium">{currentUser.displayName}</span>
          <span className="block text-xs text-muted-foreground">
            {plan.name} plan
          </span>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>
          <p className="font-medium">{currentUser.name}</p>
          <p className="text-xs font-normal text-muted-foreground">
            {currentUser.email}
          </p>
          <Badge variant="secondary" className="mt-1.5">
            {plan.name} plan
          </Badge>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          render={<Link href="/dashboard/settings" />}
        >
          <UserRound className="size-4" />
          Profile & settings
        </DropdownMenuItem>
        <DropdownMenuItem
          render={<Link href="/dashboard/billing" />}
        >
          <CreditCard className="size-4" />
          Billing & plan
        </DropdownMenuItem>
        <DropdownMenuItem
          render={<Link href="/dashboard/credits" />}
        >
          <Settings className="size-4" />
          Credits
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/login" />}>
          <LogOut className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
