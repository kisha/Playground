import { cn } from "@/lib/utils";

/** A legend's small square, in the same fill as the part it names. */
export function PartSwatch({ fill, isStriped }: { fill: string; isStriped: boolean }) {
  return (
    <span
      aria-hidden
      className={cn("size-2.5 shrink-0 rounded-sm", isStriped && "stripes border border-foreground text-foreground")}
      style={isStriped ? undefined : { background: fill }}
    />
  );
}

export type LegendPart = { key: string; label: string; fill: string; isStriped: boolean };

/** A row of swatches naming each part of a chart, in the parts' own fills. */
export function PartLegend({ parts }: { parts: LegendPart[] }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
      {parts.map((part) => (
        <li key={part.key} className="flex items-center gap-1.5">
          <PartSwatch fill={part.fill} isStriped={part.isStriped} /> {part.label}
        </li>
      ))}
    </ul>
  );
}
