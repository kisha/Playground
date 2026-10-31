/** Turns the server's OpenAPI document into the endpoints the API explorer lists, and fills in their requests. */

import type { EndpointParam, ExplorerRequest } from "@/content/sandbox-requests";
import { env } from "@/lib/env";

type SchemaObject = {
  $ref?: string;
  type?: string;
  default?: unknown;
  required?: string[];
  properties?: Record<string, SchemaObject>;
};

type OpenApiOperation = {
  summary?: string;
  description?: string;
  tags?: string[];
  parameters?: { name: string; in: string; required?: boolean; schema?: SchemaObject }[];
  requestBody?: { content?: { "application/json"?: { schema?: SchemaObject } } };
};

export type OpenApiDocument = {
  paths: Record<string, Record<string, OpenApiOperation>>;
  components?: { schemas?: Record<string, SchemaObject> };
};

export type ApiEndpoint = ExplorerRequest & { group: string };

type EndpointGroup = { name: string; endpoints: ApiEndpoint[] };

const HTTP_METHODS = new Set(["get", "post", "put", "patch", "delete"]);
const UNGROUPED = "other";

function resolveSchema(schema: SchemaObject | undefined, document: OpenApiDocument): SchemaObject | undefined {
  if (!schema?.$ref) return schema;
  return document.components?.schemas?.[schema.$ref.split("/").pop() ?? ""];
}

/** A starting body: the required fields and any with a default, ready to edit. */
function exampleBody(schema: SchemaObject | undefined): unknown {
  if (!schema?.properties) return {};
  const fields = Object.entries(schema.properties).flatMap(([name, property]): [string, unknown][] => {
    if (property.default !== undefined) return [[name, property.default]];
    if (!schema.required?.includes(name)) return [];
    if (property.type === "integer" || property.type === "number") return [[name, 1]];
    if (property.type === "boolean") return [[name, true]];
    return [[name, "example"]];
  });
  return Object.fromEntries(fields);
}

function toParams(operation: OpenApiOperation): EndpointParam[] {
  return (operation.parameters ?? [])
    .filter((param) => param.in === "path" || param.in === "query")
    .map((param) => ({
      name: param.name,
      location: param.in as EndpointParam["location"],
      required: Boolean(param.required),
      defaultValue: param.schema?.default === undefined ? "" : String(param.schema.default),
    }));
}

/** Every endpoint under the API base URL, with paths relative to it. */
export function toApiEndpoints(document: OpenApiDocument): ApiEndpoint[] {
  const apiBasePath = new URL(env.apiBaseUrl).pathname;
  return Object.entries(document.paths).flatMap(([fullPath, operations]) =>
    Object.entries(operations)
      .filter(([method]) => HTTP_METHODS.has(method) && fullPath.startsWith(apiBasePath))
      .map(([method, operation]) => {
        const label = operation.summary ?? fullPath;
        const bodySchema = operation.requestBody?.content?.["application/json"]?.schema;
        return {
          id: `${method} ${fullPath}`,
          label,
          method: method.toUpperCase(),
          path: fullPath.slice(apiBasePath.length),
          body: bodySchema ? exampleBody(resolveSchema(bodySchema, document)) : undefined,
          note: operation.description?.split("\n")[0] ?? label,
          params: toParams(operation),
          group: operation.tags?.[0] ?? UNGROUPED,
        };
      }),
  );
}

/** The endpoints matching a search, grouped in the order the server lists them. */
export function groupEndpoints(endpoints: ApiEndpoint[], search: string): EndpointGroup[] {
  const words = search.toLowerCase().split(/\s+/).filter(Boolean);
  const groups = new Map<string, ApiEndpoint[]>();
  for (const endpoint of endpoints) {
    const searchable = `${endpoint.method} ${endpoint.path} ${endpoint.label} ${endpoint.group}`.toLowerCase();
    if (!words.every((word) => searchable.includes(word))) continue;
    groups.set(endpoint.group, [...(groups.get(endpoint.group) ?? []), endpoint]);
  }
  return [...groups].map(([name, groupEndpoints]) => ({ name, endpoints: groupEndpoints }));
}

/** A read with nothing to fill in is safe to send straight away. Anything else waits for Send. */
export function sendsOnSelect(request: ExplorerRequest): boolean {
  return request.method === "GET" && !request.params?.some((param) => param.required);
}
