"use client";

import { KpiGrid } from "@/components/sandbox/kpi-grid";
import { STUDENT_MIX_COUNT, STUDENT_PROGRESS_COUNT, TIME_TO_COMPLETE_COUNT } from "./chart-config";
import { kpiLoaders } from "./data";

/** /sandbox/kpi-examples' groups, each asking the one endpoint for its own cards from the browser. */
export function Charts() {
  return (
    <div className="flex flex-col gap-8">
      <KpiGrid load={kpiLoaders.studentProgress} placeholderCount={STUDENT_PROGRESS_COUNT} />
      <KpiGrid load={kpiLoaders.studentMix} placeholderCount={STUDENT_MIX_COUNT} />
      <KpiGrid load={kpiLoaders.timeToComplete} placeholderCount={TIME_TO_COMPLETE_COUNT} />
    </div>
  );
}
