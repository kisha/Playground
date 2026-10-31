import { type ChartResponse, chartLoader } from "@/app/(app)/sandbox/shared";

/** /sandbox/chart-examples: one type and one loader per chart. Mirrors server_application/app/sandbox/chart_examples/schemas.py. */

type GatewayCompletion = ChartResponse<{ term: string; english: number; math: number }>;
export type TermEnrollmentRow = { term: string; enrolled_next_term: number; into_fall: boolean };
type TermEnrollment = ChartResponse<TermEnrollmentRow>;
type CreditCompletion = ChartResponse<{ cohort_year: number; new: number; transfer: number }>;
type PersistenceRetention = ChartResponse<{
  cohort_year: number;
  persistence: number;
  retention: number;
}>;
export type CompletionByGroup = ChartResponse<{ group: string; rate: number }>;
type PersistenceByAge = ChartResponse<{
  age_group: string;
  persistence: number;
  gateway_completion: number;
}>;
export type TimeToComplete = ChartResponse<{ entry_term: string; average_terms: number }>;
export type EntryStatusShare = ChartResponse<{ status: string; share: number }>;
export type GenderShare = ChartResponse<{ gender: string; share: number }>;
type CreditLoad = ChartResponse<{
  cohort_year: number;
  full_time: number;
  three_quarter: number;
  half_time_or_less: number;
}>;
type Headcount = ChartResponse<{ term: string; students: number }>;

const ENDPOINT = "/chart-examples";

export const chartLoaders = {
  gatewayCompletion: chartLoader<GatewayCompletion>(ENDPOINT, "gateway-completion"),
  termEnrollment: chartLoader<TermEnrollment>(ENDPOINT, "term-enrollment"),
  creditCompletion: chartLoader<CreditCompletion>(ENDPOINT, "credit-completion"),
  persistenceRetention: chartLoader<PersistenceRetention>(ENDPOINT, "persistence-retention"),
  completionByGroup: chartLoader<CompletionByGroup>(ENDPOINT, "completion-by-group"),
  persistenceByAge: chartLoader<PersistenceByAge>(ENDPOINT, "persistence-by-age"),
  timeToComplete: chartLoader<TimeToComplete>(ENDPOINT, "time-to-complete"),
  entryStatusShare: chartLoader<EntryStatusShare>(ENDPOINT, "entry-status-share"),
  genderShare: chartLoader<GenderShare>(ENDPOINT, "gender-share"),
  creditLoad: chartLoader<CreditLoad>(ENDPOINT, "credit-load"),
  headcount: chartLoader<Headcount>(ENDPOINT, "headcount"),
};
