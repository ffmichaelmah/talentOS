"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Lightweight light/dark toggle. The root layout runs an inline script that
 * applies the persisted class before hydration, so there is no flash. We read
 * the current theme straight from the DOM via useSyncExternalStore — no effect
 * needed, and it stays in sync if the class changes elsewhere.
 */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

export function ThemeToggle() {
  const isDark = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => false // server snapshot: matches the pre-hydration default
  );

  function toggle() {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("talentos-theme", next ? "dark" : "light");
    } catch {
      // private mode etc. — theme just won't persist
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}
