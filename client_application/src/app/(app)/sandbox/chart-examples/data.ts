import { type ChartResponse, sandboxLoader } from "@/app/(app)/sandbox/shared";

/** /sandbox/chart-examples: one type and one loader per endpoint. Mirrors server_application/app/sandbox/schemas.py. */

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
export type EntryStatusShare = ChartResponse<{ status: string; share: number }>;
export type GenderShare = ChartResponse<{ gender: string; share: number }>;
export type CreditLoad = ChartResponse<{
  cohort_year: number;
  full_time: number;
  three_quarter: number;
  half_time_or_less: number;
}>;
export type Headcount = ChartResponse<{ term: string; students: number }>;

export const endpoints = {
  gatewayCompletion: sandboxLoader<GatewayCompletion>("/gateway-completion"),
  termEnrollment: sandboxLoader<TermEnrollment>("/term-enrollment"),
  creditCompletion: sandboxLoader<CreditCompletion>("/credit-completion"),
  persistenceRetention: sandboxLoader<PersistenceRetention>("/persistence-retention"),
  completionByGroup: sandboxLoader<CompletionByGroup>("/completion-by-group"),
  persistenceByAge: sandboxLoader<PersistenceByAge>("/persistence-by-age"),
  timeToComplete: sandboxLoader<TimeToComplete>("/time-to-complete"),
  entryStatusShare: sandboxLoader<EntryStatusShare>("/entry-status-share"),
  genderShare: sandboxLoader<GenderShare>("/gender-share"),
  creditLoad: sandboxLoader<CreditLoad>("/credit-load"),
  headcount: sandboxLoader<Headcount>("/headcount"),
};
