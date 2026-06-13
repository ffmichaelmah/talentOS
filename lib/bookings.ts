import { advanceForms, bookings, clients, contracts, invoices } from "@/data";
import type { Booking, BookingStage, EventType } from "@/types";

export const BOOKING_STAGE_LABELS: Record<BookingStage, string> = {
  inquiry: "Inquiry",
  quoted: "Quoted",
  confirmed: "Confirmed",
  "contract-sent": "Contract Sent",
  "deposit-paid": "Deposit Paid",
  "advance-completed": "Advance Completed",
  "job-completed": "Job Completed",
  "balance-paid": "Balance Paid",
  closed: "Closed",
};

export const BOOKING_STAGES = Object.keys(
  BOOKING_STAGE_LABELS
) as BookingStage[];

export function stageLabel(stage: BookingStage): string {
  return BOOKING_STAGE_LABELS[stage];
}

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  "club-night": "Club night",
  festival: "Festival",
  "private-event": "Private event",
  corporate: "Corporate",
  wedding: "Wedding",
  "brand-activation": "Brand activation",
  "photo-shoot": "Photo shoot",
  "video-shoot": "Video shoot",
};

export function bookingById(id: string): Booking | undefined {
  return bookings.find((b) => b.id === id);
}

export function clientFor(booking: Booking) {
  return clients.find((c) => c.id === booking.clientId);
}

export function clientDisplayName(booking: Booking): string {
  const client = clientFor(booking);
  return client?.company ?? client?.name ?? "—";
}

export function invoiceFor(booking: Booking) {
  return booking.invoiceId
    ? invoices.find((i) => i.id === booking.invoiceId)
    : undefined;
}

export function contractFor(booking: Booking) {
  return booking.contractId
    ? contracts.find((c) => c.id === booking.contractId)
    : undefined;
}

export function advanceFor(booking: Booking) {
  return booking.advanceFormId
    ? advanceForms.find((a) => a.id === booking.advanceFormId)
    : undefined;
}
