import { apiRequest } from "@/lib/api-client";

/** Mirrors server_application/app/schemas/sandbox.py. */

export type ChartMeta = {
  title: string;
  description: string;
  takeaway: string | null;
  fields_used: string[];
  filters: string[];
  definitions: Record<string, string>;
  source: "mock";
};

export type Kpi = {
  id: string;
  label: string;
  unit: "percent" | "split" | "terms";
  value: number;
  secondary_value: number | null;
  detail: string;
};

export type ChartResponse<Row> = { meta: ChartMeta; rows: Row[] };

export type KpiResponse = { meta: ChartMeta; items: Kpi[] };
export type GatewayCompletion = ChartResponse<{ term: string; english: number; math: number }>;
export type TermEnrollmentRow = { term: string; enrolled_next_term: number; into_fall: boolean };
export type TermEnrollment = ChartResponse<TermEnrollmentRow>;
export type CreditCompletion = ChartResponse<{ cohort_year: number; new: number; transfer: number }>;
export type PersistenceRetention = ChartResponse<{
  cohort_year: number;
  persistence: number;
  retention: number;
}>;
export type CompletionByGroup = ChartResponse<{ group: string; rate: number }>;
export type PersistenceByAge = ChartResponse<{
  age_group: string;
  persistence: number;
  gateway_completion: number;
}>;
export type TimeToComplete = ChartResponse<{ entry_term: string; average_terms: number }>;

/** A loader for one sandbox endpoint, e.g. sandboxLoader("/kpis") fetches /api/v1/sandbox/kpis. */
export function sandboxLoader<T>(endpoint: string): () => Promise<T> {
  return () => apiRequest<T>(`/sandbox${endpoint}`, { cache: "no-store" });
}

export const sandbox = {
  kpis: sandboxLoader<KpiResponse>("/kpis"),
  gatewayCompletion: sandboxLoader<GatewayCompletion>("/gateway-completion"),
  termEnrollment: sandboxLoader<TermEnrollment>("/term-enrollment"),
  creditCompletion: sandboxLoader<CreditCompletion>("/credit-completion"),
  persistenceRetention: sandboxLoader<PersistenceRetention>("/persistence-retention"),
  completionByGroup: sandboxLoader<CompletionByGroup>("/completion-by-group"),
  persistenceByAge: sandboxLoader<PersistenceByAge>("/persistence-by-age"),
  timeToComplete: sandboxLoader<TimeToComplete>("/time-to-complete"),
};
