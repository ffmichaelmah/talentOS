"use client";

import * as React from "react";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { createClientAction } from "@/app/actions/clients";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { CLIENT_TYPE_LABELS, CLIENT_TYPES } from "@/lib/clients";
import type { ClientType } from "@/types";

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

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={buttonVariants()}
      disabled={pending}
    >
      {pending ? "Adding…" : "Add client"}
    </button>
  );
}

export function ClientForm() {
  const [type, setType] = React.useState<ClientType>("venue");
  const [state, action] = useActionState(createClientAction, undefined);

  return (
    <form action={action} className="max-w-2xl space-y-5">
      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle>Client details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {state?.error ? (
            <p
              role="alert"
              className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive sm:col-span-2"
            >
              {state.error}
            </p>
          ) : null}
          <Field label="Client name" id="cl-name">
            <Input id="cl-name" name="name" placeholder="e.g. Jordan Blake" required />
          </Field>
          <Field label="Company" id="cl-company" optional>
            <Input
              id="cl-company"
              name="company"
              placeholder="e.g. Echoplex Venue Group"
            />
          </Field>
          <Field label="Email" id="cl-email" optional>
            <Input
              id="cl-email"
              name="email"
              type="email"
              placeholder="name@company.com"
            />
          </Field>
          <Field label="Phone" id="cl-phone" optional>
            <Input id="cl-phone" name="phone" placeholder="+1 (555) 000-0000" />
          </Field>
          <Field label="Client type">
            <input type="hidden" name="type" value={type} />
            <Select
              items={CLIENT_TYPE_LABELS}
              value={type}
              onValueChange={(v) => setType((v as ClientType) ?? "venue")}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CLIENT_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {CLIENT_TYPE_LABELS[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Tax number" id="cl-tax" optional>
            <Input
              id="cl-tax"
              name="taxNumber"
              placeholder="EIN / VAT / registration no."
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Address" id="cl-address" optional>
              <Input
                id="cl-address"
                name="address"
                placeholder="Street, city, region, postal code"
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Notes" id="cl-notes" optional>
              <Textarea
                id="cl-notes"
                name="notes"
                rows={3}
                placeholder="Booking preferences, payment terms, anything worth remembering."
              />
            </Field>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton />
        <Button
          variant="ghost"
          nativeButton={false}
          render={<Link href="/dashboard/clients" />}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
