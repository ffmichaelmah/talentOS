import { bookings, clients, contracts, invoices } from "@/data";
import type { Client, ClientType } from "@/types";

export const CLIENT_TYPE_LABELS: Record<ClientType, string> = {
  venue: "Venue",
  brand: "Brand",
  agency: "Agency",
  promoter: "Promoter",
  private: "Private",
};

export const CLIENT_TYPES = Object.keys(CLIENT_TYPE_LABELS) as ClientType[];

export function clientById(id: string): Client | undefined {
  return clients.find((c) => c.id === id);
}

export function bookingsForClient(id: string) {
  return bookings
    .filter((b) => b.clientId === id)
    .sort((a, b) => b.startTime.localeCompare(a.startTime));
}

export function invoicesForClient(id: string) {
  return invoices
    .filter((i) => i.clientId === id)
    .sort((a, b) => b.issueDate.localeCompare(a.issueDate));
}

export function contractsForClient(id: string) {
  return contracts
    .filter((c) => c.clientId === id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function lastBookingDate(id: string): string | undefined {
  return bookingsForClient(id)[0]?.startTime;
}

/** Revenue actually collected from this client's invoices. */
export function collectedRevenue(id: string): number {
  return invoicesForClient(id).reduce((sum, i) => sum + i.amountPaid, 0);
}
