import type { PresetRequest } from "@/content/sandbox-requests";
import { type CapturedResponse, captureApiResponse } from "@/lib/api-client";
import { describeError } from "@/lib/errors";

/** What the explorer's Response panel shows. */
export type ExplorerExchange =
  | { state: "sending" }
  | { state: "done"; response: CapturedResponse }
  | { state: "unreachable"; message: string };

/** Send one preset request and describe the outcome. Never throws. */
export async function sendPresetRequest(request: PresetRequest): Promise<ExplorerExchange> {
  try {
    return { state: "done", response: await captureApiResponse(request.method, request.path, request.body) };
  } catch (error) {
    return { state: "unreachable", message: describeError(error) };
  }
}

export function isErrorStatus(status: number): boolean {
  return status >= 400;
}

/** Pretty-printed JSON for the Request and Response panels. */
export function formatJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}
