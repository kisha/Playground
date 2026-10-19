import { PulseDot } from "@/components/landing/pulse-dot";
import { cn } from "@/lib/utils";
import type { LinkState } from "@/lib/system-status";

export type DiagramNode = {
  name: string;
  technology: string;
  detail: string;
  state: LinkState;
};

const NODE: Record<LinkState, string> = {
  healthy: "border-foreground/70",
  degraded: "border-dashed border-foreground/70",
  offline: "border-dashed border-foreground/30 text-muted-foreground",
  pending: "border-border",
};

function Node({ node }: { node: DiagramNode }) {
  return (
    <div
      className={cn(
        "flex w-52 flex-col items-center gap-1 rounded-xl border bg-background px-4 py-5 transition-colors duration-500",
        NODE[node.state],
      )}
    >
      <div className="flex items-center gap-2">
        <PulseDot state={node.state} />
        <span className="text-sm font-medium tracking-tight">{node.name}</span>
      </div>
      <span className="text-xs text-muted-foreground">{node.technology}</span>
      <span className="mt-1 font-mono text-xs text-muted-foreground tabular-nums">{node.detail}</span>
    </div>
  );
}

/** Line between two nodes. On every successful check a dot travels along it (keyed by runKey). */
function Connector({ active, runKey, delayMs }: { active: boolean; runKey: number; delayMs: number }) {
  return (
    <div className="relative flex h-10 w-px items-center justify-center md:h-px md:w-auto md:min-w-12 md:flex-1">
      <span
        className={cn(
          "absolute inset-0 transition-opacity duration-500",
          active
            ? "bg-foreground/40"
            : "bg-[repeating-linear-gradient(to_bottom,var(--border)_0_4px,transparent_4px_8px)] md:bg-[repeating-linear-gradient(to_right,var(--border)_0_4px,transparent_4px_8px)]",
        )}
      />
      {active && (
        <span
          key={runKey}
          style={{ animationDelay: `${delayMs}ms` }}
          className="absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground opacity-0 max-md:left-1/2 motion-safe:max-md:animate-travel-y md:top-1/2 motion-safe:md:animate-travel-x"
        />
      )}
    </div>
  );
}

/** Client Application → Server Application → Data, each with its live state. */
export function SystemDiagram({ nodes, runKey }: { nodes: [DiagramNode, DiagramNode, DiagramNode]; runKey: number }) {
  const [website, api, database] = nodes;
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center md:flex-row md:justify-center">
      <Node node={website} />
      <Connector active={api.state !== "offline" && api.state !== "pending"} runKey={runKey} delayMs={0} />
      <Node node={api} />
      <Connector active={database.state === "healthy"} runKey={runKey} delayMs={600} />
      <Node node={database} />
    </div>
  );
}
