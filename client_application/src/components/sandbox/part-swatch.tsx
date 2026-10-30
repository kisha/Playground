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
