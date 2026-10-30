"use client";

import { Pie, PieChart } from "recharts";

import { PartStripes } from "@/components/sandbox/part-stripes";
import { PartSwatch } from "@/components/sandbox/part-swatch";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { ShareSlice } from "@/lib/charts";

type ShareChartProps = {
  slices: ShareSlice[];
  /** Set to draw a donut, with this in the hole. Leave out for a pie. */
  center?: { value: string; label: string };
};

/** A pie or donut in black and white, with every part named and valued beside it. Use for a few clearly different parts. */
export function ShareChart({ slices, center }: ShareChartProps) {
  return (
    <div className="@container">
      <div className="flex flex-col items-center gap-5 @md:flex-row @md:gap-8">
      <div className="relative shrink-0">
        <ChartContainer config={{}} className="aspect-square h-44">
          <PieChart>
            <defs>
              <PartStripes />
            </defs>
            <ChartTooltip content={<ChartTooltipContent nameKey="label" hideLabel />} />
            <Pie
              data={slices}
              dataKey="value"
              nameKey="label"
              innerRadius={center ? "62%" : 0}
              outerRadius="100%"
              startAngle={90}
              endAngle={-270}
              stroke="var(--background)"
              strokeWidth={2}
              isAnimationActive={false}
            />
          </PieChart>
        </ChartContainer>
        {center && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-semibold tabular-nums">{center.value}</span>
            <span className="text-xs text-muted-foreground">{center.label}</span>
          </div>
        )}
      </div>

      <ul className="flex w-full min-w-0 flex-col gap-2.5 text-sm">
        {slices.map((slice) => (
          <li key={slice.label} className="flex items-center gap-2">
            <PartSwatch fill={slice.fill} isStriped={slice.isStriped} />
            <span className="min-w-0">{slice.label}</span>
            <span className="ml-auto font-semibold tabular-nums">{slice.display}</span>
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
}
