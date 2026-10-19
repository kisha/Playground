import type { Metadata } from "next";
import Link from "next/link";

import { RequestedPath } from "@/components/requested-path";
import { StatusPage } from "@/components/status-page";
import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Page not found",
};

/** Shown for any address that doesn't match a page. */
export default function NotFoundPage() {
  return (
    <StatusPage
      eyebrow="404"
      title="This page isn't connected."
      unreachableLabel="Page"
      description={
        <p>
          Nothing lives at <RequestedPath />. It may have moved, or the address may have a typo.
        </p>
      }
      actions={
        <Link href={routes.home} className={buttonVariants({ size: "lg" })}>
          Back to home
        </Link>
      }
    />
  );
}
