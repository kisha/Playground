"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type ChatPanelState = {
  /** False when the shell style has no chat panel: it stays closed and its controls are gone. */
  isChatPanelAvailable: boolean;
  setChatPanelAvailable: (available: boolean) => void;
  isChatPanelOpen: boolean;
  setChatPanelOpen: (open: boolean) => void;
  toggleChatPanel: () => void;
};

export const ChatPanelContext = createContext<ChatPanelState | null>(null);

/** The chat panel's state, for anything inside the app shell. */
export function useChatPanel(): ChatPanelState {
  const chatPanelState = useContext(ChatPanelContext);
  if (!chatPanelState) throw new Error("useChatPanel must be used inside ChatPanelProvider.");
  return chatPanelState;
}

/**
 * Whether the chat panel is open, with ⌘J to toggle it. It starts closed on every screen size.
 */
export function useChatPanelState(): ChatPanelState {
  const [isChatPanelAvailable, setChatPanelAvailable] = useState(true);
  const [isOpen, setChatPanelOpen] = useState(false);
  const isChatPanelOpen = isChatPanelAvailable && isOpen;

  const toggleChatPanel = useCallback(() => setChatPanelOpen(!isChatPanelOpen), [isChatPanelOpen]);

  useEffect(() => {
    function toggleOnShortcut(event: KeyboardEvent) {
      if (!isChatPanelAvailable || event.key !== "j" || !(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      toggleChatPanel();
    }
    window.addEventListener("keydown", toggleOnShortcut);
    return () => window.removeEventListener("keydown", toggleOnShortcut);
  }, [isChatPanelAvailable, toggleChatPanel]);

  return useMemo(
    () => ({
      isChatPanelAvailable,
      setChatPanelAvailable,
      isChatPanelOpen,
      setChatPanelOpen,
      toggleChatPanel,
    }),
    [isChatPanelAvailable, isChatPanelOpen, toggleChatPanel],
  );
}
