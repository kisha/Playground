"use client"; // Error boundaries must be Client Components

import Link from "next/link";
import { useEffect } from "react";

import { StatusPage } from "@/components/status-page";
import { Button, buttonVariants } from "@/components/ui/button";
import { errorDigest } from "@/lib/errors";
import { routes } from "@/lib/routes";

/** Shown when a page throws while rendering. `retry` re-fetches and re-renders it. */
export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const reference = errorDigest(error);

  return (
    <StatusPage
      eyebrow="Error"
      title="Something went wrong."
      unreachableLabel="This page"
      description={
        <p>
          The page couldn&apos;t finish loading. Try again, and if it keeps happening, check that the
          API is running.
          {reference && <span className="mt-3 block font-mono text-xs">Reference: {reference}</span>}
        </p>
      }
      actions={
        <>
          <Button size="lg" onClick={retry}>
            Try again
          </Button>
          <Link href={routes.home} className={buttonVariants({ size: "lg", variant: "outline" })}>
            Back to home
          </Link>
        </>
      }
    />
  );
}
