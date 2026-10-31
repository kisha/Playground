import type { Metadata } from "next";
import { Suspense } from "react";

import { PageIntro } from "@/components/page-intro";

import { FilteredDashboard } from "./filtered-dashboard";

export const metadata: Metadata = {
  title: "Charts with Filters",
  description: "A filter panel that sends its choices to the server and redraws from the answer.",
};

export default function FiltersPage() {
  return (
    <>
      <PageIntro eyebrow="Sandbox" title="Charts with Filters">
        <p>
          Choose filters and press Apply. They go into the address, so you can share the view, and the server answers
          with new numbers. The numbers are mock data.
        </p>
      </PageIntro>
      {/* The filters are in the URL's query, which only the browser knows on a pre-built page. */}
      <Suspense>
        <FilteredDashboard />
      </Suspense>
    </>
  );
}
