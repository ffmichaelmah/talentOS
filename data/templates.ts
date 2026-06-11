import type { DocumentTemplate } from "@/types";

export const templates: DocumentTemplate[] = [
  {
    id: "template-1",
    kind: "contract",
    name: "Performance Agreement",
    description:
      "Standard single-event performance contract with deposit, cancellation, and overtime terms.",
    status: "published",
    version: 4,
    isDefault: true,
    minPlanId: null,
    body: `PERFORMANCE AGREEMENT

This agreement is made between {{talent.businessName}} ("Artist") and {{client.company}} ("Purchaser") for the event "{{booking.title}}" at {{booking.venueName}} on {{booking.startTime}}.

1. PERFORMANCE. Artist will perform a set of {{fields.setLength}} minutes beginning at the time stated above.
2. FEE. Purchaser agrees to pay {{document.total}}, with a deposit of {{fields.depositPercent}}% due upon signing. Balance is due {{fields.balanceDue}}.
3. CANCELLATION. Cancellations within {{fields.cancellationWindow}} days of the event forfeit the deposit.
4. OVERTIME. Performance beyond the contracted time is billed at {{fields.overtimeRate}} per hour.

Signed,
{{talent.displayName}} — {{client.name}}`,
    fields: [
      {
        id: "tf-1a",
        key: "setLength",
        label: "Set length (minutes)",
        type: "number",
        required: true,
      },
      {
        id: "tf-1b",
        key: "depositPercent",
        label: "Deposit (%)",
        type: "number",
        required: true,
        placeholder: "50",
      },
      {
        id: "tf-1c",
        key: "balanceDue",
        label: "Balance due",
        type: "select",
        required: true,
        options: ["On event day", "Net 15", "Net 30"],
      },
      {
        id: "tf-1d",
        key: "cancellationWindow",
        label: "Cancellation window (days)",
        type: "number",
        required: true,
        placeholder: "14",
      },
      {
        id: "tf-1e",
        key: "overtimeRate",
        label: "Overtime rate",
        type: "currency",
        required: false,
      },
    ],
    usageCount: 38,
    createdBy: "TalentOS",
    createdAt: "2025-08-01T12:00:00Z",
    updatedAt: "2026-04-12T09:30:00Z",
  },
  {
    id: "template-2",
    kind: "contract",
    name: "Brand Collaboration Agreement",
    description:
      "Sponsored performance / appearance contract including content usage rights and exclusivity.",
    status: "published",
    version: 2,
    isDefault: false,
    minPlanId: "plan-pro",
    body: `BRAND COLLABORATION AGREEMENT

{{talent.businessName}} ("Talent") and {{client.company}} ("Brand") agree to the activation "{{booking.title}}".

1. DELIVERABLES. {{fields.deliverables}}
2. USAGE. Brand may use event content for {{fields.usageWindow}} months on owned channels.
3. EXCLUSIVITY. Talent will not promote competing brands in the category "{{fields.exclusivityCategory}}" for {{fields.exclusivityWindow}} days around the event.
4. FEE. Total fee {{document.total}}, payable {{fields.paymentTerms}}.`,
    fields: [
      {
        id: "tf-2a",
        key: "deliverables",
        label: "Deliverables",
        type: "textarea",
        required: true,
        placeholder: "e.g. 2 × 90-min sets, 1 IG post, 2 stories",
      },
      {
        id: "tf-2b",
        key: "usageWindow",
        label: "Content usage window (months)",
        type: "number",
        required: true,
      },
      {
        id: "tf-2c",
        key: "exclusivityCategory",
        label: "Exclusivity category",
        type: "text",
        required: false,
      },
      {
        id: "tf-2d",
        key: "exclusivityWindow",
        label: "Exclusivity window (days)",
        type: "number",
        required: false,
      },
      {
        id: "tf-2e",
        key: "paymentTerms",
        label: "Payment terms",
        type: "select",
        required: true,
        options: ["50% deposit / 50% on completion", "Net 30", "Net 45"],
      },
    ],
    usageCount: 11,
    createdBy: "TalentOS",
    createdAt: "2025-11-05T15:00:00Z",
    updatedAt: "2026-03-02T11:20:00Z",
  },
  {
    id: "template-3",
    kind: "invoice",
    name: "Standard Invoice",
    description:
      "Clean single-page invoice with line items, tax, and payment instructions.",
    status: "published",
    version: 6,
    isDefault: true,
    minPlanId: null,
    body: `INVOICE {{document.number}}

From: {{talent.businessName}}
To: {{client.company}} — Attn: {{client.name}}

Issued {{document.issueDate}} · Due {{document.dueDate}}

{{document.lineItems}}

Subtotal: {{document.subtotal}}
Tax: {{document.taxAmount}}
TOTAL DUE: {{document.total}}

Payment: {{fields.paymentInstructions}}`,
    fields: [
      {
        id: "tf-3a",
        key: "paymentInstructions",
        label: "Payment instructions",
        type: "textarea",
        required: true,
        placeholder: "Bank transfer details, payment link, etc.",
      },
    ],
    usageCount: 142,
    createdBy: "TalentOS",
    createdAt: "2025-08-01T12:00:00Z",
    updatedAt: "2026-05-18T08:45:00Z",
  },
  {
    id: "template-4",
    kind: "invoice",
    name: "Deposit Invoice",
    description:
      "Partial invoice for booking deposits, with the remaining balance shown for reference.",
    status: "draft",
    version: 1,
    isDefault: false,
    minPlanId: null,
    body: `DEPOSIT INVOICE {{document.number}}

From {{talent.businessName}} to {{client.company}} for "{{booking.title}}".

Deposit due ({{fields.depositPercent}}% of {{booking.fee}}): {{document.total}}
Remaining balance due {{fields.balanceDue}}.

This deposit confirms the booking date of {{booking.startTime}}.`,
    fields: [
      {
        id: "tf-4a",
        key: "depositPercent",
        label: "Deposit (%)",
        type: "number",
        required: true,
        placeholder: "50",
      },
      {
        id: "tf-4b",
        key: "balanceDue",
        label: "Balance due",
        type: "select",
        required: true,
        options: ["On event day", "7 days before event", "Net 15"],
      },
    ],
    usageCount: 0,
    createdBy: "Maya Reyes",
    createdAt: "2026-06-01T19:00:00Z",
    updatedAt: "2026-06-01T19:00:00Z",
  },
  {
    id: "template-5",
    kind: "advance-form",
    name: "Standard Event Advance",
    description:
      "Pre-event logistics sheet covering timings, tech, hospitality, parking, and contacts.",
    status: "published",
    version: 3,
    isDefault: true,
    minPlanId: null,
    body: `EVENT ADVANCE — {{booking.title}}

Date: {{booking.startTime}} · Venue: {{booking.venueName}}

TIMINGS
Load-in {{fields.loadInTime}} · Soundcheck {{fields.soundCheckTime}} · Set {{fields.setTime}} ({{fields.setLength}} min)

TECH
Provided by venue: {{fields.equipmentProvided}}
Required from venue: {{fields.equipmentRequired}}

HOSPITALITY: {{fields.hospitality}}
PARKING / ACCESS: {{fields.parking}}

ON-SITE CONTACT: {{fields.contactName}} — {{fields.contactPhone}}`,
    fields: [
      { id: "tf-5a", key: "loadInTime", label: "Load-in time", type: "time", required: true },
      { id: "tf-5b", key: "soundCheckTime", label: "Soundcheck time", type: "time", required: false },
      { id: "tf-5c", key: "setTime", label: "Set time", type: "time", required: true },
      { id: "tf-5d", key: "setLength", label: "Set length (minutes)", type: "number", required: true },
      {
        id: "tf-5e",
        key: "equipmentProvided",
        label: "Equipment provided",
        type: "textarea",
        required: false,
      },
      {
        id: "tf-5f",
        key: "equipmentRequired",
        label: "Equipment required",
        type: "textarea",
        required: true,
      },
      { id: "tf-5g", key: "hospitality", label: "Hospitality notes", type: "textarea", required: false },
      { id: "tf-5h", key: "parking", label: "Parking / access", type: "textarea", required: false },
      { id: "tf-5i", key: "contactName", label: "On-site contact name", type: "text", required: true },
      { id: "tf-5j", key: "contactPhone", label: "On-site contact phone", type: "text", required: true },
    ],
    usageCount: 64,
    createdBy: "TalentOS",
    createdAt: "2025-09-10T10:00:00Z",
    updatedAt: "2026-02-22T14:10:00Z",
  },
  {
    id: "template-6",
    kind: "advance-form",
    name: "Festival / Multi-Act Advance",
    description:
      "Extended advance for festival slots: stage assignment, backline sharing, credentials, and settlement.",
    status: "archived",
    version: 2,
    isDefault: false,
    minPlanId: "plan-pro",
    body: `FESTIVAL ADVANCE — {{booking.title}}

Stage: {{fields.stage}} · Slot: {{fields.setTime}} ({{fields.setLength}} min)
Changeover: {{fields.changeover}} min · Backline shared: {{fields.backlineShared}}

CREDENTIALS: {{fields.credentials}}
SETTLEMENT: {{fields.settlement}}`,
    fields: [
      { id: "tf-6a", key: "stage", label: "Stage", type: "text", required: true },
      { id: "tf-6b", key: "setTime", label: "Set time", type: "time", required: true },
      { id: "tf-6c", key: "setLength", label: "Set length (minutes)", type: "number", required: true },
      { id: "tf-6d", key: "changeover", label: "Changeover (minutes)", type: "number", required: true },
      {
        id: "tf-6e",
        key: "backlineShared",
        label: "Backline shared",
        type: "select",
        required: true,
        options: ["Yes", "No", "Partial"],
      },
      { id: "tf-6f", key: "credentials", label: "Credentials / passes", type: "textarea", required: false },
      { id: "tf-6g", key: "settlement", label: "Settlement details", type: "textarea", required: false },
    ],
    usageCount: 7,
    createdBy: "TalentOS",
    createdAt: "2025-10-20T13:00:00Z",
    updatedAt: "2026-01-15T16:40:00Z",
  },
];
