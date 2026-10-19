/** A readable message from anything that was thrown. */
export function describeError(error: unknown, fallback = "Something went wrong."): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return fallback;
}

/** The reference Next.js attaches to errors thrown while rendering on the server, if any. */
export function errorDigest(error: unknown): string | null {
  return error instanceof Error && "digest" in error ? String(error.digest) : null;
}
