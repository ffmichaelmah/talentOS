import type { Metadata } from "next";

import { BookingForm } from "@/components/bookings/booking-form";
import { PageHeader } from "@/components/layout/page-header";
import { requireUser } from "@/lib/auth";
import { getClients } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Add booking",
};

export default async function NewBookingPage() {
  const user = await requireUser();
  const clients = await getClients(user.id);

  return (
    <>
      <PageHeader
        title="Add booking"
        description="Log a gig and track it through your pipeline."
      />
      <BookingForm clients={clients} currency={user.currency} />
    </>
  );
}
