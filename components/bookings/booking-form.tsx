"use client";

import * as React from "react";
import Link from "next/link";

import { createBookingAction } from "@/app/actions/bookings";
import { Button } from "@/components/ui/button";
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
import { BOOKING_STAGE_LABELS, BOOKING_STAGES } from "@/lib/bookings";
import { formatCurrency } from "@/lib/format";
import type { Client } from "@/types";
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

export function BookingForm({
  clients,
  currency,
  defaultClientId,
}: {
  clients: Client[];
  currency: string;
  defaultClientId?: string;
}) {
  const clientItems: Record<string, string> = Object.fromEntries(
    clients.map((c) => [c.id, c.company ?? c.name])
  );
  const [clientId, setClientId] = React.useState(
    defaultClientId ?? clients[0]?.id ?? ""
  );
  const [stage, setStage] = React.useState<BookingStage>("inquiry");
  const [title, setTitle] = React.useState("");
  const [date, setDate] = React.useState("");
  const [time, setTime] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [fee, setFee] = React.useState("");
  const [deposit, setDeposit] = React.useState("");
  const [pending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);

  const balance = Math.max(num(fee) - num(deposit), 0);

  function save() {
    setError(null);
    startTransition(async () => {
      const res = await createBookingAction({
        clientId,
        title,
        stage,
        date,
        time,
        location,
        notes,
        fee: num(fee),
        deposit: num(deposit),
      });
      if (res?.error) setError(res.error);
    });
  }

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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
            <Input
              id="bk-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>
          <Field label="Time" id="bk-time">
            <Input
              id="bk-time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g. 23:00 – 01:00"
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Location" id="bk-location">
              <Input
                id="bk-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Venue, city"
              />
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
              value={formatCurrency(balance, currency)}
              className="bg-muted/50"
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Notes" id="bk-notes" optional>
              <Textarea
                id="bk-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Set details, special requests, anything to remember."
              />
            </Field>
          </div>
        </CardContent>
      </Card>

      {error ? (
        <p role="alert" className="text-sm text-destructive">{error}</p>
      ) : null}
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={save} disabled={pending || !title.trim() || !clientId}>
          {pending ? "Adding…" : "Add booking"}
        </Button>
        <Button variant="ghost" nativeButton={false} render={<Link href="/dashboard/bookings" />}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
