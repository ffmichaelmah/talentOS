"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import { generateReferralCode } from "@/lib/referrals";
import { createSession, destroySession } from "@/lib/session";

export type AuthState = { error?: string } | undefined;

const signupSchema = z.object({
  name: z.string().trim().min(1),
  email: z.email(),
  password: z.string().min(8),
  referralCode: z.string().trim().optional(),
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export async function signupAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    referralCode: formData.get("referralCode") ?? undefined,
  });
  if (!parsed.success) {
    return {
      error: "Enter your name, a valid email, and an 8+ character password.",
    };
  }
  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with that email already exists." };
  }
  // Look up the referrer by their code (ignored silently if it doesn't match).
  const code = parsed.data.referralCode?.toUpperCase();
  const referrer = code
    ? await prisma.user.findUnique({ where: { referralCode: code } })
    : null;
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: await hashPassword(parsed.data.password),
      name: parsed.data.name,
      displayName: parsed.data.name,
      location: "",
      currency: "USD",
      planId: "plan-free",
      referralCode: generateReferralCode(),
      referredById: referrer?.id ?? null,
      createdAt: new Date().toISOString(),
    },
  });
  await createSession(user.id);
  redirect("/dashboard");
}

export async function loginAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Enter your email and password." };
  }
  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });
  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return { error: "Incorrect email or password." };
  }
  await createSession(user.id);
  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/login");
}
