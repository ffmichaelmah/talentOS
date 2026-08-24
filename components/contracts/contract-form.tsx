"use client";

import * as React from "react";

import { createContractAction } from "@/app/actions/contracts";
import { ContractActions } from "@/components/contracts/contract-actions";
import {
  ContractDocument,
  type ContractView,
} from "@/components/contracts/contract-document";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { Textarea } from "@/components/ui/textarea";
import {
  CONTRACT_REFERENCE_DISCLAIMER,
  CONTRACT_TYPE_LABELS,
  CONTRACT_TYPES,
  contractTypeLabel,
} from "@/lib/contracts";
import { formatCurrency } from "@/lib/format";
import type { Client, ContractType } from "@/types";

export interface ContractFormTalent {
  name: string;
  businessName?: string | null;
  email: string;
  currency: string;
}

const NO_CLIENT = "none";

function num(value: string): number {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

function Field({
  label,
  id,
  optional,
  children,
}: {
  label: string;
  id?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {optional ? (
          <span className="ml-1 text-xs font-normal text-muted-foreground">
            (optional)
          </span>
        ) : null}
      </Label>
      {children}
    </div>
  );
}

export function ContractForm({
  clients,
  talent,
  defaultClientId,
}: {
  clients: Client[];
  talent: ContractFormTalent;
  defaultClientId?: string;
}) {
  const initialClient = clients.find((c) => c.id === defaultClientId);

  // 1. Contract type
  const [contractType, setContractType] =
    React.useState<ContractType>("dj-booking");

  // 2. Parties (client preselected when arriving from a client's page)
  const [talentName, setTalentName] = React.useState(
    `${talent.name}${talent.businessName ? ` (${talent.businessName})` : ""}`
  );
  const [clientName, setClientName] = React.useState(initialClient?.name ?? "");
  const [clientCompany, setClientCompany] = React.useState(
    initialClient?.company ?? ""
  );
  const [clientEmail, setClientEmail] = React.useState(initialClient?.email ?? "");
  const [clientAddress, setClientAddress] = React.useState(
    initialClient?.location ?? ""
  );

  // 3. Job scope
  const [serviceDescription, setServiceDescription] = React.useState("");
  const [deliverables, setDeliverables] = React.useState("");
  const [eventName, setEventName] = React.useState("");
  const [dateTime, setDateTime] = React.useState("");
  const [location, setLocation] = React.useState("");

  // 4. Fees & payment
  const [fee, setFee] = React.useState("");
  const [deposit, setDeposit] = React.useState("");
  const [paymentDeadline, setPaymentDeadline] = React.useState("");
  const [latePaymentTerms, setLatePaymentTerms] = React.useState(
    "Late balances accrue 1.5% interest per month."
  );

  // 5. Terms
  const [cancellationPolicy, setCancellationPolicy] = React.useState(
    "Cancellation within 14 days of the event forfeits the deposit."
  );
  const [reschedulePolicy, setReschedulePolicy] = React.useState(
    "One reschedule permitted with 14+ days notice, subject to availability."
  );
  const [usageRights, setUsageRights] = React.useState("");
  const [exclusivity, setExclusivity] = React.useState("");
  const [travelAccommodation, setTravelAccommodation] = React.useState("");
  const [technicalRider, setTechnicalRider] = React.useState("");
  const [forceMajeure, setForceMajeure] = React.useState(
    "Neither party is liable for failure to perform due to events beyond reasonable control. Deposit is refunded if the event cannot proceed."
  );

  const currency = talent.currency;
  const feeAmount = num(fee);
  const depositAmount = num(deposit);
  const balanceAmount = Math.max(feeAmount - depositAmount, 0);

  function prefillClient(id: string | null) {
    const client =
      id && id !== NO_CLIENT ? clients.find((c) => c.id === id) : undefined;
    setSelectedClientId(client?.id ?? null);
    // Switching back to "New client" clears the fields — otherwise the
    // previous client's details would be saved as a brand-new duplicate.
    setClientName(client?.name ?? "");
    setClientCompany(client?.company ?? "");
    setClientEmail(client?.email ?? "");
    setClientAddress(client?.location ?? "");
  }

  const [selectedClientId, setSelectedClientId] = React.useState<string | null>(
    initialClient?.id ?? null
  );
  const [pending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);

  function save(status: "draft" | "sent") {
    setError(null);
    startTransition(async () => {
      const res = await createContractAction({
        clientId: selectedClientId ?? undefined,
        clientName,
        clientCompany,
        clientEmail,
        clientAddress,
        contractType,
        talentLegalName: talentName,
        serviceDescription,
        deliverables,
        eventName,
        dateTime,
        location,
        currency,
        fee: feeAmount,
        deposit: depositAmount,
        paymentDeadline,
        latePaymentTerms,
        cancellationPolicy,
        reschedulePolicy,
        usageRights,
        exclusivity,
        travelAccommodation,
        technicalRider,
        forceMajeure,
        status,
      });
      if (res?.error) setError(res.error);
    });
  }

  const clientItems: Record<string, string> = {
    [NO_CLIENT]: "New client",
    ...Object.fromEntries(clients.map((c) => [c.id, c.company ?? c.name])),
  };

  const view: ContractView = {
    title: eventName
      ? `${contractTypeLabel(contractType)} — ${eventName}`
      : contractTypeLabel(contractType),
    typeLabel: contractTypeLabel(contractType),
    status: "draft",
    talentLegalName: talentName,
    clientLegalName: clientName,
    clientCompany,
    clientEmail,
    clientAddress,
    serviceDescription,
    deliverables,
    eventName,
    dateTime,
    location,
    fee: feeAmount,
    depositAmount,
    balanceAmount,
    currency,
    paymentDeadline,
    latePaymentTerms,
    cancellationPolicy,
    reschedulePolicy,
    usageRights,
    exclusivity,
    travelAccommodation,
    technicalRider,
    forceMajeure,
  };

  return (
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-5">
        {/* 1. Agreement type */}
        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle>1 · Agreement type</CardTitle>
          </CardHeader>
          <CardContent>
            <Field label="Type of agreement">
              <Select
                items={CONTRACT_TYPE_LABELS}
                value={contractType}
                onValueChange={(v) =>
                  setContractType((v as ContractType) ?? "dj-booking")
                }
              >
                <SelectTrigger className="w-full sm:w-96">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTRACT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {CONTRACT_TYPE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </CardContent>
        </Card>

        {/* 2. Parties */}
        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle>2 · Parties</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Talent legal name" id="p-talent">
                <Input
                  id="p-talent"
                  value={talentName}
                  onChange={(e) => setTalentName(e.target.value)}
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Choose existing client" optional>
                <Select
                  items={clientItems}
                  defaultValue={initialClient?.id ?? NO_CLIENT}
                  onValueChange={(v) => prefillClient(v)}
                >
                  <SelectTrigger className="w-full sm:w-72">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(clientItems).map(([id, label]) => (
                      <SelectItem key={id} value={id}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Field label="Client legal name" id="p-client">
              <Input
                id="p-client"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </Field>
            <Field label="Client company" id="p-company" optional>
              <Input
                id="p-company"
                value={clientCompany}
                onChange={(e) => setClientCompany(e.target.value)}
              />
            </Field>
            <Field label="Client email" id="p-email">
              <Input
                id="p-email"
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
              />
            </Field>
            <Field label="Client address" id="p-address" optional>
              <Input
                id="p-address"
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
              />
            </Field>
          </CardContent>
        </Card>

        {/* 3. Job scope */}
        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle>3 · Job scope</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Service description" id="s-service">
                <Textarea
                  id="s-service"
                  rows={2}
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                  placeholder="What you're being booked to do."
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Deliverables" id="s-deliverables" optional>
                <Textarea
                  id="s-deliverables"
                  rows={2}
                  value={deliverables}
                  onChange={(e) => setDeliverables(e.target.value)}
                  placeholder="e.g. one 2h set, set list 48h ahead, 1 IG post"
                />
              </Field>
            </div>
            <Field label="Event / campaign name" id="s-event">
              <Input
                id="s-event"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
            </Field>
            <Field label="Date & time" id="s-datetime">
              <Input
                id="s-datetime"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                placeholder="e.g. 2026-07-11, 22:00–00:00"
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Location" id="s-location">
                <Input
                  id="s-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Venue, city"
                />
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* 4. Fees & payment */}
        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle>4 · Fees & payment</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <Field label="Total fee" id="fp-fee">
              <Input
                id="fp-fee"
                type="number"
                min="0"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                placeholder="0.00"
              />
            </Field>
            <Field label="Deposit amount" id="fp-deposit">
              <Input
                id="fp-deposit"
                type="number"
                min="0"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                placeholder="0.00"
              />
            </Field>
            <Field label="Balance (auto)">
              <Input
                readOnly
                value={formatCurrency(balanceAmount, currency)}
                className="bg-muted/50"
              />
            </Field>
            <div className="sm:col-span-3">
              <Field label="Payment deadline" id="fp-deadline">
                <Input
                  id="fp-deadline"
                  value={paymentDeadline}
                  onChange={(e) => setPaymentDeadline(e.target.value)}
                  placeholder="e.g. Balance due on or before event day"
                />
              </Field>
            </div>
            <div className="sm:col-span-3">
              <Field label="Late payment terms" id="fp-late">
                <Textarea
                  id="fp-late"
                  rows={2}
                  value={latePaymentTerms}
                  onChange={(e) => setLatePaymentTerms(e.target.value)}
                />
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* 5. Terms */}
        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle>5 · Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Cancellation policy" id="t-cancel">
              <Textarea
                id="t-cancel"
                rows={2}
                value={cancellationPolicy}
                onChange={(e) => setCancellationPolicy(e.target.value)}
              />
            </Field>
            <Field label="Reschedule policy" id="t-reschedule">
              <Textarea
                id="t-reschedule"
                rows={2}
                value={reschedulePolicy}
                onChange={(e) => setReschedulePolicy(e.target.value)}
              />
            </Field>
            <Field label="Usage rights" id="t-usage">
              <Textarea
                id="t-usage"
                rows={2}
                value={usageRights}
                onChange={(e) => setUsageRights(e.target.value)}
                placeholder="How the client may use photos, video, or content."
              />
            </Field>
            <Field label="Exclusivity" id="t-exclusivity" optional>
              <Textarea
                id="t-exclusivity"
                rows={2}
                value={exclusivity}
                onChange={(e) => setExclusivity(e.target.value)}
                placeholder="e.g. no competing brands within 30 days."
              />
            </Field>
            <Field label="Travel & accommodation" id="t-travel">
              <Textarea
                id="t-travel"
                rows={2}
                value={travelAccommodation}
                onChange={(e) => setTravelAccommodation(e.target.value)}
              />
            </Field>
            <Field label="Technical rider" id="t-rider" optional>
              <Textarea
                id="t-rider"
                rows={2}
                value={technicalRider}
                onChange={(e) => setTechnicalRider(e.target.value)}
                placeholder="Equipment provided / required."
              />
            </Field>
            <Field label="Force majeure clause" id="t-force">
              <Textarea
                id="t-force"
                rows={2}
                value={forceMajeure}
                onChange={(e) => setForceMajeure(e.target.value)}
              />
            </Field>
          </CardContent>
        </Card>

        {/* 6. Signature */}
        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle>6 · Signature</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div>
              <div className="flex h-16 items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground">
                Talent signature
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Signed digitally when the agreement is countersigned.
              </p>
            </div>
            <div>
              <div className="flex h-16 items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground">
                Client signature
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Date signed captured on the client&apos;s e-signature.
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="rounded-lg bg-muted/50 px-4 py-3 text-center text-xs text-muted-foreground">
          {CONTRACT_REFERENCE_DISCLAIMER}
        </p>
      </div>

      {/* Preview column */}
      <div className="space-y-4 xl:sticky xl:top-24">
        <Card className="overflow-hidden shadow-xs">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center justify-between">
              Preview
              <StatusBadge status="draft" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {view.typeLabel}
              </p>
              <p className="mt-0.5 font-semibold">{view.title}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-lg border border-border/60 p-3 text-xs">
              <div className="min-w-0">
                <p className="font-medium tracking-wide text-muted-foreground uppercase">
                  Talent
                </p>
                <p className="mt-1 truncate font-medium text-foreground">
                  {talentName || "Your name"}
                </p>
              </div>
              <div className="min-w-0">
                <p className="font-medium tracking-wide text-muted-foreground uppercase">
                  Client
                </p>
                <p className="mt-1 truncate font-medium text-foreground">
                  {clientCompany || clientName || "Client"}
                </p>
              </div>
            </div>

            {serviceDescription ? (
              <p className="line-clamp-3 text-muted-foreground">
                {serviceDescription}
              </p>
            ) : null}

            <div className="space-y-1.5">
              <div className="flex justify-between text-muted-foreground">
                <span>Total fee</span>
                <span className="tabular-nums">
                  {formatCurrency(feeAmount, currency)}
                </span>
              </div>
              {depositAmount > 0 ? (
                <div className="flex justify-between text-muted-foreground">
                  <span>Deposit</span>
                  <span className="tabular-nums">
                    {formatCurrency(depositAmount, currency)}
                  </span>
                </div>
              ) : null}
              <div className="flex justify-between border-t border-border/60 pt-1.5 font-medium">
                <span>Balance</span>
                <span className="tabular-nums">
                  {formatCurrency(balanceAmount, currency)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {error ? (
          <p role="alert" className="text-sm text-destructive">{error}</p>
        ) : null}
        <ContractActions
          preview={<ContractDocument view={view} />}
          onSubmit={save}
          pending={pending}
        />
      </div>
    </div>
  );
}
