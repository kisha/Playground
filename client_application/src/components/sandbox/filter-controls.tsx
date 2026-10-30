"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { FilterDefinition } from "@/content/sandbox-filters";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { buildFilterSelectItems, haveFilterValuesChanged } from "@/lib/filters";

/** The filters column beside a page's content. Shown when there's room. */
export function FilterPanel({ filters }: { filters: FilterDefinition[] }) {
  return (
    <aside aria-label="Filters" className="self-start rounded-2xl border bg-card p-4">
      <FilterForm filters={filters} />
    </aside>
  );
}

/** When there isn't room: a "Filters" button opening the same form, with what's applied as removable chips. */
export function FilterSheet({ filters }: { filters: FilterDefinition[] }) {
  const { activeFilters, removeFilter } = useUrlFilters(filters);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger render={<Button variant="outline" />}>
          <SlidersHorizontal />
          Filters{activeFilters.length > 0 && ` (${activeFilters.length})`}
        </SheetTrigger>
        <SheetContent side="bottom" showCloseButton={false} className="max-h-[85svh] overflow-y-auto rounded-t-2xl">
          <SheetHeader className="sr-only">
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>Choose which students to show.</SheetDescription>
          </SheetHeader>
          <div className="p-4 pb-8">
            <FilterForm filters={filters} onApplied={() => setIsOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
      {activeFilters.map(({ filter, option }) => (
        <button
          key={filter.key}
          type="button"
          onClick={() => removeFilter(filter)}
          aria-label={`Remove filter ${filter.label}: ${option.label}`}
          className="flex items-center gap-1.5 rounded-full border py-1 pr-2 pl-3 text-xs transition-colors hover:bg-muted"
        >
          {option.label}
          <X aria-hidden className="size-3" />
        </button>
      ))}
    </div>
  );
}

/** Starts fresh from the applied filters whenever they change: Apply, Reset, a chip or the Back button. */
function FilterForm({ filters, onApplied }: { filters: FilterDefinition[]; onApplied?: () => void }) {
  const { appliedQuery } = useUrlFilters(filters);
  return <FilterDraftForm key={appliedQuery} filters={filters} onApplied={onApplied} />;
}

/** "Filters" with Reset and Apply, then one select per filter. Choices are a draft until Apply. */
function FilterDraftForm({ filters, onApplied }: { filters: FilterDefinition[]; onApplied?: () => void }) {
  const { appliedValues, appliedQuery, applyValues, resetFilters } = useUrlFilters(filters);
  const [draftValues, setDraftValues] = useState(appliedValues);

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        applyValues(draftValues);
        onApplied?.();
      }}
    >
      <div className="flex items-center gap-1">
        <h2 className="mr-auto text-sm font-semibold">Filters</h2>
        {appliedQuery && (
          <Button type="button" variant="ghost" size="sm" onClick={resetFilters}>
            Reset
          </Button>
        )}
        <Button type="submit" size="sm" disabled={!haveFilterValuesChanged(draftValues, appliedValues)}>
          Apply
        </Button>
      </div>
      {filters.map((filter) => {
        const items = buildFilterSelectItems(filter);
        return (
          <label key={filter.key} className="flex flex-col gap-1 text-xs text-muted-foreground">
            {filter.label}
            <Select
              items={items}
              value={draftValues[filter.key]}
              onValueChange={(value) => setDraftValues((draft) => ({ ...draft, [filter.key]: String(value) }))}
            >
              <SelectTrigger className="w-full bg-background text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {items.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
        );
      })}
    </form>
  );
}
