"use client";

import * as React from "react";

import { PrototypeSave } from "@/components/forms/prototype-save";
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
import { Textarea } from "@/components/ui/textarea";
import { clients, currentUser } from "@/data";
import { BOOKING_STAGE_LABELS, BOOKING_STAGES } from "@/lib/bookings";
import { formatCurrency } from "@/lib/format";
import type { BookingStage } from "@/types";

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

const clientItems: Record<string, string> = Object.fromEntries(
  clients.map((c) => [c.id, c.company ?? c.name])
);

export function BookingForm() {
  const [clientId, setClientId] = React.useState(clients[0]?.id ?? "");
  const [stage, setStage] = React.useState<BookingStage>("inquiry");
  const [fee, setFee] = React.useState("");
  const [deposit, setDeposit] = React.useState("");

  const balance = Math.max(num(fee) - num(deposit), 0);

  return (
    <div className="max-w-2xl space-y-5">
      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle>Booking details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Booking title" id="bk-title">
              <Input
                id="bk-title"
                placeholder="e.g. Echoplex Main Room — Saturday Residency"
              />
            </Field>
          </div>
          <Field label="Client">
            <Select
              items={clientItems}
              value={clientId}
              onValueChange={(v) => setClientId(v ?? clients[0]?.id ?? "")}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.company ?? c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Stage">
            <Select
              items={BOOKING_STAGE_LABELS}
              value={stage}
              onValueChange={(v) => setStage((v as BookingStage) ?? "inquiry")}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BOOKING_STAGES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {BOOKING_STAGE_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Date" id="bk-date">
            <Input id="bk-date" type="date" />
          </Field>
          <Field label="Time" id="bk-time">
            <Input id="bk-time" placeholder="e.g. 23:00 – 01:00" />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Location" id="bk-location">
              <Input id="bk-location" placeholder="Venue, city" />
            </Field>
          </div>
          <Field label="Fee" id="bk-fee">
            <Input
              id="bk-fee"
              type="number"
              min="0"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              placeholder="0.00"
            />
          </Field>
          <Field label="Deposit amount" id="bk-deposit" optional>
            <Input
              id="bk-deposit"
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
              value={formatCurrency(balance, currentUser.currency)}
              className="bg-muted/50"
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Notes" id="bk-notes" optional>
              <Textarea
                id="bk-notes"
                rows={3}
                placeholder="Set details, special requests, anything to remember."
              />
            </Field>
          </div>
        </CardContent>
      </Card>

      <PrototypeSave saveLabel="Add booking" cancelHref="/dashboard/bookings" />
    </div>
  );
}
