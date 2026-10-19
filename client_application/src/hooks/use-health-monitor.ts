"use client";

import { useEffect, useState } from "react";

import type { CheckResult } from "@/lib/system-status";
import { checkHealth } from "@/services/health";

type Options = {
  /** Time between checks. */
  intervalMs?: number;
  /** How many recent checks to keep for the tracker and sparkline. */
  historySize?: number;
};

/**
 * Polls the API's /health from the browser and keeps the most recent checks.
 * Pauses while the tab is hidden, and checks again as soon as it is visible.
 */
export function useHealthMonitor({ intervalMs = 5_000, historySize = 30 }: Options = {}) {
  const [history, setHistory] = useState<CheckResult[]>([]);

  useEffect(() => {
    let cancelled = false;
    let nextId = 0;

    async function runCheck() {
      if (document.hidden) return;
      const started = performance.now();
      const check = await checkHealth();
      if (cancelled) return;
      const result: CheckResult = {
        id: nextId++,
        at: Date.now(),
        check,
        roundTripMs: Math.round(performance.now() - started),
      };
      setHistory((previous) => [...previous, result].slice(-historySize));
    }

    void runCheck();
    const timer = window.setInterval(runCheck, intervalMs);
    const onVisible = () => {
      if (!document.hidden) void runCheck();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [intervalMs, historySize]);

  return { history, latest: history.at(-1) };
}
