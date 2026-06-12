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
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Invoices", href: "/dashboard/invoices", icon: Receipt },
  { label: "Contracts", href: "/dashboard/contracts", icon: FileSignature },
  { label: "Advancing", href: "/dashboard/advancing", icon: ClipboardList },
  { label: "Clients", href: "/dashboard/clients", icon: Users },
  { label: "Bookings", href: "/dashboard/bookings", icon: Calendar },
  { label: "Credits", href: "/dashboard/credits", icon: Coins },
  { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export const dashboardSecondaryNav: NavItem[] = [
  { label: "Admin", href: "/admin", icon: ShieldCheck },
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
  { label: "Features", href: "/features" },
  { label: "Templates", href: "/templates" },
  { label: "Pricing", href: "/pricing" },
];
