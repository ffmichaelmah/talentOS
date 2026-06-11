import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  ClipboardList,
  Coins,
  FileSignature,
  Receipt,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: Receipt,
    title: "Invoices",
    description:
      "Professional invoices with deposits, line items, and payment tracking — sent in minutes.",
  },
  {
    icon: FileSignature,
    title: "Contracts",
    description:
      "Performance and collab agreements from templates built for talent, ready to sign.",
  },
  {
    icon: ClipboardList,
    title: "Client advancing",
    description:
      "Advance forms that lock in timings, tech, hospitality, and contacts before show day.",
  },
  {
    icon: Calendar,
    title: "Bookings",
    description:
      "Every gig in one pipeline, from first inquiry to paid and done.",
  },
  {
    icon: Users,
    title: "Clients",
    description:
      "Venues, brands, promoters, and planners — with full history per relationship.",
  },
  {
    icon: Coins,
    title: "Credits & plans",
    description:
      "Pay for the documents you generate, or subscribe and stop counting.",
  },
];

export default function LandingPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 py-24 text-center md:py-32">
        <Badge variant="secondary" className="mb-6">
          Business tools for modern talents
        </Badge>
        <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-balance md:text-6xl">
          Run your talent business like a pro — without the admin team.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground text-pretty">
          TalentOS gives DJs, creators, performers, and their managers the
          invoices, contracts, and booking advances an agency would handle —
          minus the agency.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            nativeButton={false}
            render={<Link href="/dashboard" />}
          >
            Get started free
            <ArrowRight className="size-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            render={<Link href="/pricing" />}
          >
            See pricing
          </Button>
        </div>
      </section>

      <section id="features" className="border-t bg-muted/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mx-auto mb-12 max-w-xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight">
              Everything between the gig and getting paid
            </h2>
            <p className="mt-3 text-muted-foreground">
              One workspace for the paperwork side of being booked.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="shadow-xs">
                <CardHeader>
                  <span className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="size-5" />
                  </span>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <Card className="shadow-xs">
          <CardContent className="flex flex-col items-center gap-6 py-12 text-center">
            <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-balance">
              Look like you have a team behind you.
            </h2>
            <p className="max-w-lg text-muted-foreground">
              Start free with 3 document credits a month. Upgrade when the
              bookings do.
            </p>
            <Button
              size="lg"
              nativeButton={false}
              render={<Link href="/dashboard" />}
            >
              Open your dashboard
              <ArrowRight className="size-4" />
            </Button>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
