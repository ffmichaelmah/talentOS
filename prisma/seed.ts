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
  currentUser,
  invoices,
} from "../data";

const prisma = new PrismaClient();

/** Idempotent: ensure the demo account shows the referral + ambassador program.
 *  Safe to run on every redeploy (updates in place). */
async function ensureReferralDemo(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { referralCode: currentUser.referralCode, isAmbassador: true },
  });
  const referees = [
    { email: "referral.dana@example.com", name: "Dana Cole", planId: "plan-pro" },
    { email: "referral.rio@example.com", name: "Rio Santos", planId: "plan-standard" },
    { email: "referral.sam@example.com", name: "Sam Idris", planId: "plan-free" },
  ];
  const passwordHash = await bcrypt.hash("referral-demo", 10);
  for (const r of referees) {
    await prisma.user.upsert({
      where: { email: r.email },
      update: { referredById: userId, planId: r.planId },
      create: {
        email: r.email,
        passwordHash,
        name: r.name,
        displayName: r.name,
        location: "",
        currency: "USD",
        planId: r.planId,
        referredById: userId,
        createdAt: new Date().toISOString(),
      },
    });
  }
}

async function main() {
  // Idempotent: skip re-seeding data when the demo account exists so production
  // redeploys don't wipe data, but always refresh the referral demo in place.
  const existing = await prisma.user.findUnique({
    where: { email: currentUser.email },
  });
  if (existing) {
    await ensureReferralDemo(existing.id);
    console.log("Demo user already exists — refreshed referral demo.");
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
  await ensureReferralDemo(userId);
  const counts = {
    clients: clients.length,
    bookings: bookings.length,
    invoices: invoices.length,
    contracts: contracts.length,
    advanceForms: advanceForms.length,
  };
  console.log("Seeded demo user", currentUser.email, counts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
