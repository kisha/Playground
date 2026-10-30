"use client";

import { useMemo } from "react";

import { LoadError } from "@/components/load-error";
import { BarList } from "@/components/sandbox/bar-list";
import { FilterChips } from "@/components/sandbox/filter-chips";
import { FilterPanel, FilterSheet } from "@/components/sandbox/filter-controls";
import { TrendChart } from "@/components/sandbox/trend-chart";
import { Skeleton } from "@/components/ui/skeleton";
import { sandboxFilters } from "@/content/sandbox-filters";
import { useApiResource } from "@/hooks/use-api-resource";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { type ChartSeries, formatPercent, toBarListItems } from "@/lib/charts";

import { type FilteredCompletion, filteredCompletionLoader } from "./data";

const trendSeries: ChartSeries[] = [
  { key: "english", label: "English" },
  { key: "math", label: "Math", dashed: true },
];

/** The filters beside what they change. Everything here comes from one request, sent again when filters apply. */
export function FilteredDashboard() {
  const { appliedQuery } = useUrlFilters(sandboxFilters);
  const load = useMemo(() => filteredCompletionLoader(appliedQuery), [appliedQuery]);
  const { resource, retry } = useApiResource(load);

  return (
    <div className="@container">
      <div className="grid gap-4 @3xl:grid-cols-[14rem_1fr]">
        <div className="hidden @3xl:block">
          <FilterPanel filters={sandboxFilters} />
        </div>
        <div className="@3xl:hidden">
          <FilterSheet filters={sandboxFilters} />
        </div>

        <div className="flex min-w-0 flex-col gap-4" aria-live="polite">
          {resource.status === "loading" && <Skeleton className="h-96 rounded-2xl" />}
          {resource.status === "error" && (
            <LoadError title="This view couldn't load." message={resource.message} onRetry={retry} className="min-h-56" />
          )}
          {resource.status === "success" && <FilteredResults data={resource.data} />}
        </div>
      </div>
    </div>
  );
}

function FilteredResults({ data }: { data: FilteredCompletion }) {
  const groupBars = toBarListItems(data.groups, (row) => row.group, (row) => row.rate, formatPercent);

  return (
    <>
      <FilterChips filters={data.applied_filters} />
      <div className="grid gap-4 @2xl:grid-cols-2">
        <article className="rounded-2xl border p-5">
          <p className="text-4xl font-semibold tabular-nums">{data.kpis.gateway_completion}%</p>
          <p className="mt-1 text-sm font-medium">{data.meta.title}</p>
          <p className="text-xs text-muted-foreground">math and English</p>
        </article>
        <article className="rounded-2xl border p-5">
          <p className="text-4xl font-semibold tabular-nums">
            {data.kpis.english} / {data.kpis.math}
          </p>
          <p className="mt-1 text-sm font-medium">English / Math</p>
          <p className="text-xs text-muted-foreground">% completing</p>
        </article>
      </div>
      <div className="grid gap-4 @4xl:grid-cols-2">
        <article className="flex min-w-0 flex-col gap-4 rounded-2xl border p-5">
          <h3 className="text-base font-semibold tracking-tight">Gateway completion by cohort</h3>
          <TrendChart rows={data.trend} xKey="cohort_year" series={trendSeries} />
        </article>
        <article className="flex min-w-0 flex-col gap-4 rounded-2xl border p-5">
          <h3 className="text-base font-semibold tracking-tight">Gateway completion, by group</h3>
          <BarList items={groupBars} />
        </article>
      </div>
      {data.meta.takeaway && (
        <div className="border-l-2 border-foreground bg-muted/60 px-4 py-3">
          <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">Answer</p>
          <p className="mt-1 text-sm font-medium">{data.meta.takeaway}</p>
        </div>
      )}
    </>
  );
}
