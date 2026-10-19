import { PulseDot } from "@/components/landing/pulse-dot";
import { diagramNodeClasses } from "@/lib/connection-styles";
import { type DiagramNode, isConnected } from "@/lib/system-status";
import { cn } from "@/lib/utils";

function DiagramBox({ node }: { node: DiagramNode }) {
  return (
    <div
      className={cn(
        "flex w-52 flex-col items-center gap-1 rounded-xl border bg-background px-4 py-5 transition-colors duration-500",
        diagramNodeClasses[node.state],
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

type ConnectorProps = {
  connected: boolean;
  /** Changes on every check, which restarts the travelling dot. */
  checkId: number;
  delayMs: number;
};

/** Line between two boxes. On every successful check a dot travels along it. */
function Connector({ connected, checkId, delayMs }: ConnectorProps) {
  return (
    <div className="relative flex h-10 w-px items-center justify-center md:h-px md:w-auto md:min-w-12 md:flex-1">
      <span
        className={cn(
          "absolute inset-0 transition-opacity duration-500",
          connected
            ? "bg-foreground/40"
            : "bg-[repeating-linear-gradient(to_bottom,var(--border)_0_4px,transparent_4px_8px)] md:bg-[repeating-linear-gradient(to_right,var(--border)_0_4px,transparent_4px_8px)]",
        )}
      />
      {connected && (
        <span
          key={checkId}
          style={{ animationDelay: `${delayMs}ms` }}
          className="absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground opacity-0 max-md:left-1/2 motion-safe:max-md:animate-travel-y md:top-1/2 motion-safe:md:animate-travel-x"
        />
      )}
    </div>
  );
}

type SystemDiagramProps = {
  nodes: [DiagramNode, DiagramNode, DiagramNode];
  checkId: number;
};

/** Client Application → Server Application → Data, each with its live state. */
export function SystemDiagram({ nodes, checkId }: SystemDiagramProps) {
  const [clientNode, serverNode, dataNode] = nodes;
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center md:flex-row md:justify-center">
      <DiagramBox node={clientNode} />
      <Connector connected={isConnected(serverNode.state)} checkId={checkId} delayMs={0} />
      <DiagramBox node={serverNode} />
      <Connector connected={isConnected(dataNode.state)} checkId={checkId} delayMs={600} />
      <DiagramBox node={dataNode} />
    </div>
  );
}
