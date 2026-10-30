"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { type ChartSeries, formatCount, monochromeChartConfig } from "@/lib/charts";

type AreaTrendChartProps = {
  rows: Record<string, string | number>[];
  xKey: string;
  /** One series: an area's fill shows amount, so it starts from zero. */
  series: ChartSeries;
};

/** One amount over time, as a line with its area filled down to zero. */
export function AreaTrendChart({ rows, xKey, series }: AreaTrendChartProps) {
  return (
    <ChartContainer config={monochromeChartConfig([series])} className="aspect-auto h-56 w-full">
      <AreaChart data={rows} margin={{ top: 12, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="2 4" />
        <XAxis dataKey={xKey} tickLine={false} axisLine={false} tickMargin={8} interval={0} fontSize={11} />
        <YAxis domain={[0, "auto"]} tickLine={false} axisLine={false} width={44} fontSize={11} tickFormatter={formatCount} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
        <Area
          dataKey={series.key}
          type="linear"
          stroke="var(--foreground)"
          strokeWidth={2}
          fill="var(--foreground)"
          fillOpacity={0.14}
          isAnimationActive={false}
        />
      </AreaChart>
    </ChartContainer>
  );
}
