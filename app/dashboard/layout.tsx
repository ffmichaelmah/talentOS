import { DemoBanner } from "@/components/layout/demo-banner";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { requireUser } from "@/lib/auth";
import { planById } from "@/lib/plan";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const plan = planById(user.planId);
  const chrome = {
    name: user.name,
    displayName: user.displayName,
    email: user.email,
    avatarUrl: user.avatarUrl,
    planName: plan.name,
  };

  return (
    <div className="flex min-h-dvh">
      <Sidebar planName={chrome.planName} isTopPlan={plan.id === "plan-pro"} />
      <div className="flex min-w-0 flex-1 flex-col">
        <DemoBanner />
        <Topbar user={chrome} />
        <main className="flex-1 space-y-8 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
