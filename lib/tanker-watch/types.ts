export type TankerRouteTone = "amber" | "mint" | "ice" | "rose";

export type TankerRouteAlign = "start" | "end";

export type TankerRoute = {
  vessel: string;
  short: string;
  route: string;
  destination: string;
  cargo: string;
  eta: string;
  etaBadge: string;
  days: number;
  top: string;
  left: string;
  path: string;
  tone: TankerRouteTone;
  align: TankerRouteAlign;
};

export type TankerWatchDashboardData = {
  routes: TankerRoute[];
  soonestRoute: TankerRoute;
  providerBadge: string;
  providerLabel: string;
  trackedPortCount: number;
  sourceMode: "live" | "fallback";
};
