import type { Metadata } from "next";
import { Calendar } from "lucide-react";

import { EmptyStateCard } from "@/components/cards/empty-state-card";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { bookings } from "@/data";

export const metadata: Metadata = {
  title: "Bookings",
};

export default function BookingsPage() {
  return (
    <>
      <PageHeader
        title="Bookings"
        description={`${bookings.length} bookings in your pipeline.`}
        actions={<Button>New booking</Button>}
      />
      <EmptyStateCard
        icon={Calendar}
        title="Booking pipeline coming soon"
        description="This view will list every gig from inquiry to completed, with linked invoices, contracts, and advance forms."
      />
    </>
  );
}
