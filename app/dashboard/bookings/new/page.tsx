import type { Metadata } from "next";

import { BookingForm } from "@/components/bookings/booking-form";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Add booking",
};

export default function NewBookingPage() {
  return (
    <>
      <PageHeader
        title="Add booking"
        description="Log a gig and track it through your pipeline."
      />
      <BookingForm />
    </>
  );
}
