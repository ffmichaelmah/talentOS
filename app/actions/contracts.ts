"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireUser } from "@/lib/auth";
import { ensureClientId } from "@/lib/create-helpers";
import { prisma } from "@/lib/db";
import { CONTRACT_TYPE_LABELS } from "@/lib/contracts";
import { canUseContracts, planForUser } from "@/lib/plan";

export type ContractFormState = { error?: string } | undefined;

const schema = z.object({
  clientId: z.string().optional(),
  clientName: z.string().optional(),
  clientCompany: z.string().optional(),
  clientEmail: z.string().optional(),
  clientAddress: z.string().optional(),
  contractType: z.string().min(1),
  talentLegalName: z.string().optional(),
  serviceDescription: z.string().optional(),
  deliverables: z.string().optional(),
  eventName: z.string().optional(),
  dateTime: z.string().optional(),
  location: z.string().optional(),
  currency: z.string().min(1),
  fee: z.number().nonnegative(),
  deposit: z.number().nonnegative().optional(),
  paymentDeadline: z.string().optional(),
  latePaymentTerms: z.string().optional(),
  cancellationPolicy: z.string().optional(),
  reschedulePolicy: z.string().optional(),
  usageRights: z.string().optional(),
  exclusivity: z.string().optional(),
  travelAccommodation: z.string().optional(),
  technicalRider: z.string().optional(),
  forceMajeure: z.string().optional(),
  status: z.enum(["draft", "sent"]).default("draft"),
});

/** Update an agreement's status; stamps sentAt / signedAt as it moves. */
export async function updateContractStatusAction(
  id: string,
  status: string
): Promise<{ ok: boolean }> {
  const user = await requireUser();
  const allowed = ["draft", "sent", "pending-client", "signed", "cancelled"];
  if (!allowed.includes(status)) return { ok: false };

  const now = new Date().toISOString();
  const existing = await prisma.contract.findFirst({
    where: { id, userId: user.id },
  });
  if (!existing) return { ok: false };

  await prisma.contract.update({
    where: { id },
    data: {
      status,
      sentAt: status === "sent" && !existing.sentAt ? now : existing.sentAt,
      signedAt: status === "signed" ? (existing.signedAt ?? now) : existing.signedAt,
    },
  });
  revalidatePath("/dashboard/contracts");
  revalidatePath(`/dashboard/contracts/${id}`);
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function createContractAction(
  input: unknown
): Promise<ContractFormState> {
  const user = await requireUser();
  if (!canUseContracts(planForUser(user))) return { error: "Agreements aren't on your plan." };

  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: "Add an agreement type, client, and fee." };
  const d = parsed.data;

  const clientId = await ensureClientId(user.id, {
    clientId: d.clientId,
    name: d.clientName,
    company: d.clientCompany,
    email: d.clientEmail,
    address: d.clientAddress,
  });

  const fee = Math.round(d.fee);
  const deposit = Math.round(d.deposit ?? 0);
  const typeLabel =
    CONTRACT_TYPE_LABELS[d.contractType as keyof typeof CONTRACT_TYPE_LABELS] ??
    "Agreement";

  await prisma.contract.create({
    data: {
      userId: user.id,
      clientId,
      title: d.eventName ? `${typeLabel} — ${d.eventName}` : typeLabel,
      status: d.status,
      templateType: "custom",
      contractType: d.contractType,
      fee,
      currency: d.currency,
      depositPercent: fee > 0 ? deposit / fee : 0,
      sentAt: d.status === "sent" ? new Date().toISOString() : null,
      termsSummary: d.serviceDescription || null,
      details: JSON.stringify({
        talentLegalName: d.talentLegalName || "",
        clientLegalName: d.clientName || "",
        clientCompany: d.clientCompany || undefined,
        clientEmail: d.clientEmail || undefined,
        clientAddress: d.clientAddress || undefined,
        serviceDescription: d.serviceDescription || "",
        deliverables: d.deliverables || undefined,
        eventName: d.eventName || undefined,
        dateTime: d.dateTime || undefined,
        location: d.location || undefined,
        depositAmount: deposit || undefined,
        balanceAmount: Math.max(fee - deposit, 0) || undefined,
        paymentDeadline: d.paymentDeadline || undefined,
        latePaymentTerms: d.latePaymentTerms || undefined,
        cancellationPolicy: d.cancellationPolicy || undefined,
        reschedulePolicy: d.reschedulePolicy || undefined,
        usageRights: d.usageRights || undefined,
        exclusivity: d.exclusivity || undefined,
        travelAccommodation: d.travelAccommodation || undefined,
        technicalRider: d.technicalRider || undefined,
        forceMajeure: d.forceMajeure || undefined,
      }),
      createdAt: new Date().toISOString(),
    },
  });

  revalidatePath("/dashboard/contracts");
  redirect("/dashboard/contracts");
}
