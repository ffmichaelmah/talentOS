import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { AdvanceActions } from "@/components/advancing/advance-actions";
import { AdvanceDocument } from "@/components/advancing/advance-document";
import { ShareLink } from "@/components/advancing/share-link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { advanceTypeLabel, clientDisplayName } from "@/lib/advancing";
import { getAdvanceFormById } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Advance form",
};

export default async function AdvanceDetailPage(
  props: PageProps<"/dashboard/advancing/[id]">
) {
  const { id } = await props.params;
  const user = await requireUser();
  const form = await getAdvanceFormById(user.id, id);
  if (!form) notFound();

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            nativeButton={false}
            render={<Link href="/dashboard/advancing" />}
            aria-label="Back to advancing"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              {advanceTypeLabel(form.type)}
            </h1>
            <p className="text-sm text-muted-foreground">
              {clientDisplayName(form)}
            </p>
          </div>
        </div>
        <AdvanceActions actions={["export", "send"]} />
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <AdvanceDocument form={form} />
        {form.shareEnabled ? (
          <Card className="shadow-xs xl:sticky xl:top-24">
            <CardContent>
              <ShareLink slug={form.id} />
            </CardContent>
          </Card>
        ) : null}
      </div>
    </>
  );
}
