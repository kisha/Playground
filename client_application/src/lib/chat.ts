/** The chat's shapes, and how a question is matched to a reply while replies are canned. */

export type CannedReply = { keywords: string[]; text: string };

export type ChatMessage =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "assistant"; text: string; suggestedQuestions?: string[] };

/** The canned reply whose keywords appear most often in the question, if any do. */
export function findBestCannedReply(question: string, cannedReplies: CannedReply[]): CannedReply | undefined {
  const lowerCaseQuestion = question.toLowerCase();
  let best: { cannedReply: CannedReply; keywordHits: number } | undefined;
  for (const cannedReply of cannedReplies) {
    const keywordHits = cannedReply.keywords.filter((keyword) => lowerCaseQuestion.includes(keyword)).length;
    if (keywordHits > 0 && (!best || keywordHits > best.keywordHits)) best = { cannedReply, keywordHits };
  }
  return best?.cannedReply;
}

/** "Morning", "Afternoon" or "Evening", for the empty chat. */
export function getTimeOfDayGreeting(date: Date): string {
  const hour = date.getHours();
  if (hour < 12) return "Morning";
  if (hour < 18) return "Afternoon";
  return "Evening";
}

/** Enter sends; Shift+Enter starts a new line; Enter while composing (e.g. Japanese input) doesn't send. */
export function isSubmitKeyPress(event: { key: string; shiftKey: boolean; isComposing: boolean }): boolean {
  return event.key === "Enter" && !event.shiftKey && !event.isComposing;
}
