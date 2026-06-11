import type { Metadata } from "next";
import { ClipboardList } from "lucide-react";

import { EmptyStateCard } from "@/components/cards/empty-state-card";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { advanceForms } from "@/data";

export const metadata: Metadata = {
  title: "Advancing",
};

export default function AdvancingPage() {
  return (
    <>
      <PageHeader
        title="Advancing"
        description={`${advanceForms.length} advance forms for upcoming and past events.`}
        actions={<Button>New advance form</Button>}
      />
      <EmptyStateCard
        icon={ClipboardList}
        title="Advance forms coming soon"
        description="This view will manage event logistics — timings, tech riders, hospitality, and on-site contacts — per booking."
      />
    </>
  );
}
