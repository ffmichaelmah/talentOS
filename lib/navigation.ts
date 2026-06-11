import {
  ArrowLeft,
  Calendar,
  ClipboardList,
  Coins,
  CreditCard,
  FileSignature,
  LayoutDashboard,
  LayoutTemplate,
  Receipt,
  Settings,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const dashboardNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Bookings", href: "/bookings", icon: Calendar },
  { label: "Clients", href: "/clients", icon: Users },
  { label: "Invoices", href: "/invoices", icon: Receipt },
  { label: "Contracts", href: "/contracts", icon: FileSignature },
  { label: "Advancing", href: "/advancing", icon: ClipboardList },
  { label: "Credits", href: "/credits", icon: Coins },
];

export const dashboardSecondaryNav: NavItem[] = [
  { label: "Admin", href: "/admin", icon: ShieldCheck },
  { label: "Settings", href: "/settings", icon: Settings },
];

export const adminNav: NavItem[] = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Templates", href: "/admin/templates", icon: LayoutTemplate },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Plans", href: "/admin/plans", icon: CreditCard },
];

export const adminSecondaryNav: NavItem[] = [
  { label: "Back to app", href: "/dashboard", icon: ArrowLeft },
];

export const marketingNav = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/pricing" },
];
