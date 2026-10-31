import { apiRequest } from "@/lib/api-client";

/** Shared by every sandbox page. Mirrors server_application/app/sandbox/shared.py. */

export type ChartMeta = {
  title: string;
  description: string;
  takeaway: string | null;
  fields_used: string[];
  filters: string[];
  definitions: Record<string, string>;
  source: "mock" | "synthetic";
};

/** Every chart answers with its meta plus one row per point or bar. */
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

/** A loader for one sandbox endpoint, e.g. sandboxLoader("/chart-examples") fetches /api/v1/sandbox/chart-examples. */
export function sandboxLoader<T>(endpoint: string): SandboxLoader<T> {
  const path = `/sandbox${endpoint}`;
  return Object.assign(() => apiRequest<T>(path, { cache: "no-store" }), { path });
}

/** Loads one chart by name from a page's endpoint, so each card keeps its own loading and errors. */
export function chartLoader<Chart>(endpoint: string, chartName: string): SandboxLoader<Chart> {
  const load = sandboxLoader<Record<string, Chart>>(`${endpoint}?charts=${chartName}`);
  return Object.assign(() => load().then((charts) => charts[chartName]), { path: load.path });
}

/** Loads one filter example. `query` is its filters, e.g. "gender=Female", and can't change which example. */
export function filterExampleLoader<T>(example: string, query = ""): SandboxLoader<T> {
  const params = new URLSearchParams(query);
  params.set("example", example);
  return sandboxLoader<T>(`/filter-example?${params}`);
}
