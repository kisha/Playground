import { type BarListItem, barWidthPercent } from "@/lib/charts";

type BarListProps = {
  items: BarListItem[];
  max?: number;
  /** Marks a value on every bar, e.g. all students, so each reads as above or below it. */
  reference?: number;
};

/** Horizontal bars with the value on the right, as in the briefs' "by student group" panels. */
export function BarList({ items, max = 100, reference }: BarListProps) {
  return (
    <ul className="flex flex-col gap-3.5">
      {items.map((item) => (
        <li key={item.label} className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span>
              {item.label}
              {item.note && <span className="ml-2 text-xs text-muted-foreground">{item.note}</span>}
            </span>
            <span className="font-semibold tabular-nums">{item.display}</span>
          </div>
          <div className="relative">
            <div className="h-2 overflow-hidden rounded-full bg-muted" role="presentation">
              <div
                className="h-full rounded-full bg-foreground transition-[width] duration-700"
                style={{ width: `${barWidthPercent(item.value, max)}%` }}
              />
            </div>
            {reference !== undefined && (
              <span
                aria-hidden
                className="absolute -top-0.5 h-3 w-0.5 -translate-x-1/2 rounded-full bg-foreground ring-2 ring-card"
                style={{ left: `${barWidthPercent(reference, max)}%` }}
              />
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
