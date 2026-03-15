import { fetchTankers, nzFuelPorts, tankerTracking } from "../dashboard-config";
import { buildFallbackTankerRoutes, parseTankers } from "./parser";
import type { TankerRoute, TankerWatchDashboardData } from "./types";

function toDashboardData(
  routes: TankerRoute[],
  sourceMode: TankerWatchDashboardData["sourceMode"],
) {
  const sortedRoutes = [...routes].sort((left, right) => left.days - right.days);
  const soonestRoute = sortedRoutes[0] ?? buildFallbackTankerRoutes()[0];

  return {
    routes: sortedRoutes,
    soonestRoute,
    providerBadge:
      sourceMode === "live"
        ? `${tankerTracking.provider} live`
        : `${tankerTracking.provider} fallback`,
    providerLabel: tankerTracking.provider,
    trackedPortCount: nzFuelPorts.length,
    sourceMode,
  } satisfies TankerWatchDashboardData;
}

export async function getTankerWatchDashboardData() {
  const apiKey = process.env.MYSHIPTRACKING_API_KEY;

  if (!apiKey) {
    return toDashboardData(buildFallbackTankerRoutes(), "fallback");
  }

  try {
    const payload = await fetchTankers(apiKey);
    const routes = parseTankers(payload);

    if (routes.length > 0) {
      return toDashboardData(routes, "live");
    }
  } catch (_error) {
    return toDashboardData(buildFallbackTankerRoutes(), "fallback");
  }

  return toDashboardData(buildFallbackTankerRoutes(), "fallback");
}
