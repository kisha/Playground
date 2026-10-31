import type { ChartConfig } from "@/components/ui/chart";

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


/**
 * Whether a line chart point is drawn filled. By default the first series has hollow points and a
 * dashed series filled ones; `isFilled` overrides that per row (e.g. to mark fall terms).
 */
export function isPointFilled<Row>(series: ChartSeries, row: Row | undefined, isFilled?: (row: Row) => boolean): boolean {
  if (isFilled && row) return isFilled(row);
  return Boolean(series.dashed);
}

/**
 * Fills for the parts of a whole, in order. Charts are black and white, so parts step from solid to light, and the
 * fourth is striped. Pie, donut and stacked charts keep to four parts or fewer.
 */
const PART_FILLS = [
  "var(--foreground)",
  "color-mix(in oklab, var(--foreground) 62%, var(--background))",
  "color-mix(in oklab, var(--foreground) 30%, var(--background))",
  "url(#part-stripes)",
];

/** The fill for the part at `index`, and whether it's the striped one. */
export function partFill(index: number): { fill: string; isStriped: boolean } {
  return { fill: PART_FILLS[index], isStriped: index === PART_FILLS.length - 1 };
}

export type ShareSlice = { label: string; value: number; display: string; fill: string; isStriped: boolean };

/** Turn chart rows into pie or donut slices, in the order they arrive. */
export function toShareSlices<Row>(rows: Row[], labelOf: (row: Row) => string, valueOf: (row: Row) => number): ShareSlice[] {
  return rows.map((row, index) => ({
    label: labelOf(row),
    value: valueOf(row),
    display: formatPercent(valueOf(row)),
    ...partFill(index),
  }));
}

export function formatCount(value: unknown): string {
  return Number(value).toLocaleString("en-US");
}
