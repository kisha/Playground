import { ApiError, apiRequest } from "@/lib/api-client";

/** Mirrors HealthResponse in server_application/app/schemas/health.py. */
export type HealthResponse = {
  status: "ok" | "degraded";
  environment: "development" | "staging" | "production";
  version: string;
  database: {
    status: "connected" | "disconnected";
    latency_ms: number | null;
  };
};

export type HealthCheck =
  | { reachable: true; health: HealthResponse }
  | { reachable: false; error: string };

/**
 * Ask the API for its health. A degraded API answers with 503 but still sends a HealthResponse,
 * so that case counts as reachable; only a missing or unreadable response counts as unreachable.
 */
export async function checkHealth(): Promise<HealthCheck> {
  try {
    const health = await apiRequest<HealthResponse>("/health", { cache: "no-store" });
    return { reachable: true, health };
  } catch (error) {
    if (error instanceof ApiError && error.status === 503 && error.body) {
      return { reachable: true, health: error.body as HealthResponse };
    }
    return { reachable: false, error: error instanceof Error ? error.message : String(error) };
  }
}
