import { StatusBadge } from "@/components/ui/status-badge";
import { currentUser } from "@/data";
import { formatCurrency, formatDate } from "@/lib/format";
import { balanceFor, clientFor } from "@/lib/invoices";
import type { Invoice } from "@/types";

/**
 * Clean, print-ready invoice layout. Pure markup so the same component can
 * back the on-screen detail view and (later) the real PDF export.
 */
export function InvoiceDocument({ invoice }: { invoice: Invoice }) {
  const client = clientFor(invoice);
  const balance = balanceFor(invoice);

  return (
    <article className="mx-auto w-full max-w-3xl rounded-2xl border border-border/60 bg-card p-6 shadow-xs sm:p-10">
      {/* Header */}
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <p className="text-2xl font-semibold tracking-tight">INVOICE</p>
          <p className="mt-1 font-mono text-sm text-muted-foreground">
            {invoice.invoiceNumber}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold tracking-tight">
            {currentUser.displayName}
          </p>
          <p className="text-sm text-muted-foreground">
            {currentUser.businessName}
          </p>
          <div className="mt-2">
            <StatusBadge status={invoice.status} />
          </div>
        </div>
      </header>

      {/* Parties + dates */}
      <section className="grid gap-6 border-b border-border/60 py-6 sm:grid-cols-3">
        <div className="space-y-1 text-sm">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            From
          </p>
          <p className="font-medium">{currentUser.businessName}</p>
          <p className="text-muted-foreground">{currentUser.name}</p>
          <p className="text-muted-foreground">{currentUser.address}</p>
          <p className="text-muted-foreground">{currentUser.email}</p>
          <p className="text-muted-foreground">{currentUser.phone}</p>
        </div>
        <div className="space-y-1 text-sm">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Bill to
          </p>
          <p className="font-medium">{client?.company ?? client?.name}</p>
          {client?.company ? (
            <p className="text-muted-foreground">Attn: {client.name}</p>
          ) : null}
          <p className="text-muted-foreground">{client?.location}</p>
          <p className="text-muted-foreground">{client?.email}</p>
          <p className="text-muted-foreground">{client?.phone}</p>
        </div>
        <div className="space-y-3 text-sm sm:text-right">
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Invoice date
            </p>
            <p className="font-medium">{formatDate(invoice.issueDate)}</p>
          </div>
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Due date
            </p>
            <p className="font-medium">{formatDate(invoice.dueDate)}</p>
          </div>
        </div>
      </section>

      {/* Job */}
      {invoice.job ? (
        <section className="border-b border-border/60 py-6 text-sm">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Event / campaign
          </p>
          <p className="mt-1 font-medium">{invoice.job.eventName}</p>
          <p className="mt-0.5 text-muted-foreground">
            {invoice.job.serviceDescription}
          </p>
          <p className="mt-0.5 text-muted-foreground">
            {invoice.job.eventDate ? formatDate(invoice.job.eventDate) : null}
            {invoice.job.eventDate && invoice.job.location ? " · " : null}
            {invoice.job.location}
          </p>
        </section>
      ) : null}

      {/* Line items */}
      <section className="py-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase">
              <th className="pb-2 font-medium">Description</th>
              <th className="pb-2 text-right font-medium">Qty</th>
              <th className="pb-2 text-right font-medium">Rate</th>
              <th className="pb-2 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems.map((item) => (
              <tr key={item.id} className="border-b border-border/40">
                <td className="py-3 pr-4">{item.description}</td>
                <td className="py-3 text-right tabular-nums">
                  {item.quantity}
                </td>
                <td className="py-3 text-right tabular-nums">
                  {formatCurrency(item.unitPrice, invoice.currency)}
                </td>
                <td className="py-3 text-right font-medium tabular-nums">
                  {formatCurrency(item.total, invoice.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="mt-4 ml-auto w-full max-w-xs space-y-1.5 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="tabular-nums">
              {formatCurrency(invoice.subtotal, invoice.currency)}
            </span>
          </div>
          {invoice.discountAmount ? (
            <div className="flex justify-between text-muted-foreground">
              <span>Discount</span>
              <span className="tabular-nums">
                −{formatCurrency(invoice.discountAmount, invoice.currency)}
              </span>
            </div>
          ) : null}
          {invoice.taxAmount > 0 ? (
            <div className="flex justify-between text-muted-foreground">
              <span>Tax ({Math.round(invoice.taxRate * 100)}%)</span>
              <span className="tabular-nums">
                {formatCurrency(invoice.taxAmount, invoice.currency)}
              </span>
            </div>
          ) : null}
          <div className="flex justify-between border-t border-border/60 pt-2 font-medium">
            <span>Total</span>
            <span className="tabular-nums">
              {formatCurrency(invoice.total, invoice.currency)}
            </span>
          </div>
          {invoice.depositAmount ? (
            <div className="flex justify-between text-muted-foreground">
              <span>Deposit</span>
              <span className="tabular-nums">
                {formatCurrency(invoice.depositAmount, invoice.currency)}
              </span>
            </div>
          ) : null}
          <div className="flex justify-between text-muted-foreground">
            <span>Paid to date</span>
            <span className="tabular-nums">
              −{formatCurrency(invoice.amountPaid, invoice.currency)}
            </span>
          </div>
          <div className="flex justify-between rounded-lg bg-primary/5 px-3 py-2 font-semibold text-primary">
            <span>Balance due</span>
            <span className="tabular-nums">
              {formatCurrency(balance, invoice.currency)}
            </span>
          </div>
        </div>
      </section>

      {/* Payment details + terms */}
      <section className="space-y-4 border-t border-border/60 pt-6 text-sm">
        {currentUser.paymentDetails ? (
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Payment details
            </p>
            <p className="mt-1 text-muted-foreground">
              {currentUser.paymentDetails}
            </p>
          </div>
        ) : null}
        {invoice.paymentTerms ? (
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Payment terms
            </p>
            <p className="mt-1 text-muted-foreground">{invoice.paymentTerms}</p>
          </div>
        ) : null}
        {invoice.cancellationTerms ? (
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Cancellation terms
            </p>
            <p className="mt-1 text-muted-foreground">
              {invoice.cancellationTerms}
            </p>
          </div>
        ) : null}
        {invoice.notes ? (
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Notes
            </p>
            <p className="mt-1 text-muted-foreground">{invoice.notes}</p>
          </div>
        ) : null}
      </section>

      <footer className="mt-8 border-t border-border/60 pt-4 text-center text-xs text-muted-foreground">
        Thank you for the booking — {currentUser.displayName} ·{" "}
        {currentUser.email}
      </footer>
    </article>
  );
}
