import { cn } from "@/lib/utils";
import { type CheckResult, type LinkState, toCheckState } from "@/lib/system-status";

const BLOCK: Record<LinkState, string> = {
  healthy: "bg-foreground",
  degraded: "stripes border border-foreground/60 text-foreground/70",
  offline: "border border-foreground/40",
  pending: "bg-muted",
};

/** One block per health check, oldest on the left. Empty slots fill in as checks arrive. */
export function StatusTracker({ history, slots }: { history: CheckResult[]; slots: number }) {
  const empty = Math.max(slots - history.length, 0);

  return (
    <div className="flex h-8 w-full gap-[3px]" role="img" aria-label={`Last ${history.length} health checks`}>
      {Array.from({ length: empty }, (_, i) => (
        <span key={`empty-${i}`} className="flex-1 rounded-[3px] bg-muted" />
      ))}
      {history.map((result) => {
        const state = toCheckState(result);
        return (
          <span
            key={result.id}
            title={`${new Date(result.at).toLocaleTimeString()} · ${state} · ${result.roundTripMs} ms`}
            className={cn("flex-1 rounded-[3px] transition-colors duration-500", BLOCK[state])}
          />
        );
      })}
    </div>
  );
}
