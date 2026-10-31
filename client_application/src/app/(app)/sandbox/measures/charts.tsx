"use client";

import { useMemo, useState } from "react";

import { BarList } from "@/components/sandbox/bar-list";
import { ChartCard } from "@/components/sandbox/chart-card";

import { groupRateBars } from "./chart-config";
import {
  cohortLabels,
  cohorts,
  groupByLabels,
  groupBys,
  groupRateLoader,
  measureLabels,
  measures,
  type Cohort,
  type GroupBy,
  type Measure,
} from "./data";

/** A complete pattern: local filter state becomes typed query parameters and reloads a ChartCard. */
export function Charts() {
  const [measure, setMeasure] = useState<Measure>("gateway_math");
  const [cohort, setCohort] = useState<Cohort>("2022-23");
  const [groupBy, setGroupBy] = useState<GroupBy>("gender");
  const load = useMemo(
    () => groupRateLoader(measure, cohort, groupBy),
    [measure, cohort, groupBy],
  );

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <FilterSelect
          id="measure"
          label="Measure"
          value={measure}
          values={measures}
          labels={measureLabels}
          onChange={setMeasure}
        />
        <FilterSelect
          id="cohort"
          label="Cohort"
          value={cohort}
          values={cohorts}
          labels={cohortLabels}
          onChange={setCohort}
        />
        <FilterSelect
          id="group-by"
          label="Group by"
          value={groupBy}
          values={groupBys}
          labels={groupByLabels}
          onChange={setGroupBy}
        />
      </div>

      <ChartCard load={load}>
        {(data) =>
          data.rows.length > 0 ? (
            <BarList items={groupRateBars(data.rows)} />
          ) : (
            <p className="text-sm text-muted-foreground">This fixture does not include this combination yet.</p>
          )
        }
      </ChartCard>
    </div>
  );
}

type FilterSelectProps<Value extends string> = {
  id: string;
  label: string;
  value: Value;
  values: readonly Value[];
  labels: Record<Value, string>;
  onChange: (value: Value) => void;
};

function FilterSelect<Value extends string>({ id, label, value, values, labels, onChange }: FilterSelectProps<Value>) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium" htmlFor={id}>
      {label}
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as Value)}
        className="h-10 rounded-md border bg-background px-3 text-sm font-normal shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        {values.map((option) => (
          <option key={option} value={option}>
            {labels[option]}
          </option>
        ))}
      </select>
    </label>
  );
}
