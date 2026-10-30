import type { Metadata } from "next";

import { MessengerChat } from "@/components/chat/messenger-chat";
import { PanelChat } from "@/components/chat/panel-chat";
import { PageIntro } from "@/components/page-intro";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Chat UI",
  description: "Two chat layouts to start from, both with canned mock replies.",
};

const chatCardClasses = "mx-auto w-full max-w-md overflow-hidden rounded-2xl border bg-card shadow-sm";

export default function ChatUiPage() {
  return (
    <>
      <PageIntro eyebrow="Sandbox" title="Chat UI">
        <p>Two chat layouts to start from. Both work, with canned mock replies, so try them.</p>
      </PageIntro>

      <section aria-labelledby="panel-chat-heading" className="flex flex-col gap-6">
        <SectionHeading id="panel-chat-heading" title="Side panel">
          <p className="text-muted-foreground">For a narrow space beside the page, with a header and Start over.</p>
        </SectionHeading>
        <div className={`${chatCardClasses} h-[36rem]`}>
          <PanelChat />
        </div>
      </section>

      <section aria-labelledby="messenger-chat-heading" className="flex flex-col gap-6">
        <SectionHeading id="messenger-chat-heading" title="Messenger">
          <p className="text-muted-foreground">For support or a small widget: bubbles on both sides, with avatars.</p>
        </SectionHeading>
        <div className={`${chatCardClasses} h-[32rem]`}>
          <MessengerChat />
        </div>
      </section>
    </>
  );
}
