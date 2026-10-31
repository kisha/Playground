/** Quick picks for the sandbox's API explorer. Add or edit them here; every endpoint is listed automatically. */

export type EndpointParam = {
  name: string;
  location: "path" | "query";
  required: boolean;
  defaultValue: string;
};

export type ExplorerRequest = {
  id: string;
  label: string;
  method: string;
  /** Relative to the API base URL. May hold {placeholders} for path params. */
  path: string;
  body?: unknown;
  /** What this request does. */
  note: string;
  params?: EndpointParam[];
};

export const presetRequests: ExplorerRequest[] = [
  {
    id: "health",
    label: "Health",
    method: "GET",
    path: "/health",
    note: "Is the server application up, and can it reach the database?",
  },
  {
    id: "gateway",
    label: "Gateway completion",
    method: "GET",
    path: "/sandbox/chart-examples",
    note: "A chart's data by name: meta (title, takeaway, fields used) plus rows.",
    params: [{ name: "charts", location: "query", required: false, defaultValue: "gateway-completion" }],
  },
  {
    id: "search",
    label: "Vector search",
    method: "POST",
    path: "/documents/search",
    body: { query: "gateway math completion", limit: 3 },
    note: "pgvector similarity search over stored documents.",
  },
  {
    id: "not-found",
    label: "Unknown endpoint",
    method: "GET",
    path: "/does-not-exist",
    note: "How the API answers a missing endpoint: a 404 in the standard error shape.",
  },
  {
    id: "invalid",
    label: "Invalid request",
    method: "POST",
    path: "/documents",
    body: { content: "" },
    note: "How the API answers bad input: a 422 listing each field's problem.",
  },
];
