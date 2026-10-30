"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { FilterDefinition } from "@/content/sandbox-filters";
import {
  ALL_FILTER_VALUE,
  buildFilterQuery,
  type FilterValues,
  getActiveFilters,
  getFilterValues,
  resetFilterValues,
} from "@/lib/filters";

/** The applied filters, read from the URL, and the ways to change them. */
export function useUrlFilters(filters: FilterDefinition[]) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const appliedValues = getFilterValues(filters, searchParams);

  function applyValues(values: FilterValues) {
    const query = buildFilterQuery(filters, values);
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return {
    appliedValues,
    appliedQuery: buildFilterQuery(filters, appliedValues),
    activeFilters: getActiveFilters(filters, searchParams),
    applyValues,
    removeFilter: (filter: FilterDefinition) =>
      applyValues({ ...appliedValues, [filter.key]: filter.defaultValue ?? ALL_FILTER_VALUE }),
    resetFilters: () => applyValues(resetFilterValues(filters)),
  };
}
