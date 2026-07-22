"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ReferralLink({ code }: { code: string }) {
  const [origin, setOrigin] = React.useState("");
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setOrigin(window.location.origin), []);
  const url = `${origin}/signup?ref=${code}`;
  const [copied, setCopied] = React.useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* clipboard may be blocked */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex gap-2">
      <Input readOnly value={url} className="bg-muted/50 font-mono text-xs" />
      <Button variant="outline" size="icon" onClick={copy} aria-label="Copy link">
        {copied ? <Check className="size-4 text-primary" /> : <Copy className="size-4" />}
      </Button>
    </div>
  );
}
