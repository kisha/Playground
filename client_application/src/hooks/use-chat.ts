"use client";

import { useCallback, useRef, useState } from "react";

import { CHAT_NO_REPLY, suggestedQuestions } from "@/content/chat-ui";
import type { ChatMessage } from "@/lib/chat";
import { sendChatQuestion } from "@/services/chat";

/** The conversation: what's been said, whether a reply is on its way, and how to add to it or start over. */
export function useChat() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isAwaitingReply, setAwaitingReply] = useState(false);
  // Each question gets a number, so a reply is dropped if Start over came first.
  const latestQuestionNumber = useRef(0);

  const submitQuestion = useCallback(async (question: string) => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) return;
    const questionNumber = ++latestQuestionNumber.current;
    setChatMessages((previous) => [...previous, { id: crypto.randomUUID(), role: "user", text: trimmedQuestion }]);
    setAwaitingReply(true);

    const reply = await sendChatQuestion(trimmedQuestion);
    if (questionNumber !== latestQuestionNumber.current) return;
    setAwaitingReply(false);
    setChatMessages((previous) => [
      ...previous,
      reply
        ? { id: crypto.randomUUID(), role: "assistant", text: reply }
        : { id: crypto.randomUUID(), role: "assistant", text: CHAT_NO_REPLY, suggestedQuestions },
    ]);
  }, []);

  const startNewChat = useCallback(() => {
    latestQuestionNumber.current += 1;
    setAwaitingReply(false);
    setChatMessages([]);
  }, []);

  return { chatMessages, isAwaitingReply, submitQuestion, startNewChat };
}
