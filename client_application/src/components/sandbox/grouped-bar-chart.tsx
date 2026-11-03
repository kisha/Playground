"use client";

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

import { PartStripes, usePartStripesId } from "@/components/sandbox/part-stripes";
import { PartLegend } from "@/components/sandbox/part-swatch";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { type ChartSeries, categoryAxisProps, formatPercent, monochromeChartConfig, partFill, stripedPartFill, stripesFor } from "@/lib/charts";

const barLabelClass = "fill-foreground text-xs font-semibold";

type GroupedBarChartProps = {
  rows: Record<string, string | number>[];
  categoryKey: string;
  /** Two series: the first solid, the second striped. */
  series: [ChartSeries, ChartSeries];
};

/** Paired bars per category in black and white: solid vs diagonal stripes. */
export function GroupedBarChart({ rows, categoryKey, series }: GroupedBarChartProps) {
  const [solid, striped] = series;
  const stripesId = usePartStripesId();

  return (
    <div className="flex flex-col gap-3">
      <ChartContainer config={monochromeChartConfig(series)} className="aspect-auto h-56 w-full">
        <BarChart data={rows} margin={{ top: 22, right: 0, bottom: 0, left: 0 }} barGap={6}>
          <defs>
            <PartStripes id={stripesId} />
          </defs>
          <XAxis dataKey={categoryKey} {...categoryAxisProps} fontSize={11} />
          <YAxis hide domain={[0, 100]} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
          <Bar dataKey={solid.key} fill="var(--foreground)" radius={[6, 6, 0, 0]} isAnimationActive={false}>
            <LabelList dataKey={solid.key} position="top" className={barLabelClass} formatter={formatPercent} />
          </Bar>
          <Bar
            dataKey={striped.key}
            fill={stripesFor(stripedPartFill.fill, stripesId)}
            stroke="var(--foreground)"
            strokeWidth={1.25}
            radius={[6, 6, 0, 0]}
            isAnimationActive={false}
          >
            <LabelList dataKey={striped.key} position="top" className={barLabelClass} formatter={formatPercent} />
          </Bar>
        </BarChart>
      </ChartContainer>
      <PartLegend parts={[{ ...solid, ...partFill(0) }, { ...striped, ...stripedPartFill }]} />
    </div>
  );
}
