import {
  Pool,
  type PoolClient,
  type QueryResult,
  type QueryResultRow,
} from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __nzFuelDashboardPool: Pool | undefined;
}

type DbClient = Pool | PoolClient;

function isLocalDatabase(url: string) {
  return (
    url.includes("localhost") ||
    url.includes("127.0.0.1") ||
    url.includes(".local")
  );
}

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function getPool() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!global.__nzFuelDashboardPool) {
    global.__nzFuelDashboardPool = new Pool({
      connectionString,
      ssl: isLocalDatabase(connectionString)
        ? undefined
        : { rejectUnauthorized: false },
    });
  }

  return global.__nzFuelDashboardPool;
}

export async function withDbClient<T>(
  action: (client: PoolClient) => Promise<T>,
) {
  const client = await getPool().connect();

  try {
    return await action(client);
  } finally {
    client.release();
  }
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  values: unknown[] = [],
  client?: DbClient,
) {
  const db = client ?? getPool();
  return db.query(text, values) as Promise<QueryResult<T>>;
}
