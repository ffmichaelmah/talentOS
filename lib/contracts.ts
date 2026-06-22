import type { Contract, ContractType } from "@/types";

/**
 * Shown wherever a contract template is offered or generated, and appended
 * to generated contract bodies.
 */
export const CONTRACT_REFERENCE_DISCLAIMER =
  "This document is a template and does not replace legal advice.";

/** Longer-form version for help text and the locked-feature preview. */
export const CONTRACT_REFERENCE_DISCLAIMER_LONG =
  "This document is a template and does not replace legal advice. TalentOS " +
  "is not a law firm. Review the final document with a qualified legal " +
  "professional before signing — contract legal review is available on Pro " +
  "and Agency plans.";

/** Footer block appended to contract bodies generated from templates. */
export const CONTRACT_BODY_NOTICE = `------------------------------------------------------------
REFERENCE NOTICE
This document was generated from a TalentOS reference template. It is
provided for reference only and does not constitute legal advice. Have a
qualified legal professional review it before signing.
------------------------------------------------------------`;

export const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  "dj-booking": "DJ Booking Contract",
  "influencer-campaign": "Influencer Campaign Agreement",
  "music-performance": "Music Performance Agreement",
  "talent-appearance": "Talent Appearance Agreement",
  "event-hosting": "Event Hosting Agreement",
  "brand-collaboration": "Brand Collaboration Agreement",
  "freelance-service": "Freelance Service Agreement",
};

export const CONTRACT_TYPES = Object.keys(
  CONTRACT_TYPE_LABELS
) as ContractType[];

export function contractTypeLabel(type?: ContractType): string {
  return type ? CONTRACT_TYPE_LABELS[type] : "Contract";
}

export function clientDisplayName(contract: Contract): string {
  return contract.clientName ?? "—";
}
