import "server-only";

import { prisma } from "@/lib/db";
import type { Booking, Client, Contract, Invoice } from "@/types";

/**
 * Per-user read layer. Rows are shaped to match the app's TypeScript types
 * (JSON columns parsed); null↔undefined differences are tolerated by the UI,
 * so results are cast to the public types.
 */

export async function getClients(userId: string): Promise<Client[]> {
  const rows = await prisma.client.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return rows as unknown as Client[];
}

export async function getClientById(
  userId: string,
  id: string
): Promise<Client | null> {
  const row = await prisma.client.findFirst({ where: { id, userId } });
  return (row as unknown as Client) ?? null;
}

export async function getBookingsForClient(
  userId: string,
  clientId: string
): Promise<Booking[]> {
  const rows = await prisma.booking.findMany({
    where: { userId, clientId },
    orderBy: { startTime: "desc" },
  });
  return rows as unknown as Booking[];
}

function parseInvoice(row: { job: string | null; lineItems: string }): Invoice {
  return {
    ...row,
    job: row.job ? JSON.parse(row.job) : undefined,
    lineItems: JSON.parse(row.lineItems),
  } as unknown as Invoice;
}

export async function getInvoicesForClient(
  userId: string,
  clientId: string
): Promise<Invoice[]> {
  const rows = await prisma.invoice.findMany({
    where: { userId, clientId },
    orderBy: { issueDate: "desc" },
  });
  return rows.map(parseInvoice);
}

export async function getContractsForClient(
  userId: string,
  clientId: string
): Promise<Contract[]> {
  const rows = await prisma.contract.findMany({
    where: { userId, clientId },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(
    (r) =>
      ({
        ...r,
        details: r.details ? JSON.parse(r.details) : undefined,
      }) as unknown as Contract
  );
}

/** Latest booking start time per client, for the clients list. */
export async function lastBookingByClient(
  userId: string
): Promise<Record<string, string | undefined>> {
  const rows = await prisma.booking.findMany({
    where: { userId },
    select: { clientId: true, startTime: true },
  });
  const map: Record<string, string | undefined> = {};
  for (const r of rows) {
    if (!map[r.clientId] || r.startTime > (map[r.clientId] as string)) {
      map[r.clientId] = r.startTime;
    }
  }
  return map;
}
