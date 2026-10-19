"use client";

import { useEffect, useState } from "react";

import {
  HEALTH_CHECK_HISTORY_SIZE,
  HEALTH_CHECK_INTERVAL_MS,
  type HealthCheckRecord,
} from "@/lib/system-status";
import { measureDuration } from "@/lib/timing";
import { checkHealth } from "@/services/health";

type HealthMonitorOptions = {
  /** Time between checks. */
  intervalMs?: number;
  /** How many recent checks to keep for the tracker and sparkline. */
  historySize?: number;
};

/**
 * Polls the API's /health from the browser and keeps the most recent checks.
 * Pauses while the tab is hidden, and checks again as soon as it is visible.
 */
export function useHealthMonitor({
  intervalMs = HEALTH_CHECK_INTERVAL_MS,
  historySize = HEALTH_CHECK_HISTORY_SIZE,
}: HealthMonitorOptions = {}) {
  const [history, setHistory] = useState<HealthCheckRecord[]>([]);

  useEffect(() => {
    let cancelled = false;
    let nextCheckId = 0;

    async function recordHealthCheck() {
      if (document.hidden) return;
      const { result: outcome, durationMs } = await measureDuration(checkHealth);
      if (cancelled) return;
      const record: HealthCheckRecord = {
        id: nextCheckId++,
        checkedAt: Date.now(),
        outcome,
        roundTripMs: durationMs,
      };
      setHistory((previous) => [...previous, record].slice(-historySize));
    }

    function checkWhenVisible() {
      if (!document.hidden) void recordHealthCheck();
    }

    void recordHealthCheck();
    const timer = window.setInterval(recordHealthCheck, intervalMs);
    document.addEventListener("visibilitychange", checkWhenVisible);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", checkWhenVisible);
    };
  }, [intervalMs, historySize]);

  return { history, latest: history.at(-1) };
}
