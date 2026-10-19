"use client";

import { useCallback, useEffect, useState } from "react";

import { describeError } from "@/lib/errors";

export type Resource<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };

/**
 * Load one API resource from the browser and track loading / success / error.
 * `retry` loads it again, e.g. from an error state's "Try again" button.
 */
export function useApiResource<T>(loadResource: () => Promise<T>) {
  const [resource, setResource] = useState<Resource<T>>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    loadResource()
      .then((data) => !cancelled && setResource({ status: "success", data }))
      .catch((error: unknown) => !cancelled && setResource({ status: "error", message: describeError(error) }));
    return () => {
      cancelled = true;
    };
  }, [loadResource, attempt]);

  const retry = useCallback(() => {
    setResource({ status: "loading" });
    setAttempt((previousAttempt) => previousAttempt + 1);
  }, []);

  return { resource, retry };
}
