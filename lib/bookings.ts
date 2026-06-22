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

export function clientDisplayName(booking: Booking): string {
  return booking.clientName ?? "—";
}
