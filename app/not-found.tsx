import Link from "next/link";
import { Compass } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Compass className="size-7" />
      </span>
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">404</p>
        <h1 className="text-2xl font-semibold tracking-tight">
          We couldn&apos;t find that page
        </h1>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          The link may be broken or the page may have moved. Let&apos;s get you
          back on track.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button nativeButton={false} render={<Link href="/dashboard" />}>
          Go to dashboard
        </Button>
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/" />}
        >
          Back to home
        </Button>
      </div>
    </main>
  );
}
