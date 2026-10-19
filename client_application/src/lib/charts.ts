import type { ChartConfig } from "@/components/ui/chart";
import type { Kpi } from "@/services/sandbox";

/** One line or bar series. Charts are black and white, so `dashed` tells the second one apart. */
export type ChartSeries = {
  key: string;
  label: string;
  dashed?: boolean;
};

/** Chart config for shadcn/ui charts with every series in the foreground color. */
export function monochromeChartConfig(series: ChartSeries[]): ChartConfig {
  return Object.fromEntries(series.map(({ key, label }) => [key, { label, color: "var(--foreground)" }]));
}

export function formatPercent(value: unknown): string {
  return `${value}%`;
}

export type BarListItem = {
  label: string;
  value: number;
  /** The value as shown next to the bar, e.g. "78%" or "5.1 terms". */
  display: string;
};

/** Turn chart rows into bars, given which field is the label and which is the value. */
export function toBarListItems<Row>(
  rows: Row[],
  labelOf: (row: Row) => string,
  valueOf: (row: Row) => number,
  formatValue: (value: number) => string,
): BarListItem[] {
  return rows.map((row) => ({ label: labelOf(row), value: valueOf(row), display: formatValue(valueOf(row)) }));
}

/** A bar's width as a percent of the track, capped at 100. */
export function barWidthPercent(value: number, max: number): number {
  return Math.min((value / max) * 100, 100);
}

/** A KPI's headline, e.g. "76%", "64 / 36" or "5.5" with the unit "terms" shown smaller. */
export function formatKpi(kpi: Kpi): { headline: string; unitLabel: string | null } {
  switch (kpi.unit) {
    case "percent":
      return { headline: formatPercent(kpi.value), unitLabel: null };
    case "split":
      return { headline: `${kpi.value} / ${kpi.secondary_value}`, unitLabel: null };
    case "terms":
      return { headline: `${kpi.value}`, unitLabel: "terms" };
  }
}

/**
 * Whether a line chart point is drawn filled. By default the first series has hollow points and a
 * dashed series filled ones; `isFilled` overrides that per row (e.g. to mark fall terms).
 */
export function isPointFilled<Row>(series: ChartSeries, row: Row | undefined, isFilled?: (row: Row) => boolean): boolean {
  if (isFilled && row) return isFilled(row);
  return Boolean(series.dashed);
}
