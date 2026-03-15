export type MarketSourceConfig = {
  symbol: string;
  label: string;
  refresh_ms: number;
};

export type TickerSymbolConfig = {
  symbol: string;
  label: string;
  sourceSymbol: string;
};

export type TankerTrackingConfig = {
  provider: string;
  api_base: string;
  refresh_ms: number;
};

export type NzFuelPort = {
  name: string;
  unloco: string;
};

export type AucklandStationWatch = {
  name: string;
  diesel: number;
  petrol91: number;
};

export const markets = {
  brent: {
    symbol: "TVC:UKOIL",
    label: "Brent Crude",
    refresh_ms: 30_000,
  },
  wti: {
    symbol: "TVC:USOIL",
    label: "WTI Crude",
    refresh_ms: 30_000,
  },
  nzdusd: {
    symbol: "FX:NZDUSD",
    label: "USD/NZD",
    refresh_ms: 30_000,
  },
} satisfies Record<string, MarketSourceConfig>;

export const tradingViewTickerSymbols: TickerSymbolConfig[] = [
  {
    symbol: "OIL_BRENT",
    label: markets.brent.label,
    sourceSymbol: markets.brent.symbol,
  },
  {
    symbol: "USOIL",
    label: markets.wti.label,
    sourceSymbol: markets.wti.symbol,
  },
  {
    symbol: "USDNZD",
    label: markets.nzdusd.label,
    sourceSymbol: markets.nzdusd.symbol,
  },
];

export const tankerTracking: TankerTrackingConfig = {
  provider: "MyShipTracking",
  api_base: "https://api.myshiptracking.com/api/v2",
  refresh_ms: 300_000,
};

export async function fetchTankers(apiKey: string) {
  const response = await fetch(`${tankerTracking.api_base}/vessel/nearby`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `MyShipTracking request failed: ${response.status} ${response.statusText}`,
    );
  }

  return (await response.json()) as unknown;
}

export const nzFuelPorts: NzFuelPort[] = [
  {
    name: "Marsden Point",
    unloco: "NZMAP",
  },
  {
    name: "Auckland",
    unloco: "NZAKL",
  },
  {
    name: "Tauranga",
    unloco: "NZTRG",
  },
  {
    name: "Lyttelton",
    unloco: "NZLYT",
  },
];

export const aucklandStations: AucklandStationWatch[] = [
  {
    name: "Costco Westgate",
    diesel: 2.547,
    petrol91: 2.887,
  },
  {
    name: "Gull Hobsonville",
    diesel: 2.549,
    petrol91: 2.949,
  },
  {
    name: "BP Hobsonville",
    diesel: 2.699,
    petrol91: 3.05,
  },
];

export const refreshTimers = {
  oil_prices: 30_000,
  fx_rates: 30_000,
  tanker_tracking: 300_000,
  station_prices: 900_000,
} as const;

export const dashboardRefreshMs = Math.min(
  refreshTimers.tanker_tracking,
  refreshTimers.station_prices,
);
