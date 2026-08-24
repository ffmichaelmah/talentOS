import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { AdvanceActions } from "@/components/advancing/advance-actions";
import { AdvanceDocument } from "@/components/advancing/advance-document";
import { ReopenButton } from "@/components/advancing/reopen-button";
import { ShareLink } from "@/components/advancing/share-link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { advanceTypeLabel, clientDisplayName } from "@/lib/advancing";
import { clientEditableSections, sectionSlug } from "@/lib/advance-sections";
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

  // Non-empty only when the client has marked at least one section.
  const states =
    form.sectionStates && Object.keys(form.sectionStates).length
      ? form.sectionStates
      : null;

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
          <div className="space-y-4 xl:sticky xl:top-24">
            <Card className="shadow-xs">
              <CardContent className="space-y-4">
                <ShareLink slug={form.id} />
                {form.clientLocked || states ? (
                  <ReopenButton id={form.id} />
                ) : null}
              </CardContent>
            </Card>

            {states ? (
              <Card className="shadow-xs">
                <CardHeader>
                  <CardTitle className="text-base">Client progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1.5">
                  {clientEditableSections(form.category).map((s) => {
                    const st = states[sectionSlug(s.title)];
                    return (
                      <div
                        key={s.title}
                        className="flex items-center justify-between gap-2 text-sm"
                      >
                        <span className="truncate">{s.title}</span>
                        <span
                          className={
                            st === "complete"
                              ? "shrink-0 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                              : st === "skipped"
                                ? "shrink-0 text-xs font-medium text-muted-foreground"
                                : "shrink-0 text-xs text-amber-600 dark:text-amber-400"
                          }
                        >
                          {st === "complete"
                            ? "Complete"
                            : st === "skipped"
                              ? "Skipped"
                              : "Awaiting"}
                        </span>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ) : null}
          </div>
        ) : null}
      </div>
    </>
  );
}
