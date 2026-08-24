"use client";

import * as React from "react";

import { updateBookingStageAction } from "@/app/actions/bookings";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BOOKING_STAGE_LABELS, BOOKING_STAGES } from "@/lib/bookings";
import type { BookingStage } from "@/types";

/** Moves a booking through the pipeline from its detail page. */
export function StageSelect({
  id,
  stage,
}: {
  id: string;
  stage: BookingStage;
}) {
  const [value, setValue] = React.useState<BookingStage>(stage);
  const [pending, startTransition] = React.useTransition();

  function change(next: BookingStage) {
    const previous = value;
    setValue(next);
    startTransition(async () => {
      const res = await updateBookingStageAction(id, next);
      if (!res.ok) setValue(previous); // revert if the save failed
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="stage-select" className="text-xs text-muted-foreground">
        Stage
      </Label>
      <Select
        items={BOOKING_STAGE_LABELS}
        value={value}
        onValueChange={(v) => change((v as BookingStage) ?? value)}
      >
        <SelectTrigger id="stage-select" className="w-56" disabled={pending}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {BOOKING_STAGES.map((s) => (
            <SelectItem key={s} value={s}>
              {BOOKING_STAGE_LABELS[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
