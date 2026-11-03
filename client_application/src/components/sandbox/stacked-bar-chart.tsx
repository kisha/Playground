"use client";

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

import { PartStripes, usePartStripesId } from "@/components/sandbox/part-stripes";
import { PartLegend } from "@/components/sandbox/part-swatch";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { type ChartSeries, formatPercent, categoryAxisProps, monochromeChartConfig, partFill, stripesFor } from "@/lib/charts";

type StackedBarChartProps = {
  rows: Record<string, string | number>[];
  categoryKey: string;
  /** The parts of each bar, from the bottom up. Each row's parts add up to 100. */
  series: ChartSeries[];
};

/** One column per category, split into its parts, in black and white. */
export function StackedBarChart({ rows, categoryKey, series }: StackedBarChartProps) {
  const stripesId = usePartStripesId();

  return (
    <div className="flex flex-col gap-3">
      <ChartContainer config={monochromeChartConfig(series)} className="aspect-auto h-56 w-full">
        <BarChart data={rows} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <PartStripes id={stripesId} />
          </defs>
          <XAxis dataKey={categoryKey} {...categoryAxisProps} fontSize={11} />
          <YAxis hide domain={[0, 100]} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
          {series.map((part, index) => (
            <Bar
              key={part.key}
              dataKey={part.key}
              stackId="parts"
              fill={stripesFor(partFill(index).fill, stripesId)}
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
      <PartLegend parts={series.map((part, index) => ({ ...part, ...partFill(index) }))} />
    </div>
  );
}
