"use client";

import { useSyncExternalStore } from "react";

import { getTimeOfDayGreeting } from "@/lib/chat";

/** The greeting only changes when it's shown again, so there is nothing to listen to. */
function subscribeToNoUpdates() {
  return () => {};
}

/** "Morning", "Afternoon" or "Evening" on the viewer's clock; the server renders "Hello". */
export function useTimeOfDayGreeting(): string {
  return useSyncExternalStore(subscribeToNoUpdates, () => getTimeOfDayGreeting(new Date()), () => "Hello");
}
