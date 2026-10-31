import { chartLoader, type KpiResponse } from "@/app/(app)/sandbox/shared";

/** /sandbox/kpi-examples: one loader per group of KPI cards. */

const ENDPOINT = "/kpi-examples";

export const kpiLoaders = {
  studentProgress: chartLoader<KpiResponse>(ENDPOINT, "student-progress"),
  studentMix: chartLoader<KpiResponse>(ENDPOINT, "student-mix"),
  timeToComplete: chartLoader<KpiResponse>(ENDPOINT, "time-to-complete"),
};
