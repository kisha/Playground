/** Preset requests for the sandbox's API explorer. Add or edit requests here. */

export type PresetRequest = {
  id: string;
  label: string;
  method: "GET" | "POST";
  path: string;
  body?: unknown;
  /** What this request demonstrates. */
  note: string;
};

export const presetRequests: PresetRequest[] = [
  {
    id: "health",
    label: "Health",
    method: "GET",
    path: "/health",
    note: "Is the server application up, and can it reach the database?",
  },
  {
    id: "kpis",
    label: "KPIs",
    method: "GET",
    path: "/sandbox/kpis",
    note: "The headline measures behind the KPI cards below.",
  },
  {
    id: "gateway",
    label: "Gateway completion",
    method: "GET",
    path: "/sandbox/gateway-completion",
    note: "A chart's data: meta (title, takeaway, fields used) plus rows.",
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
