import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { BookingsTable } from "@/components/bookings/bookings-table";
import { UpgradePrompt } from "@/components/cards/upgrade-prompt";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { canUseBookings, planById } from "@/lib/plan";
import { getBookings } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Bookings",
};

export default async function BookingsPage() {
  const user = await requireUser();
  const bookings = await getBookings(user.id);
  const unlocked = canUseBookings(planById(user.planId));

  return (
    <>
      <PageHeader
        title="Bookings"
        description={`${bookings.length} bookings in your pipeline.`}
        actions={
          <Button
            nativeButton={false}
            render={<Link href="/dashboard/bookings/new" />}
          >
            <Plus className="size-4" />
            Add Booking
          </Button>
        }
      />

      {!unlocked ? (
        <UpgradePrompt
          variant="banner"
          description="Bookings are available on Standard and Pro."
          cta="Upgrade"
        />
      ) : null}

      <BookingsTable bookings={bookings} />
    </>
  );
}
