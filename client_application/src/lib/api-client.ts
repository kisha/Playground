import { env } from "@/lib/env";
import { measureDuration } from "@/lib/timing";

const DEFAULT_TIMEOUT_MS = 10_000;

/** Thrown for any failed request. `status` is 0 when the server could not be reached at all. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  /** Plain object sent as JSON. */
  json?: unknown;
  /** Abort after this many milliseconds. Defaults to 10 seconds. */
  timeoutMs?: number;
};

/** Send one request to the API. Throws ApiError (status 0) only when nothing answers. */
async function sendRequest(path: string, options: RequestOptions): Promise<Response> {
  const { json, timeoutMs = DEFAULT_TIMEOUT_MS, headers, ...init } = options;
  try {
    return await fetch(`${env.apiBaseUrl}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        ...(json !== undefined && { "Content-Type": "application/json" }),
        ...headers,
      },
      body: json !== undefined ? JSON.stringify(json) : undefined,
      signal: init.signal ?? AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    throw new ApiError(`Could not reach the API at ${env.apiBaseUrl}`, 0, error);
  }
}

/** The response body as JSON, or null when there is none (204) or it isn't JSON. */
async function readJsonBody(response: Response): Promise<unknown> {
  if (response.status === 204) return null;
  return response.json().catch(() => null);
}

/** The API sends every error as {"error": {"message": ...}}; pull out the readable message. */
function errorMessageFromBody(body: unknown): string | undefined {
  if (typeof body !== "object" || body === null || !("error" in body)) return undefined;
  const error = (body as { error: unknown }).error;
  if (typeof error !== "object" || error === null || !("message" in error)) return undefined;
  const message = (error as { message: unknown }).message;
  return typeof message === "string" ? message : undefined;
}

/**
 * The single place the client talks to server_application.
 * `path` is relative to the API base URL for the current environment, e.g. "/health".
 * Throws ApiError for any response that isn't 2xx.
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await sendRequest(path, options);
  const body = await readJsonBody(response);

  if (!response.ok) {
    const fallbackMessage = `${options.method ?? "GET"} ${path} failed with ${response.status}`;
    throw new ApiError(errorMessageFromBody(body) ?? fallbackMessage, response.status, body);
  }
  return body as T;
}

export type CapturedResponse = {
  status: number;
  statusText: string;
  durationMs: number;
  body: unknown;
};

/**
 * Send a request and return whatever comes back, 4xx and 5xx included, instead of throwing.
 * Used by the sandbox's API explorer to show real responses. Throws ApiError only when the API
 * cannot be reached at all.
 */
export async function captureApiResponse(method: string, path: string, json?: unknown): Promise<CapturedResponse> {
  const { result: response, durationMs } = await measureDuration(() =>
    sendRequest(path, { method, json, cache: "no-store" }),
  );
  return {
    status: response.status,
    statusText: response.statusText,
    durationMs,
    body: await readJsonBody(response),
  };
}
