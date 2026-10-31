import type { Metadata } from "next";

import { PageIntro } from "@/components/page-intro";

import { Charts } from "./charts";

export const metadata: Metadata = {
  title: "Chart Examples",
  description: "Example charts, all served by one mock-data endpoint.",
};

export default function ChartExamplesPage() {
  return (
    <>
      <PageIntro eyebrow="Sandbox" title="Chart Examples">
        <p>
          Each chart asks <code className="font-mono text-base">/api/v1/sandbox/chart-examples</code> for its data by
          name, with the answer and the AR fields it draws on.
        </p>
      </PageIntro>
      <Charts />
    </>
  );
}
