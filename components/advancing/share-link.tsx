"use client";

import * as React from "react";
import { Check, Copy, Link2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * Public share-link UI for an advance form. The link is a placeholder; copy
 * works locally, "Share with client" is a prototype confirmation.
 */
export function ShareLink({
  slug = "sample",
  className,
}: {
  slug?: string;
  className?: string;
}) {
  const url = `https://talentos.app/advance/${slug}`;
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // clipboard may be blocked — still show the confirmation
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2 text-sm font-medium">
        <Link2 className="size-4 text-primary" />
        Client share link
      </div>
      <p className="text-xs text-muted-foreground">
        Send this public link so the client can fill in the details themselves.
      </p>
      <div className="flex gap-2">
        <Input readOnly value={url} className="bg-muted/50 font-mono text-xs" />
        <Button variant="outline" size="icon" onClick={copy} aria-label="Copy link">
          {copied ? (
            <Check className="size-4 text-primary" />
          ) : (
            <Copy className="size-4" />
          )}
        </Button>
      </div>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setShared(true);
          window.setTimeout(() => setShared(false), 3000);
        }}
      >
        <Send className="size-4" />
        Share with client
      </Button>
      {copied ? (
        <p className="text-xs text-muted-foreground">Link copied to clipboard.</p>
      ) : null}
      {shared ? (
        <p className="text-xs text-muted-foreground">
          Prototype — sharing sends the link by email once the backend is wired
          up.
        </p>
      ) : null}
    </div>
  );
}
