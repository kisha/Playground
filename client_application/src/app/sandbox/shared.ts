import { apiRequest } from "@/lib/api-client";

/** Shared by every sandbox page. Mirrors server_application/app/sandbox/shared.py. */

export type ChartMeta = {
  title: string;
  description: string;
  takeaway: string | null;
  fields_used: string[];
  filters: string[];
  definitions: Record<string, string>;
  source: "mock";
};

/** Every chart endpoint answers with its meta plus one row per point or bar. */
export type ChartResponse<Row> = { meta: ChartMeta; rows: Row[] };

export type Kpi = {
  id: string;
  label: string;
  unit: "percent" | "split" | "terms";
  value: number;
  secondary_value: number | null;
  detail: string;
};

export type KpiResponse = { meta: ChartMeta; items: Kpi[] };

/** Loads one sandbox endpoint. `path` is what it fetches, relative to the API base URL. */
export type SandboxLoader<T> = (() => Promise<T>) & { path: string };

/** A loader for one sandbox endpoint, e.g. sandboxLoader("/kpis") fetches /api/v1/sandbox/kpis. */
export function sandboxLoader<T>(endpoint: string): SandboxLoader<T> {
  const path = `/sandbox${endpoint}`;
  return Object.assign(() => apiRequest<T>(path, { cache: "no-store" }), { path });
}
