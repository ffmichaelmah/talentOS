"use client";

import * as React from "react";

import { InvoiceActions } from "@/components/invoices/invoice-actions";
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
import { formatCurrency } from "@/lib/format";
import type { Client } from "@/types";

export interface InvoiceTalent {
  businessName?: string | null;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  paymentDetails?: string | null;
  currency: string;
}

const currencies = ["USD", "EUR", "GBP", "MYR", "SGD", "AUD"] as const;

const statusLabels: Record<string, string> = {
  draft: "Draft",
  sent: "Sent",
};

const NO_CLIENT = "none";

function num(value: string): number {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

function Field({
  label,
  id,
  children,
}: {
  label: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

export function InvoiceForm({
  clients,
  defaultNumber,
  talent,
}: {
  clients: Client[];
  defaultNumber: string;
  talent: InvoiceTalent;
}) {
  // 1. Talent details
  const [talentName, setTalentName] = React.useState(
    talent.businessName ?? talent.name
  );
  const [talentEmail, setTalentEmail] = React.useState(talent.email);
  const [talentPhone, setTalentPhone] = React.useState(talent.phone ?? "");
  const [talentAddress, setTalentAddress] = React.useState(talent.address ?? "");
  const [paymentDetails, setPaymentDetails] = React.useState(
    talent.paymentDetails ?? ""
  );

  // 2. Client details
  const [clientName, setClientName] = React.useState("");
  const [clientCompany, setClientCompany] = React.useState("");
  const [clientEmail, setClientEmail] = React.useState("");
  const [clientPhone, setClientPhone] = React.useState("");
  const [clientAddress, setClientAddress] = React.useState("");

  // 3. Invoice details
  const [invoiceNumber, setInvoiceNumber] = React.useState(defaultNumber);
  const [invoiceDate, setInvoiceDate] = React.useState(
    new Date().toISOString().slice(0, 10)
  );
  const [dueDate, setDueDate] = React.useState("");
  const [currency, setCurrency] = React.useState(talent.currency);
  const [status, setStatus] = React.useState("draft");

  // 4. Job details
  const [serviceDescription, setServiceDescription] = React.useState("");
  const [eventName, setEventName] = React.useState("");
  const [eventDate, setEventDate] = React.useState("");
  const [eventLocation, setEventLocation] = React.useState("");

  // 5. Fees
  const [fee, setFee] = React.useState("");
  const [deposit, setDeposit] = React.useState("");
  const [taxPercent, setTaxPercent] = React.useState("");
  const [discount, setDiscount] = React.useState("");

  // 6. Terms
  const [paymentTerms, setPaymentTerms] = React.useState(
    "50% deposit to confirm the booking; balance due on or before event day."
  );
  const [cancellationTerms, setCancellationTerms] = React.useState(
    "Cancellation within 14 days of the event forfeits the deposit."
  );
  const [notes, setNotes] = React.useState("");

  const clientItems: Record<string, string> = {
    [NO_CLIENT]: "New client",
    ...Object.fromEntries(
      clients.map((c) => [c.id, c.company ?? c.name])
    ),
  };

  function prefillClient(id: string | null) {
    const client = clients.find((c) => c.id === id);
    if (!client) return;
    setClientName(client.name);
    setClientCompany(client.company ?? "");
    setClientEmail(client.email);
    setClientPhone(client.phone ?? "");
    setClientAddress(client.location ?? "");
  }

  const feeAmount = num(fee);
  const discountAmount = num(discount);
  const taxAmount = ((feeAmount - discountAmount) * num(taxPercent)) / 100;
  const total = feeAmount - discountAmount + taxAmount;
  const depositAmount = num(deposit);
  const balance = total - depositAmount;

  return (
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      {/* Form column */}
      <div className="space-y-5">
        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle>1 · Talent details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Talent / company name" id="t-name">
              <Input
                id="t-name"
                value={talentName}
                onChange={(e) => setTalentName(e.target.value)}
              />
            </Field>
            <Field label="Email" id="t-email">
              <Input
                id="t-email"
                type="email"
                value={talentEmail}
                onChange={(e) => setTalentEmail(e.target.value)}
              />
            </Field>
            <Field label="Phone" id="t-phone">
              <Input
                id="t-phone"
                value={talentPhone}
                onChange={(e) => setTalentPhone(e.target.value)}
              />
            </Field>
            <Field label="Address" id="t-address">
              <Input
                id="t-address"
                value={talentAddress}
                onChange={(e) => setTalentAddress(e.target.value)}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Payment details" id="t-payment">
                <Textarea
                  id="t-payment"
                  rows={2}
                  value={paymentDetails}
                  onChange={(e) => setPaymentDetails(e.target.value)}
                  placeholder="Bank transfer details, PayPal, payment link…"
                />
              </Field>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle>2 · Client details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Choose existing client (optional)">
                <Select
                  items={clientItems}
                  defaultValue={NO_CLIENT}
                  onValueChange={(value) => prefillClient(value)}
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
            <Field label="Client name" id="c-name">
              <Input
                id="c-name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </Field>
            <Field label="Client company" id="c-company">
              <Input
                id="c-company"
                value={clientCompany}
                onChange={(e) => setClientCompany(e.target.value)}
              />
            </Field>
            <Field label="Client email" id="c-email">
              <Input
                id="c-email"
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
              />
            </Field>
            <Field label="Client phone" id="c-phone">
              <Input
                id="c-phone"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Client address" id="c-address">
                <Input
                  id="c-address"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                />
              </Field>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle>3 · Invoice details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Invoice number" id="i-number">
              <Input
                id="i-number"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="font-mono"
              />
            </Field>
            <Field label="Invoice date" id="i-date">
              <Input
                id="i-date"
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
              />
            </Field>
            <Field label="Due date" id="i-due">
              <Input
                id="i-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </Field>
            <Field label="Currency">
              <Select
                items={Object.fromEntries(currencies.map((c) => [c, c]))}
                value={currency}
                onValueChange={(v) => setCurrency(v ?? "USD")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Status">
              <Select
                items={statusLabels}
                value={status}
                onValueChange={(v) => setStatus(v ?? "draft")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle>4 · Job details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Service description" id="j-service">
                <Textarea
                  id="j-service"
                  rows={2}
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                  placeholder="e.g. DJ performance — 2h closing set with MC"
                />
              </Field>
            </div>
            <Field label="Event / campaign name" id="j-event">
              <Input
                id="j-event"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="e.g. Lumen Summer Launch"
              />
            </Field>
            <Field label="Event date" id="j-date">
              <Input
                id="j-date"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Location" id="j-location">
                <Input
                  id="j-location"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="Venue, city"
                />
              </Field>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle>5 · Fees</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Fee amount" id="f-fee">
              <Input
                id="f-fee"
                type="number"
                min="0"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                placeholder="0.00"
              />
            </Field>
            <Field label="Deposit amount" id="f-deposit">
              <Input
                id="f-deposit"
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
                value={formatCurrency(balance, currency)}
                className="bg-muted/50"
              />
            </Field>
            <Field label="Tax % (optional)" id="f-tax">
              <Input
                id="f-tax"
                type="number"
                min="0"
                value={taxPercent}
                onChange={(e) => setTaxPercent(e.target.value)}
                placeholder="0"
              />
            </Field>
            <Field label="Discount (optional)" id="f-discount">
              <Input
                id="f-discount"
                type="number"
                min="0"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="0.00"
              />
            </Field>
            <Field label="Total (auto)">
              <Input
                readOnly
                value={formatCurrency(total, currency)}
                className="bg-muted/50 font-medium"
              />
            </Field>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle>6 · Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Payment terms" id="te-payment">
              <Textarea
                id="te-payment"
                rows={2}
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
              />
            </Field>
            <Field label="Cancellation terms" id="te-cancel">
              <Textarea
                id="te-cancel"
                rows={2}
                value={cancellationTerms}
                onChange={(e) => setCancellationTerms(e.target.value)}
              />
            </Field>
            <Field label="Notes" id="te-notes">
              <Textarea
                id="te-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Anything else the client should know."
              />
            </Field>
          </CardContent>
        </Card>
      </div>

      {/* Preview column */}
      <div className="space-y-4 xl:sticky xl:top-24">
        <Card className="overflow-hidden shadow-xs">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center justify-between">
              Preview
              <StatusBadge status={status} />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-base font-semibold tracking-tight">
                  INVOICE
                </p>
                <p className="font-mono text-xs text-muted-foreground">
                  {invoiceNumber || "INV-…"}
                </p>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <p>{invoiceDate || "Invoice date"}</p>
                <p>Due {dueDate || "—"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-lg border border-border/60 p-3 text-xs">
              <div className="min-w-0">
                <p className="font-medium tracking-wide text-muted-foreground uppercase">
                  From
                </p>
                <p className="mt-1 truncate font-medium text-foreground">
                  {talentName || "Your name"}
                </p>
                <p className="truncate text-muted-foreground">{talentEmail}</p>
              </div>
              <div className="min-w-0">
                <p className="font-medium tracking-wide text-muted-foreground uppercase">
                  Bill to
                </p>
                <p className="mt-1 truncate font-medium text-foreground">
                  {clientCompany || clientName || "Client"}
                </p>
                <p className="truncate text-muted-foreground">{clientEmail}</p>
              </div>
            </div>

            {eventName || serviceDescription ? (
              <div className="rounded-lg border border-border/60 p-3 text-xs">
                <p className="font-medium text-foreground">
                  {eventName || "Event"}
                </p>
                <p className="mt-0.5 line-clamp-2 text-muted-foreground">
                  {serviceDescription}
                </p>
                <p className="mt-0.5 text-muted-foreground">
                  {eventDate}
                  {eventDate && eventLocation ? " · " : ""}
                  {eventLocation}
                </p>
              </div>
            ) : null}

            <div className="space-y-1.5">
              <div className="flex justify-between text-muted-foreground">
                <span>Fee</span>
                <span className="tabular-nums">
                  {formatCurrency(feeAmount, currency)}
                </span>
              </div>
              {discountAmount > 0 ? (
                <div className="flex justify-between text-muted-foreground">
                  <span>Discount</span>
                  <span className="tabular-nums">
                    −{formatCurrency(discountAmount, currency)}
                  </span>
                </div>
              ) : null}
              {taxAmount > 0 ? (
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax ({taxPercent}%)</span>
                  <span className="tabular-nums">
                    {formatCurrency(taxAmount, currency)}
                  </span>
                </div>
              ) : null}
              <div className="flex justify-between border-t border-border/60 pt-1.5 font-medium">
                <span>Total</span>
                <span className="tabular-nums">
                  {formatCurrency(total, currency)}
                </span>
              </div>
              {depositAmount > 0 ? (
                <div className="flex justify-between text-muted-foreground">
                  <span>Deposit</span>
                  <span className="tabular-nums">
                    −{formatCurrency(depositAmount, currency)}
                  </span>
                </div>
              ) : null}
              <div className="flex justify-between rounded-md bg-primary/5 px-2 py-1.5 font-semibold text-primary">
                <span>Balance due</span>
                <span className="tabular-nums">
                  {formatCurrency(balance, currency)}
                </span>
              </div>
            </div>

            {paymentTerms ? (
              <p className="line-clamp-2 border-t border-border/60 pt-3 text-xs text-muted-foreground">
                {paymentTerms}
              </p>
            ) : null}
          </CardContent>
        </Card>

        <InvoiceActions />
      </div>
    </div>
  );
}
