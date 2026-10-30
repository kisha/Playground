"use client";

import { PanelRight } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useChatPanel } from "@/hooks/use-chat-panel";

/** Above the page: the sidebar toggle on the left; the chat panel toggle and theme toggle on the right. */
export function AppTopbar() {
  const { isChatPanelOpen, toggleChatPanel } = useChatPanel();

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-3 sm:px-4">
      <SidebarTrigger aria-label="Toggle sidebar (⌘B)" title="Toggle sidebar (⌘B)" />
      <div className="ml-auto flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle chat panel (⌘J)"
          title="Toggle chat panel (⌘J)"
          aria-pressed={isChatPanelOpen}
          onClick={toggleChatPanel}
        >
          <PanelRight />
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}
