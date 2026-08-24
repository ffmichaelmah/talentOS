/**
 * Seeds a demo account from the existing dummy data so a fresh login lands on
 * a populated app. Run with: npx tsx prisma/seed.ts
 *
 * Demo login →  maya@djnova.live  /  demo1234
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import {
  advanceForms as rawAdvanceForms,
  bookings as rawBookings,
  clients as rawClients,
  contracts as rawContracts,
  currentUser as rawCurrentUser,
  invoices as rawInvoices,
} from "../data";
import { daysBetween, shiftDemoDates } from "../lib/demo-dates";

const prisma = new PrismaClient();

// Slide the whole demo onto the current date so the dashboard always shows
// upcoming gigs and this-month revenue, however long after authoring it runs.
const currentUser = shiftDemoDates(rawCurrentUser);
const clients = shiftDemoDates(rawClients);
const bookings = shiftDemoDates(rawBookings);
const invoices = shiftDemoDates(rawInvoices);
const contracts = shiftDemoDates(rawContracts);
const advanceForms = shiftDemoDates(rawAdvanceForms);

/**
 * Idempotent: re-slide the seeded demo rows onto today's dates so an existing
 * demo account doesn't drift into "no upcoming gigs, $0 this month" over time.
 * Only touches rows that came from the dummy data (matched by their seed ids).
 */
async function refreshDemoDates(userId: string) {
  for (const b of bookings) {
    await prisma.booking.updateMany({
      where: { id: b.id, userId },
      data: { startTime: b.startTime, endTime: b.endTime, createdAt: b.createdAt },
    });
  }
  for (const i of invoices) {
    await prisma.invoice.updateMany({
      where: { id: i.id, userId },
      data: { issueDate: i.issueDate, dueDate: i.dueDate },
    });
  }
  for (const c of contracts) {
    // sentAt / signedAt are set by the artist ("Mark as sent/signed"), so they
    // are left alone — only the authored createdAt is re-anchored.
    await prisma.contract.updateMany({
      where: { id: c.id, userId },
      data: { createdAt: c.createdAt },
    });
  }
  for (const a of advanceForms) {
    const stored = await prisma.advanceForm.findFirst({
      where: { id: a.id, userId },
    });
    if (!stored) continue;
    /*
     * The details JSON may contain what the client filled in via the share
     * link, so it is never replaced from the dummy data. Instead its dates are
     * nudged by the same distance this row's own date is moving — which leaves
     * client-entered text untouched and is idempotent (the delta is 0 once the
     * row is already current).
     */
    const delta = daysBetween(stored.date, a.date);
    const shiftStored = (json: string | null) =>
      json ? JSON.stringify(shiftDemoDates(JSON.parse(json), delta)) : null;
    await prisma.advanceForm.update({
      where: { id: stored.id },
      data: {
        date: a.date ?? null,
        eventDetails: shiftStored(stored.eventDetails),
        campaignDetails: shiftStored(stored.campaignDetails),
      },
    });
  }
}

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
    await refreshDemoDates(existing.id);
    await ensureReferralDemo(existing.id);
    console.log("Demo user already exists — refreshed demo dates + referrals.");
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
        sectionStates: null,
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
