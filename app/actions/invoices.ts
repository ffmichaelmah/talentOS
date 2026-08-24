"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireUser } from "@/lib/auth";
import { ensureClientId } from "@/lib/create-helpers";
import { prisma } from "@/lib/db";
import { nextInvoiceNumber } from "@/lib/queries";

export type InvoiceFormState = { error?: string } | undefined;

/** Pages whose numbers depend on invoice state (client revenue derives from paid). */
function revalidateInvoiceSurfaces(id?: string) {
  revalidatePath("/dashboard/invoices");
  revalidatePath("/dashboard/clients");
  revalidatePath("/dashboard");
  if (id) revalidatePath(`/dashboard/invoices/${id}`);
}

/** Add a payment; the invoice flips to "paid" once the balance is cleared. */
export async function recordInvoicePaymentAction(
  id: string,
  amount: number
): Promise<{ ok: boolean }> {
  const user = await requireUser();
  const invoice = await prisma.invoice.findFirst({ where: { id, userId: user.id } });
  if (!invoice || !Number.isFinite(amount) || amount <= 0) return { ok: false };

  const amountPaid = Math.min(invoice.amountPaid + Math.round(amount), invoice.total);
  await prisma.invoice.update({
    where: { id },
    data: {
      amountPaid,
      status: amountPaid >= invoice.total ? "paid" : invoice.status,
    },
  });
  revalidateInvoiceSurfaces(id);
  return { ok: true };
}

/** Mark the whole balance settled. */
export async function markInvoicePaidAction(id: string): Promise<{ ok: boolean }> {
  const user = await requireUser();
  // Read first so status and amountPaid are written together — setting the
  // status alone would leave a "Paid" invoice showing an outstanding balance.
  const invoice = await prisma.invoice.findFirst({
    where: { id, userId: user.id },
  });
  if (!invoice) return { ok: false };

  await prisma.invoice.update({
    where: { id },
    data: { status: "paid", amountPaid: invoice.total },
  });
  revalidateInvoiceSurfaces(id);
  return { ok: true };
}

/** Copy an invoice as a fresh draft — handy for residencies / recurring gigs. */
export async function duplicateInvoiceAction(id: string): Promise<InvoiceFormState> {
  const user = await requireUser();
  const source = await prisma.invoice.findFirst({ where: { id, userId: user.id } });
  if (!source) return { error: "Invoice not found." };

  // Carry the original payment term (issue → due gap) forward from today so a
  // copy isn't born already overdue.
  const DAY_MS = 86_400_000;
  const now = new Date();
  const termDays = Math.max(
    Math.round(
      (new Date(source.dueDate).getTime() -
        new Date(source.issueDate).getTime()) /
        DAY_MS
    ) || 0,
    0
  );
  const data = {
    ...source,
    invoiceNumber: await nextInvoiceNumber(user.id),
    issueDate: now.toISOString().slice(0, 10),
    dueDate: new Date(now.getTime() + termDays * DAY_MS)
      .toISOString()
      .slice(0, 10),
    status: "draft",
    amountPaid: 0,
  };
  delete (data as { id?: string }).id; // let Prisma mint a fresh id
  const created = await prisma.invoice.create({ data });
  revalidateInvoiceSurfaces();
  redirect(`/dashboard/invoices/${created.id}`);
}

const schema = z.object({
  clientId: z.string().optional(),
  clientName: z.string().optional(),
  clientCompany: z.string().optional(),
  clientEmail: z.string().optional(),
  clientPhone: z.string().optional(),
  clientAddress: z.string().optional(),
  invoiceNumber: z.string().trim().min(1),
  issueDate: z.string().min(1),
  dueDate: z.string().optional(),
  currency: z.string().min(1),
  status: z.enum(["draft", "sent"]).default("draft"),
  serviceDescription: z.string().optional(),
  eventName: z.string().optional(),
  eventDate: z.string().optional(),
  location: z.string().optional(),
  fee: z.number().nonnegative(),
  deposit: z.number().nonnegative().optional(),
  taxPercent: z.number().nonnegative().optional(),
  discount: z.number().nonnegative().optional(),
  paymentTerms: z.string().optional(),
  cancellationTerms: z.string().optional(),
  notes: z.string().optional(),
});

export async function createInvoiceAction(
  input: unknown
): Promise<InvoiceFormState> {
  const user = await requireUser();
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: "Add an invoice number, a client, and a fee." };
  const d = parsed.data;

  const clientId = await ensureClientId(user.id, {
    clientId: d.clientId,
    name: d.clientName,
    company: d.clientCompany,
    email: d.clientEmail,
    phone: d.clientPhone,
    address: d.clientAddress,
  });

  const fee = Math.round(d.fee);
  const discount = Math.round(d.discount ?? 0);
  const taxRate = d.taxPercent ?? 0;
  const taxAmount = Math.round(((fee - discount) * taxRate) / 100);
  const total = fee - discount + taxAmount;

  const lineItems = [
    {
      id: "li-1",
      description: d.serviceDescription || d.eventName || "Performance fee",
      quantity: 1,
      unitPrice: fee,
      total: fee,
    },
  ];

  await prisma.invoice.create({
    data: {
      userId: user.id,
      clientId,
      invoiceNumber: d.invoiceNumber,
      status: d.status,
      issueDate: d.issueDate,
      dueDate: d.dueDate || d.issueDate,
      job: JSON.stringify({
        serviceDescription: d.serviceDescription || "",
        eventName: d.eventName || "",
        eventDate: d.eventDate || undefined,
        location: d.location || undefined,
      }),
      lineItems: JSON.stringify(lineItems),
      subtotal: fee,
      discountAmount: discount || null,
      taxRate,
      taxAmount,
      total,
      depositAmount: d.deposit ? Math.round(d.deposit) : null,
      amountPaid: 0,
      currency: d.currency,
      paymentTerms: d.paymentTerms || null,
      cancellationTerms: d.cancellationTerms || null,
      notes: d.notes || null,
    },
  });

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}
