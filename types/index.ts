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
  location: string;
  /** ISO 4217 code used as the default for documents, e.g. "USD". */
  currency: string;
  /** Current credit balance for pay-per-document usage. */
  creditBalance: number;
  /** References SubscriptionPlan.id */
  planId: string;
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
  lineItems: InvoiceLineItem[];
  subtotal: number;
  /** e.g. 0.08 for 8% */
  taxRate: number;
  taxAmount: number;
  total: number;
  amountPaid: number;
  currency: string;
  notes?: string;
}

/* -------------------------------- Contract ------------------------------- */

export type ContractStatus =
  | "draft"
  | "sent"
  | "signed"
  | "expired"
  | "declined";

export type ContractTemplate =
  | "performance"
  | "brand-collab"
  | "content-production"
  | "appearance"
  | "custom";

export interface Contract {
  id: string;
  title: string;
  clientId: string;
  bookingId?: string;
  status: ContractStatus;
  templateType: ContractTemplate;
  fee: number;
  currency: string;
  /** Deposit required to confirm, as a fraction of fee (0.5 = 50%). */
  depositPercent: number;
  sentAt?: string;
  signedAt?: string;
  expiresAt?: string;
  /** Short summary of key terms for list views. */
  termsSummary?: string;
  createdAt: string;
}

/* -------------------------------- Booking -------------------------------- */

export type BookingStatus =
  | "inquiry"
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

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
  eventType: EventType;
  venueName: string;
  venueAddress?: string;
  /** ISO datetime strings. */
  startTime: string;
  endTime: string;
  fee: number;
  currency: string;
  depositPaid: boolean;
  /** Cross-links to the documents generated for this booking. */
  invoiceId?: string;
  contractId?: string;
  advanceFormId?: string;
  notes?: string;
  createdAt: string;
}

/* ------------------------------ Advance Form ----------------------------- */

export type AdvanceFormStatus = "draft" | "sent" | "completed";

export interface OnSiteContact {
  name: string;
  role?: string;
  phone: string;
}

/**
 * Client advancing: the logistics sheet a talent sends ahead of an event
 * (timings, tech rider, hospitality, access) so show day runs smoothly.
 */
export interface AdvanceForm {
  id: string;
  bookingId: string;
  clientId: string;
  status: AdvanceFormStatus;
  eventDate: string;
  loadInTime?: string;
  soundCheckTime?: string;
  setTime: string;
  setLengthMinutes: number;
  stageDetails?: string;
  equipmentProvided: string[];
  equipmentRequired: string[];
  hospitalityNotes?: string;
  parkingDetails?: string;
  onSiteContact: OnSiteContact;
  updatedAt: string;
}

/* --------------------------- Credit Transaction -------------------------- */

export type CreditTransactionType = "purchase" | "spend" | "bonus" | "refund";

export interface CreditTransaction {
  id: string;
  userId: string;
  type: CreditTransactionType;
  /** Positive for credits in (purchase/bonus/refund), negative for spend. */
  amount: number;
  balanceAfter: number;
  description: string;
  /** What the credits were spent on, when applicable. */
  relatedDocument?: {
    kind: "invoice" | "contract" | "advance-form";
    id: string;
  };
  createdAt: string;
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

export interface PlanLimits {
  /** null = unlimited */
  clients: number | null;
  invoicesPerMonth: number | null;
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
  /** Credits included each month for document generation. */
  includedCredits: number;
  features: string[];
  limits: PlanLimits;
  /** Access to contract legal review / advice features. */
  hasLegalReview: boolean;
  /** Marketing flag for the "most popular" treatment on pricing pages. */
  highlighted: boolean;
  cta: string;
}
