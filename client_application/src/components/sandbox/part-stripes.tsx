/** The striped fill for the fourth part of a whole. Goes inside a chart's <defs>. */
export function PartStripes() {
  return (
    <pattern id="part-stripes" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="6" height="6" fill="var(--background)" />
      <line x1="0" y1="0" x2="0" y2="6" stroke="var(--foreground)" strokeWidth="3" />
    </pattern>
  );
}
