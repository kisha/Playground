import type { Metadata } from "next";

import { PageIntro } from "@/components/page-intro";

import { Charts } from "./charts";

export const metadata: Metadata = {
  title: "KPI Examples",
  description: "Example KPI cards for percentages, splits and terms, all served by one mock-data endpoint.",
};

export default function KpiExamplesPage() {
  return (
    <>
      <PageIntro eyebrow="Sandbox" title="KPI Examples">
        <p>
          Each group asks <code className="font-mono text-base">/api/v1/sandbox/kpi-examples</code> for its cards by
          name. The cards show percentages, splits and terms.
        </p>
      </PageIntro>
      <Charts />
    </>
  );
}
