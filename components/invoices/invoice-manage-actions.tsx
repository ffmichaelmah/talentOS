"use client";

import * as React from "react";
import { BadgeCheck, Check, Copy } from "lucide-react";

import {
  duplicateInvoiceAction,
  markInvoicePaidAction,
  recordInvoicePaymentAction,
} from "@/app/actions/invoices";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/format";

export function InvoiceManageActions({
  id,
  balance,
  currency,
  paid,
}: {
  id: string;
  balance: number;
  currency: string;
  paid: boolean;
}) {
  const [pending, startTransition] = React.useTransition();
  const [payOpen, setPayOpen] = React.useState(false);
  const [amount, setAmount] = React.useState(String(balance || ""));

  function recordPayment() {
    startTransition(async () => {
      await recordInvoicePaymentAction(id, parseFloat(amount) || 0);
      setPayOpen(false);
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {paid ? (
        <span className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
          <BadgeCheck className="size-4" /> Paid
        </span>
      ) : (
        <>
          <Dialog open={payOpen} onOpenChange={setPayOpen}>
            <DialogTrigger render={<Button variant="outline" />}>
              Record payment
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Record a payment</DialogTitle>
                <DialogDescription>
                  Balance due: {formatCurrency(balance, currency)}. Enter what
                  the client paid — the invoice marks itself paid once the
                  balance is cleared.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <Label htmlFor="pay-amount">Amount</Label>
                <Input
                  id="pay-amount"
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
                <Button onClick={recordPayment} disabled={pending}>
                  {pending ? "Saving…" : "Record payment"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button
            disabled={pending}
            onClick={() => startTransition(() => markInvoicePaidAction(id).then(() => {}))}
          >
            <Check className="size-4" />
            Mark as paid
          </Button>
        </>
      )}
      <Button
        variant="outline"
        disabled={pending}
        onClick={() => startTransition(() => duplicateInvoiceAction(id).then(() => {}))}
      >
        <Copy className="size-4" />
        Duplicate
      </Button>
    </div>
  );
}
