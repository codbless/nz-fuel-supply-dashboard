import { isDatabaseConfigured } from "../db";
import { buildFallbackPumpWatchSnapshot, createPumpWatchSource } from "./source";
import { getLatestPumpWatchSnapshot, storePumpWatchSnapshot } from "./storage";
import type {
  PumpWatchDashboardData,
  PumpWatchSnapshot,
  PumpWatchSpreadRow,
} from "./types";

const DEFAULT_STALE_HOURS = 12;

function formatPrice(cpl: number) {
  return `$${(cpl / 100).toFixed(2)}`;
}

function formatRelativeTime(timestamp: string) {
  const ageMs = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.max(0, Math.round(ageMs / 60000));

  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h`;

  const days = Math.round(hours / 24);
  return `${days}d`;
}

function spreadStatus(spreadCpl: number): PumpWatchSpreadRow["status"] {
  if (spreadCpl >= 16) return "warning";
  if (spreadCpl >= 12) return "flat";
  return "up";
}

function toDashboardData(
  snapshot: PumpWatchSnapshot,
  storageMode: PumpWatchDashboardData["storageMode"],
): PumpWatchDashboardData {
  const updated = formatRelativeTime(snapshot.fetchedAt);
  const sourceBadge =
    snapshot.sourceMode === "official-weekly-national-plus-city-basis"
      ? "MBIE + basis"
      : snapshot.sourceMode === "fallback-national-plus-city-basis"
        ? "Fallback model"
        : snapshot.sourceLabel;
  const storageBadge =
    storageMode === "database"
      ? `DB sync ${updated}`
      : storageMode === "source-direct"
        ? `Auto fetch ${updated}`
        : `Fallback ${updated}`;

  return {
    pumpWatchRows: snapshot.cities.map((city) => ({
      city: city.city,
      regular: formatPrice(city.regularCpl),
      premium: formatPrice(city.premiumCpl),
      diesel: formatPrice(city.dieselCpl),
      updated,
    })),
    spreadRows: snapshot.cities.map((city) => ({
      city: city.city,
      submissions: city.submissions,
      low: formatPrice(city.lowCpl),
      high: formatPrice(city.highCpl),
      spread: formatPrice(city.spreadCpl),
      status: spreadStatus(city.spreadCpl),
    })),
    pumpWatchBadge: sourceBadge,
    communityBadge: storageBadge,
    storageMode,
  };
}

function getStaleThresholdMs() {
  const hours = Number(
    process.env.PUMP_WATCH_MAX_STALE_HOURS ?? DEFAULT_STALE_HOURS,
  );

  return Math.max(1, hours) * 60 * 60 * 1000;
}

function isSnapshotFresh(snapshot: PumpWatchSnapshot | null) {
  if (!snapshot) {
    return false;
  }

  return Date.now() - new Date(snapshot.fetchedAt).getTime() < getStaleThresholdMs();
}

export async function syncPumpWatchSnapshot() {
  const snapshot = await createPumpWatchSource().fetchSnapshot();

  if (isDatabaseConfigured()) {
    await storePumpWatchSnapshot(snapshot);
  }

  return snapshot;
}

export async function getPumpWatchDashboardData(): Promise<PumpWatchDashboardData> {
  const databaseBacked = isDatabaseConfigured();
  const latestSnapshot = databaseBacked ? await getLatestPumpWatchSnapshot() : null;

  if (databaseBacked && latestSnapshot && isSnapshotFresh(latestSnapshot)) {
    return toDashboardData(latestSnapshot, "database");
  }

  try {
    const freshSnapshot = await syncPumpWatchSnapshot();
    return toDashboardData(
      freshSnapshot,
      databaseBacked ? "database" : "source-direct",
    );
  } catch (error) {
    if (latestSnapshot) {
      return toDashboardData(latestSnapshot, "database");
    }

    return toDashboardData(buildFallbackPumpWatchSnapshot(), "fallback");
  }
}
