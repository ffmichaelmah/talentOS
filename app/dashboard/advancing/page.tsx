import type { Metadata } from "next";
import { ClipboardList, Plus } from "lucide-react";

import { UpgradePrompt } from "@/components/cards/upgrade-prompt";
import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { advanceForms, bookings } from "@/data";
import { formatDate } from "@/lib/format";
import { canUseAdvancing, getCurrentPlan } from "@/lib/plan";
import type { AdvanceForm } from "@/types";

export const metadata: Metadata = {
  title: "Advancing",
};

const bookingTitle = (id: string) =>
  bookings.find((b) => b.id === id)?.title ?? "—";

export default function AdvancingPage() {
  const plan = getCurrentPlan();
  const unlocked = canUseAdvancing(plan);

  return (
    <>
      <PageHeader
        title="Advancing"
        description={`${advanceForms.length} advance forms for upcoming and past events.`}
        actions={
          <Button>
            <Plus className="size-4" />
            New advance form
          </Button>
        }
      />

      {!unlocked ? (
        <UpgradePrompt
          variant="banner"
          description="Advancing is available on Pro Plan and above."
          cta="Upgrade"
        />
      ) : null}

      <DataTable<AdvanceForm>
        columns={[
          {
            header: "Event",
            cell: (f) => (
              <span className="font-medium">{bookingTitle(f.bookingId)}</span>
            ),
          },
          { header: "Event date", cell: (f) => formatDate(f.eventDate) },
          { header: "Set time", cell: (f) => f.setTime },
          {
            header: "Set length",
            className: "text-right",
            cell: (f) => `${f.setLengthMinutes} min`,
          },
          { header: "Contact", cell: (f) => f.onSiteContact.name },
          {
            header: "Status",
            className: "text-right",
            cell: (f) => <StatusBadge status={f.status} />,
          },
        ]}
        rows={advanceForms}
        rowKey={(f) => f.id}
        emptyIcon={ClipboardList}
        emptyTitle="No advance forms yet"
        emptyDescription="Lock in timings, tech, and hospitality before your next show."
      />
    </>
  );
}
