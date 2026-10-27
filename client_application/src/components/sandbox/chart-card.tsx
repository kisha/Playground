"use client";

import { LoadError } from "@/components/load-error";
import { FilterChips } from "@/components/sandbox/filter-chips";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiResource } from "@/hooks/use-api-resource";
import { cn } from "@/lib/utils";
import type { ChartMeta } from "@/app/sandbox/shared";

type ChartCardProps<Data extends { meta: ChartMeta }> = {
  load: () => Promise<Data>;
  /** Draws the chart once the data has loaded. */
  children: (data: Data) => React.ReactNode;
  className?: string;
};

/** A card that loads one sandbox endpoint and frames its chart with title, answer and fields. */
export function ChartCard<Data extends { meta: ChartMeta }>({ load, children, className }: ChartCardProps<Data>) {
  const { resource, retry } = useApiResource(load);

  return (
    <article className={cn("flex min-w-0 flex-col gap-5 rounded-2xl border p-5 sm:p-6", className)}>
      {resource.status === "loading" && <ChartSkeleton />}
      {resource.status === "error" && (
        <LoadError title="This chart couldn't load." message={resource.message} onRetry={retry} className="min-h-56" />
      )}
      {resource.status === "success" && (
        <>
          <ChartHeader meta={resource.data.meta} />
          <div className="min-w-0">{children(resource.data)}</div>
          <ChartFooter meta={resource.data.meta} />
        </>
      )}
    </article>
  );
}

function ChartSkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-busy="true" aria-label="Loading chart">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="mt-2 h-48 rounded-lg" />
    </div>
  );
}

function ChartHeader({ meta }: { meta: ChartMeta }) {
  return (
    <header className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold tracking-tight">{meta.title}</h3>
        <span className="shrink-0 rounded-full bg-foreground px-2 py-0.5 text-[10px] font-medium tracking-wide text-background uppercase">
          Mock data
        </span>
      </div>
      <p className="text-sm text-muted-foreground">{meta.description}</p>
      <FilterChips filters={meta.filters} />
    </header>
  );
}

/** The chart's answer, its definitions, and the AR fields it draws on. */
function ChartFooter({ meta }: { meta: ChartMeta }) {
  const definitions = Object.entries(meta.definitions);
  return (
    <>
      {meta.takeaway && (
        <div className="border-l-2 border-foreground bg-muted/60 px-4 py-3">
          <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">Answer</p>
          <p className="mt-1 text-sm font-medium">{meta.takeaway}</p>
        </div>
      )}

      {definitions.length > 0 && (
        <dl className="grid gap-x-6 gap-y-1 text-xs sm:grid-cols-2">
          {definitions.map(([term, definition]) => (
            <div key={term}>
              <dt className="inline font-medium">{term}: </dt>
              <dd className="inline text-muted-foreground">{definition}</dd>
            </div>
          ))}
        </dl>
      )}

      <footer className="mt-auto flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <span>Fields used:</span>
        {meta.fields_used.map((field) => (
          <span key={field} className="rounded-md bg-muted px-1.5 py-0.5 text-foreground">
            {field}
          </span>
        ))}
      </footer>
    </>
  );
}
