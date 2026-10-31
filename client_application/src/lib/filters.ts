/**
 * Filters live in the URL (?cohort_year=2024&gender=Female), so a filtered view can be bookmarked or shared and
 * survives a refresh. "All", or a filter's default, is the absence of a key.
 */

import type { FilterDefinition, FilterOption } from "@/content/sandbox-filters";

export const ALL_FILTER_VALUE = "all";

/** One value per filter key, "all" included, e.g. { gender: "Female", first_gen: "all" }. */
export type FilterValues = Record<string, string>;

type ActiveFilter = { filter: FilterDefinition; option: FilterOption };

type ReadableSearchParams = Pick<URLSearchParams, "get">;

function findSelectedOption(filter: FilterDefinition, searchParams: ReadableSearchParams): FilterOption | undefined {
  return filter.options.find((option) => option.value === searchParams.get(filter.key));
}

export function unsetValue(filter: FilterDefinition): string {
  return filter.defaultValue ?? ALL_FILTER_VALUE;
}

/** Every filter's value from the URL. A value that isn't one of its options is ignored. */
export function getFilterValues(filters: FilterDefinition[], searchParams: ReadableSearchParams): FilterValues {
  return Object.fromEntries(
    filters.map((filter) => [filter.key, findSelectedOption(filter, searchParams)?.value ?? unsetValue(filter)]),
  );
}

/** The filters set away from their default, to show as removable chips. */
export function getActiveFilters(filters: FilterDefinition[], searchParams: ReadableSearchParams): ActiveFilter[] {
  return filters.flatMap((filter) => {
    const option = findSelectedOption(filter, searchParams);
    return option && option.value !== filter.defaultValue ? [{ filter, option }] : [];
  });
}

/** The query string for these values: "All" and a filter's default are left out. */
export function buildFilterQuery(filters: FilterDefinition[], values: FilterValues): string {
  const query = new URLSearchParams();
  for (const filter of filters) {
    const value = values[filter.key];
    if (value && value !== unsetValue(filter)) query.set(filter.key, value);
  }
  return query.toString();
}

export function resetFilterValues(filters: FilterDefinition[]): FilterValues {
  return Object.fromEntries(filters.map((filter) => [filter.key, unsetValue(filter)]));
}

export function haveFilterValuesChanged(first: FilterValues, second: FilterValues): boolean {
  return Object.keys({ ...first, ...second }).some((key) => first[key] !== second[key]);
}

/** A filter's select options, with "All" first unless it has a default. */
export function buildFilterSelectItems(filter: FilterDefinition): FilterOption[] {
  return filter.defaultValue ? filter.options : [{ value: ALL_FILTER_VALUE, label: "All" }, ...filter.options];
}
