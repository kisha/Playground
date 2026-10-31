"use client";

import { LoadError } from "@/components/load-error";
import { FilterChips } from "@/components/sandbox/filter-chips";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiResource } from "@/hooks/use-api-resource";
import { formatKpi } from "@/lib/charts";
import type { Kpi, KpiResponse } from "@/app/(app)/sandbox/shared";

const kpiTileClasses = "flex min-h-32 flex-col gap-1 rounded-2xl border p-4 sm:p-5";
const kpiGridClasses = "grid grid-cols-2 gap-3 lg:grid-cols-4";

function KpiTile({ kpi }: { kpi: Kpi }) {
  const { headline, unitLabel } = formatKpi(kpi);
  return (
    <li className={kpiTileClasses}>
      <span className="text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">
        {headline}
        {unitLabel && <span className="ml-1 text-base font-normal text-muted-foreground">{unitLabel}</span>}
      </span>
      <span className="text-sm leading-snug font-medium">{kpi.label}</span>
      <span className="text-xs text-muted-foreground">{kpi.detail}</span>
    </li>
  );
}

type KpiGridProps = {
  load: () => Promise<KpiResponse>;
  /** How many placeholder tiles to show while loading. */
  placeholderCount: number;
};

/** KPI stat cards, as at the top of the briefs' dashboards. */
export function KpiGrid({ load, placeholderCount }: KpiGridProps) {
  const { resource, retry } = useApiResource(load);

  if (resource.status === "error") {
    return (
      <LoadError
        title="The KPIs couldn't load."
        message={resource.message}
        onRetry={retry}
        className="rounded-2xl border p-8"
      />
    );
  }

  if (resource.status === "loading") {
    return (
      <ul className={kpiGridClasses} aria-busy="true" aria-label="Loading KPIs">
        {Array.from({ length: placeholderCount }, (_, placeholderIndex) => (
          <li key={placeholderIndex} className={kpiTileClasses}>
            <Skeleton className="h-full rounded-lg" />
          </li>
        ))}
      </ul>
    );
  }

  const { meta, items } = resource.data;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{meta.title}</span>
        <FilterChips filters={meta.filters} />
      </div>
      <ul className={kpiGridClasses}>
        {items.map((kpi) => (
          <KpiTile key={kpi.id} kpi={kpi} />
        ))}
      </ul>
    </div>
  );
}
