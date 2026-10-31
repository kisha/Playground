"use client";

import { useLayoutEffect } from "react";

import { useChatPanel } from "@/hooks/use-chat-panel";

/** Tells the shell around this page which style to show, since a layout can't read the URL's query. Leaving resets it. */
export function ApplyShellStyle({ hasChatPanel }: { hasChatPanel: boolean }) {
  const { setChatPanelAvailable } = useChatPanel();

  useLayoutEffect(() => {
    setChatPanelAvailable(hasChatPanel);
    return () => setChatPanelAvailable(true);
  }, [hasChatPanel, setChatPanelAvailable]);

  return null;
}
