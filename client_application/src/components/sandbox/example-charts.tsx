"use client";

import { BarList } from "@/components/sandbox/bar-list";
import { ChartCard } from "@/components/sandbox/chart-card";
import { GroupedBarChart } from "@/components/sandbox/grouped-bar-chart";
import { KpiGrid } from "@/components/sandbox/kpi-grid";
import { TrendChart } from "@/components/sandbox/trend-chart";
import {
  completionByGroupBars,
  creditCompletionSeries,
  gatewayCompletionSeries,
  isIntoFall,
  persistenceByAgeSeries,
  persistenceRetentionSeries,
  TIME_TO_COMPLETE_MAX_TERMS,
  termEnrollmentLegend,
  termEnrollmentSeries,
  timeToCompleteBars,
} from "@/content/sandbox-charts";
import { sandbox } from "@/services/sandbox";

/** Every example chart, each loading its own sandbox endpoint from the browser. */
export function ExampleCharts() {
  return (
    <div className="flex flex-col gap-4">
      <KpiGrid />

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard load={sandbox.gatewayCompletion}>
          {(data) => <TrendChart rows={data.rows} xKey="term" series={gatewayCompletionSeries} />}
        </ChartCard>

        <ChartCard load={sandbox.termEnrollment}>
          {(data) => (
            <div className="flex flex-col gap-2">
              <TrendChart rows={data.rows} xKey="term" series={termEnrollmentSeries} isFilled={isIntoFall} />
              <p className="text-xs text-muted-foreground">{termEnrollmentLegend}</p>
            </div>
          )}
        </ChartCard>

        <ChartCard load={sandbox.creditCompletion}>
          {(data) => <TrendChart rows={data.rows} xKey="cohort_year" series={creditCompletionSeries} />}
        </ChartCard>

        <ChartCard load={sandbox.persistenceRetention}>
          {(data) => <TrendChart rows={data.rows} xKey="cohort_year" series={persistenceRetentionSeries} />}
        </ChartCard>

        <ChartCard load={sandbox.completionByGroup}>
          {(data) => <BarList items={completionByGroupBars(data.rows)} />}
        </ChartCard>

        <ChartCard load={sandbox.persistenceByAge}>
          {(data) => <GroupedBarChart rows={data.rows} categoryKey="age_group" series={persistenceByAgeSeries} />}
        </ChartCard>

        <ChartCard load={sandbox.timeToComplete} className="lg:col-span-2">
          {(data) => <BarList max={TIME_TO_COMPLETE_MAX_TERMS} items={timeToCompleteBars(data.rows)} />}
        </ChartCard>
      </div>
    </div>
  );
}
