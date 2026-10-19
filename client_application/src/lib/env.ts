/**
 * Which environment the client is running in, and the settings for each one.
 *
 * Next.js only knows `development` and `production` (via NODE_ENV), so the app reads its own
 * NEXT_PUBLIC_APP_ENV, the same idea as APP_ENV on the server:
 *
 *   bun run dev            -> development (unless NEXT_PUBLIC_APP_ENV says otherwise)
 *   bun run build          -> production
 *   bun run build:staging  -> staging
 *
 * Client values are public (they ship to the browser), so per-environment defaults live here in
 * code. Any value can be overridden with an environment variable, e.g. NEXT_PUBLIC_API_BASE_URL.
 * NEXT_PUBLIC_ variables are fixed at build time: rebuild after changing them.
 */

export const ENVIRONMENTS = ["development", "staging", "production"] as const;

export type Environment = (typeof ENVIRONMENTS)[number];

type EnvironmentSettings = {
  apiBaseUrl: string;
};

const SETTINGS: Record<Environment, EnvironmentSettings> = {
  development: { apiBaseUrl: "http://localhost:8000/api/v1" },
  // Placeholders: replace with real URLs when staging and production exist.
  staging: { apiBaseUrl: "https://api.staging.example.com/api/v1" },
  production: { apiBaseUrl: "https://api.example.com/api/v1" },
};

function isEnvironment(value: string): value is Environment {
  return (ENVIRONMENTS as readonly string[]).includes(value);
}

function resolveEnvironment(): Environment {
  const value =
    process.env.NEXT_PUBLIC_APP_ENV ??
    (process.env.NODE_ENV === "production" ? "production" : "development");

  if (!isEnvironment(value)) {
    throw new Error(
      `NEXT_PUBLIC_APP_ENV="${value}" is not valid. Use one of: ${ENVIRONMENTS.join(", ")}.`,
    );
  }
  return value;
}

const appEnv = resolveEnvironment();
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || SETTINGS[appEnv].apiBaseUrl;

export const env = {
  appEnv,
  isDevelopment: appEnv === "development",
  isProduction: appEnv === "production",
  apiBaseUrl,
  /** Swagger UI. The API disables it in production, so there is nothing to link to there. */
  apiDocsUrl: appEnv === "production" ? null : new URL("/docs", apiBaseUrl).toString(),
  /** Source repository, linked from the landing page. Copies of Playground override this. */
  repositoryUrl: process.env.NEXT_PUBLIC_REPOSITORY_URL || "https://github.com/kisha/Playground",
} as const;
