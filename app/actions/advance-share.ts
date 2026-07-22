"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth";
import { clientEditableKeys } from "@/lib/advance-sections";
import { prisma } from "@/lib/db";
import type { AdvanceCategory } from "@/types";

function revalidate(id: string) {
  revalidatePath(`/advance/${id}`);
  revalidatePath(`/dashboard/advancing/${id}`);
}

/**
 * Client (promoter/brand) updates their logistics via the public share link.
 * No auth: the boundary is the share flag + the field whitelist — only keys
 * the client is allowed to edit are applied, so extra keys can't be smuggled
 * in from the browser. ponytail: no rate limit; anyone with the link can edit,
 * which is the share-link model. Add a token + throttle if abused.
 */
export async function updateSharedAdvance(
  id: string,
  values: Record<string, string>
): Promise<{ ok: boolean }> {
  const form = await prisma.advanceForm.findFirst({
    where: { id, shareEnabled: true },
  });
  if (!form || form.clientLocked) return { ok: false };

  const category = form.category as AdvanceCategory;
  const allowed = clientEditableKeys(category);
  const detailsField =
    category === "event" ? "eventDetails" : "campaignDetails";
  const current = form[detailsField]
    ? JSON.parse(form[detailsField] as string)
    : {};

  for (const [key, value] of Object.entries(values)) {
    if (allowed.has(key)) current[key] = value;
  }

  await prisma.advanceForm.update({
    where: { id },
    data: { [detailsField]: JSON.stringify(current), updatedAt: new Date().toISOString() },
  });

  revalidate(id);
  return { ok: true };
}

/** Client's double-confirm: lock the form so it can't be edited via the link
 *  until the artist reopens it. */
export async function confirmSharedAdvance(id: string): Promise<{ ok: boolean }> {
  const res = await prisma.advanceForm.updateMany({
    where: { id, shareEnabled: true, clientLocked: false },
    data: { clientLocked: true, updatedAt: new Date().toISOString() },
  });
  revalidate(id);
  return { ok: res.count > 0 };
}

/** Artist reopens a locked form so the client can edit again (their new link). */
export async function reopenAdvanceForClient(id: string): Promise<{ ok: boolean }> {
  const user = await requireUser();
  const res = await prisma.advanceForm.updateMany({
    where: { id, userId: user.id },
    data: { clientLocked: false },
  });
  revalidate(id);
  return { ok: res.count > 0 };
}
