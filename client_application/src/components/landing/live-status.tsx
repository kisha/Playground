"use client";

import { LatencySparkline } from "@/components/landing/latency-sparkline";
import { PulseDot } from "@/components/landing/pulse-dot";
import { StatusTracker } from "@/components/landing/status-tracker";
import { type DiagramNode, SystemDiagram } from "@/components/landing/system-diagram";
import { useHealthMonitor } from "@/hooks/use-health-monitor";
import { env } from "@/lib/env";
import { type CheckResult, toSystemStatus } from "@/lib/system-status";

const HISTORY_SIZE = 30;
const INTERVAL_MS = 5_000;

function describeNodes(latest: CheckResult | undefined): [DiagramNode, DiagramNode, DiagramNode] {
  const status = toSystemStatus(latest);
  const health = latest?.check.reachable ? latest.check.health : undefined;

  const apiDetail = !latest ? "checking…" : health ? `${latest.roundTripMs} ms` : "unreachable";
  const databaseDetail = !health
    ? "unknown"
    : health.database.status === "connected"
      ? `${health.database.latency_ms} ms`
      : "disconnected";

  return [
    { name: "Website", detail: env.appEnv, state: status.website },
    { name: "API", detail: apiDetail, state: status.api },
    { name: "Database", detail: databaseDetail, state: status.database },
  ];
}

/** The live part of the landing page: diagram, tracker and sparkline, fed by /health. */
export function LiveStatus() {
  const { history, latest } = useHealthMonitor({ intervalMs: INTERVAL_MS, historySize: HISTORY_SIZE });
  const status = toSystemStatus(latest);
  const version = latest?.check.reachable ? latest.check.health.version : null;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-center gap-2.5" aria-live="polite">
        <PulseDot state={status.overall} />
        <span className="text-sm text-muted-foreground">{status.label}</span>
      </div>

      <SystemDiagram nodes={describeNodes(latest)} runKey={latest?.id ?? -1} />

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Last {HISTORY_SIZE} checks</span>
            <span>every {INTERVAL_MS / 1000}s</span>
          </div>
          <StatusTracker history={history} slots={HISTORY_SIZE} />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Round-trip latency</span>
            <span className="font-mono tabular-nums">{version ? `API v${version}` : "—"}</span>
          </div>
          <LatencySparkline history={history} />
        </div>
      </div>
    </div>
  );
}
