import { cn } from "@/lib/utils";
import type { LinkState } from "@/lib/system-status";

const DOT: Record<LinkState, string> = {
  healthy: "bg-foreground",
  degraded: "stripes border border-foreground text-foreground",
  offline: "border border-foreground",
  pending: "bg-muted-foreground/40 motion-safe:animate-pulse",
};

/** Small status dot. Pulses while healthy; shape (solid, striped, outlined) carries the state. */
export function PulseDot({ state, className }: { state: LinkState; className?: string }) {
  return (
    <span className={cn("relative flex size-2.5 shrink-0", className)} aria-hidden>
      {state === "healthy" && (
        <span className="absolute inline-flex size-full rounded-full bg-foreground opacity-30 motion-safe:animate-ping" />
      )}
      <span className={cn("relative inline-flex size-full rounded-full", DOT[state])} />
    </span>
  );
}
