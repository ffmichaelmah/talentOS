"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export type ProfileState = { ok?: boolean; error?: string } | undefined;

const schema = z.object({
  name: z.string().trim().min(1),
  displayName: z.string().trim().min(1),
  email: z.email(),
  businessName: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  address: z.string().trim().optional(),
  paymentDetails: z.string().trim().optional(),
  location: z.string().trim().optional(),
  currency: z.string().trim().min(1),
});

export async function updateProfileAction(
  _prev: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const user = await requireUser();
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: "Enter your name, display name, a valid email, and currency." };
  }
  const d = parsed.data;
  const email = d.email.toLowerCase();
  if (email !== user.email) {
    const taken = await prisma.user.findUnique({ where: { email } });
    if (taken) return { error: "That email is already in use." };
  }
  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: d.name,
      displayName: d.displayName,
      email,
      businessName: d.businessName || null,
      phone: d.phone || null,
      address: d.address || null,
      paymentDetails: d.paymentDetails || null,
      location: d.location ?? "",
      currency: d.currency,
    },
  });
  // Revalidate the dashboard layout too — the topbar shows the name/avatar.
  revalidatePath("/dashboard", "layout");
  return { ok: true };
}
