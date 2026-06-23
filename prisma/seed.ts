/**
 * Seeds a demo account from the existing dummy data so a fresh login lands on
 * a populated app. Run with: npx tsx prisma/seed.ts
 *
 * Demo login →  maya@djnova.live  /  demo1234
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import {
  advanceForms,
  bookings,
  clients,
  contracts,
  creditTransactions,
  currentUser,
  invoices,
} from "../data";

const prisma = new PrismaClient();

async function main() {
  // Idempotent: skip when the demo account already exists so production
  // redeploys don't wipe data. Use `npm run db:reset` to force a fresh seed.
  const existing = await prisma.user.findUnique({
    where: { email: currentUser.email },
  });
  if (existing) {
    console.log("Demo user already exists — skipping seed.");
    return;
  }

  const passwordHash = await bcrypt.hash("demo1234", 10);
  const userId = currentUser.id;

  await prisma.user.create({ data: { ...currentUser, passwordHash } });

  for (const c of clients) {
    await prisma.client.create({ data: { ...c, userId } });
  }
  for (const b of bookings) {
    await prisma.booking.create({ data: { ...b, userId } });
  }
  for (const i of invoices) {
    await prisma.invoice.create({
      data: {
        ...i,
        userId,
        job: i.job ? JSON.stringify(i.job) : null,
        lineItems: JSON.stringify(i.lineItems),
      },
    });
  }
  for (const c of contracts) {
    await prisma.contract.create({
      data: {
        ...c,
        userId,
        details: c.details ? JSON.stringify(c.details) : null,
      },
    });
  }
  for (const a of advanceForms) {
    await prisma.advanceForm.create({
      data: {
        ...a,
        userId,
        shareViewed: a.shareViewed ?? false,
        eventDetails: a.eventDetails ? JSON.stringify(a.eventDetails) : null,
        campaignDetails: a.campaignDetails
          ? JSON.stringify(a.campaignDetails)
          : null,
      },
    });
  }
  for (const t of creditTransactions) {
    await prisma.creditTransaction.create({
      data: {
        ...t,
        relatedDocument: t.relatedDocument
          ? JSON.stringify(t.relatedDocument)
          : null,
      },
    });
  }

  const counts = {
    clients: clients.length,
    bookings: bookings.length,
    invoices: invoices.length,
    contracts: contracts.length,
    advanceForms: advanceForms.length,
    creditTransactions: creditTransactions.length,
  };
  console.log("Seeded demo user", currentUser.email, counts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
