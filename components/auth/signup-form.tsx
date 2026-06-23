"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { signupAction } from "@/app/actions/auth";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={cn(buttonVariants(), "w-full")}
      disabled={pending}
    >
      {pending ? "Creating your account…" : "Create account"}
    </button>
  );
}

export function SignupForm() {
  const [state, action] = useActionState(signupAction, undefined);

  return (
    <form action={action} className="space-y-4">
      {state?.error ? (
        <p
          role="alert"
          className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {state.error}
        </p>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="name">Name or stage name</Label>
        <Input
          id="name"
          name="name"
          placeholder="e.g. DJ NOVA"
          autoComplete="name"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          required
        />
      </div>
      <SubmitButton />
    </form>
  );
}
