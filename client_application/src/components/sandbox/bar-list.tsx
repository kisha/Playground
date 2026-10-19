import { type BarListItem, barWidthPercent } from "@/lib/charts";

/** Horizontal bars with the value on the right, as in the briefs' "by student group" panels. */
export function BarList({ items, max = 100 }: { items: BarListItem[]; max?: number }) {
  return (
    <ul className="flex flex-col gap-3.5">
      {items.map((item) => (
        <li key={item.label} className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span>{item.label}</span>
            <span className="font-semibold tabular-nums">{item.display}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted" role="presentation">
            <div
              className="h-full rounded-full bg-foreground transition-[width] duration-700"
              style={{ width: `${barWidthPercent(item.value, max)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
