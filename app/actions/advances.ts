"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireUser } from "@/lib/auth";
import { ensureClientId } from "@/lib/create-helpers";
import { prisma } from "@/lib/db";
import { advanceTypeLabel, categoryOf } from "@/lib/advancing";
import { canUseAdvancing, planForUser } from "@/lib/plan";
import type { AdvanceFormType } from "@/types";

export type AdvanceFormState = { error?: string } | undefined;

const schema = z.object({
  clientId: z.string().optional(),
  clientName: z.string().optional(),
  clientCompany: z.string().optional(),
  type: z.string().min(1),
  values: z.record(z.string(), z.string()),
  status: z.enum(["draft", "sent"]).default("draft"),
});

export async function createAdvanceAction(
  input: unknown
): Promise<AdvanceFormState> {
  const user = await requireUser();
  if (!canUseAdvancing(planForUser(user))) return { error: "Advancing isn't on your plan." };

  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: "Pick a client and an advance type." };
  const d = parsed.data;

  const type = d.type as AdvanceFormType;
  const category = categoryOf(type);
  const reference =
    d.values[category === "event" ? "eventName" : "campaignTitle"] || "";
  const date = d.values[category === "event" ? "eventDate" : "postingDate"] || null;

  const clientId = await ensureClientId(user.id, {
    clientId: d.clientId,
    name: d.clientName,
    company: d.clientCompany,
  });

  const now = new Date().toISOString();
  await prisma.advanceForm.create({
    data: {
      userId: user.id,
      clientId,
      title: reference ? `${advanceTypeLabel(type)} — ${reference}` : advanceTypeLabel(type),
      type,
      category,
      reference: reference || null,
      status: d.status === "sent" ? "sent" : "draft",
      date,
      shareEnabled: d.status === "sent",
      eventDetails: category === "event" ? JSON.stringify(d.values) : null,
      campaignDetails: category === "campaign" ? JSON.stringify(d.values) : null,
      createdAt: now,
      updatedAt: now,
    },
  });

  revalidatePath("/dashboard/advancing");
  redirect("/dashboard/advancing");
}
