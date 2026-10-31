import { type ChartResponse, sandboxLoader } from "@/app/(app)/sandbox/shared";

/** /sandbox/measures: typed query filters and their matching chart payload. */
export const measures = ["retention", "persistence", "gateway_math", "gateway_english"] as const;
export type Measure = (typeof measures)[number];

export const cohorts = ["2021-22", "2022-23", "2023-24", "2024-25"] as const;
export type Cohort = (typeof cohorts)[number];

export const groupBys = ["race", "gender", "pell", "age_band", "enrollment_intensity"] as const;
export type GroupBy = (typeof groupBys)[number];

export const measureLabels: Record<Measure, string> = {
  retention: "Retention",
  persistence: "Persistence",
  gateway_math: "Gateway math completion",
  gateway_english: "Gateway English completion",
};

export const cohortLabels: Record<Cohort, string> = {
  "2021-22": "2021–22",
  "2022-23": "2022–23",
  "2023-24": "2023–24",
  "2024-25": "2024–25",
};

export const groupByLabels: Record<GroupBy, string> = {
  race: "Race and ethnicity",
  gender: "Gender",
  pell: "Pell eligibility",
  age_band: "Age band",
  enrollment_intensity: "Enrollment intensity",
};

export type GroupRate = ChartResponse<{ group: string; rate: number | null; n: number | null }>;

export function groupRateLoader(measure: Measure, cohort: Cohort, groupBy: GroupBy) {
  const searchParams = new URLSearchParams({
    measure,
    cohort,
    group_by: groupBy,
  });
  return sandboxLoader<GroupRate>(`/measures/by-group?${searchParams.toString()}`);
}
