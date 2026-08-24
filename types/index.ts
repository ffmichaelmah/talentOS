/**
 * TalentOS core data models.
 *
 * Frontend-prototype stage: these types are consumed by the dummy data in
 * `/data` and will later map to real database tables / API responses.
 */

/* ---------------------------------- User --------------------------------- */

export type TalentType =
  | "dj"
  | "musician"
  | "influencer"
  | "emcee"
  | "model"
  | "photographer"
  | "videographer"
  | "performer"
  | "manager"
  | "agency";

export interface User {
  id: string;
  name: string;
  /** Stage / brand name shown on documents (e.g. "DJ NOVA"). */
  displayName: string;
  email: string;
  avatarUrl?: string;
  talentType: TalentType;
  businessName?: string;
  phone?: string;
  /** Mailing address shown on documents. */
  address?: string;
  /** Bank / payment instructions printed on invoices. */
  paymentDetails?: string;
  location: string;
  /** ISO 4217 code used as the default for documents, e.g. "USD". */
  currency: string;
  /** References SubscriptionPlan.id */
  planId: string;
  /** Cancelled subscriptions keep their plan until currentPeriodEnd. */
  subscriptionStatus: SubscriptionStatus;
  /** ISO date the paid period ends; null on Free / never-subscribed. */
  currentPeriodEnd?: string | null;
  /** Shareable code others enter at signup. */
  referralCode?: string | null;
  /** Referrer's user id when this account signed up under a code. */
  referredById?: string | null;
  /** Internal brand-ambassador flag (20% monthly commission, not advertised). */
  isAmbassador?: boolean;
  createdAt: string;
}

/* --------------------------------- Client -------------------------------- */

export type ClientType = "venue" | "brand" | "agency" | "promoter" | "private";

export interface Client {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  type: ClientType;
  location?: string;
  /** Full mailing address shown on the client profile. */
  address?: string;
  /** Optional tax / business registration number. */
  taxNumber?: string;
  notes?: string;
  /** Lifetime totals — denormalized for dashboard display. */
  totalBookings: number;
  totalBilled: number;
  createdAt: string;
}

/* -------------------------------- Invoice -------------------------------- */

export type InvoiceStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "paid"
  | "overdue"
  | "cancelled";

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

/** The gig or campaign an invoice bills for. */
export interface InvoiceJob {
  serviceDescription: string;
  /** Event / campaign name, e.g. "Lumen Summer Launch". */
  eventName: string;
  eventDate?: string;
  location?: string;
}

export interface Invoice {
  id: string;
  /** Human-readable number shown on the document, e.g. "INV-2026-014". */
  invoiceNumber: string;
  clientId: string;
  /** Optional link back to the booking this invoice bills for. */
  bookingId?: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  job?: InvoiceJob;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  /** Flat discount applied before tax. */
  discountAmount?: number;
  /** e.g. 0.08 for 8% */
  taxRate: number;
  taxAmount: number;
  total: number;
  /** Deposit agreed for this booking (may differ from amount paid so far). */
  depositAmount?: number;
  amountPaid: number;
  currency: string;
  paymentTerms?: string;
  cancellationTerms?: string;
  notes?: string;
  /** Enrichment resolved by the query layer for display. */
  clientName?: string;
  eventName?: string;
}

/* -------------------------------- Contract ------------------------------- */

export type ContractStatus =
  | "draft"
  | "sent"
  | "pending-client"
  | "signed"
  | "expired"
  | "cancelled";

/** Legacy template grouping kept for older dummy data. */
export type ContractTemplate =
  | "performance"
  | "brand-collab"
  | "content-production"
  | "appearance"
  | "custom";

/** The guided contract types offered in the builder. */
export type ContractType =
  | "dj-booking"
  | "influencer-campaign"
  | "music-performance"
  | "talent-appearance"
  | "event-hosting"
  | "brand-collaboration"
  | "freelance-service";

/**
 * Rich, document-ready contract content. Optional so older dummy contracts
 * (which only carry a termsSummary) still satisfy the type.
 */
export interface ContractDetails {
  // Parties
  talentLegalName: string;
  clientLegalName: string;
  clientCompany?: string;
  clientEmail?: string;
  clientAddress?: string;
  // Job scope
  serviceDescription: string;
  deliverables?: string;
  eventName?: string;
  dateTime?: string;
  location?: string;
  // Fees & payment
  depositAmount?: number;
  balanceAmount?: number;
  paymentDeadline?: string;
  latePaymentTerms?: string;
  // Terms
  cancellationPolicy?: string;
  reschedulePolicy?: string;
  usageRights?: string;
  exclusivity?: string;
  travelAccommodation?: string;
  technicalRider?: string;
  forceMajeure?: string;
}

export interface Contract {
  id: string;
  title: string;
  clientId: string;
  bookingId?: string;
  status: ContractStatus;
  templateType: ContractTemplate;
  /** Guided contract type shown in lists and the builder. */
  contractType?: ContractType;
  fee: number;
  currency: string;
  /** Deposit required to confirm, as a fraction of fee (0.5 = 50%). */
  depositPercent: number;
  sentAt?: string;
  signedAt?: string;
  expiresAt?: string;
  /** Short summary of key terms for list views. */
  termsSummary?: string;
  /** Full document content for the detail / preview view. */
  details?: ContractDetails;
  createdAt: string;
  /** Enrichment resolved by the query layer for display. */
  clientName?: string;
}

/* -------------------------------- Booking -------------------------------- */

export type BookingStatus =
  | "inquiry"
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

/** Pipeline stage a booking moves through from first contact to close. */
export type BookingStage =
  | "inquiry"
  | "quoted"
  | "confirmed"
  | "contract-sent"
  | "deposit-paid"
  | "advance-completed"
  | "job-completed"
  | "balance-paid"
  | "closed";

export type EventType =
  | "club-night"
  | "festival"
  | "private-event"
  | "corporate"
  | "wedding"
  | "brand-activation"
  | "photo-shoot"
  | "video-shoot";

export interface Booking {
  id: string;
  title: string;
  clientId: string;
  status: BookingStatus;
  /** Pipeline stage shown in the bookings CRM. */
  stage: BookingStage;
  eventType: EventType;
  venueName: string;
  venueAddress?: string;
  /** ISO datetime strings. */
  startTime: string;
  endTime: string;
  fee: number;
  currency: string;
  depositAmount?: number;
  balanceAmount?: number;
  depositPaid: boolean;
  /** Cross-links to the documents generated for this booking. */
  invoiceId?: string;
  contractId?: string;
  advanceFormId?: string;
  notes?: string;
  createdAt: string;
  /** Enrichment resolved by the query layer for display. */
  clientName?: string;
  invoiceStatus?: string;
  contractStatus?: string;
  advanceStatus?: string;
}

/* ------------------------------ Advance Form ----------------------------- */

export type AdvanceFormStatus =
  | "draft"
  | "sent"
  | "completed"
  | "incomplete"
  | "expired";

/** Top-level builder choice that decides which field set is shown. */
export type AdvanceCategory = "event" | "campaign";

/** The named advance types shown in the list. */
export type AdvanceFormType =
  | "event-performance"
  | "music-performance"
  | "dj-booking"
  | "influencer-campaign"
  | "content-creator-campaign";

/** Logistics collected ahead of an event, performance, or booking. */
export interface EventAdvanceDetails {
  // Schedule & performance
  eventName?: string;
  eventDate?: string;
  callTime?: string;
  soundcheckTime?: string;
  performanceTime?: string;
  setDuration?: string;
  expectedCrowd?: string;
  dressCode?: string;
  performanceDirection?: string;
  // Artist / manager contact (your side)
  advancingPic?: string;
  advancingPicPhone?: string;
  advancingPicEmail?: string;
  // Client-side PIC (their side)
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  onSiteContact?: string; // day-of / on-site contact
  // Venue
  venueName?: string;
  clientCompany?: string;
  venueAddress?: string;
  parkingLoading?: string;
  // Technical rider (DJ / performer)
  djEquipment?: string;
  monitors?: string;
  technicalRider?: string;
  // Hospitality rider
  greenRoom?: string;
  mealArrangement?: string;
  guestList?: string;
  hospitalityRider?: string;
  // Accommodation
  hotelName?: string;
  hotelConfirmation?: string;
  hotelPhone?: string;
  hotelAddress?: string;
  roomType?: string;
  checkInDate?: string;
  checkInTime?: string;
  checkOutDate?: string;
  checkOutTime?: string;
  hotelDetails?: string;
  // Departure (outbound) flight
  outFlightNumber?: string;
  outDepartAirport?: string;
  outDepartDate?: string;
  outDepartTime?: string;
  outArriveAirport?: string;
  outArriveDate?: string;
  outArriveTime?: string;
  // Return (inbound) flight
  retFlightNumber?: string;
  retDepartAirport?: string;
  retDepartDate?: string;
  retDepartTime?: string;
  retArriveAirport?: string;
  retArriveDate?: string;
  retArriveTime?: string;
  // Ground transport
  groundTransport?: string;
  driverContact?: string;
  itinerary?: string;
  // Notes
  specialNotes?: string;
}

/** Details collected ahead of an influencer / creator campaign. */
export interface CampaignAdvanceDetails {
  brandName?: string;
  campaignTitle?: string;
  deliverables?: string;
  appearanceTime?: string;
  appearanceDuration?: string;
  postingDate?: string;
  contentFormat?: string;
  captionRequirement?: string;
  hashtags?: string;
  tagsMentions?: string;
  usageRights?: string;
  revisionRounds?: string;
  approvalDeadline?: string;
  draftLink?: string; // content draft submitted for brand approval
  draftApproved?: string; // "yes" once the client approves the draft
  postLink?: string; // final published post
  productDelivery?: string;
  paymentStatus?: string;
  specialNotes?: string;
}

/**
 * Client advancing: the briefing a talent collects from the client ahead of
 * an event, performance, or campaign so everyone shows up prepared.
 */
export interface AdvanceForm {
  id: string;
  title: string;
  type: AdvanceFormType;
  category: AdvanceCategory;
  clientId: string;
  bookingId?: string;
  /** Booking or campaign label shown in the list. */
  reference?: string;
  status: AdvanceFormStatus;
  /** Event or posting date used for list display. */
  date?: string;
  /** Whether a public share link has been generated. */
  shareEnabled: boolean;
  /** Whether the client has opened the shared link. */
  shareViewed?: boolean;
  /** Client confirmed their details; the share link is read-only until reopened. */
  clientLocked?: boolean;
  /** Per-section client status: { sectionSlug: "complete" | "skipped" }. */
  sectionStates?: Record<string, "complete" | "skipped"> | null;
  eventDetails?: EventAdvanceDetails;
  campaignDetails?: CampaignAdvanceDetails;
  createdAt: string;
  updatedAt: string;
  /** Enrichment resolved by the query layer for display. */
  clientName?: string;
}

/* ----------------------------- Document Template ------------------------- */

export type TemplateKind = "invoice" | "contract" | "advance-form";

export type TemplateStatus = "draft" | "published" | "archived";

export type TemplateFieldType =
  | "text"
  | "textarea"
  | "number"
  | "currency"
  | "date"
  | "time"
  | "select";

/**
 * A fill-in field the talent completes when generating a document from a
 * template (anything not auto-filled by merge tokens).
 */
export interface TemplateField {
  id: string;
  /** Token key used in the body, e.g. "overtimeRate" → {{fields.overtimeRate}} */
  key: string;
  label: string;
  type: TemplateFieldType;
  required: boolean;
  placeholder?: string;
  /** Only for type "select". */
  options?: string[];
}

/**
 * Admin-managed template for invoices, contracts, and advance forms.
 * The body is rich text with {{merge.tokens}} resolved at generation time.
 */
export interface DocumentTemplate {
  id: string;
  kind: TemplateKind;
  name: string;
  description: string;
  status: TemplateStatus;
  version: number;
  /** Default template offered for its kind. */
  isDefault: boolean;
  /** Minimum plan required to use it; null = available on all plans. */
  minPlanId: string | null;
  body: string;
  fields: TemplateField[];
  /** How many documents users have generated from this template. */
  usageCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

/* ----------------------------- Subscription ------------------------------ */

export type PlanInterval = "monthly" | "yearly";

/**
 * "cancelled" means the user has unsubscribed but keeps their paid plan
 * until User.currentPeriodEnd, after which they fall back to Free.
 */
export type SubscriptionStatus = "active" | "cancelled";

export interface PlanLimits {
  /** null = unlimited */
  clients: number | null;
  invoicesPerMonth: number | null;
  /** 0 = feature locked for this plan, null = unlimited. */
  bookingsPerMonth: number | null;
  contractsPerMonth: number | null;
  advanceFormsPerMonth: number | null;
  teamSeats: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
  features: string[];
  limits: PlanLimits;
  /** Access to contract legal review / advice features. */
  hasLegalReview: boolean;
  /** Marketing flag for the "most popular" treatment on pricing pages. */
  highlighted: boolean;
  cta: string;
}
