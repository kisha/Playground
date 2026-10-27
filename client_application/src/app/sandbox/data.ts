import { type ChartResponse, type KpiResponse, sandboxLoader } from "@/app/sandbox/shared";

/** /sandbox: one type and one loader per endpoint. Mirrors server_application/app/sandbox/schemas.py. */

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

export const endpoints = {
  kpis: sandboxLoader<KpiResponse>("/kpis"),
  gatewayCompletion: sandboxLoader<GatewayCompletion>("/gateway-completion"),
  termEnrollment: sandboxLoader<TermEnrollment>("/term-enrollment"),
  creditCompletion: sandboxLoader<CreditCompletion>("/credit-completion"),
  persistenceRetention: sandboxLoader<PersistenceRetention>("/persistence-retention"),
  completionByGroup: sandboxLoader<CompletionByGroup>("/completion-by-group"),
  persistenceByAge: sandboxLoader<PersistenceByAge>("/persistence-by-age"),
  timeToComplete: sandboxLoader<TimeToComplete>("/time-to-complete"),
};
