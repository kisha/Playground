"use client";

import { LatencySparkline } from "@/components/landing/latency-sparkline";
import { PulseDot } from "@/components/landing/pulse-dot";
import { StatusTracker } from "@/components/landing/status-tracker";
import { SystemDiagram } from "@/components/landing/system-diagram";
import { useHealthMonitor } from "@/hooks/use-health-monitor";
import {
  apiVersionLabel,
  HEALTH_CHECK_HISTORY_SIZE,
  HEALTH_CHECK_INTERVAL_MS,
  toDiagramNodes,
  toSystemStatus,
} from "@/lib/system-status";

/** The live part of the landing page: diagram, tracker and sparkline, fed by /health. */
export function LiveStatus() {
  const { history, latest } = useHealthMonitor();
  const status = toSystemStatus(latest);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-center gap-2.5" aria-live="polite">
        <PulseDot state={status.overall} />
        <span className="text-sm text-muted-foreground">{status.label}</span>
      </div>

      <SystemDiagram nodes={toDiagramNodes(latest)} checkId={latest?.id ?? -1} />

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Last {HEALTH_CHECK_HISTORY_SIZE} checks</span>
            <span>every {HEALTH_CHECK_INTERVAL_MS / 1000}s</span>
          </div>
          <StatusTracker history={history} totalSlots={HEALTH_CHECK_HISTORY_SIZE} />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Round-trip latency</span>
            <span className="font-mono tabular-nums">{apiVersionLabel(latest)}</span>
          </div>
          <LatencySparkline history={history} />
        </div>
      </div>
    </div>
  );
}
