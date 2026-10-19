import { cn } from "@/lib/utils";

/** Grey placeholder shown while content loads. Pulses unless the visitor prefers reduced motion. */
export function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div aria-hidden className={cn("rounded bg-muted motion-safe:animate-pulse", className)} style={style} />;
}
