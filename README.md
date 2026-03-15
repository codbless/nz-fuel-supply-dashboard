# NZ Fuel Supply Dashboard

First working version of a Bloomberg-style fuel supply dashboard for New Zealand, built with Next.js for Vercel deployment.

## Repository Scope

This repository is dedicated to fuel, oil, tanker, and pump-price monitoring only.

It is intentionally separate from `codbless/nzred-dashboard`, which remains focused on NZRed seafood operations. Dependencies, environment variables, and deployment configuration should stay isolated between the two projects.

## Pump Watch pipeline

NZ Pump Watch no longer needs manual city-by-city editing in code.

The current automatic pipeline is:

1. Fetch official MBIE weekly fuel monitoring CSV data.
2. Parse the latest national retail fuel rows.
3. Transform them through a swap-friendly city basis layer.
4. Store the latest snapshot in Postgres.
5. Read Pump Watch and city spread panels from the database.
6. Refresh automatically via Vercel cron and on-request stale sync.

Default upstream source:

- MBIE weekly CSV: [weekly-table.csv](https://www.mbie.govt.nz/assets/Data-Files/Energy/Weekly-fuel-price-monitoring/weekly-table.csv)

Current source mode:

- `official-weekly-national-plus-city-basis`

That means the source is automatic and database-backed today, while the fetch/parser/source layer is isolated so a true live city-level feed can be swapped in later without rewriting the dashboard UI.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Environment

Copy `.env.example` and set:

- `DATABASE_URL`
  A Postgres connection string. This works with Vercel Postgres, Neon, Supabase Postgres, or any compatible Postgres provider.
- `CRON_SECRET`
  Shared secret used by Vercel cron to call `/api/pump-watch/refresh`.
- `PUMP_WATCH_SOURCE_URL`
  Optional override for the upstream source URL.
- `PUMP_WATCH_MAX_STALE_HOURS`
  Optional staleness threshold before the dashboard auto-syncs on request.

## Automatic refresh

- Vercel cron is configured in `vercel.json` to call `/api/pump-watch/refresh` daily at `06:00 UTC`.
- If the stored Pump Watch data is stale when someone opens the dashboard, the page will auto-sync on request.
- The open dashboard also refreshes itself periodically so new database values appear without manual reload.

If you move to a better live source later, replace the Pump Watch source adapter in `lib/pump-watch/source.ts` and keep the parser/storage/dashboard layers intact.
