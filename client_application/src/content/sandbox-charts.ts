/** Which fields each example chart draws, and how they are labelled. Edit here, not in the components. */

import { type BarListItem, type ChartSeries, formatPercent, toBarListItems } from "@/lib/charts";
import type { CompletionByGroup, TermEnrollmentRow, TimeToComplete } from "@/services/sandbox";

export const KPI_COUNT = 8;

export const gatewayCompletionSeries: ChartSeries[] = [
  { key: "english", label: "English" },
  { key: "math", label: "Math", dashed: true },
];

export const termEnrollmentSeries: ChartSeries[] = [{ key: "enrolled_next_term", label: "Enrolled again" }];

/** Fall terms are drawn as filled points. */
export function isIntoFall(row: TermEnrollmentRow): boolean {
  return row.into_fall;
}
export const termEnrollmentLegend = "Filled points: continuing into fall.";

export const creditCompletionSeries: ChartSeries[] = [
  { key: "new", label: "New" },
  { key: "transfer", label: "Transfer", dashed: true },
];

export const persistenceRetentionSeries: ChartSeries[] = [
  { key: "persistence", label: "Persistence" },
  { key: "retention", label: "Retention", dashed: true },
];

/** First series solid, second striped. */
export const persistenceByAgeSeries: [ChartSeries, ChartSeries] = [
  { key: "persistence", label: "Persistence" },
  { key: "gateway_completion", label: "Gateway course completion" },
];

/** Longest bar on the time-to-complete chart, in terms. */
export const TIME_TO_COMPLETE_MAX_TERMS = 8;

export function completionByGroupBars(rows: CompletionByGroup["rows"]): BarListItem[] {
  return toBarListItems(rows, (row) => row.group, (row) => row.rate, formatPercent);
}

export function timeToCompleteBars(rows: TimeToComplete["rows"]): BarListItem[] {
  return toBarListItems(rows, (row) => row.entry_term, (row) => row.average_terms, (terms) => `${terms} terms`);
}
