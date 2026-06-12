import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CtaBand({
  title,
  description,
  primaryLabel = "Create Your First Invoice Free",
  primaryHref = "/signup",
  secondaryLabel,
  secondaryHref,
}: {
  title: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 px-6 py-16 text-center sm:px-16">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent"
        />
        <div
          aria-hidden
          className="absolute -top-24 left-1/2 -z-10 size-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
        />
        <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground text-pretty">
            {description}
          </p>
        ) : null}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" nativeButton={false} render={<Link href={primaryHref} />}>
            {primaryLabel}
            <ArrowRight className="size-4" />
          </Button>
          {secondaryLabel && secondaryHref ? (
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<Link href={secondaryHref} />}
            >
              {secondaryLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
