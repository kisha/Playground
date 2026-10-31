"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { LoadError } from "@/components/load-error";
import { SearchInput } from "@/components/search-input";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiResource } from "@/hooks/use-api-resource";
import { type ApiEndpoint, groupEndpoints } from "@/lib/api-endpoints";
import { cn } from "@/lib/utils";
import { fetchApiEndpoints } from "@/services/api-endpoints";

type ApiEndpointListProps = {
  selectedId: string;
  onSelect: (endpoint: ApiEndpoint) => void;
};

/** A section that opens to show every endpoint the server offers. Choosing one closes it, ready to try. */
export function ApiEndpointList({ selectedId, onSelect }: ApiEndpointListProps) {
  const { resource, retry } = useApiResource(fetchApiEndpoints);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const endpointCount = resource.status === "success" ? resource.data.length : null;

  function chooseEndpoint(endpoint: ApiEndpoint) {
    onSelect(endpoint);
    setIsOpen(false);
  }

  return (
    <section className="overflow-hidden rounded-xl border">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="api-endpoint-list"
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center justify-between gap-3 bg-foreground px-4 py-3 text-left text-sm font-medium text-background transition-opacity hover:opacity-90"
      >
        <span>
          Available endpoints
          {endpointCount !== null && <span className="ml-2 font-normal opacity-70">{endpointCount}</span>}
        </span>
        <ChevronDown aria-hidden className={cn("size-4 shrink-0 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div id="api-endpoint-list" className="flex flex-col gap-4 border-t p-4">
          {resource.status === "loading" && <Skeleton className="h-40" />}
          {resource.status === "error" && (
            <LoadError title="The endpoints couldn't load." message={resource.message} onRetry={retry} />
          )}
          {resource.status === "success" && (
            <>
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search by name, path or method"
                label="Search endpoints"
              />
              <EndpointGroups
                endpoints={resource.data}
                search={search}
                selectedId={selectedId}
                onSelect={chooseEndpoint}
              />
            </>
          )}
        </div>
      )}
    </section>
  );
}

function EndpointGroups({
  endpoints,
  search,
  selectedId,
  onSelect,
}: {
  endpoints: ApiEndpoint[];
  search: string;
  selectedId: string;
  onSelect: (endpoint: ApiEndpoint) => void;
}) {
  const groups = groupEndpoints(endpoints, search);
  if (groups.length === 0) return <p className="text-sm text-muted-foreground">No endpoints match that search.</p>;

  return (
    <div className="flex max-h-96 flex-col gap-5 overflow-y-auto">
      {groups.map((group) => (
        <div key={group.name} className="flex flex-col gap-1">
          <h3 className="px-2 text-xs tracking-widest text-muted-foreground uppercase">{group.name}</h3>
          <ul className="flex flex-col">
            {group.endpoints.map((endpoint) => (
              <li key={endpoint.id}>
                <button
                  type="button"
                  aria-current={endpoint.id === selectedId ? "true" : undefined}
                  onClick={() => onSelect(endpoint)}
                  className={cn(
                    "grid w-full grid-cols-[3.75rem_1fr] items-baseline gap-x-2 rounded-lg px-2 py-2 text-left transition-colors hover:bg-muted",
                    endpoint.id === selectedId && "bg-muted",
                  )}
                >
                  <span className="font-mono text-xs font-semibold">{endpoint.method}</span>
                  <span className="flex min-w-0 flex-col gap-x-3 @2xl:flex-row @2xl:items-baseline">
                    <span className="font-mono text-xs break-all">{endpoint.path}</span>
                    <span className="text-xs text-muted-foreground">{endpoint.label}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
