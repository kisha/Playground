import type { HealthCheck } from "@/services/health";

/** One health check, as seen from the browser. */
export type CheckResult = {
  id: number;
  at: number;
  check: HealthCheck;
  /** Browser → API → browser, in milliseconds. */
  roundTripMs: number;
};

export type LinkState = "healthy" | "degraded" | "offline" | "pending";

export type SystemStatus = {
  overall: LinkState;
  label: string;
  website: LinkState;
  api: LinkState;
  database: LinkState;
};

const LABELS: Record<LinkState, string> = {
  healthy: "All systems connected",
  degraded: "Server application up, database unreachable",
  offline: "Server application unreachable",
  pending: "Checking connection…",
};

/** Turn the latest health check into a state for each part of the system. */
export function toSystemStatus(result: CheckResult | undefined): SystemStatus {
  if (!result) {
    return { overall: "pending", label: LABELS.pending, website: "healthy", api: "pending", database: "pending" };
  }
  if (!result.check.reachable) {
    return { overall: "offline", label: LABELS.offline, website: "healthy", api: "offline", database: "pending" };
  }
  const databaseUp = result.check.health.database.status === "connected";
  const overall: LinkState = databaseUp ? "healthy" : "degraded";
  return {
    overall,
    label: LABELS[overall],
    website: "healthy",
    api: "healthy",
    database: databaseUp ? "healthy" : "offline",
  };
}

/** State of a single check, for the status tracker. */
export function toCheckState(result: CheckResult): LinkState {
  return toSystemStatus(result).overall;
}
