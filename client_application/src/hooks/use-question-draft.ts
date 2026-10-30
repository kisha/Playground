"use client";

import { useState } from "react";

import { isSubmitKeyPress } from "@/lib/chat";

/** The question being typed into the chat: send it with the button or Enter, then start a fresh one. */
export function useQuestionDraft(onSubmit: (question: string) => void, isDisabled: boolean) {
  const [draftQuestion, setDraftQuestion] = useState("");
  const canSubmit = draftQuestion.trim().length > 0 && !isDisabled;

  function submitDraftQuestion() {
    if (!canSubmit) return;
    onSubmit(draftQuestion);
    setDraftQuestion("");
  }

  return {
    draftQuestion,
    setDraftQuestion,
    canSubmit,
    submitDraftQuestion,
    submitOnEnter: (event: React.KeyboardEvent) => {
      if (!isSubmitKeyPress({ ...event, isComposing: event.nativeEvent.isComposing })) return;
      event.preventDefault();
      submitDraftQuestion();
    },
  };
}
