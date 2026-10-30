import type { ExplorerRequest } from "@/content/sandbox-requests";
import { type CapturedResponse, captureApiResponse } from "@/lib/api-client";
import { describeError } from "@/lib/errors";

/** What the explorer's Response panel shows. "idle" is a request waiting for Send. */
export type ExplorerExchange =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "done"; response: CapturedResponse }
  | { state: "unreachable"; message: string };

export type ParamValues = Record<string, string>;

/** Send one request and describe the outcome. Never throws. */
export async function sendExplorerRequest(method: string, path: string, body: unknown): Promise<ExplorerExchange> {
  try {
    return { state: "done", response: await captureApiResponse(method, path, body) };
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

export function initialParamValues(request: ExplorerRequest): ParamValues {
  return Object.fromEntries((request.params ?? []).map((param) => [param.name, param.defaultValue]));
}

export function initialBodyText(request: ExplorerRequest): string {
  return request.body === undefined ? "" : formatJson(request.body);
}

/** The path with its params filled in. An empty path param stays as its {placeholder}, so the gap shows. */
export function buildRequestPath(request: ExplorerRequest, values: ParamValues): string {
  const query = new URLSearchParams();
  let path = request.path;
  for (const param of request.params ?? []) {
    const value = values[param.name]?.trim() ?? "";
    if (!value) continue;
    if (param.location === "path") path = path.replace(`{${param.name}}`, encodeURIComponent(value));
    else query.set(param.name, value);
  }
  const queryText = query.toString();
  return queryText ? `${path}?${queryText}` : path;
}

export function hasMissingParams(request: ExplorerRequest, values: ParamValues): boolean {
  return (request.params ?? []).some((param) => param.required && !values[param.name]?.trim());
}

/** The body text as JSON, or null when there's a mistake in it. */
export function parseBodyText(text: string): { value: unknown } | null {
  try {
    return { value: JSON.parse(text) };
  } catch {
    return null;
  }
}
