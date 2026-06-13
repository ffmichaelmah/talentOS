import { StatusBadge } from "@/components/ui/status-badge";
import { currentUser } from "@/data";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  CONTRACT_REFERENCE_DISCLAIMER,
  clientFor,
  contractTypeLabel,
} from "@/lib/contracts";
import type { Contract } from "@/types";

export interface ContractView {
  title: string;
  typeLabel: string;
  status: string;
  talentLegalName?: string;
  clientLegalName?: string;
  clientCompany?: string;
  clientEmail?: string;
  clientAddress?: string;
  serviceDescription?: string;
  deliverables?: string;
  eventName?: string;
  dateTime?: string;
  location?: string;
  fee: number;
  depositAmount?: number;
  balanceAmount?: number;
  currency: string;
  paymentDeadline?: string;
  latePaymentTerms?: string;
  cancellationPolicy?: string;
  reschedulePolicy?: string;
  usageRights?: string;
  exclusivity?: string;
  travelAccommodation?: string;
  technicalRider?: string;
  forceMajeure?: string;
  signedAt?: string;
}

/** Normalize a stored contract (+ its client) into the document view model. */
export function contractToView(contract: Contract): ContractView {
  const client = clientFor(contract);
  const d = contract.details;
  return {
    title: contract.title,
    typeLabel: contractTypeLabel(contract.contractType),
    status: contract.status,
    talentLegalName:
      d?.talentLegalName ??
      `${currentUser.name}${currentUser.businessName ? ` (${currentUser.businessName})` : ""}`,
    clientLegalName: d?.clientLegalName ?? client?.name,
    clientCompany: d?.clientCompany ?? client?.company,
    clientEmail: d?.clientEmail ?? client?.email,
    clientAddress: d?.clientAddress ?? client?.location,
    serviceDescription: d?.serviceDescription ?? contract.termsSummary,
    deliverables: d?.deliverables,
    eventName: d?.eventName,
    dateTime: d?.dateTime,
    location: d?.location,
    fee: contract.fee,
    depositAmount: d?.depositAmount ?? contract.fee * contract.depositPercent,
    balanceAmount:
      d?.balanceAmount ?? contract.fee * (1 - contract.depositPercent),
    currency: contract.currency,
    paymentDeadline: d?.paymentDeadline,
    latePaymentTerms: d?.latePaymentTerms,
    cancellationPolicy: d?.cancellationPolicy,
    reschedulePolicy: d?.reschedulePolicy,
    usageRights: d?.usageRights,
    exclusivity: d?.exclusivity,
    travelAccommodation: d?.travelAccommodation,
    technicalRider: d?.technicalRider,
    forceMajeure: d?.forceMajeure,
    signedAt: contract.signedAt,
  };
}

function Term({ title, body }: { title: string; body?: string }) {
  if (!body) return null;
  return (
    <div>
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

/**
 * Clean, print-ready contract layout. Pure markup so it backs the detail
 * view, the builder's "Preview Contract" dialog, and the locked-state sample.
 */
export function ContractDocument({ view }: { view: ContractView }) {
  const terms = [
    { title: "1. Cancellation policy", body: view.cancellationPolicy },
    { title: "2. Reschedule policy", body: view.reschedulePolicy },
    { title: "3. Usage rights", body: view.usageRights },
    { title: "4. Exclusivity", body: view.exclusivity },
    { title: "5. Travel & accommodation", body: view.travelAccommodation },
    { title: "6. Technical rider", body: view.technicalRider },
    { title: "7. Force majeure", body: view.forceMajeure },
  ].filter((t) => t.body);

  return (
    <article className="mx-auto w-full max-w-3xl rounded-2xl border border-border/60 bg-card p-6 shadow-xs sm:p-10">
      {/* Header */}
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {view.typeLabel}
          </p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight">
            {view.title}
          </h1>
        </div>
        <StatusBadge status={view.status} />
      </header>

      {/* Parties */}
      <section className="grid gap-6 border-b border-border/60 py-6 sm:grid-cols-2">
        <div className="space-y-1 text-sm">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Talent
          </p>
          <p className="font-medium">{view.talentLegalName}</p>
          <p className="text-muted-foreground">{currentUser.email}</p>
        </div>
        <div className="space-y-1 text-sm">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Client
          </p>
          <p className="font-medium">
            {view.clientCompany ?? view.clientLegalName}
          </p>
          {view.clientCompany && view.clientLegalName ? (
            <p className="text-muted-foreground">Attn: {view.clientLegalName}</p>
          ) : null}
          <p className="text-muted-foreground">{view.clientAddress}</p>
          <p className="text-muted-foreground">{view.clientEmail}</p>
        </div>
      </section>

      {/* Job scope */}
      <section className="space-y-4 border-b border-border/60 py-6 text-sm">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Scope of work
        </p>
        {view.serviceDescription ? (
          <p>{view.serviceDescription}</p>
        ) : null}
        {view.deliverables ? (
          <div>
            <p className="font-medium">Deliverables</p>
            <p className="mt-1 text-muted-foreground">{view.deliverables}</p>
          </div>
        ) : null}
        <div className="grid gap-3 sm:grid-cols-3">
          {view.eventName ? (
            <div>
              <p className="text-xs text-muted-foreground">Event / campaign</p>
              <p className="font-medium">{view.eventName}</p>
            </div>
          ) : null}
          {view.dateTime ? (
            <div>
              <p className="text-xs text-muted-foreground">Date & time</p>
              <p className="font-medium">{view.dateTime}</p>
            </div>
          ) : null}
          {view.location ? (
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="font-medium">{view.location}</p>
            </div>
          ) : null}
        </div>
      </section>

      {/* Fees */}
      <section className="border-b border-border/60 py-6 text-sm">
        <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Fees & payment
        </p>
        <div className="ml-auto w-full max-w-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total fee</span>
            <span className="font-medium tabular-nums">
              {formatCurrency(view.fee, view.currency)}
            </span>
          </div>
          {view.depositAmount ? (
            <div className="flex justify-between text-muted-foreground">
              <span>Deposit</span>
              <span className="tabular-nums">
                {formatCurrency(view.depositAmount, view.currency)}
              </span>
            </div>
          ) : null}
          {view.balanceAmount ? (
            <div className="flex justify-between text-muted-foreground">
              <span>Balance</span>
              <span className="tabular-nums">
                {formatCurrency(view.balanceAmount, view.currency)}
              </span>
            </div>
          ) : null}
        </div>
        {view.paymentDeadline ? (
          <p className="mt-3 text-muted-foreground">
            <span className="font-medium text-foreground">
              Payment deadline:{" "}
            </span>
            {view.paymentDeadline}
          </p>
        ) : null}
        {view.latePaymentTerms ? (
          <p className="mt-1 text-muted-foreground">
            <span className="font-medium text-foreground">Late payment: </span>
            {view.latePaymentTerms}
          </p>
        ) : null}
      </section>

      {/* Terms */}
      {terms.length > 0 ? (
        <section className="space-y-4 border-b border-border/60 py-6">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Terms & conditions
          </p>
          {terms.map((t) => (
            <Term key={t.title} title={t.title} body={t.body} />
          ))}
        </section>
      ) : null}

      {/* Signatures */}
      <section className="grid gap-8 py-8 sm:grid-cols-2">
        <div>
          <div className="h-12 border-b border-foreground/30" />
          <p className="mt-2 text-sm font-medium">Talent signature</p>
          <p className="text-xs text-muted-foreground">
            {view.talentLegalName}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Date: {view.signedAt ? formatDate(view.signedAt) : "____________"}
          </p>
        </div>
        <div>
          <div className="h-12 border-b border-foreground/30" />
          <p className="mt-2 text-sm font-medium">Client signature</p>
          <p className="text-xs text-muted-foreground">
            {view.clientLegalName ?? "Client"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Date: {view.signedAt ? formatDate(view.signedAt) : "____________"}
          </p>
        </div>
      </section>

      <footer className="rounded-lg bg-muted/50 px-4 py-3 text-center text-xs text-muted-foreground">
        {CONTRACT_REFERENCE_DISCLAIMER}
      </footer>
    </article>
  );
}
