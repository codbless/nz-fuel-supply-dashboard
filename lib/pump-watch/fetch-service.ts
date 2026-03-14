const DEFAULT_MBIE_WEEKLY_SOURCE_URL =
  "https://www.mbie.govt.nz/assets/Data-Files/Energy/Weekly-fuel-price-monitoring/weekly-table.csv";

export function getPumpWatchSourceUrl() {
  return process.env.PUMP_WATCH_SOURCE_URL ?? DEFAULT_MBIE_WEEKLY_SOURCE_URL;
}

export async function fetchPumpWatchSourceText() {
  const sourceUrl = getPumpWatchSourceUrl();
  const response = await fetch(sourceUrl, {
    cache: "no-store",
    headers: {
      "user-agent": "nz-fuel-supply-dashboard/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Pump Watch source request failed (${response.status} ${response.statusText}).`,
    );
  }

  return {
    sourceUrl,
    rawText: await response.text(),
  };
}
