"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export type ClientFormState = { error?: string } | undefined;

const schema = z.object({
  name: z.string().trim().min(1),
  company: z.string().trim().optional(),
  email: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  type: z.string().trim().default("venue"),
  taxNumber: z.string().trim().optional(),
  address: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

const str = (v: FormDataEntryValue | null) =>
  typeof v === "string" ? v : undefined;

export async function createClientAction(
  _prev: ClientFormState,
  formData: FormData
): Promise<ClientFormState> {
  const user = await requireUser();
  const parsed = schema.safeParse({
    name: str(formData.get("name")),
    company: str(formData.get("company")),
    email: str(formData.get("email")),
    phone: str(formData.get("phone")),
    type: str(formData.get("type")),
    taxNumber: str(formData.get("taxNumber")),
    address: str(formData.get("address")),
    notes: str(formData.get("notes")),
  });
  if (!parsed.success) {
    return { error: "Please enter at least a client name." };
  }
  const d = parsed.data;
  await prisma.client.create({
    data: {
      userId: user.id,
      name: d.name,
      company: d.company || null,
      email: d.email || "",
      phone: d.phone || null,
      type: d.type || "venue",
      address: d.address || null,
      taxNumber: d.taxNumber || null,
      notes: d.notes || null,
      totalBookings: 0,
      totalBilled: 0,
      createdAt: new Date().toISOString(),
    },
  });
  revalidatePath("/dashboard/clients");
  redirect("/dashboard/clients");
}
