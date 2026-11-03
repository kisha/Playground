"use client";

import { useLayoutEffect } from "react";

import { useChatPanel } from "@/hooks/use-chat-panel";

/** Tells the shell around this page which style to show, since a layout can't read the URL's query. Leaving resets it. */
export function ApplyShellStyle({ hasChatPanel, look }: { hasChatPanel: boolean; look?: string }) {
  const { setChatPanelAvailable } = useChatPanel();

  useLayoutEffect(() => {
    setChatPanelAvailable(hasChatPanel);
    return () => setChatPanelAvailable(true);
  }, [hasChatPanel, setChatPanelAvailable]);

  // On <html>, so the look also reaches sheets drawn outside the shell.
  useLayoutEffect(() => {
    if (!look) return;
    const root = document.documentElement;
    root.dataset.shellLook = look;
    return () => {
      delete root.dataset.shellLook;
    };
  }, [look]);

  return null;
}
