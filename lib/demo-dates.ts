/**
 * The dummy data in /data is written around this notional "today" — invoices
 * raised in the days before it, bookings spread on either side of it.
 */
const DEMO_ANCHOR = "2026-06-12";

const DAY_MS = 24 * 60 * 60 * 1000;

/** Days to add so the demo sits around the real current date. */
export function demoDateOffset(now: Date = new Date()): number {
  const anchor = new Date(`${DEMO_ANCHOR}T00:00:00.000Z`);
  const today = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
  return Math.round((today.getTime() - anchor.getTime()) / DAY_MS);
}

/** Whole days from `from` to `to`; 0 when either is missing or unparseable. */
export function daysBetween(from?: string | null, to?: string | null): number {
  if (!from || !to) return 0;
  const a = new Date(from).getTime();
  const b = new Date(to).getTime();
  if (Number.isNaN(a) || Number.isNaN(b)) return 0;
  return Math.round((b - a) / DAY_MS);
}

/**
 * "2026-06-20", or a full ISO timestamp with an optional zone —
 * "…T18:00:00Z", "…T23:00:00-07:00", "…T23:00:00".
 */
const DATE_RE = /^(\d{4}-\d{2}-\d{2})(T[\d:.]+(?:Z|[+-]\d{2}:\d{2})?)?$/;

function shiftOne(value: string, days: number): string {
  const m = DATE_RE.exec(value);
  if (!m) return value;
  const shifted = new Date(new Date(`${m[1]}T00:00:00.000Z`).getTime() + days * DAY_MS);
  const date = shifted.toISOString().slice(0, 10);
  return m[2] ? `${date}${m[2]}` : date;
}

/**
 * Deep-copy a demo record with every date string moved by `days`, keeping the
 * relative spacing intact so past gigs stay past and upcoming stay upcoming.
 * Non-date strings (phones, tax numbers, prose) are left alone.
 */
export function shiftDemoDates<T>(value: T, days = demoDateOffset()): T {
  if (days === 0) return value;
  if (typeof value === "string") return shiftOne(value, days) as T;
  if (Array.isArray(value)) {
    return value.map((v) => shiftDemoDates(v, days)) as T;
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, shiftDemoDates(v, days)])
    ) as T;
  }
  return value;
}
