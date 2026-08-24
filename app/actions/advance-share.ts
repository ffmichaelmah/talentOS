"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth";
import {
  clientEditableKeys,
  lockedKeys,
  sectionSlug,
  sectionsFor,
  type SectionState,
  type SectionStates,
} from "@/lib/advance-sections";
import { prisma } from "@/lib/db";
import type { AdvanceCategory } from "@/types";

function revalidate(id: string) {
  revalidatePath(`/advance/${id}`);
  revalidatePath(`/dashboard/advancing/${id}`);
}

const detailsFieldFor = (category: AdvanceCategory) =>
  category === "event" ? "eventDetails" : "campaignDetails";

/**
 * Client (promoter/brand) updates their logistics via the public share link.
 * No auth: the boundary is the share flag + the field whitelist — only keys the
 * client is allowed to edit AND that aren't in a completed section are applied,
 * so extra or locked keys can't be smuggled in from the browser.
 * ponytail: no rate limit; anyone with the link can edit (the share-link model).
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
  const detailsField = detailsFieldFor(category);
  const states: SectionStates = form.sectionStates
    ? JSON.parse(form.sectionStates)
    : {};
  const allowed = clientEditableKeys(category);
  const locked = lockedKeys(category, states);
  const current = form[detailsField]
    ? JSON.parse(form[detailsField] as string)
    : {};

  for (const [key, value] of Object.entries(values)) {
    if (allowed.has(key) && !locked.has(key)) current[key] = value;
  }

  await prisma.advanceForm.update({
    where: { id },
    data: { [detailsField]: JSON.stringify(current), updatedAt: new Date().toISOString() },
  });

  revalidate(id);
  return { ok: true };
}

/**
 * Client marks a section complete / skipped / open. Completing also saves that
 * section's current values; only a real client-editable section is accepted.
 */
export async function setAdvanceSection(
  id: string,
  slug: string,
  state: SectionState | "open",
  values: Record<string, string> = {}
): Promise<{ ok: boolean }> {
  const form = await prisma.advanceForm.findFirst({
    where: { id, shareEnabled: true },
  });
  if (!form || form.clientLocked) return { ok: false };

  const category = form.category as AdvanceCategory;
  const section = sectionsFor(category).find(
    (s) => s.clientEditable && sectionSlug(s.title) === slug
  );
  if (!section) return { ok: false };

  const detailsField = detailsFieldFor(category);
  const current = form[detailsField]
    ? JSON.parse(form[detailsField] as string)
    : {};
  // Persist this section's fields alongside the state change.
  const sectionKeys = new Set(section.fields.map((f) => f.key));
  for (const [key, value] of Object.entries(values)) {
    if (sectionKeys.has(key)) current[key] = value;
  }

  const states: SectionStates = form.sectionStates
    ? JSON.parse(form.sectionStates)
    : {};
  if (state === "open") delete states[slug];
  else states[slug] = state;

  await prisma.advanceForm.update({
    where: { id },
    data: {
      [detailsField]: JSON.stringify(current),
      sectionStates: Object.keys(states).length ? JSON.stringify(states) : null,
      updatedAt: new Date().toISOString(),
    },
  });

  revalidate(id);
  return { ok: true };
}

/** Artist reopens everything so the client can edit again — clears every
 *  per-section confirmation and any whole-form lock. */
export async function reopenAdvanceForClient(id: string): Promise<{ ok: boolean }> {
  const user = await requireUser();
  const res = await prisma.advanceForm.updateMany({
    where: { id, userId: user.id },
    data: { clientLocked: false, sectionStates: null },
  });
  revalidate(id);
  return { ok: res.count > 0 };
}
