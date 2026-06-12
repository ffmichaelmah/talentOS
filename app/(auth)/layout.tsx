import Link from "next/link";
import { BadgeCheck } from "lucide-react";

import { Logo } from "@/components/layout/logo";

const highlights = [
  "Send your first professional invoice in minutes",
  "Contracts and advance forms built for talent",
  "Free forever — no credit card required",
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-primary lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/70"
        />
        <div
          aria-hidden
          className="absolute -bottom-24 -left-16 size-96 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -top-20 right-0 size-80 rounded-full bg-white/10 blur-3xl"
        />

        <div className="relative">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-primary-foreground"
          >
            <span className="flex size-7 items-center justify-center rounded-lg bg-white/20">
              <span className="text-sm font-bold">T</span>
            </span>
            TalentOS
          </Link>
        </div>

        <div className="relative space-y-6 text-primary-foreground">
          <p className="text-3xl font-semibold leading-snug tracking-tight text-balance">
            Run your talent career like a real business.
          </p>
          <ul className="space-y-3">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-primary-foreground/90">
                <BadgeCheck className="mt-0.5 size-5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-primary-foreground/70">
          Business tools for modern talents.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between p-6 lg:hidden">
          <Logo />
        </div>
        <div className="flex flex-1 items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}
