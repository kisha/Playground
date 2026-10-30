"use client";

import { useSyncExternalStore } from "react";

/** Below this, the sidebar, page and chat panel don't fit side by side, so the panel slides over the page. */
const dockedQuery = "(min-width: 1280px)";

function subscribeToWidthChanges(onWidthChange: () => void) {
  const mediaQuery = window.matchMedia(dockedQuery);
  mediaQuery.addEventListener("change", onWidthChange);
  return () => mediaQuery.removeEventListener("change", onWidthChange);
}

/** Whether the screen is wide enough to dock the chat panel beside the page. */
export function useChatPanelDocks(): boolean {
  return useSyncExternalStore(subscribeToWidthChanges, () => window.matchMedia(dockedQuery).matches, () => true);
}
