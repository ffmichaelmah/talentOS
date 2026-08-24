import { prisma } from "@/lib/db";

export interface ClientInput {
  clientId?: string;
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  address?: string;
}

/**
 * Resolve the client for a new document: use the picked existing client (when
 * it belongs to the user), otherwise create one from the entered fields — so a
 * "new client" on an invoice/agreement/advance also lands in the client list.
 */
export async function ensureClientId(
  userId: string,
  input: ClientInput
): Promise<string> {
  if (input.clientId) {
    const existing = await prisma.client.findFirst({
      where: { id: input.clientId, userId },
    });
    if (existing) return existing.id;
  }
  const created = await prisma.client.create({
    data: {
      userId,
      name: input.name?.trim() || "New client",
      company: input.company?.trim() || null,
      email: input.email?.trim() || "",
      phone: input.phone?.trim() || null,
      address: input.address?.trim() || null,
      type: "venue",
      totalBookings: 0,
      totalBilled: 0,
      createdAt: new Date().toISOString(),
    },
  });
  return created.id;
}
