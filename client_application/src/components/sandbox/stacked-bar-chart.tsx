"use client";

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

import { PartStripes } from "@/components/sandbox/part-stripes";
import { PartSwatch } from "@/components/sandbox/part-swatch";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { type ChartSeries, formatPercent, monochromeChartConfig, partFill } from "@/lib/charts";

type StackedBarChartProps = {
  rows: Record<string, string | number>[];
  categoryKey: string;
  /** The parts of each bar, from the bottom up. Each row's parts add up to 100. */
  series: ChartSeries[];
};

/** One column per category, split into its parts, in black and white. */
export function StackedBarChart({ rows, categoryKey, series }: StackedBarChartProps) {
  return (
    <div className="flex flex-col gap-3">
      <ChartContainer config={monochromeChartConfig(series)} className="aspect-auto h-56 w-full">
        <BarChart data={rows} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <PartStripes />
          </defs>
          <XAxis dataKey={categoryKey} tickLine={false} axisLine={false} tickMargin={8} interval={0} fontSize={11} />
          <YAxis hide domain={[0, 100]} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
          {series.map((part, index) => (
            <Bar
              key={part.key}
              dataKey={part.key}
              stackId="parts"
              fill={partFill(index).fill}
              stroke="var(--background)"
              strokeWidth={2}
              isAnimationActive={false}
            >
              {/* Dark ink on the lightest part, light ink on the two darker ones. */}
              <LabelList
                dataKey={part.key}
                position="center"
                className={index < 2 ? "fill-background text-[11px] font-semibold" : "fill-foreground text-[11px] font-semibold"}
                formatter={formatPercent}
              />
            </Bar>
          ))}
        </BarChart>
      </ChartContainer>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {series.map((part, index) => (
          <li key={part.key} className="flex items-center gap-1.5">
            <PartSwatch {...partFill(index)} /> {part.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
