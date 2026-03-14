import { NextResponse } from "next/server";

import { syncPumpWatchSnapshot } from "../../../../lib/pump-watch/dashboard";

export const runtime = "nodejs";

function isAuthorized(request: Request) {
  const configuredSecret =
    process.env.CRON_SECRET ?? process.env.PUMP_WATCH_CRON_SECRET;

  if (!configuredSecret) {
    return process.env.NODE_ENV !== "production";
  }

  const authorization = request.headers.get("authorization");
  return authorization === `Bearer ${configuredSecret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const snapshot = await syncPumpWatchSnapshot();

    return NextResponse.json({
      ok: true,
      sourceKey: snapshot.sourceKey,
      sourceMode: snapshot.sourceMode,
      effectiveAt: snapshot.effectiveAt,
      fetchedAt: snapshot.fetchedAt,
      records: snapshot.cities.length,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Pump Watch refresh failed.";

    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 },
    );
  }
}
