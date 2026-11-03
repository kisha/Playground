import { useId } from "react";

/** A pattern id unique to one chart. useId's punctuation isn't safe inside url(#...), so it's stripped. */
export function usePartStripesId(): string {
  return `part-stripes-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
}

/** The striped fill for the fourth part of a whole. Goes inside a chart's <defs>. */
export function PartStripes({ id }: { id: string }) {
  return (
    <pattern id={id} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="6" height="6" fill="var(--background)" />
      <line x1="0" y1="0" x2="0" y2="6" stroke="var(--foreground)" strokeWidth="3" />
    </pattern>
  );
}
