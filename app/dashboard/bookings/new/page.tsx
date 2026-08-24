import type { Metadata } from "next";

import { BookingForm } from "@/components/bookings/booking-form";
import { BookingsLocked } from "@/components/bookings/bookings-locked";
import { PageHeader } from "@/components/layout/page-header";
import { requireUser } from "@/lib/auth";
import { canUseBookings, planForUser } from "@/lib/plan";
import { getClients } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Add booking",
};

export default async function NewBookingPage(props: {
  searchParams: Promise<{ client?: string }>;
}) {
  const user = await requireUser();
  const unlocked = canUseBookings(planForUser(user));
  const clients = unlocked ? await getClients(user.id) : [];
  const { client } = await props.searchParams;

  return (
    <>
      <PageHeader
        title="Add booking"
        description="Log a gig and track it through your pipeline."
      />
      {unlocked ? (
        <BookingForm
          clients={clients}
          currency={user.currency}
          defaultClientId={client}
        />
      ) : (
        <BookingsLocked />
      )}
    </>
  );
}
