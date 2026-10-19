"use client"; // Error boundaries must be Client Components

import Link from "next/link";
import { useEffect } from "react";

import { StatusPage } from "@/components/status-page";
import { Button, buttonVariants } from "@/components/ui/button";

/** Shown when a page throws while rendering. `retry` re-fetches and re-renders it. */
export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const reference = error instanceof Error && "digest" in error ? String(error.digest) : null;

  return (
    <StatusPage
      code="Error"
      title="Something went wrong."
      missing="This page"
      description={
        <p>
          The page couldn&apos;t finish loading. Try again, and if it keeps happening, check that the
          API is running.
          {reference && (
            <span className="mt-3 block font-mono text-xs">Reference: {reference}</span>
          )}
        </p>
      }
      actions={
        <>
          <Button size="lg" onClick={() => retry()}>
            Try again
          </Button>
          <Link href="/" className={buttonVariants({ size: "lg", variant: "outline" })}>
            Back to home
          </Link>
        </>
      }
    />
  );
}
