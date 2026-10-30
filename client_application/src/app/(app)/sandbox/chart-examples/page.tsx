import type { Metadata } from "next";

import { PageIntro } from "@/components/page-intro";

import { Charts } from "./charts";

export const metadata: Metadata = {
  title: "Chart Examples",
  description: "Example charts, each built from its own mock-data endpoint.",
};

export default function ChartExamplesPage() {
  return (
    <>
      <PageIntro eyebrow="Sandbox" title="Chart Examples">
        <p>
          Each chart loads its own endpoint under <code className="font-mono text-base">/api/v1/sandbox</code>, with the
          answer and the AR fields it draws on.
        </p>
      </PageIntro>
      <Charts />
    </>
  );
}
