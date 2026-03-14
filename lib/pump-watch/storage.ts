import { isDatabaseConfigured, query, withDbClient } from "../db";
import type { PumpWatchSnapshot, PumpWatchSnapshotCity } from "./types";

type PumpWatchIngestionRow = {
  id: string;
  source_key: string;
  source_label: string;
  source_mode: string;
  effective_at: string;
  fetched_at: string;
  raw_url: string;
  metadata: Record<string, unknown>;
};

type PumpWatchCityRow = {
  city: string;
  city_order: number;
  regular_cpl: string;
  premium_cpl: string;
  diesel_cpl: string;
  submissions: number;
  low_cpl: string;
  high_cpl: string;
  spread_cpl: string;
};

async function ensurePumpWatchSchema() {
  if (!isDatabaseConfigured()) {
    return;
  }

  await withDbClient(async (client) => {
    await client.query(`
      CREATE TABLE IF NOT EXISTS pump_watch_ingestions (
        id TEXT PRIMARY KEY,
        source_key TEXT NOT NULL,
        source_label TEXT NOT NULL,
        source_mode TEXT NOT NULL,
        effective_at TIMESTAMPTZ NOT NULL,
        fetched_at TIMESTAMPTZ NOT NULL,
        raw_url TEXT NOT NULL,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS pump_watch_city_prices (
        ingestion_id TEXT NOT NULL REFERENCES pump_watch_ingestions(id) ON DELETE CASCADE,
        city TEXT NOT NULL,
        city_order INTEGER NOT NULL DEFAULT 0,
        regular_cpl NUMERIC(10, 3) NOT NULL,
        premium_cpl NUMERIC(10, 3) NOT NULL,
        diesel_cpl NUMERIC(10, 3) NOT NULL,
        submissions INTEGER NOT NULL DEFAULT 0,
        low_cpl NUMERIC(10, 3) NOT NULL,
        high_cpl NUMERIC(10, 3) NOT NULL,
        spread_cpl NUMERIC(10, 3) NOT NULL,
        PRIMARY KEY (ingestion_id, city)
      );
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS pump_watch_ingestions_fetched_at_idx
      ON pump_watch_ingestions (fetched_at DESC);
    `);
  });
}

function serializeCityRow(row: PumpWatchCityRow): PumpWatchSnapshotCity {
  return {
    city: row.city,
    cityOrder: row.city_order,
    regularCpl: Number(row.regular_cpl),
    premiumCpl: Number(row.premium_cpl),
    dieselCpl: Number(row.diesel_cpl),
    submissions: row.submissions,
    lowCpl: Number(row.low_cpl),
    highCpl: Number(row.high_cpl),
    spreadCpl: Number(row.spread_cpl),
  };
}

export async function storePumpWatchSnapshot(snapshot: PumpWatchSnapshot) {
  if (!isDatabaseConfigured()) {
    return;
  }

  await ensurePumpWatchSchema();

  await withDbClient(async (client) => {
    await client.query("BEGIN");

    try {
      await client.query(
        `
          INSERT INTO pump_watch_ingestions (
            id,
            source_key,
            source_label,
            source_mode,
            effective_at,
            fetched_at,
            raw_url,
            metadata
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
        `,
        [
          snapshot.id,
          snapshot.sourceKey,
          snapshot.sourceLabel,
          snapshot.sourceMode,
          snapshot.effectiveAt,
          snapshot.fetchedAt,
          snapshot.rawUrl,
          snapshot.metadata,
        ],
      );

      for (const city of snapshot.cities) {
        await client.query(
          `
            INSERT INTO pump_watch_city_prices (
              ingestion_id,
              city,
              city_order,
              regular_cpl,
              premium_cpl,
              diesel_cpl,
              submissions,
              low_cpl,
              high_cpl,
              spread_cpl
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
          `,
          [
            snapshot.id,
            city.city,
            city.cityOrder,
            city.regularCpl,
            city.premiumCpl,
            city.dieselCpl,
            city.submissions,
            city.lowCpl,
            city.highCpl,
            city.spreadCpl,
          ],
        );
      }

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  });
}

export async function getLatestPumpWatchSnapshot() {
  if (!isDatabaseConfigured()) {
    return null;
  }

  await ensurePumpWatchSchema();

  const ingestion = await query<PumpWatchIngestionRow>(
    `
      SELECT
        id,
        source_key,
        source_label,
        source_mode,
        effective_at::text,
        fetched_at::text,
        raw_url,
        metadata
      FROM pump_watch_ingestions
      ORDER BY fetched_at DESC
      LIMIT 1;
    `,
  );

  const latest = ingestion.rows[0];

  if (!latest) {
    return null;
  }

  const cityRows = await query<PumpWatchCityRow>(
    `
      SELECT
        city,
        city_order,
        regular_cpl,
        premium_cpl,
        diesel_cpl,
        submissions,
        low_cpl,
        high_cpl,
        spread_cpl
      FROM pump_watch_city_prices
      WHERE ingestion_id = $1
      ORDER BY city_order ASC, city ASC;
    `,
    [latest.id],
  );

  return {
    id: latest.id,
    sourceKey: latest.source_key,
    sourceLabel: latest.source_label,
    sourceMode: latest.source_mode,
    effectiveAt: latest.effective_at,
    fetchedAt: latest.fetched_at,
    rawUrl: latest.raw_url,
    metadata: latest.metadata ?? {},
    cities: cityRows.rows.map(serializeCityRow),
  } satisfies PumpWatchSnapshot;
}
