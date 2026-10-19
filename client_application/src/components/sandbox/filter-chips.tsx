/** Cohort filters a chart was built with, e.g. "Fall entry". */
export function FilterChips({ filters }: { filters: string[] }) {
  if (filters.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {filters.map((filter) => (
        <li key={filter} className="rounded-full border px-2 py-0.5 text-[11px]">
          {filter}
        </li>
      ))}
    </ul>
  );
}
