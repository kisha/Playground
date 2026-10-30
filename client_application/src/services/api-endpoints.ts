import { apiRequest } from "@/lib/api-client";
import { type ApiEndpoint, type OpenApiDocument, toApiEndpoints } from "@/lib/api-endpoints";

/** Every endpoint the server offers, read live from its OpenAPI document. */
export async function fetchApiEndpoints(): Promise<ApiEndpoint[]> {
  return toApiEndpoints(await apiRequest<OpenApiDocument>("/openapi.json", { cache: "no-store" }));
}
