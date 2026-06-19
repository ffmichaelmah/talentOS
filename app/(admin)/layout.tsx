import { Sidebar } from "@/components/layout/sidebar";
import { Topbar, type ChromeUser } from "@/components/layout/topbar";

// Admin tooling is internal; it isn't behind the per-user session yet.
const adminUser: ChromeUser = {
  name: "TalentOS Admin",
  displayName: "Admin",
  email: "admin@talentos.app",
  avatarUrl: null,
  creditBalance: 0,
  planName: "Internal",
  includedCredits: 0,
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh">
      <Sidebar variant="admin" />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar user={adminUser} />
        <main className="flex-1 space-y-8 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
