/**
 * Send a question to the chat. For now it answers from canned replies in the browser; once the server has a chat
 * endpoint, this is the one place that changes to call it.
 */

import { cannedReplies } from "@/content/chat-ui";
import { findBestCannedReply } from "@/lib/chat";

/** Long enough to show the "thinking" state, as a real request would. */
const MOCK_DELAY_MS = 700;

/** The reply's text, or null when there's no reply for the question. */
export async function sendChatQuestion(question: string): Promise<string | null> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
  return findBestCannedReply(question, cannedReplies)?.text ?? null;
}
