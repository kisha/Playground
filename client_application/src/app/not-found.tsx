import type { Metadata } from "next";
import Link from "next/link";

import { RequestedPath } from "@/components/requested-path";
import { StatusPage } from "@/components/status-page";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found · Playground",
};

/** Shown for any address that doesn't match a page. */
export default function NotFound() {
  return (
    <StatusPage
      code="404"
      title="This page isn't connected."
      missing="Page"
      description={
        <p>
          Nothing lives at <RequestedPath />. It may have moved, or the address may have a typo.
        </p>
      }
      actions={
        <Link href="/" className={buttonVariants({ size: "lg" })}>
          Back to home
        </Link>
      }
    />
  );
}
