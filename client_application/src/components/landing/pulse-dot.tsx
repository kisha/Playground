import { statusDotClasses } from "@/lib/connection-styles";
import type { ConnectionState } from "@/lib/system-status";
import { cn } from "@/lib/utils";

/** Small status dot. Pulses while healthy; shape (solid, striped, outlined) carries the state. */
export function PulseDot({ state, className }: { state: ConnectionState; className?: string }) {
  return (
    <span className={cn("relative flex size-2.5 shrink-0", className)} aria-hidden>
      {state === "healthy" && (
        <span className="absolute inline-flex size-full rounded-full bg-foreground opacity-30 motion-safe:animate-ping" />
      )}
      <span className={cn("relative inline-flex size-full rounded-full", statusDotClasses[state])} />
    </span>
  );
}
