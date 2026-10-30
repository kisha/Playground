/** The words the chat example says. Canned replies stand in for a model until one is connected. */

import type { CannedReply } from "@/lib/chat";

export const CHAT_DESCRIPTION = "How can I help you today?";
export const CHAT_WELCOME = "Ask a question about the Playground. Replies are canned mock answers for now.";
export const CHAT_PLACEHOLDER = "Ask a question…";
export const CHAT_NO_REPLY = "I can only answer a few sample questions so far. Try one of these:";

export const suggestedQuestions = [
  "What can I do in the sandbox?",
  "Which charts are there?",
  "How do I send an API request?",
];

export const cannedReplies: CannedReply[] = [
  {
    keywords: ["chart"],
    text: "Trend lines, bar charts, pies and more. Each one loads its own mock-data endpoint: see Charts in the sidebar.",
  },
  {
    keywords: ["api", "request", "endpoint"],
    text: "Open Api Requests in the sidebar and pick a request. It goes to the Server Application, and you see the real response.",
  },
  {
    keywords: ["sandbox"],
    text: "Try the reusable examples in the sidebar, or copy one to add your own page. The sandbox is off in production.",
  },
];
