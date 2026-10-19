"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { type ChartSeries, isPointFilled, monochromeChartConfig } from "@/lib/charts";

type ChartRow = Record<string, string | number | boolean>;

type TrendChartProps<Row extends ChartRow> = {
  rows: Row[];
  xKey: string;
  series: ChartSeries[];
  unit?: string;
  /** Per-row override: true draws that point filled, false hollow (used for "into fall"). */
  isFilled?: (row: Row) => boolean;
};

type DotProps<Row> = { cx?: number; cy?: number; index?: number; payload?: Row };

/** Black-and-white line chart with a values table underneath, as in the project briefs. */
export function TrendChart<Row extends ChartRow>({ rows, xKey, series, unit = "%", isFilled }: TrendChartProps<Row>) {
  return (
    <div className="flex flex-col gap-4">
      <ChartContainer config={monochromeChartConfig(series)} className="aspect-auto h-44 w-full">
        <LineChart data={rows} margin={{ top: 12, right: 8, bottom: 0, left: 8 }}>
          <CartesianGrid vertical={false} strokeDasharray="2 4" />
          <XAxis
            dataKey={xKey}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            interval={0}
            padding={{ left: 12, right: 12 }}
          />
          <YAxis hide domain={["dataMin - 8", "dataMax + 4"]} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
          {series.map((line) => (
            <Line
              key={line.key}
              dataKey={line.key}
              type="linear"
              stroke="var(--foreground)"
              strokeWidth={1.75}
              strokeDasharray={line.dashed ? "5 4" : undefined}
              isAnimationActive={false}
              dot={(dot: DotProps<Row>) => (
                <circle
                  key={`${line.key}-${dot.index}`}
                  cx={dot.cx}
                  cy={dot.cy}
                  r={4.5}
                  stroke="var(--foreground)"
                  strokeWidth={1.75}
                  fill={isPointFilled(line, dot.payload, isFilled) ? "var(--foreground)" : "var(--background)"}
                />
              )}
            />
          ))}
        </LineChart>
      </ChartContainer>

      <div className="overflow-x-auto">
        <table className="w-full text-[11px] tabular-nums sm:text-xs">
          <tbody>
            {series.map((line) => (
              <tr key={line.key} className="border-t first:border-t-0">
                <th scope="row" className="py-1.5 pr-2 text-left font-normal whitespace-nowrap text-muted-foreground">
                  <span
                    aria-hidden
                    className="mr-1.5 inline-block w-4 border-t-2 border-foreground align-middle"
                    style={line.dashed ? { borderTopStyle: "dashed" } : undefined}
                  />
                  {line.label}
                </th>
                {rows.map((row) => (
                  <td key={String(row[xKey])} className="py-1.5 text-center font-semibold">
                    {String(row[line.key])}
                    {unit}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
