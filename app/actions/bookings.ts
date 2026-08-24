"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { canUseBookings, planForUser } from "@/lib/plan";
import type { BookingStage, BookingStatus } from "@/types";

export type BookingFormState = { error?: string } | undefined;

const schema = z.object({
  clientId: z.string().min(1),
  title: z.string().trim().min(1),
  stage: z.string().min(1),
  date: z.string().optional(),
  time: z.string().optional(),
  location: z.string().optional(),
  fee: z.number().nonnegative(),
  deposit: z.number().nonnegative().optional(),
  notes: z.string().optional(),
});

// The pipeline stage implies a coarse status for list filtering.
const STAGE_STATUS: Record<BookingStage, BookingStatus> = {
  inquiry: "inquiry",
  quoted: "pending",
  confirmed: "confirmed",
  "contract-sent": "confirmed",
  "deposit-paid": "confirmed",
  "advance-completed": "confirmed",
  "job-completed": "completed",
  "balance-paid": "completed",
  closed: "completed",
};

/** Move a booking along the pipeline; status follows the stage. */
export async function updateBookingStageAction(
  id: string,
  stage: string
): Promise<{ ok: boolean }> {
  const user = await requireUser();
  const status = STAGE_STATUS[stage as BookingStage];
  if (!status) return { ok: false };

  const res = await prisma.booking.updateMany({
    where: { id, userId: user.id },
    data: { stage, status },
  });
  revalidatePath("/dashboard/bookings");
  revalidatePath(`/dashboard/bookings/${id}`);
  revalidatePath("/dashboard");
  return { ok: res.count > 0 };
}

export async function createBookingAction(
  input: unknown
): Promise<BookingFormState> {
  const user = await requireUser();
  if (!canUseBookings(planForUser(user))) return { error: "Bookings aren't on your plan." };

  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: "Add a title, client, and fee." };
  const d = parsed.data;

  const client = await prisma.client.findFirst({
    where: { id: d.clientId, userId: user.id },
  });
  if (!client) return { error: "Pick a client from your list." };

  const when = d.date ? `${d.date}T00:00:00.000Z` : new Date().toISOString();
  const balance = Math.max(d.fee - (d.deposit ?? 0), 0);
  const notes = [d.time ? `Set time: ${d.time}` : "", d.notes ?? ""]
    .filter(Boolean)
    .join("\n");

  await prisma.booking.create({
    data: {
      userId: user.id,
      clientId: client.id,
      title: d.title,
      status: STAGE_STATUS[d.stage as BookingStage] ?? "pending",
      stage: d.stage,
      eventType: "club-night", // ponytail: form doesn't collect it; sensible DJ default
      venueName: d.location || "",
      startTime: when,
      endTime: when,
      fee: Math.round(d.fee),
      currency: user.currency,
      depositAmount: d.deposit ? Math.round(d.deposit) : null,
      balanceAmount: balance ? Math.round(balance) : null,
      depositPaid: false,
      notes: notes || null,
      createdAt: new Date().toISOString(),
    },
  });

  revalidatePath("/dashboard/bookings");
  redirect("/dashboard/bookings");
}
