import * as React from "react";

/** Renders a document body with {{tokens}} highlighted. */
export function BodyPreview({ body }: { body: string }) {
  const parts = body.split(/(\{\{[^}]+\}\})/g);
  return (
    <pre className="min-h-64 rounded-lg border bg-muted/30 p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap">
      {parts.map((part, i) =>
        part.startsWith("{{") ? (
          <span
            key={i}
            className="rounded bg-primary/10 px-1 py-0.5 font-medium text-primary"
          >
            {part}
          </span>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </pre>
  );
}
