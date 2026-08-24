"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { updateProfileAction } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProfileUser {
  name: string;
  displayName: string;
  email: string;
  businessName?: string | null;
  phone?: string | null;
  address?: string | null;
  paymentDetails?: string | null;
  location: string;
  currency: string;
}

function SaveButton() {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? "Saving…" : "Save changes"}</Button>;
}

export function ProfileForm({ user }: { user: ProfileUser }) {
  const [state, action] = useActionState(updateProfileAction, undefined);

  return (
    <form action={action} className="space-y-5">
      {state?.error ? (
        <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" defaultValue={user.name} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="displayName">Stage / display name</Label>
          <Input id="displayName" name="displayName" defaultValue={user.displayName} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" defaultValue={user.email} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="businessName">Business name</Label>
          <Input id="businessName" name="businessName" defaultValue={user.businessName ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" defaultValue={user.phone ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" defaultValue={user.location} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency">Default currency</Label>
          <Input id="currency" name="currency" defaultValue={user.currency} required />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Input id="address" name="address" defaultValue={user.address ?? ""} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="paymentDetails">Payment details</Label>
          <Textarea
            id="paymentDetails"
            name="paymentDetails"
            rows={2}
            defaultValue={user.paymentDetails ?? ""}
            placeholder="Bank / PayPal details shown on your invoices"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <SaveButton />
        {state?.ok ? (
          <p className="text-sm text-emerald-600 dark:text-emerald-400">Saved.</p>
        ) : null}
      </div>
    </form>
  );
}
