import { env } from "@/lib/env";

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

/**
 * The single place the client talks to server_application.
 * `path` is relative to the API base URL for the current environment, e.g. "/health".
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { json, timeoutMs = 10_000, headers, ...init } = options;

  let response: Response;
  try {
    response = await fetch(`${env.apiBaseUrl}${path}`, {
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

  const body: unknown = response.status === 204 ? undefined : await response.json().catch(() => undefined);

  if (!response.ok) {
    throw new ApiError(`${init.method ?? "GET"} ${path} failed with ${response.status}`, response.status, body);
  }
  return body as T;
}
