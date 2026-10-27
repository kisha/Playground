import Link from "next/link";

import { Eyebrow } from "@/components/eyebrow";
import { routes } from "@/lib/routes";

/** A card linking to the worked example of adding a sandbox page. Inverted, so it stands out. */
export function ExamplePageLink() {
  return (
    <Link
      href={routes.sandboxEnrollment}
      className="group flex flex-col gap-2 rounded-2xl bg-foreground p-5 text-background transition-opacity hover:opacity-90 sm:p-6"
    >
      <Eyebrow className="text-background/70">Example</Eyebrow>
      <span className="text-lg font-semibold underline-offset-4 group-hover:underline">How to add a sandbox page →</span>
      <span className="text-sm text-background/80">
        A working example at <code className="font-mono">{routes.sandboxEnrollment}</code>: two charts, their endpoints,
        and the steps to build your own.
      </span>
    </Link>
  );
}
