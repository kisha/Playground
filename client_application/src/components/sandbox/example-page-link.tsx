import Link from "next/link";

import { Eyebrow } from "@/components/eyebrow";
import { routes } from "@/lib/routes";

/** A card linking to the worked example of adding a sandbox page. */
export function ExamplePageLink() {
  return (
    <Link
      href={routes.sandboxEnrollment}
      className="group flex flex-col gap-2 rounded-2xl border p-5 transition-colors hover:bg-muted/50 sm:p-6"
    >
      <Eyebrow>Example</Eyebrow>
      <span className="text-lg font-semibold underline-offset-4 group-hover:underline">How to add a sandbox page →</span>
      <span className="text-sm text-muted-foreground">
        A worked example at <code className="font-mono">{routes.sandboxEnrollment}</code>: two enrollment charts, their
        endpoints and the eight files that built them.
      </span>
    </Link>
  );
}
