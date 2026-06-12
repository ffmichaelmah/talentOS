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
  {
    id: "template-7",
    kind: "contract",
    name: "Artist Deal Memo (Club Show)",
    description:
      "Concise deal memo for a single club performance: parties, set details, fee with deposit/balance schedule, and purchaser-provided items. Modeled on international booking-agency deal memos.",
    status: "published",
    version: 1,
    isDefault: false,
    minPlanId: null,
    body: `ARTIST DEAL MEMO AND PERFORMANCE AGREEMENT {{document.number}}

This Performance Agreement is dated {{document.issueDate}}.

THE PARTIES
1. {{client.company}} ("Purchaser"), represented by {{client.name}} ({{client.email}});
2. {{talent.businessName}}, for the services of the artist professionally known as {{talent.displayName}} ("Artist").

The Purchaser engages the Artist, and the Artist agrees to furnish the entertainment presentation described below ("the Performance"), subject to the terms set out in this memo and any rider attached.

THE PERFORMANCE
Event:                {{booking.title}}
Venue:                {{booking.venueName}}
Date of performance:  {{booking.startTime}}
Stage:                {{fields.stage}}
Billing:              {{fields.billing}}
Duration:             {{fields.setLength}} minutes
Set time:             {{fields.setTime}}
* Any change to set times must be agreed in writing.

FEE AND PAYMENT
Non-returnable performance fee: {{booking.fee}}
Applicable withholding tax: {{fields.whtRate}}% (if applicable, certificates must be provided as detailed on the Artist invoice)
Deposit: {{fields.depositAmount}} due on or before {{fields.depositDueDate}}
Balance: {{fields.balanceAmount}} due on or before {{fields.balanceDueDate}}

PURCHASER TO PROVIDE AND PAY FOR
Flights:          {{fields.flights}}
Accommodation:    {{fields.accommodation}}
Ground transport: {{fields.groundTransport}}
Technical & hospitality: as per Artist rider
Permits, visas, licences, insurance: all necessary documents, permits, and personal-injury and property-damage liability insurance.

IMAGE & RECORDING
This Agreement does not grant any consents in respect of image rights, filming, photography, or promotional recordings featuring the Artist. Any such requests must be cleared separately in writing with the Artist's management.

SIGNATURES
For the Purchaser: {{client.name}}, {{client.company}}
For the Artist: {{talent.displayName}}, {{talent.businessName}}`,
    fields: [
      { id: "tf-7a", key: "stage", label: "Stage", type: "text", required: true, placeholder: "Mainstage" },
      {
        id: "tf-7b",
        key: "billing",
        label: "Billing",
        type: "select",
        required: true,
        options: ["Solo headline", "Co-headline", "Support", "Special guest"],
      },
      { id: "tf-7c", key: "setLength", label: "Set length (minutes)", type: "number", required: true },
      { id: "tf-7d", key: "setTime", label: "Set time", type: "time", required: true },
      { id: "tf-7e", key: "whtRate", label: "Withholding tax (%)", type: "number", required: true, placeholder: "0" },
      { id: "tf-7f", key: "depositAmount", label: "Deposit amount", type: "currency", required: true },
      { id: "tf-7g", key: "depositDueDate", label: "Deposit due date", type: "date", required: true },
      { id: "tf-7h", key: "balanceAmount", label: "Balance amount", type: "currency", required: true },
      { id: "tf-7i", key: "balanceDueDate", label: "Balance due date", type: "date", required: true },
      { id: "tf-7j", key: "flights", label: "Flights", type: "text", required: false, placeholder: "None — included in fee" },
      { id: "tf-7k", key: "accommodation", label: "Accommodation", type: "text", required: false, placeholder: "1 king room, 2 nights, 5* hotel" },
      { id: "tf-7l", key: "groundTransport", label: "Ground transport", type: "text", required: false, placeholder: "Professional ground transportation" },
    ],
    usageCount: 0,
    createdBy: "Maya Reyes",
    createdAt: "2026-06-12T08:00:00Z",
    updatedAt: "2026-06-12T08:00:00Z",
  },
  {
    id: "template-8",
    kind: "contract",
    name: "International Booking Agreement (Articles)",
    description:
      "Full article-style agreement for international bookings: fee & deal, payment terms, promotion approval, technical and accommodation obligations, tiered payment schedule, and force majeure.",
    status: "published",
    version: 1,
    isDefault: false,
    minPlanId: "plan-starter",
    body: `PERFORMANCE AGREEMENT {{document.number}}
Dated {{document.issueDate}}

Between {{client.company}}, represented by {{client.name}} ("Organizer"), and {{talent.businessName}} acting for the artist professionally known as {{talent.displayName}} ("Artist").

ARTICLE 1 — PERFORMANCE
The Organizer engages the Artist for a performance at {{booking.title}}, {{booking.venueName}}, on {{booking.startTime}}. Changes to these details are valid only with prior written consent of the Artist.

ARTICLE 2 — FEE & DEAL
In consideration for the Performance the Organizer shall pay {{booking.fee}} ("the Fee"), plus: {{fields.dealExtras}}. The Organizer is responsible for all applicable taxes and levies on amounts payable. Where withholding tax applies, the Organizer shall provide withholding certificates in the Artist's company name at the earliest opportunity; if not provided within 6 months of the performance date, withheld amounts become directly payable to the Artist.

ARTICLE 3 — PAYMENT TERMS
All payments shall be made by bank transfer to the account stated on the Artist's invoice. If the Organizer fails to pay on time or in full, the Organizer is in default without further notice, and the Artist may cancel the Performance while the Organizer remains liable for the full Fee.

ARTICLE 4 — PROMOTION & BILLING
The Artist shall receive {{fields.billing}} billing on all artwork. Only images and logos supplied by the Artist's team may be used, and all artwork must be approved in writing before publication. The Performance may be announced only after this Agreement is signed, the deposit has been received, and artwork approved.

ARTICLE 5 — TECHNICAL
The technical rider forms an integral part of this Agreement. The Organizer guarantees timely fulfilment of all rider requirements at its own cost, and warrants that all equipment is in good condition. Failure to comply entitles the Artist to cancel while the Organizer remains liable for the Fee.

ARTICLE 6 — ACCOMMODATION & TRAVEL
On top of the Fee, the Organizer shall book and pay for: {{fields.travelPackage}}, in accordance with the hospitality rider and subject to approval by the Artist's advancing team.

ARTICLE 7 — PAYMENT SCHEDULE
A. {{fields.tier1}}
B. {{fields.tier2}}
C. {{fields.tier3}}

ARTICLE 8 — FORCE MAJEURE
The Performance may be cancelled due to force majeure, including: death, illness, or serious injury of the Artist or persons close to the Artist; acts of God; fire; riots; strikes; governmental decisions; acts of war or terrorism; failure of essential utilities; extreme weather; pandemic or epidemic; or any other circumstance beyond a party's control. If cancelled for force majeure, the Fee (to the extent paid) is retained until the parties agree a replacement date; if no date is agreed within 12 months, the Fee is returned less reasonable, documented expenses already incurred.

ARTICLE 9 — FINAL PROVISIONS
Deviations from this Agreement are valid only in writing and initialed by both parties. The contents of this Agreement are confidential. If any provision is held invalid, the remainder stays in force and the parties shall negotiate a valid replacement reflecting the original intent.

SIGNATURES
For the Organizer: {{client.name}}, {{client.company}}
For the Artist: {{talent.displayName}}, {{talent.businessName}}`,
    fields: [
      {
        id: "tf-8a",
        key: "dealExtras",
        label: "Deal extras (hotel, ground, rider, visa…)",
        type: "textarea",
        required: true,
        placeholder: "Hotel (2 rooms, 2 nights), ground transport, rider, visa/work permit",
      },
      {
        id: "tf-8b",
        key: "billing",
        label: "Billing",
        type: "select",
        required: true,
        options: ["Sole headline", "Co-headline", "Support"],
      },
      {
        id: "tf-8c",
        key: "travelPackage",
        label: "Accommodation & travel package",
        type: "textarea",
        required: true,
        placeholder: "2 king rooms for 2 nights at a 5* hotel incl. breakfast, airport transfers",
      },
      {
        id: "tf-8d",
        key: "tier1",
        label: "Payment tier A",
        type: "text",
        required: true,
        placeholder: "84–42 days before the date: 25% of the Fee due",
      },
      {
        id: "tf-8e",
        key: "tier2",
        label: "Payment tier B",
        type: "text",
        required: true,
        placeholder: "41–21 days before the date: 50% of the Fee due",
      },
      {
        id: "tf-8f",
        key: "tier3",
        label: "Payment tier C",
        type: "text",
        required: true,
        placeholder: "Within 21 days of the date: 100% of the Fee due",
      },
    ],
    usageCount: 0,
    createdBy: "Maya Reyes",
    createdAt: "2026-06-12T08:05:00Z",
    updatedAt: "2026-06-12T08:05:00Z",
  },
  {
    id: "template-9",
    kind: "contract",
    name: "Engagement Contract (Agency Schedule)",
    description:
      "Agency-style engagement contract with a schedule (artist/agency/bank fees, payment schedule, billing, hotel, transport) and core terms: cancellation windows, recording prohibition, permits, and governing law.",
    status: "published",
    version: 1,
    isDefault: false,
    minPlanId: "plan-starter",
    body: `ENGAGEMENT CONTRACT {{document.number}}
An agreement dated {{document.issueDate}}

BETWEEN {{client.name}} of {{client.company}} ("the Company") of the one part, AND the artist professionally known as {{talent.displayName}}, booked through {{talent.businessName}} ("the Artist"), of the other part.

The Company engages the Artist to appear and perform ("the Performance") per the Schedule below, subject to the Conditions and any rider attached.

SCHEDULE
(a) PERFORMANCE: {{booking.title}} at {{booking.venueName}} on {{booking.startTime}} — {{fields.setLength}} minutes.
(b) CONSIDERATION:
    Artist fee:  {{fields.artistFee}}
    Agency fee:  {{fields.agencyFee}}
    Bank fee:    {{fields.bankFee}}
    Payment schedule: {{fields.paymentSchedule}}
    Failure to comply with this payment schedule is a material breach entitling the Artist to terminate immediately.
(c) BILLING & ADVERTISING: {{fields.billing}} billing. All artwork must be approved before publication, and no advertising may run until the deposit has cleared and the artwork is approved in writing.
(d) TECHNICAL: as per the attached rider.
(e) HOTEL: {{fields.hotel}}.
(f) TRANSPORT & FLIGHTS: {{fields.transport}}.

CONDITIONS
1. CANCELLATION. Cancellation by the Company is acceptable only under Force Majeure, in which case the deposit and booking fee are non-refundable. If the Company cancels within {{fields.cancellationWindow}} weeks of the date for any other reason, the full fees become due; earlier cancellation forfeits the deposit and booking fee only.
2. TERMINATION. The Artist may terminate immediately on written notice if the Company breaches this contract, fails to pay on time, or enters insolvency. All outstanding fees become payable within 5 days of such notice.
3. RECORDING. No audio or audio-visual recording or broadcast of the Performance may be made or permitted by the Company without the Artist's prior written approval.
4. PERMITS & INSURANCE. The Company shall, at its own cost, obtain all required licences, permits, visas, safety certificates, and insurance, and shall provide adequate security for the Artist from arrival until departure.
5. LIABILITY. Each party's liability for breach is capped at the total fees actually paid under this contract.
6. CONFIDENTIALITY. The terms of this contract are confidential to the parties.
7. GOVERNING LAW. This contract is governed by the laws of {{fields.governingLaw}}, and disputes are subject to the exclusive jurisdiction of its courts.

SIGNED for the Company: {{client.name}}, {{client.company}}
SIGNED for the Artist: {{talent.displayName}}, {{talent.businessName}}`,
    fields: [
      { id: "tf-9a", key: "setLength", label: "Set length (minutes)", type: "number", required: true },
      { id: "tf-9b", key: "artistFee", label: "Artist fee", type: "currency", required: true },
      { id: "tf-9c", key: "agencyFee", label: "Agency fee", type: "currency", required: false },
      { id: "tf-9d", key: "bankFee", label: "Bank fee", type: "currency", required: false },
      {
        id: "tf-9e",
        key: "paymentSchedule",
        label: "Payment schedule",
        type: "textarea",
        required: true,
        placeholder: "50% of the artist fee and 100% of the agency fee on signing; balance one month before the show date",
      },
      {
        id: "tf-9f",
        key: "billing",
        label: "Billing",
        type: "select",
        required: true,
        options: ["100% headline", "Co-headline", "Support"],
      },
      { id: "tf-9g", key: "hotel", label: "Hotel", type: "text", required: false, placeholder: "2 king rooms, 2 nights, min 5*, incl. breakfast" },
      { id: "tf-9h", key: "transport", label: "Transport & flights", type: "text", required: false, placeholder: "Business flights + ground transport with driver" },
      { id: "tf-9i", key: "cancellationWindow", label: "Cancellation window (weeks)", type: "number", required: true, placeholder: "6" },
      { id: "tf-9j", key: "governingLaw", label: "Governing law (jurisdiction)", type: "text", required: true, placeholder: "Malaysia" },
    ],
    usageCount: 0,
    createdBy: "Maya Reyes",
    createdAt: "2026-06-12T08:10:00Z",
    updatedAt: "2026-06-12T08:10:00Z",
  },
];
