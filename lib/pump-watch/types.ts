export type PumpWatchSnapshotCity = {
  city: string;
  cityOrder: number;
  regularCpl: number;
  premiumCpl: number;
  dieselCpl: number;
  submissions: number;
  lowCpl: number;
  highCpl: number;
  spreadCpl: number;
};

export type PumpWatchSnapshot = {
  id: string;
  sourceKey: string;
  sourceLabel: string;
  sourceMode: string;
  effectiveAt: string;
  fetchedAt: string;
  rawUrl: string;
  metadata: Record<string, unknown>;
  cities: PumpWatchSnapshotCity[];
};

export type PumpWatchDashboardRow = {
  city: string;
  regular: string;
  premium: string;
  diesel: string;
  updated: string;
};

export type PumpWatchSpreadRow = {
  city: string;
  submissions: number;
  low: string;
  high: string;
  spread: string;
  status: "up" | "down" | "warning" | "flat";
};

export type PumpWatchDashboardData = {
  pumpWatchRows: PumpWatchDashboardRow[];
  spreadRows: PumpWatchSpreadRow[];
  pumpWatchBadge: string;
  communityBadge: string;
  storageMode: "database" | "source-direct" | "fallback";
};

export type MbieWeeklyRow = {
  week: string;
  date: string;
  fuel: string;
  variable: string;
  value: number;
  unit: string;
  status: string;
};
