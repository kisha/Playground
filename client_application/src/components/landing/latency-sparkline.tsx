"use client";

import { Line, LineChart, YAxis } from "recharts";

import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import type { CheckResult } from "@/lib/system-status";

const config = {
  roundTripMs: { label: "Round trip", color: "var(--foreground)" },
} satisfies ChartConfig;

/** Round-trip time of recent checks. Gaps mark checks where the API was unreachable. */
export function LatencySparkline({ history }: { history: CheckResult[] }) {
  const data = history.map((result) => ({
    id: result.id,
    roundTripMs: result.check.reachable ? result.roundTripMs : null,
  }));

  return (
    <ChartContainer config={config} className="aspect-auto h-12 w-full">
      <LineChart data={data} margin={{ top: 4, right: 2, bottom: 4, left: 2 }}>
        <YAxis hide domain={[0, "dataMax"]} />
        <Line
          dataKey="roundTripMs"
          type="monotone"
          stroke="var(--color-roundTripMs)"
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
