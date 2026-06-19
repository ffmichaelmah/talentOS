import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";

import { SignupForm } from "@/components/auth/signup-form";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Start Free",
};

export default async function SignupPage() {
  if (await getCurrentUser()) redirect("/dashboard");

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Start free — no credit card required.
        </p>
      </div>

      <SignupForm />

      <p className="text-center text-xs text-muted-foreground">
        By signing up you agree to our Terms and Privacy Policy.
      </p>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
