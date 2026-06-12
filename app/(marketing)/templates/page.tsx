import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  FileSignature,
  Receipt,
  type LucideIcon,
} from "lucide-react";

import { CtaBand } from "@/components/marketing/cta-band";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";
import { templates } from "@/data";
import type { TemplateKind } from "@/types";

export const metadata: Metadata = {
  title: "Templates",
  description:
    "Professional invoice, contract, and booking advance templates built for DJs, creators, musicians, and freelance talents. Customize and send in minutes.",
};

const categories: {
  kind: TemplateKind;
  label: string;
  icon: LucideIcon;
  description: string;
}[] = [
  {
    kind: "contract",
    label: "Contracts",
    icon: FileSignature,
    description:
      "Performance, brand collaboration, and engagement agreements — amend the details and send for signature.",
  },
  {
    kind: "invoice",
    label: "Invoices",
    icon: Receipt,
    description:
      "Clean, professional invoices with line items, deposits, and payment terms.",
  },
  {
    kind: "advance-form",
    label: "Advance forms",
    icon: ClipboardList,
    description:
      "Pre-event logistics sheets covering timings, tech, hospitality, and contacts.",
  },
];

export default function TemplatesPage() {
  const published = templates.filter((t) => t.status === "published");

  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute -top-32 left-1/2 -z-10 size-[36rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
        />
        <div className="mx-auto max-w-6xl px-6 pt-20 pb-12 text-center sm:pt-28">
          <SectionHeading
            eyebrow="Templates"
            title="Professional templates, ready in minutes."
            description="Start from a template built for talent work, customize the details, and export a polished, branded document your clients can sign."
          />
          <div className="mt-8 flex justify-center">
            <Button size="lg" nativeButton={false} render={<Link href="/signup" />}>
              Start Free
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-6 py-8">
        {categories.map((category) => {
          const items = published.filter((t) => t.kind === category.kind);
          if (items.length === 0) return null;
          return (
            <section key={category.kind}>
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <category.icon className="size-5" />
                </span>
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">
                    {category.label}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((template) => (
                  <div
                    key={template.id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                  >
                    {/* faux document preview */}
                    <div className="relative h-36 overflow-hidden border-b border-border/60 bg-gradient-to-br from-muted/60 to-muted/20 p-4">
                      <div className="space-y-1.5">
                        <div className="h-2 w-1/3 rounded bg-foreground/15" />
                        <div className="h-1.5 w-2/3 rounded bg-foreground/10" />
                        <div className="h-1.5 w-1/2 rounded bg-foreground/10" />
                        <div className="mt-3 h-1.5 w-full rounded bg-foreground/10" />
                        <div className="h-1.5 w-5/6 rounded bg-foreground/10" />
                        <div className="h-1.5 w-3/4 rounded bg-foreground/10" />
                      </div>
                      <category.icon className="absolute -right-3 -bottom-3 size-20 text-primary/10" />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="mt-1.5 flex-1 text-sm text-muted-foreground">
                        {template.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {template.fields.length} customizable fields
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          nativeButton={false}
                          render={<Link href="/signup" />}
                        >
                          Use template
                          <ArrowRight className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <CtaBand
        title="Find the template. Make it yours. Send it."
        description="Every template is fully editable and exports to a clean, branded PDF."
        primaryLabel="Start Free"
        secondaryLabel="See Pricing"
        secondaryHref="/pricing"
      />
    </>
  );
}
