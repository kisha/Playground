/** /sandbox/add-a-sandbox-page: which fields each chart draws, and how they are labelled. Edit here, not in charts.tsx. */

import { type BarListItem, type ChartSeries, formatPercent, toBarListItems } from "@/lib/charts";
import type { EnrollmentByProgram } from "./data";

export const enrollmentByModalitySeries: ChartSeries[] = [
  { key: "in_person", label: "In person" },
  { key: "online", label: "Online", dashed: true },
];

export function enrollmentByProgramBars(rows: EnrollmentByProgram["rows"]): BarListItem[] {
  return toBarListItems(rows, (row) => row.program, (row) => row.share, formatPercent);
}
