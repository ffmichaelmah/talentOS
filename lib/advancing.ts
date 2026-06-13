import { advanceForms, clients } from "@/data";
import type { AdvanceCategory, AdvanceForm, AdvanceFormType } from "@/types";

export const ADVANCE_CATEGORY_LABELS: Record<AdvanceCategory, string> = {
  event: "Event / Performance",
  campaign: "Influencer / Creator Campaign",
};

export const ADVANCE_TYPE_LABELS: Record<AdvanceFormType, string> = {
  "event-performance": "Event / Performance Advance",
  "music-performance": "Music Performance Advance",
  "dj-booking": "DJ Booking Advance",
  "influencer-campaign": "Influencer Campaign Advance",
  "content-creator-campaign": "Content Creator Campaign Advance",
};

const TYPE_CATEGORY: Record<AdvanceFormType, AdvanceCategory> = {
  "event-performance": "event",
  "music-performance": "event",
  "dj-booking": "event",
  "influencer-campaign": "campaign",
  "content-creator-campaign": "campaign",
};

export const ADVANCE_TYPES = Object.keys(
  ADVANCE_TYPE_LABELS
) as AdvanceFormType[];

export function categoryOf(type: AdvanceFormType): AdvanceCategory {
  return TYPE_CATEGORY[type];
}

export function typesForCategory(category: AdvanceCategory): AdvanceFormType[] {
  return ADVANCE_TYPES.filter((t) => TYPE_CATEGORY[t] === category);
}

export function advanceTypeLabel(type: AdvanceFormType): string {
  return ADVANCE_TYPE_LABELS[type];
}

export function clientFor(form: AdvanceForm) {
  return clients.find((c) => c.id === form.clientId);
}

export function clientDisplayName(form: AdvanceForm): string {
  const client = clientFor(form);
  return client?.company ?? client?.name ?? "—";
}

/** Human label for the share-link state shown in the list. */
export function shareStatusLabel(form: AdvanceForm): {
  label: string;
  tone: "active" | "viewed" | "none";
} {
  if (!form.shareEnabled) return { label: "Not shared", tone: "none" };
  if (form.shareViewed) return { label: "Opened by client", tone: "viewed" };
  return { label: "Link active", tone: "active" };
}

export { advanceForms };
