"use client";

import { AppSidebar } from "@/components/app-frame/app-sidebar";
import { AppTopbar } from "@/components/app-frame/app-topbar";
import { ChatPanelProvider } from "@/components/app-frame/chat-panel-provider";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useChatPanel } from "@/hooks/use-chat-panel";
import { useChatPanelDocks } from "@/hooks/use-chat-panel-docks";

/**
 * The app frame, like an editor: a collapsible sidebar on the left, the page in the middle, and the chat panel on
 * the right. On smaller screens the chat panel slides over the page, and on phones the sidebar does too. The chat
 * panel is empty for now.
 */
export function AppFrame({ children }: { children: React.ReactNode }) {
  return (
    <ChatPanelProvider>
      <SidebarProvider className="h-svh overflow-hidden">
        <AppSidebar />
        <SidebarInset className="min-w-0 overflow-hidden">
          <AppFramePanels>{children}</AppFramePanels>
        </SidebarInset>
      </SidebarProvider>
    </ChatPanelProvider>
  );
}

function AppFramePanels({ children }: { children: React.ReactNode }) {
  const chatPanelDocks = useChatPanelDocks();
  const { isChatPanelOpen, setChatPanelOpen } = useChatPanel();
  const mainArea = <AppMainArea>{children}</AppMainArea>;

  if (!chatPanelDocks) {
    return (
      <>
        {mainArea}
        <Sheet open={isChatPanelOpen} onOpenChange={setChatPanelOpen}>
          <SheetContent side="right" className="gap-0 p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-md">
            <SheetTitle className="sr-only">Chat</SheetTitle>
            <SheetDescription className="sr-only">The chat panel, empty for now.</SheetDescription>
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <ResizablePanelGroup orientation="horizontal" id="app-frame">
      <ResizablePanel id="main" minSize="40" className="min-w-0">
        {mainArea}
      </ResizablePanel>
      {isChatPanelOpen && (
        <>
          <ResizableHandle withHandle />
          <ResizablePanel id="chat" defaultSize="28" minSize="20" maxSize="50">
            <div className="h-full p-2 pl-1">
              <section aria-label="Chat" className="h-full rounded-2xl border bg-card shadow-sm" />
            </div>
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
}

/** The top bar above the scrolling page. */
function AppMainArea({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full min-w-0 flex-col">
      <AppTopbar />
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
