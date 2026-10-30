"use client";

import { AreaTrendChart } from "@/components/sandbox/area-trend-chart";
import { BarList } from "@/components/sandbox/bar-list";
import { ChartCard } from "@/components/sandbox/chart-card";
import { GroupedBarChart } from "@/components/sandbox/grouped-bar-chart";
import { ShareChart } from "@/components/sandbox/share-chart";
import { StackedBarChart } from "@/components/sandbox/stacked-bar-chart";
import { TrendChart } from "@/components/sandbox/trend-chart";
import {
  completionByGroupBars,
  creditCompletionSeries,
  creditLoadSeries,
  entryStatusSlices,
  genderCenter,
  genderSlices,
  headcountSeries,
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

/** /sandbox/chart-examples' charts, each loading its own endpoint from the browser. */
export function Charts() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard load={endpoints.entryStatusShare}>
          {(data) => <ShareChart slices={entryStatusSlices(data.rows)} />}
        </ChartCard>

        <ChartCard load={endpoints.genderShare}>
          {(data) => <ShareChart slices={genderSlices(data.rows)} center={genderCenter} />}
        </ChartCard>

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

        <ChartCard load={endpoints.creditLoad}>
          {(data) => <StackedBarChart rows={data.rows} categoryKey="cohort_year" series={creditLoadSeries} />}
        </ChartCard>

        <ChartCard load={endpoints.headcount}>
          {(data) => <AreaTrendChart rows={data.rows} xKey="term" series={headcountSeries} />}
        </ChartCard>

        <ChartCard load={endpoints.timeToComplete} className="lg:col-span-2">
          {(data) => <BarList max={TIME_TO_COMPLETE_MAX_TERMS} items={timeToCompleteBars(data.rows)} />}
        </ChartCard>
      </div>
    </div>
  );
}
