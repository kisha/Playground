"use client";

import { useMediaQuery } from "@/hooks/use-media-query";

/** Below this, the sidebar, page and chat panel don't fit side by side, so the panel slides over the page. */
const DOCKED_QUERY = "(min-width: 1280px)";

/** Whether the screen is wide enough to dock the chat panel beside the page. */
export function useChatPanelDocks(): boolean {
  return useMediaQuery(DOCKED_QUERY, true);
}
