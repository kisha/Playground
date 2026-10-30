"use client";

import { ChatPanelContext, useChatPanelState } from "@/hooks/use-chat-panel";

/** Shares the chat panel's state with everything in the app frame. */
export function ChatPanelProvider({ children }: { children: React.ReactNode }) {
  return <ChatPanelContext.Provider value={useChatPanelState()}>{children}</ChatPanelContext.Provider>;
}
