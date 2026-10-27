"use client";

import { BarList } from "@/components/sandbox/bar-list";
import { ChartCard } from "@/components/sandbox/chart-card";
import { GroupedBarChart } from "@/components/sandbox/grouped-bar-chart";
import { KpiGrid } from "@/components/sandbox/kpi-grid";
import { TrendChart } from "@/components/sandbox/trend-chart";
import {
  completionByGroupBars,
  KPI_COUNT,
  creditCompletionSeries,
  gatewayCompletionSeries,
  isIntoFall,
  persistenceByAgeSeries,
  persistenceRetentionSeries,
  TIME_TO_COMPLETE_MAX_TERMS,
  termEnrollmentLegend,
  termEnrollmentSeries,
  timeToCompleteBars,
} from "./chart-config";
import { endpoints } from "./data";

/** /sandbox's charts, each loading its own endpoint from the browser. */
export function Charts() {
  return (
    <div className="flex flex-col gap-4">
      <KpiGrid load={endpoints.kpis} placeholderCount={KPI_COUNT} />

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard load={endpoints.gatewayCompletion}>
          {(data) => <TrendChart rows={data.rows} xKey="term" series={gatewayCompletionSeries} />}
        </ChartCard>

        <ChartCard load={endpoints.termEnrollment}>
          {(data) => (
            <div className="flex flex-col gap-2">
              <TrendChart rows={data.rows} xKey="term" series={termEnrollmentSeries} isFilled={isIntoFall} />
              <p className="text-xs text-muted-foreground">{termEnrollmentLegend}</p>
            </div>
          )}
        </ChartCard>

        <ChartCard load={endpoints.creditCompletion}>
          {(data) => <TrendChart rows={data.rows} xKey="cohort_year" series={creditCompletionSeries} />}
        </ChartCard>

        <ChartCard load={endpoints.persistenceRetention}>
          {(data) => <TrendChart rows={data.rows} xKey="cohort_year" series={persistenceRetentionSeries} />}
        </ChartCard>

        <ChartCard load={endpoints.completionByGroup}>
          {(data) => <BarList items={completionByGroupBars(data.rows)} />}
        </ChartCard>

        <ChartCard load={endpoints.persistenceByAge}>
          {(data) => <GroupedBarChart rows={data.rows} categoryKey="age_group" series={persistenceByAgeSeries} />}
        </ChartCard>

        <ChartCard load={endpoints.timeToComplete} className="lg:col-span-2">
          {(data) => <BarList max={TIME_TO_COMPLETE_MAX_TERMS} items={timeToCompleteBars(data.rows)} />}
        </ChartCard>
      </div>
    </div>
  );
}
