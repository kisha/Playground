import { env } from "@/lib/env";
import type { HealthCheckOutcome } from "@/services/health";

/** How often the landing page checks /health, and how many checks it keeps on screen. */
export const HEALTH_CHECK_INTERVAL_MS = 5_000;
export const HEALTH_CHECK_HISTORY_SIZE = 30;

/** One health check, as seen from the browser. */
export type HealthCheckRecord = {
  id: number;
  checkedAt: number;
  outcome: HealthCheckOutcome;
  /** Browser → API → browser, in milliseconds. */
  roundTripMs: number;
};

export type ConnectionState = "healthy" | "degraded" | "offline" | "pending";

export type SystemStatus = {
  overall: ConnectionState;
  label: string;
  clientApplication: ConnectionState;
  serverApplication: ConnectionState;
  database: ConnectionState;
};

const STATUS_LABELS: Record<ConnectionState, string> = {
  healthy: "All systems connected",
  degraded: "Server application up, database unreachable",
  offline: "Server application unreachable",
  pending: "Checking connection…",
};

/** Turn the latest health check into a state for each part of the system. */
export function toSystemStatus(record: HealthCheckRecord | undefined): SystemStatus {
  if (!record) {
    return {
      overall: "pending",
      label: STATUS_LABELS.pending,
      clientApplication: "healthy",
      serverApplication: "pending",
      database: "pending",
    };
  }
  if (!record.outcome.reachable) {
    return {
      overall: "offline",
      label: STATUS_LABELS.offline,
      clientApplication: "healthy",
      serverApplication: "offline",
      database: "pending",
    };
  }
  const databaseConnected = record.outcome.health.database.status === "connected";
  const overall: ConnectionState = databaseConnected ? "healthy" : "degraded";
  return {
    overall,
    label: STATUS_LABELS[overall],
    clientApplication: "healthy",
    serverApplication: "healthy",
    database: databaseConnected ? "healthy" : "offline",
  };
}

/** State of a single check, for the status tracker. */
export function toCheckState(record: HealthCheckRecord): ConnectionState {
  return toSystemStatus(record).overall;
}

/** A line in the diagram carries traffic only when the box it leads to is healthy. */
export function isConnected(state: ConnectionState): boolean {
  return state === "healthy";
}

export type DiagramNode = {
  name: string;
  technology: string;
  detail: string;
  state: ConnectionState;
};

/** How the Data box names each database. Unknown until the API answers. */
const databaseLabels = { postgresql: "PostgreSQL · pgvector", sqlite: "SQLite" } as const;

/** The three boxes of the landing page diagram: Client Application → Server Application → Data. */
export function toDiagramNodes(latest: HealthCheckRecord | undefined): [DiagramNode, DiagramNode, DiagramNode] {
  const status = toSystemStatus(latest);
  const health = latest?.outcome.reachable ? latest.outcome.health : undefined;

  const serverDetail = !latest ? "checking…" : health ? `${latest.roundTripMs} ms` : "unreachable";
  const databaseDetail = !health
    ? "unknown"
    : health.database.status === "connected"
      ? `${health.database.latency_ms} ms`
      : "disconnected";

  return [
    { name: "Client Application", technology: "Next.js", detail: env.appEnv, state: status.clientApplication },
    { name: "Server Application", technology: "FastAPI", detail: serverDetail, state: status.serverApplication },
    {
      name: "Data",
      technology: health ? databaseLabels[health.database.engine] : "Database",
      detail: databaseDetail,
      state: status.database,
    },
  ];
}

/** "API v0.1.0" from the latest answer, or a dash while the API can't be reached. */
export function apiVersionLabel(latest: HealthCheckRecord | undefined): string {
  return latest?.outcome.reachable ? `API v${latest.outcome.health.version}` : "—";
}

/** Points for the latency sparkline. Unreachable checks become null, which draws a gap. */
export function toLatencyPoints(history: HealthCheckRecord[]): { id: number; roundTripMs: number | null }[] {
  return history.map((record) => ({
    id: record.id,
    roundTripMs: record.outcome.reachable ? record.roundTripMs : null,
  }));
}

/** Tooltip for one tracker block, e.g. "10:42:07 AM · healthy · 12 ms". */
export function describeCheck(record: HealthCheckRecord): string {
  const time = new Date(record.checkedAt).toLocaleTimeString();
  return `${time} · ${toCheckState(record)} · ${record.roundTripMs} ms`;
}

/** How many grey placeholder blocks to show before enough checks have arrived. */
export function emptySlotCount(history: HealthCheckRecord[], totalSlots: number): number {
  return Math.max(totalSlots - history.length, 0);
}
