import { ApiError, apiRequest } from "@/lib/api-client";
import { describeError } from "@/lib/errors";

/** Mirrors HealthResponse in server_application/app/schemas/health.py. */
export type DatabaseEngine = "postgresql" | "sqlite";

export type HealthResponse = {
  status: "ok" | "degraded";
  environment: "development" | "staging" | "production";
  version: string;
  database: {
    /** PostgreSQL by default; SQLite when an instance chooses it. */
    engine: DatabaseEngine;
    status: "connected" | "disconnected";
    latency_ms: number | null;
  };
};

export type HealthCheckOutcome =
  | { reachable: true; health: HealthResponse }
  | { reachable: false; error: string };

/**
 * Ask the API for its health. A degraded API answers with 503 but still sends a HealthResponse,
 * so that case counts as reachable; only a missing or unreadable response counts as unreachable.
 */
export async function checkHealth(timeoutMs?: number): Promise<HealthCheckOutcome> {
  try {
    const health = await apiRequest<HealthResponse>("/health", { cache: "no-store", timeoutMs });
    return { reachable: true, health };
  } catch (error) {
    if (error instanceof ApiError && error.status === 503 && error.body) {
      return { reachable: true, health: error.body as HealthResponse };
    }
    return { reachable: false, error: describeError(error) };
  }
}

/** The database the API is running on, or undefined when the API can't be reached quickly. */
export async function currentDatabaseEngine(): Promise<DatabaseEngine | undefined> {
  const outcome = await checkHealth(2_000);
  return outcome.reachable ? outcome.health.database.engine : undefined;
}
