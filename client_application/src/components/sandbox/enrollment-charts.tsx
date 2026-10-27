"use client";

import { BarList } from "@/components/sandbox/bar-list";
import { ChartCard } from "@/components/sandbox/chart-card";
import { TrendChart } from "@/components/sandbox/trend-chart";
import { enrollmentByModalitySeries, enrollmentByProgramBars } from "@/content/sandbox-enrollment-charts";
import { sandboxEnrollment } from "@/services/sandbox-enrollment";

/** The worked example of a new sandbox page's charts, each loading its own /sandbox/enrollment endpoint. */
export function EnrollmentCharts() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartCard load={sandboxEnrollment.byModality}>
        {(data) => <TrendChart rows={data.rows} xKey="term" series={enrollmentByModalitySeries} />}
      </ChartCard>

      <ChartCard load={sandboxEnrollment.byProgram}>
        {(data) => <BarList items={enrollmentByProgramBars(data.rows)} />}
      </ChartCard>
    </div>
  );
}
