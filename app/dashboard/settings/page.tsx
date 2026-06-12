import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { currentUser } from "@/data";
import { getCurrentPlan } from "@/lib/plan";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  const plan = getCurrentPlan();

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
              <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
              <AvatarFallback>MR</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{currentUser.name}</p>
              <Badge variant="secondary" className="mt-1">
                {plan.name} plan
              </Badge>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="set-name">Full name</Label>
              <Input id="set-name" defaultValue={currentUser.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="set-stage">Stage / display name</Label>
              <Input id="set-stage" defaultValue={currentUser.displayName} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="set-email">Email</Label>
              <Input id="set-email" defaultValue={currentUser.email} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="set-business">Business name</Label>
              <Input
                id="set-business"
                defaultValue={currentUser.businessName}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="set-location">Location</Label>
              <Input id="set-location" defaultValue={currentUser.location} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="set-currency">Default currency</Label>
              <Input id="set-currency" defaultValue={currentUser.currency} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button>Save changes</Button>
            <p className="text-xs text-muted-foreground">
              Prototype — changes aren&apos;t persisted yet.
            </p>
          </div>
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
            Custom branding is available on Pro Plan and above.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
