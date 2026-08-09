@AGENTS.md

# TalentOS

Business tooling for independent talent (DJs, musicians, creators, performers) and
the people who manage them: invoices, clients, bookings, agreements, and advancing
forms — plus a marketing site, auth, subscription tiers, and a referral program.

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind v4 · Base UI +
shadcn (`base-nova` style) · Prisma (SQLite locally / Postgres on Vercel).

---

## Commands

```bash
npm run dev        # next dev (Turbopack) on :3000
npm run build      # prepare-db → prisma generate → db push → seed → next build
npm run build:app  # next build only (skips the DB steps)
npm run start      # production server
npm run lint       # eslint (flat config, eslint-config-next)

npm run db:push    # apply prisma/schema.prisma to the DB
npm run db:seed    # seed the demo account (idempotent)
npm run db:reset   # force-reset the DB and reseed
```

There is **no test suite and no type-check script**. Verify changes with
`npm run lint` and `npx tsc --noEmit`, plus `npm run dev` for anything visual.

### Local setup

1. `npm install`
2. Copy `.env.example` → `.env`. For local dev set `DATABASE_URL="file:./dev.db"`
   and any `AUTH_SECRET` (`openssl rand -base64 32`). The Postgres URL in the
   example file is for Vercel.
3. `npm run db:reset` to create and seed `prisma/dev.db` (gitignored).
4. `npm run dev` — log in with the seeded demo account:
   **maya@djnova.live / demo1234**.

### Before writing Next.js code

`AGENTS.md` is not boilerplate: this Next.js version has breaking changes vs.
older knowledge. Read the relevant guide under `node_modules/next/dist/docs/`
before touching routing, caching, or config. That directory only exists after
`npm install`. Already-landed consequences of the new version:

- **Middleware is now Proxy** — the root file is `proxy.ts` exporting `proxy()`,
  not `middleware.ts`.
- Dynamic route `params` are a **Promise**: `{ params }: { params: Promise<{ id: string }> }`,
  awaited in the body.
- `cookies()` and `headers()` are async — always `await` them.

---

## Architecture

### Request flow

```
proxy.ts            optimistic redirect: no session cookie + /dashboard/* → /login
  ↓
app/**/page.tsx     async Server Component
  ↓ requireUser()   lib/auth — verifies the JWT cookie, redirects to /login
  ↓ planForUser()   lib/plan — the plan the user can actually use right now
  ↓ get*(user.id)   lib/queries — every read is scoped by userId
  ↓
components/         Server Components by default; "use client" only for interactivity
  ↓ <form action>   app/actions/* server actions → prisma → revalidatePath
```

`proxy.ts` is a UX optimization only. **Never treat the cookie's presence as
authentication.** Real verification happens in `lib/session.ts` (jose JWT verify)
and authorization happens by passing `user.id` into every query.

### Route groups (`app/`)

| Path | Purpose | Auth |
|---|---|---|
| `(marketing)/` | Landing, features, templates, pricing | public |
| `(auth)/` | `/login`, `/signup` — split-panel brand layout | public |
| `dashboard/` | The product. Layout calls `requireUser()` | session required |
| `(admin)/admin/` | Internal template/user/plan tooling | **none yet** — see below |
| `advance/[id]` | Public client-facing share link for an advance form | share flag only |
| `actions/` | `"use server"` modules (not routes) | per-action |

Each dashboard resource follows the same trio: `page.tsx` (list), `new/page.tsx`
(create), `[id]/page.tsx` (detail).

**Admin is unprotected.** `app/(admin)/layout.tsx` hardcodes a fake admin user and
is intentionally unlinked from `dashboardNav` (`lib/navigation.ts` keeps
`dashboardSecondaryNav` empty for this reason). It reads static `@/data`, not the
DB. Don't put user data behind `/admin` until it has a real gate.

---

## Data layer

### Prisma with a swapped provider

`prisma/schema.prisma` is committed with `provider = "sqlite"` for zero-setup local
dev. `scripts/prepare-db.mjs` **rewrites that line in place** to `postgresql` when
`VERCEL=1` or `DATABASE_PROVIDER=postgresql`, as the first step of `npm run build`.

Consequences to respect:
- Keep the schema portable across both engines — no SQLite-only or Postgres-only
  types, no `enum`, no native array/JSON columns.
- If a local build leaves the schema on `postgresql`, revert that one line before
  committing.

### Modeling conventions

- **Nested structures are JSON strings**, not relations: `Invoice.lineItems`,
  `Invoice.job`, `Contract.details`, `AdvanceForm.eventDetails` /
  `campaignDetails`. They are `JSON.parse`d in `lib/queries.ts` and
  `JSON.stringify`d on write. The schema comments name the TS type each column holds.
- **All dates are ISO strings** (`String`), never `DateTime` — including
  `createdAt`. Comparisons are lexicographic on ISO text (see
  `lastBookingByClient`, `invoiceCountThisMonth`).
- **Money is `Int` in whole currency units** (dollars, not cents). `taxRate` is a
  `Float` fraction (`0.08` = 8%). Format with `formatCurrency` from `lib/format.ts`.
- Every user-owned model has `userId` + `@@index([userId])` and
  `onDelete: Cascade`.
- Unions live in `types/index.ts` (`InvoiceStatus`, `BookingStage`, …) and are
  stored as plain `String` columns. Prisma rows are cast through
  `as unknown as Invoice` in `lib/queries.ts` — the cast is where the string
  column becomes the union, so **keep the schema field names identical to the TS
  interface** or the cast silently lies.

### Reading data — `lib/queries.ts`

The only place that reads app data. Marked `import "server-only"`. Rules:

- Every exported function takes `userId` as its first argument and filters on it.
  Detail lookups use `findFirst({ where: { id, userId } })`, never `findUnique({ id })`
  — that's the ownership check.
- Read helpers parse JSON columns and attach denormalized display fields
  (`clientName`, `eventName`, `invoiceStatus`) that exist on the TS type but not
  in the DB.
- The one deliberate exception is `getSharedAdvance(id)`, which has no `userId`
  because the public share link is the boundary — it requires `shareEnabled: true`.

### Writing data — `app/actions/*`

Server actions are the only writers. The established shape:

```ts
"use server";
export async function createXAction(_prev: State, formData: FormData): Promise<State> {
  const user = await requireUser();              // 1. authenticate
  const parsed = schema.safeParse({ ... });      // 2. validate with zod
  if (!parsed.success) return { error: "…" };    // 3. return, don't throw
  await prisma.x.create({ data: { userId: user.id, ... } });
  revalidatePath("/dashboard/x");                // 4. revalidate
  redirect("/dashboard/x");
}
```

State is `{ error?: string } | undefined`, consumed by `useActionState` on the
client with `useFormStatus` for the pending state (see
`components/auth/login-form.tsx`). Actions that change plan state call
`revalidatePlanSurfaces()` in `app/actions/subscription.ts`, which re-renders every
gated page at once.

### Static data — `data/`

`data/` holds the original prototype fixtures. It still has two live roles:

1. **Source of the seed** (`prisma/seed.ts` imports clients/bookings/invoices/
   contracts/advance forms from it).
2. **Catalogs with no DB table yet**: `subscriptionPlans` and `templates` are read
   directly by the billing page, marketing pages, and all of `/admin`.

`data/user.ts` (`currentUser`) is fixture data only — the demo account. Nothing in
the dashboard should read it; use `requireUser()`. The one remaining reference is
`getCurrentPlan()` in `lib/plan.ts`, which is legacy — prefer `planForUser(user)`.

---

## Auth & sessions

- `lib/session.ts` — signs/verifies a `talentos-session` JWT (jose, HS256, 7 days)
  in an httpOnly cookie. Requires `AUTH_SECRET`; it throws if unset.
- `lib/auth.ts` — `getCurrentUser()` (React `cache`d per request, returns `null`
  when signed out) and `requireUser()` (redirects to `/login`).
- `lib/password.ts` — bcryptjs, cost 10.
- Signup issues a `referralCode` and records `referredById` when a code was
  entered; an unmatched code is ignored silently rather than failing signup.

---

## Plan gating

Three plans in `data/subscription-plans.ts`: Free ($0), Standard ($15), Pro ($25).
`limits.*PerMonth === 0` means locked; `null` means unlimited.

**Always resolve the plan through `planForUser(user)`** (`lib/plan.ts`), never
`planById(user.planId)`. Cancelling sets `subscriptionStatus: "cancelled"` and
`currentPeriodEnd` but keeps `planId`; `planForUser` is what drops the user to Free
once that date passes. Bypassing it grants access after the grace period ends.

Gate helpers: `canUseBookings` (Standard+), `canUseContracts` (Pro),
`canUseAdvancing` (Pro), `isOverClientLimit`, and `isOverInvoiceLimit`
(`lib/invoices.ts`).

The UI pattern for a locked feature is to render, not to hide: list pages show an
`<UpgradePrompt variant="banner">` above real content; create pages swap the form
for a `*Locked` component (`ContractLocked`, `AdvanceLocked`, `BookingsLocked`).

---

## UI conventions

- **Base UI (`@base-ui/react`), not Radix.** `components/ui/*` are shadcn
  `base-nova`-style wrappers over Base UI primitives, so the sub-component names
  differ from Radix (`Dialog.Backdrop`, not `Dialog.Overlay`). Add components with
  the shadcn CLI configured by `components.json`; don't hand-port Radix code.
- **`Button` gotcha:** Base UI's Button defaults to `type="button"`, so it never
  submits a form. For a real submit, use a native `<button type="submit">` with
  `className={cn(buttonVariants(), …)}` (see `login-form.tsx`). To render a link
  as a button: `<Button nativeButton={false} render={<Link href="…" />}>`.
- **Styling:** Tailwind v4, configured entirely in `app/globals.css` (no
  `tailwind.config`). Use semantic tokens — `bg-card`, `text-muted-foreground`,
  `border-border`, `text-primary` — never raw colors. The palette is oklch with a
  violet-tinted neutral ramp and a custom shadow scale; `shadow-xs` is the standard
  card elevation. Merge classes with `cn()` from `lib/utils.ts`, and use `cva` for
  variants.
- **Dark mode** is a `.dark` class on `<html>`, set by an inline script in
  `app/layout.tsx` from `localStorage["talentos-theme"]` (pre-hydration, so no
  flash) and toggled by `components/layout/theme-toggle.tsx`.
- **Server-first components.** Add `"use client"` only for state, effects, or
  event handlers. Pages fetch; client components receive plain props. Pass narrow
  prop objects rather than whole Prisma rows (see `chrome` in
  `app/dashboard/layout.tsx`).
- Icons are `lucide-react`. Every page exports `metadata` with a short `title` —
  the `%s · TalentOS` template lives in the root layout.
- Shared building blocks: `PageHeader`, `DataTable` (generic, column-config based),
  `StatCard`, `QuickActionCard`, `EmptyStateCard`, `StatusBadge`, `UpgradePrompt`.
  Feature components are grouped by domain (`components/invoices/`,
  `components/advancing/`, …).

---

## Domain notes

- **Contracts are "Agreements" in the UI.** The rename was UI-only: the model,
  routes (`/dashboard/contracts`), files, and types are all still `Contract`. Keep
  code naming as-is and use "Agreement" in user-facing copy. Every surface that
  offers a template must carry the disclaimer constants from `lib/contracts.ts`
  (`CONTRACT_REFERENCE_DISCLAIMER*`, `CONTRACT_BODY_NOTICE`) — TalentOS is not a
  law firm and the templates are reference-only.
- **Advancing share links** (`/advance/[id]`) are unauthenticated by design. The
  security boundary is `shareEnabled` plus the field whitelist from
  `clientEditableKeys()` in `lib/advance-sections.ts` — `updateSharedAdvance` only
  applies whitelisted keys, so extra keys can't be smuggled in from the browser.
  Never widen that whitelist without thinking about who holds the link. Clients
  double-confirm to set `clientLocked`; only the owner can `reopenAdvanceForClient`.
- **Templates** use `{{merge.tokens}}` resolved by `resolveTokens` in `lib/merge.ts`.
  Unresolved tokens are deliberately left in place so the user can see and fill
  them. The available token catalog is `lib/template-tokens.ts`.
- **Referrals** (`lib/referrals.ts`): every signup gets a code; referrers earn
  `FREE_MONTHS_PER_PAID` per paid conversion. `isAmbassador` is an internal,
  unadvertised flag adding a 20% monthly commission — keep it out of marketing copy.

---

## What is real vs. still a prototype

Persisted for real: signup/login/logout, per-user reads across all dashboard
resources, client creation, subscription cancel/resume, advance-form share editing
and locking, referral stats.

Still illustrative — the UI confirms but nothing is written:

- Invoice, booking, agreement, and advance-form **creation** (`components/forms/prototype-save.tsx`,
  and the `*-form` / `*-actions` components).
- Plan upgrades and payment methods on `/dashboard/billing`.
- Settings profile edits.
- Everything under `/admin` (template CRUD reads and writes static `data/templates.ts`).
- `components/layout/demo-banner.tsx` states this to users; update it when a flow
  becomes real.

When implementing one of these, follow the `createClientAction` +
`getClients`/`lib/queries.ts` pattern rather than inventing a new one, and delete
the corresponding `PrototypeSave` usage.

---

## Conventions & gotchas

- Import via the `@/*` alias (maps to the repo root); avoid `../..` chains.
- `import "server-only"` at the top of any module that touches the DB, cookies, or
  secrets — `lib/auth.ts`, `lib/session.ts`, `lib/queries.ts`, `lib/referrals.ts`
  do this already.
- `lib/db.ts` exports a hot-reload-safe singleton `prisma`. Never construct a new
  `PrismaClient` in app code (`prisma/seed.ts` is the exception — it's a script).
- A comment tagged **`ponytail:`** marks a known, accepted limitation (e.g. no rate
  limit on the advance share link, referral-code collisions relying on the unique
  constraint). Treat them as documented debt; keep the tag if you touch the code.
- The seed is **idempotent by design** — it detects the demo user and refreshes the
  referral demo instead of re-inserting, so Vercel redeploys (which run
  `db push --accept-data-loss` + seed) don't duplicate data.
- `prisma/*.db` and `.env*` are gitignored; `.env.example` is committed.
- Comments in this codebase explain *why*, not *what*, and are sparse. Match that.

## Deployment

Vercel. `npm run build` prepares the Postgres provider, generates the client,
pushes the schema (`--accept-data-loss`), seeds, then builds. Required env vars:
`DATABASE_URL` (use the **non-pooled/direct** connection string so `db push` works
during the build) and `AUTH_SECRET`.
