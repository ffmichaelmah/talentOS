/**
 * Merge tokens available in template bodies, resolved at document
 * generation time. Custom fields appear as {{fields.<key>}}.
 */
export const templateTokenGroups = [
  {
    group: "Talent",
    tokens: ["talent.displayName", "talent.businessName", "talent.email"],
  },
  {
    group: "Client",
    tokens: ["client.name", "client.company", "client.email"],
  },
  {
    group: "Booking",
    tokens: [
      "booking.title",
      "booking.venueName",
      "booking.startTime",
      "booking.fee",
    ],
  },
  {
    group: "Document",
    tokens: [
      "document.number",
      "document.issueDate",
      "document.dueDate",
      "document.lineItems",
      "document.subtotal",
      "document.taxAmount",
      "document.total",
    ],
  },
] as const;
