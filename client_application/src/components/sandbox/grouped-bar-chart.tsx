"use client";

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { type ChartSeries, formatPercent, monochromeChartConfig } from "@/lib/charts";

type GroupedBarChartProps = {
  rows: Record<string, string | number>[];
  categoryKey: string;
  /** Two series: the first solid, the second striped. */
  series: [ChartSeries, ChartSeries];
};

/** Paired bars per category in black and white: solid vs diagonal stripes. */
export function GroupedBarChart({ rows, categoryKey, series }: GroupedBarChartProps) {
  const [solid, striped] = series;

  return (
    <div className="flex flex-col gap-3">
      <ChartContainer config={monochromeChartConfig(series)} className="aspect-auto h-56 w-full">
        <BarChart data={rows} margin={{ top: 22, right: 0, bottom: 0, left: 0 }} barGap={6}>
          <defs>
            <pattern id="bar-stripes" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="6" height="6" fill="var(--background)" />
              <line x1="0" y1="0" x2="0" y2="6" stroke="var(--foreground)" strokeWidth="3" />
            </pattern>
          </defs>
          <XAxis
            dataKey={categoryKey}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            interval={0}
            fontSize={11}
          />
          <YAxis hide domain={[0, 100]} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
          <Bar dataKey={solid.key} fill="var(--foreground)" radius={[6, 6, 0, 0]} isAnimationActive={false}>
            <LabelList dataKey={solid.key} position="top" className="fill-foreground text-xs font-semibold" formatter={formatPercent} />
          </Bar>
          <Bar
            dataKey={striped.key}
            fill="url(#bar-stripes)"
            stroke="var(--foreground)"
            strokeWidth={1.25}
            radius={[6, 6, 0, 0]}
            isAnimationActive={false}
          >
            <LabelList dataKey={striped.key} position="top" className="fill-foreground text-xs font-semibold" formatter={formatPercent} />
          </Bar>
        </BarChart>
      </ChartContainer>
      <ul className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <li className="flex items-center gap-1.5">
          <span aria-hidden className="size-2.5 rounded-sm bg-foreground" /> {solid.label}
        </li>
        <li className="flex items-center gap-1.5">
          <span aria-hidden className="stripes size-2.5 rounded-sm border border-foreground text-foreground" /> {striped.label}
        </li>
      </ul>
    </div>
  );
}
