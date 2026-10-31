"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { useChatPanelDocks } from "@/hooks/use-chat-panel-docks";

type ChatPanelState = {
  /** False when the frame style has no chat panel: it stays closed and its controls are gone. */
  isChatPanelAvailable: boolean;
  setChatPanelAvailable: (available: boolean) => void;
  isChatPanelOpen: boolean;
  setChatPanelOpen: (open: boolean) => void;
  toggleChatPanel: () => void;
};

export const ChatPanelContext = createContext<ChatPanelState | null>(null);

/** The chat panel's state, for anything inside the app frame. */
export function useChatPanel(): ChatPanelState {
  const chatPanelState = useContext(ChatPanelContext);
  if (!chatPanelState) throw new Error("useChatPanel must be used inside ChatPanelProvider.");
  return chatPanelState;
}

/**
 * Whether the chat panel is open, with ⌘J to toggle it. Until someone chooses, it's open on a
 * desktop and closed on a phone, where it would cover the page.
 */
export function useChatPanelState(): ChatPanelState {
  const chatPanelDocks = useChatPanelDocks();
  const [isChatPanelAvailable, setChatPanelAvailable] = useState(true);
  const [chosenOpen, setChosenOpen] = useState<boolean | null>(null);
  const isChatPanelOpen = isChatPanelAvailable && (chosenOpen ?? chatPanelDocks);

  const toggleChatPanel = useCallback(() => setChosenOpen(!isChatPanelOpen), [isChatPanelOpen]);

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
      setChatPanelOpen: setChosenOpen,
      toggleChatPanel,
    }),
    [isChatPanelAvailable, isChatPanelOpen, toggleChatPanel],
  );
}
