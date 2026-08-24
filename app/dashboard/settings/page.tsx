import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { ProfileForm } from "@/components/settings/profile-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { planForUser } from "@/lib/plan";

export const metadata: Metadata = {
  title: "Settings",
};

/** First letters of the first two words, e.g. "Mike Zooka" → "MZ". */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export default async function SettingsPage() {
  const user = await requireUser();
  const plan = planForUser(user);

  return (
    <>
      <PageHeader
        title="Settings"
        description="Your profile and the details that appear on your documents."
      />

      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Shown on invoices, contracts, and advance forms you send.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center gap-4">
            <Avatar className="size-14">
              <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} />
              <AvatarFallback>{initials(user.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.name}</p>
              <Badge variant="secondary" className="mt-1">
                {plan.name} plan
              </Badge>
            </div>
          </div>
          <ProfileForm user={user} />
        </CardContent>
      </Card>

      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle>Document branding</CardTitle>
          <CardDescription>
            Logo and colors on your PDFs. Custom branding unlocks on the Pro
            plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            {plan.id === "plan-pro" || plan.id === "plan-agency"
              ? "Included on your plan — logo upload is coming soon."
              : "Custom branding is available on the Pro plan."}
          </p>
        </CardContent>
      </Card>
    </>
  );
}
