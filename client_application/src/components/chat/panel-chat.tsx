"use client";

import { ArrowUp, MessageCircleDashed, RotateCw } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { QuestionBubble } from "@/components/question-bubble";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CHAT_DESCRIPTION, CHAT_PLACEHOLDER, CHAT_WELCOME, suggestedQuestions } from "@/content/chat-ui";
import { useChat } from "@/hooks/use-chat";
import { useQuestionDraft } from "@/hooks/use-question-draft";
import { useScrollToLatest } from "@/hooks/use-scroll-to-latest";
import { useTimeOfDayGreeting } from "@/hooks/use-time-of-day-greeting";
import type { ChatMessage } from "@/lib/chat";

/** A chat for a side panel: a header, the messages, and a box to type the next question. Fills its container. */
export function PanelChat() {
  const { chatMessages, isAwaitingReply, submitQuestion, startNewChat } = useChat();
  const conversationRef = useScrollToLatest<HTMLDivElement>(chatMessages.length + Number(isAwaitingReply));

  return (
    <section aria-label="Chat" className="flex h-full min-h-0 flex-col">
      <header className="flex items-center justify-between gap-3 border-b px-5 py-4">
        <div className="min-w-0">
          <h2 className="font-semibold tracking-tight">Chat</h2>
          <p className="text-sm text-muted-foreground">{CHAT_DESCRIPTION}</p>
        </div>
        <Button variant="outline" size="icon" aria-label="Start over" title="Start over" onClick={startNewChat}>
          <RotateCw />
        </Button>
      </header>

      <div ref={conversationRef} className="min-h-0 flex-1 overflow-y-auto px-5 py-6">
        {chatMessages.length === 0 ? (
          <ChatWelcome onQuestionChosen={submitQuestion} />
        ) : (
          <ol className="flex flex-col gap-5">
            {chatMessages.map((message) => (
              <li key={message.id}>
                <ChatMessageItem message={message} onQuestionChosen={submitQuestion} />
              </li>
            ))}
            {isAwaitingReply && (
              <li className="flex items-center gap-2 text-sm text-muted-foreground" aria-live="polite">
                <span className="size-1.5 rounded-full bg-muted-foreground motion-safe:animate-pulse" />
                Thinking…
              </li>
            )}
          </ol>
        )}
      </div>

      <QuestionComposer onSubmit={submitQuestion} disabled={isAwaitingReply} />
    </section>
  );
}

function ChatWelcome({ onQuestionChosen }: { onQuestionChosen: (question: string) => void }) {
  const greeting = useTimeOfDayGreeting();

  return (
    <EmptyState
      icon={MessageCircleDashed}
      title={`${greeting}!`}
      description={CHAT_WELCOME}
      bordered={false}
      className="h-full p-0"
    >
      <SuggestedQuestions questions={suggestedQuestions} onQuestionChosen={onQuestionChosen} />
    </EmptyState>
  );
}

function ChatMessageItem({
  message,
  onQuestionChosen,
}: {
  message: ChatMessage;
  onQuestionChosen: (question: string) => void;
}) {
  if (message.role === "user") return <QuestionBubble>{message.text}</QuestionBubble>;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm leading-relaxed">{message.text}</p>
      {message.suggestedQuestions && (
        <SuggestedQuestions questions={message.suggestedQuestions} onQuestionChosen={onQuestionChosen} />
      )}
    </div>
  );
}

export function SuggestedQuestions({
  questions,
  onQuestionChosen,
}: {
  questions: string[];
  onQuestionChosen: (question: string) => void;
}) {
  return (
    <ul className="mt-3 flex w-full flex-col gap-2">
      {questions.map((question) => (
        <li key={question}>
          <button
            type="button"
            onClick={() => onQuestionChosen(question)}
            className="w-full rounded-xl border px-3.5 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {question}
          </button>
        </li>
      ))}
    </ul>
  );
}

function QuestionComposer({ onSubmit, disabled }: { onSubmit: (question: string) => void; disabled: boolean }) {
  const { draftQuestion, setDraftQuestion, canSubmit, submitDraftQuestion, submitOnEnter } = useQuestionDraft(
    onSubmit,
    disabled,
  );

  return (
    <form
      className="p-4"
      onSubmit={(event) => {
        event.preventDefault();
        submitDraftQuestion();
      }}
    >
      <div className="flex flex-col gap-2 rounded-2xl bg-muted p-3 transition-shadow focus-within:ring-2 focus-within:ring-ring/30">
        <Textarea
          value={draftQuestion}
          onChange={(event) => setDraftQuestion(event.target.value)}
          onKeyDown={submitOnEnter}
          rows={2}
          placeholder={CHAT_PLACEHOLDER}
          aria-label="Your question"
          className="max-h-40 min-h-12 resize-none border-0 bg-transparent p-1 shadow-none focus-visible:ring-0 dark:bg-transparent"
        />
        <div className="flex justify-end">
          <Button type="submit" size="icon" disabled={!canSubmit} aria-label="Send">
            <ArrowUp />
          </Button>
        </div>
      </div>
    </form>
  );
}
