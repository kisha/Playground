"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { useChatPanelDocks } from "@/hooks/use-chat-panel-docks";

export type ChatPanelState = {
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
 * Whether the chat panel is open, with ⌘J to toggle it. Until someone chooses,  * desktop and closed on a phone, where it would cover the page.
 */
export function useChatPanelState(): ChatPanelState {
  const chatPanelDocks = useChatPanelDocks();
  const [chosenOpen, setChosenOpen] = useState<boolean | null>(null);
  const isChatPanelOpen = chosenOpen ?? chatPanelDocks;

  const toggleChatPanel = useCallback(() => setChosenOpen(!isChatPanelOpen), [isChatPanelOpen]);

  useEffect(() => {
    function toggleOnShortcut(event: KeyboardEvent) {
      if (event.key !== "j" || !(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      toggleChatPanel();
    }
    window.addEventListener("keydown", toggleOnShortcut);
    return () => window.removeEventListener("keydown", toggleOnShortcut);
  }, [toggleChatPanel]);

  return useMemo(
    () => ({ isChatPanelOpen, setChatPanelOpen: setChosenOpen, toggleChatPanel }),
    [isChatPanelOpen, toggleChatPanel],
  );
}
