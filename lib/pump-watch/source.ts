import { randomUUID } from "node:crypto";

import { CITY_PRICE_PROFILES } from "./cityProfiles";
import { fetchPumpWatchSourceText } from "./fetch-service";
import {
  extractLatestNationalRetailSnapshot,
  parseMbieWeeklyCsv,
} from "./parser";
import type { PumpWatchSnapshot } from "./types";

const FALLBACK_NATIONAL_SNAPSHOT = {
  effectiveAt: "2026-03-06",
  status: "Fallback",
  week: "2026w10",
  regularCpl: 258.280554419077,
  premiumCpl: 271.067117272873,
  dieselCpl: 194.403436925041,
};

function roundCpl(value: number) {
  return Math.round(value * 1000) / 1000;
}

function buildCitySnapshot(
  effectiveAt: string,
  fetchedAt: string,
  sourceLabel: string,
  sourceMode: string,
  rawUrl: string,
  metadata: Record<string, unknown>,
  national: {
    regularCpl: number;
    premiumCpl: number;
    dieselCpl: number;
  },
) {
  return {
    id: randomUUID(),
    sourceKey: "mbie-weekly-derived",
    sourceLabel,
    sourceMode,
    effectiveAt,
    fetchedAt,
    rawUrl,
    metadata,
    cities: CITY_PRICE_PROFILES.map((profile) => {
      const regularCpl = roundCpl(
        national.regularCpl + profile.regularAdjustmentCpl,
      );
      const premiumCpl = roundCpl(
        national.premiumCpl + profile.premiumAdjustmentCpl,
      );
      const dieselCpl = roundCpl(
        national.dieselCpl + profile.dieselAdjustmentCpl,
      );
      const lowCpl = roundCpl(regularCpl - profile.spreadCpl / 2);
      const highCpl = roundCpl(regularCpl + profile.spreadCpl / 2);

      return {
        city: profile.city,
        cityOrder: profile.order,
        regularCpl,
        premiumCpl,
        dieselCpl,
        submissions: profile.submissions,
        lowCpl,
        highCpl,
        spreadCpl: profile.spreadCpl,
      };
    }),
  } satisfies PumpWatchSnapshot;
}

export type PumpWatchSource = {
  fetchSnapshot: () => Promise<PumpWatchSnapshot>;
};

export function createPumpWatchSource(): PumpWatchSource {
  return {
    async fetchSnapshot() {
      const fetchedAt = new Date().toISOString();
      const { rawText, sourceUrl } = await fetchPumpWatchSourceText();
      const rows = parseMbieWeeklyCsv(rawText);
      const nationalSnapshot = extractLatestNationalRetailSnapshot(rows);

      return buildCitySnapshot(
        nationalSnapshot.effectiveAt,
        fetchedAt,
        "MBIE Weekly Fuel Price Monitoring",
        "official-weekly-national-plus-city-basis",
        sourceUrl,
        {
          upstreamStatus: nationalSnapshot.status,
          upstreamWeek: nationalSnapshot.week,
          nationalRetailCpl: {
            regular: nationalSnapshot.regularCpl,
            premium: nationalSnapshot.premiumCpl,
            diesel: nationalSnapshot.dieselCpl,
          },
          transform:
            "City prices are derived automatically from MBIE national retail data plus fixed city basis profiles until a live city feed is connected.",
        },
        nationalSnapshot,
      );
    },
  };
}

export function buildFallbackPumpWatchSnapshot() {
  return buildCitySnapshot(
    FALLBACK_NATIONAL_SNAPSHOT.effectiveAt,
    new Date().toISOString(),
    "Fallback Pump Watch Model",
    "fallback-national-plus-city-basis",
    "local-fallback",
    {
      upstreamStatus: FALLBACK_NATIONAL_SNAPSHOT.status,
      upstreamWeek: FALLBACK_NATIONAL_SNAPSHOT.week,
      transform:
        "Fallback snapshot used because both database access and live source fetch failed.",
    },
    FALLBACK_NATIONAL_SNAPSHOT,
  );
}
