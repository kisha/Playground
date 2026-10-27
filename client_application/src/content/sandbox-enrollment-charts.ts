/** Which fields each enrollment chart draws, and how they are labelled. Edit here, not in the components. */

import { type BarListItem, type ChartSeries, formatPercent, toBarListItems } from "@/lib/charts";
import type { EnrollmentByProgram } from "@/services/sandbox-enrollment";

export const enrollmentByModalitySeries: ChartSeries[] = [
  { key: "in_person", label: "In person" },
  { key: "online", label: "Online", dashed: true },
];

export function enrollmentByProgramBars(rows: EnrollmentByProgram["rows"]): BarListItem[] {
  return toBarListItems(rows, (row) => row.program, (row) => row.share, formatPercent);
}
