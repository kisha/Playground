"use client";

import { ArrowUp, Bot, UserRound } from "lucide-react";

import { SuggestedQuestions } from "@/components/chat/panel-chat";
import { QuestionBubble } from "@/components/question-bubble";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CHAT_PLACEHOLDER, CHAT_WELCOME, suggestedQuestions } from "@/content/chat-ui";
import { useChat } from "@/hooks/use-chat";
import { useQuestionDraft } from "@/hooks/use-question-draft";
import { useScrollToLatest } from "@/hooks/use-scroll-to-latest";
import type { LucideIcon } from "lucide-react";

/** A messaging app's layout, for support or a small widget: both sides in bubbles with avatars, and a one-line box. */
export function MessengerChat() {
  const { chatMessages, isAwaitingReply, submitQuestion } = useChat();
  const conversationRef = useScrollToLatest<HTMLDivElement>(chatMessages.length + Number(isAwaitingReply));

  return (
    <section aria-label="Messenger chat" className="flex h-full min-h-0 flex-col">
      <div ref={conversationRef} className="min-h-0 flex-1 overflow-y-auto p-4">
        <ol className="flex flex-col gap-3">
          <li className="flex items-end gap-2">
            <Avatar icon={Bot} />
            <div className="flex min-w-0 flex-1 flex-col">
              <ReplyBubble>{CHAT_WELCOME}</ReplyBubble>
              {chatMessages.length === 0 && (
                <SuggestedQuestions questions={suggestedQuestions} onQuestionChosen={submitQuestion} />
              )}
            </div>
          </li>
          {chatMessages.map((message) =>
            message.role === "user" ? (
              <li key={message.id} className="flex items-end justify-end gap-2">
                <QuestionBubble className="m-0">{message.text}</QuestionBubble>
                <Avatar icon={UserRound} />
              </li>
            ) : (
              <li key={message.id} className="flex items-end gap-2">
                <Avatar icon={Bot} />
                <div className="flex min-w-0 flex-1 flex-col">
                  <ReplyBubble>{message.text}</ReplyBubble>
                  {message.suggestedQuestions && (
                    <SuggestedQuestions questions={message.suggestedQuestions} onQuestionChosen={submitQuestion} />
                  )}
                </div>
              </li>
            ),
          )}
          {isAwaitingReply && (
            <li className="flex items-end gap-2" aria-live="polite">
              <Avatar icon={Bot} />
              <ReplyBubble>Thinking…</ReplyBubble>
            </li>
          )}
        </ol>
      </div>
      <MessengerComposer onSubmit={submitQuestion} disabled={isAwaitingReply} />
    </section>
  );
}

function Avatar({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span aria-hidden className="flex size-7 shrink-0 items-center justify-center rounded-full border bg-background">
      <Icon className="size-3.5" />
    </span>
  );
}

function ReplyBubble({ children }: { children: React.ReactNode }) {
  return <p className="w-fit max-w-[85%] rounded-2xl rounded-bl-md bg-muted px-4 py-2.5 text-sm">{children}</p>;
}

function MessengerComposer({ onSubmit, disabled }: { onSubmit: (question: string) => void; disabled: boolean }) {
  const { draftQuestion, setDraftQuestion, canSubmit, submitDraftQuestion, submitOnEnter } = useQuestionDraft(
    onSubmit,
    disabled,
  );

  return (
    <form
      className="flex items-center gap-2 border-t p-3"
      onSubmit={(event) => {
        event.preventDefault();
        submitDraftQuestion();
      }}
    >
      <Textarea
        value={draftQuestion}
        onChange={(event) => setDraftQuestion(event.target.value)}
        onKeyDown={submitOnEnter}
        rows={1}
        placeholder={CHAT_PLACEHOLDER}
        aria-label="Your question"
        className="max-h-28 min-h-9 resize-none rounded-full px-4 py-2"
      />
      <Button type="submit" size="icon" className="shrink-0 rounded-full" disabled={!canSubmit} aria-label="Send">
        <ArrowUp />
      </Button>
    </form>
  );
}
