import { type ChartMeta, filterExampleLoader } from "@/app/(app)/sandbox/shared";

/** /sandbox/filters: one type and one loader. Mirrors FilteredCompletionResponse in server_application. */

export type FilteredCompletion = {
  meta: ChartMeta;
  applied_filters: string[];
  kpis: { gateway_completion: number; english: number; math: number };
  trend: { cohort_year: number; english: number; math: number }[];
  groups: { group: string; rate: number }[];
};

/** The loader for one filtered view. `query` is what the URL's filters come to, e.g. "gender=Female". */
export function filteredCompletionLoader(query: string) {
  return filterExampleLoader<FilteredCompletion>("example-one", query);
}
