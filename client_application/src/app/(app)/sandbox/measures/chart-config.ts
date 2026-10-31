/** /sandbox/measures: keep PDP result-to-chart mapping separate from UI state. */

import { type BarListItem, formatPercent, toBarListItems } from "@/lib/charts";

import type { GroupRate } from "./data";

export function groupRateBars(rows: GroupRate["rows"]): BarListItem[] {
  return toBarListItems(
    rows,
    (row) => row.group,
    (row) => row.rate,
    (rate, row) => (rate === null || row.n === null ? "—" : `${formatPercent(rate)} · n=${row.n}`),
  );
}
