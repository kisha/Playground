"use client";

import { BarList } from "@/components/sandbox/bar-list";
import { ChartCard } from "@/components/sandbox/chart-card";
import { TrendChart } from "@/components/sandbox/trend-chart";
import { enrollmentByModalitySeries, enrollmentByProgramBars } from "./chart-config";
import { chartLoaders } from "./data";

/** /sandbox/add-a-sandbox-page's charts, each loading its own endpoint from the browser. */
export function Charts() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartCard load={chartLoaders.byModality}>
        {(data) => <TrendChart rows={data.rows} xKey="term" series={enrollmentByModalitySeries} />}
      </ChartCard>

      <ChartCard load={chartLoaders.byProgram}>
        {(data) => <BarList items={enrollmentByProgramBars(data.rows)} />}
      </ChartCard>
    </div>
  );
}
