import "server-only";

import { prisma } from "@/lib/db";
import type { AdvanceForm, Booking, Client, Contract, Invoice } from "@/types";

/* ------------------------------- helpers --------------------------------- */

async function clientNameMap(userId: string): Promise<Record<string, string>> {
  const rows = await prisma.client.findMany({
    where: { userId },
    select: { id: true, name: true, company: true },
  });
  const map: Record<string, string> = {};
  for (const c of rows) map[c.id] = c.company ?? c.name;
  return map;
}

async function bookingTitleMap(userId: string): Promise<Record<string, string>> {
  const rows = await prisma.booking.findMany({
    where: { userId },
    select: { id: true, title: true },
  });
  const map: Record<string, string> = {};
  for (const b of rows) map[b.id] = b.title;
  return map;
}

function clientLabel(names: Record<string, string>, clientId: string): string {
  return names[clientId] ?? "—";
}

/* ------------------------------- clients --------------------------------- */

/** Real bookings count + collected revenue (paid invoices) per client. */
async function clientAggregates(
  userId: string
): Promise<Record<string, { bookings: number; revenue: number }>> {
  const [bookings, invoices] = await Promise.all([
    prisma.booking.findMany({ where: { userId }, select: { clientId: true } }),
    prisma.invoice.findMany({
      where: { userId, status: "paid" },
      select: { clientId: true, total: true },
    }),
  ]);
  const agg: Record<string, { bookings: number; revenue: number }> = {};
  for (const b of bookings) (agg[b.clientId] ??= { bookings: 0, revenue: 0 }).bookings++;
  for (const i of invoices) (agg[i.clientId] ??= { bookings: 0, revenue: 0 }).revenue += i.total;
  return agg;
}

export async function getClients(userId: string): Promise<Client[]> {
  const [rows, agg] = await Promise.all([
    prisma.client.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
    clientAggregates(userId),
  ]);
  return rows.map((r) => ({
    ...r,
    totalBookings: agg[r.id]?.bookings ?? 0,
    totalBilled: agg[r.id]?.revenue ?? 0,
  })) as unknown as Client[];
}

export async function getClientById(
  userId: string,
  id: string
): Promise<Client | null> {
  const row = await prisma.client.findFirst({ where: { id, userId } });
  if (!row) return null;
  const [bookings, revenue] = await Promise.all([
    prisma.booking.count({ where: { userId, clientId: id } }),
    prisma.invoice.aggregate({
      where: { userId, clientId: id, status: "paid" },
      _sum: { total: true },
    }),
  ]);
  return {
    ...row,
    totalBookings: bookings,
    totalBilled: revenue._sum.total ?? 0,
  } as unknown as Client;
}

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

/* ------------------------------- invoices -------------------------------- */

function parseInvoice(
  r: { job: string | null; lineItems: string; clientId: string; bookingId: string | null },
  names: Record<string, string>,
  titles: Record<string, string>
): Invoice {
  const job = r.job ? JSON.parse(r.job) : undefined;
  return {
    ...r,
    job,
    lineItems: JSON.parse(r.lineItems),
    clientName: clientLabel(names, r.clientId),
    eventName:
      job?.eventName ?? (r.bookingId ? titles[r.bookingId] : undefined) ?? "—",
  } as unknown as Invoice;
}

export async function getInvoices(userId: string): Promise<Invoice[]> {
  const [rows, names, titles] = await Promise.all([
    prisma.invoice.findMany({ where: { userId }, orderBy: { issueDate: "desc" } }),
    clientNameMap(userId),
    bookingTitleMap(userId),
  ]);
  return rows.map((r) => parseInvoice(r, names, titles));
}

export async function getInvoiceById(
  userId: string,
  id: string
): Promise<Invoice | null> {
  const row = await prisma.invoice.findFirst({ where: { id, userId } });
  if (!row) return null;
  const [names, titles] = await Promise.all([
    clientNameMap(userId),
    bookingTitleMap(userId),
  ]);
  return parseInvoice(row, names, titles);
}

export async function getInvoicesForClient(
  userId: string,
  clientId: string
): Promise<Invoice[]> {
  const rows = await prisma.invoice.findMany({
    where: { userId, clientId },
    orderBy: { issueDate: "desc" },
  });
  return rows.map((r) => parseInvoice(r, {}, {}));
}

export async function clientCount(userId: string): Promise<number> {
  return prisma.client.count({ where: { userId } });
}

export async function invoiceCountThisMonth(userId: string): Promise<number> {
  const now = new Date();
  const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const rows = await prisma.invoice.findMany({
    where: { userId },
    select: { issueDate: true },
  });
  return rows.filter((r) => r.issueDate.startsWith(prefix)).length;
}

export async function nextInvoiceNumber(userId: string): Promise<string> {
  const rows = await prisma.invoice.findMany({
    where: { userId },
    select: { invoiceNumber: true },
  });
  const max = rows
    .map((r) => Number(r.invoiceNumber.match(/(\d+)$/)?.[1] ?? 0))
    .reduce((a, b) => Math.max(a, b), 0);
  return `INV-${new Date().getFullYear()}-${String(max + 1).padStart(3, "0")}`;
}

/* ------------------------------- bookings -------------------------------- */

export async function getBookings(userId: string): Promise<Booking[]> {
  const [rows, names] = await Promise.all([
    prisma.booking.findMany({ where: { userId }, orderBy: { startTime: "asc" } }),
    clientNameMap(userId),
  ]);
  // Resolve linked-doc statuses for the columns.
  const [invoices, contracts, advances] = await Promise.all([
    prisma.invoice.findMany({ where: { userId }, select: { id: true, status: true } }),
    prisma.contract.findMany({ where: { userId }, select: { id: true, status: true } }),
    prisma.advanceForm.findMany({ where: { userId }, select: { id: true, status: true } }),
  ]);
  const inv = Object.fromEntries(invoices.map((i) => [i.id, i.status]));
  const con = Object.fromEntries(contracts.map((c) => [c.id, c.status]));
  const adv = Object.fromEntries(advances.map((a) => [a.id, a.status]));
  return rows.map(
    (r) =>
      ({
        ...r,
        clientName: clientLabel(names, r.clientId),
        invoiceStatus: r.invoiceId ? inv[r.invoiceId] : undefined,
        contractStatus: r.contractId ? con[r.contractId] : undefined,
        advanceStatus: r.advanceFormId ? adv[r.advanceFormId] : undefined,
      }) as unknown as Booking
  );
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

export async function getBookingById(
  userId: string,
  id: string
): Promise<Booking | null> {
  const row = await prisma.booking.findFirst({ where: { id, userId } });
  if (!row) return null;
  const names = await clientNameMap(userId);
  return {
    ...row,
    clientName: clientLabel(names, row.clientId),
  } as unknown as Booking;
}

/* ------------------------------ contracts -------------------------------- */

function parseContract(
  r: { details: string | null; clientId: string },
  names: Record<string, string>
): Contract {
  return {
    ...r,
    details: r.details ? JSON.parse(r.details) : undefined,
    clientName: clientLabel(names, r.clientId),
  } as unknown as Contract;
}

export async function getContracts(userId: string): Promise<Contract[]> {
  const [rows, names] = await Promise.all([
    prisma.contract.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
    clientNameMap(userId),
  ]);
  return rows.map((r) => parseContract(r, names));
}

export async function getContractById(
  userId: string,
  id: string
): Promise<Contract | null> {
  const row = await prisma.contract.findFirst({ where: { id, userId } });
  if (!row) return null;
  const names = await clientNameMap(userId);
  return parseContract(row, names);
}

export async function getContractsForClient(
  userId: string,
  clientId: string
): Promise<Contract[]> {
  const rows = await prisma.contract.findMany({
    where: { userId, clientId },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => parseContract(r, {}));
}

/* ----------------------------- advance forms ----------------------------- */

function parseAdvance(
  r: {
    eventDetails: string | null;
    campaignDetails: string | null;
    sectionStates?: string | null;
    clientId: string;
  },
  names: Record<string, string>
): AdvanceForm {
  return {
    ...r,
    eventDetails: r.eventDetails ? JSON.parse(r.eventDetails) : undefined,
    campaignDetails: r.campaignDetails ? JSON.parse(r.campaignDetails) : undefined,
    sectionStates: r.sectionStates ? JSON.parse(r.sectionStates) : null,
    clientName: clientLabel(names, r.clientId),
  } as unknown as AdvanceForm;
}

export async function getAdvanceForms(userId: string): Promise<AdvanceForm[]> {
  const [rows, names] = await Promise.all([
    prisma.advanceForm.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
    clientNameMap(userId),
  ]);
  return rows.map((r) => parseAdvance(r, names));
}

/** Public: a shared advance by id, only when the owner enabled sharing. */
export async function getSharedAdvance(id: string): Promise<AdvanceForm | null> {
  const row = await prisma.advanceForm.findFirst({
    where: { id, shareEnabled: true },
  });
  return row ? parseAdvance(row, {}) : null;
}

export async function getAdvanceFormById(
  userId: string,
  id: string
): Promise<AdvanceForm | null> {
  const row = await prisma.advanceForm.findFirst({ where: { id, userId } });
  if (!row) return null;
  const names = await clientNameMap(userId);
  return parseAdvance(row, names);
}

