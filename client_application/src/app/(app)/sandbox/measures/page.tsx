import type { Metadata } from "next";
import Link from "next/link";

import { PageIntro } from "@/components/page-intro";
import { SectionHeading } from "@/components/section-heading";
import { routes } from "@/lib/routes";

import { Charts } from "./charts";

export const metadata: Metadata = {
  title: "Sandbox Measures",
  description: "A PDP-style Measures example with typed filters and display-safe rates.",
};

export default function SandboxMeasuresPage() {
  return (
    <>
      <PageIntro
        eyebrow={
          <>
            <Link href={routes.sandbox} className="underline-offset-4 hover:underline">
              Sandbox
            </Link>{" "}
            / Measures
          </>
        }
        title="Explore a measure by student group."
      >
        <p>This PDP-style example turns a measure, cohort, and grouping into typed API query parameters.</p>
      </PageIntro>

      <section aria-labelledby="measures-result-heading" className="flex flex-col gap-6">
        <SectionHeading id="measures-result-heading" title="The result">
          <p className="text-muted-foreground">
            Change a filter. The browser requests a fresh fixture payload, and the chart card handles loading,
            errors, source labels, definitions, fields used, and suppressed values.
          </p>
        </SectionHeading>
        <Charts />
      </section>
    </>
  );
}
