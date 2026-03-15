import { nzFuelPorts } from "../dashboard-config";
import type { TankerRoute, TankerRouteAlign, TankerRouteTone } from "./types";

type RouteTemplate = {
  destination: string;
  top: string;
  left: string;
  path: string;
  tone: TankerRouteTone;
  align: TankerRouteAlign;
};

type FallbackRouteSeed = {
  vessel: string;
  short: string;
  origin: string;
  destination: string;
  cargo: string;
  days: number;
};

const routeTemplates: RouteTemplate[] = [
  {
    destination: "Auckland",
    top: "35%",
    left: "60%",
    path: "M 590 214 C 646 225, 735 287, 856 382",
    tone: "amber",
    align: "start",
  },
  {
    destination: "Tauranga",
    top: "23%",
    left: "70%",
    path: "M 676 152 C 744 176, 804 248, 858 382",
    tone: "mint",
    align: "end",
  },
  {
    destination: "Lyttelton",
    top: "49%",
    left: "57%",
    path: "M 566 232 C 626 266, 720 346, 848 406",
    tone: "ice",
    align: "start",
  },
  {
    destination: "Marsden Point",
    top: "61%",
    left: "75%",
    path: "M 748 343 C 785 343, 822 352, 856 378",
    tone: "rose",
    align: "end",
  },
];

const fallbackRoutes: FallbackRouteSeed[] = [
  {
    vessel: "MT Matuku",
    short: "MAT",
    origin: "Singapore",
    destination: "Auckland",
    cargo: "Gasoline blendstock",
    days: 9,
  },
  {
    vessel: "MT Waitemata",
    short: "WAI",
    origin: "South Korea",
    destination: "Tauranga",
    cargo: "ULSD cargo",
    days: 12,
  },
  {
    vessel: "MT Southern Current",
    short: "SCR",
    origin: "Strait of Malacca",
    destination: "Lyttelton",
    cargo: "Jet / diesel split cargo",
    days: 16,
  },
  {
    vessel: "MT Tasman Dawn",
    short: "TSD",
    origin: "Tasman staging",
    destination: "Marsden Point",
    cargo: "Coastal redistribution",
    days: 3,
  },
];

function templateForDestination(destination: string, index: number): RouteTemplate {
  return (
    routeTemplates.find((template) => template.destination === destination) ??
    routeTemplates[index % routeTemplates.length]
  );
}

function toShortCode(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 3);
}

function formatEtaBadge(days: number) {
  return `${Math.max(1, days)}d`;
}

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function extractVessels(payload: unknown): Record<string, unknown>[] {
  if (Array.isArray(payload)) {
    return payload.filter(
      (entry): entry is Record<string, unknown> =>
        typeof entry === "object" && entry !== null,
    );
  }

  if (typeof payload !== "object" || payload === null) {
    return [];
  }

  const record = payload as Record<string, unknown>;
  const candidateKeys = ["data", "vessels", "ships", "results", "items"];

  for (const key of candidateKeys) {
    const candidate = record[key];
    if (Array.isArray(candidate)) {
      return candidate.filter(
        (entry): entry is Record<string, unknown> =>
          typeof entry === "object" && entry !== null,
      );
    }
  }

  return [];
}

function resolveDestination(vessel: Record<string, unknown>) {
  const destinationFields = [
    vessel.destination,
    vessel.destination_port,
    vessel.destinationPort,
    vessel.destination_name,
    vessel.destinationName,
    vessel.destination_unloco,
    vessel.unloco,
    vessel.port_code,
  ];

  const haystack = destinationFields
    .map(normalizeString)
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    nzFuelPorts.find((port) => {
      const unlocoCode = port.unloco.toLowerCase();
      return (
        haystack.includes(port.name.toLowerCase()) ||
        haystack.includes(unlocoCode) ||
        haystack.includes(unlocoCode.slice(2))
      );
    })?.name ?? null
  );
}

function resolveOrigin(vessel: Record<string, unknown>) {
  return (
    normalizeString(vessel.origin) ||
    normalizeString(vessel.last_port) ||
    normalizeString(vessel.lastPort) ||
    normalizeString(vessel.departed_from) ||
    normalizeString(vessel.departedFrom) ||
    "Pacific approach"
  );
}

function resolveCargo(vessel: Record<string, unknown>) {
  return (
    normalizeString(vessel.cargo) ||
    normalizeString(vessel.cargo_type) ||
    normalizeString(vessel.cargoType) ||
    normalizeString(vessel.ship_type) ||
    normalizeString(vessel.shipType) ||
    "Refined products cargo"
  );
}

function resolveEtaDays(vessel: Record<string, unknown>, index: number) {
  const directDays = [
    vessel.days,
    vessel.days_to_arrival,
    vessel.daysToArrival,
    vessel.eta_days,
    vessel.etaDays,
  ]
    .map(normalizeNumber)
    .find((value) => value !== null);

  if (directDays !== undefined) {
    return Math.max(1, Math.round(directDays ?? 0));
  }

  const etaFields = [vessel.eta, vessel.eta_utc, vessel.arrival_eta, vessel.arrivalEta];

  for (const etaField of etaFields) {
    const etaText = normalizeString(etaField);
    if (!etaText) {
      continue;
    }

    const etaTimestamp = Date.parse(etaText);
    if (Number.isNaN(etaTimestamp)) {
      continue;
    }

    const msUntilEta = etaTimestamp - Date.now();
    return Math.max(1, Math.ceil(msUntilEta / (24 * 60 * 60 * 1000)));
  }

  return 6 + index * 3;
}

function buildRoute(
  vessel: string,
  short: string,
  origin: string,
  destination: string,
  cargo: string,
  days: number,
  index: number,
): TankerRoute {
  const template = templateForDestination(destination, index);
  const etaBadge = formatEtaBadge(days);

  return {
    vessel,
    short,
    route: `${origin} -> ${destination}`,
    destination,
    cargo,
    eta: `${destination} arrival in ${days} days`,
    etaBadge,
    days,
    top: template.top,
    left: template.left,
    path: template.path,
    tone: template.tone,
    align: template.align,
  };
}

export function buildFallbackTankerRoutes() {
  return fallbackRoutes.map((route, index) =>
    buildRoute(
      route.vessel,
      route.short,
      route.origin,
      route.destination,
      route.cargo,
      route.days,
      index,
    ),
  );
}

export function parseTankers(payload: unknown) {
  const parsedRoutes = extractVessels(payload)
    .map((vessel, index) => {
      const destination = resolveDestination(vessel);

      if (!destination) {
        return null;
      }

      const vesselName =
        normalizeString(vessel.name) ||
        normalizeString(vessel.vessel_name) ||
        normalizeString(vessel.vesselName) ||
        normalizeString(vessel.ship_name) ||
        normalizeString(vessel.shipName);

      if (!vesselName) {
        return null;
      }

      const days = resolveEtaDays(vessel, index);

      return buildRoute(
        vesselName,
        toShortCode(vesselName),
        resolveOrigin(vessel),
        destination,
        resolveCargo(vessel),
        days,
        index,
      );
    })
    .filter((route): route is TankerRoute => route !== null)
    .sort((left, right) => left.days - right.days)
    .slice(0, routeTemplates.length);

  return parsedRoutes;
}
