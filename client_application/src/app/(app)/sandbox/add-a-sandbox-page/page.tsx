import type { Metadata } from "next";

import { PageIntro } from "@/components/page-intro";
import { HowToAddASandboxPage } from "@/components/sandbox/how-to-add-a-sandbox-page";
import { SandboxPageParts } from "@/components/sandbox/sandbox-page-parts";
import { SectionHeading } from "@/components/section-heading";

import { Charts } from "./charts";

export const metadata: Metadata = {
  title: "Add A Sandbox Page",
  description: "A worked example of adding a sandbox page with its own endpoints and charts.",
};

export default function AddASandboxPage() {
  return (
    <>
      <PageIntro eyebrow="Sandbox" title="Add A Sandbox Page">
        <p>Everything in the sandbox is an example: reusable pieces for anyone building on the Playground starter kit.</p>
        <p>Add your own example charts, filters or other UI on a new sandbox page, with its own endpoints.</p>
        <p>This page is a working example of a sandbox page. A sandbox page has two parts:</p>
        <SandboxPageParts />
      </PageIntro>

      <HowToAddASandboxPage />

      <section aria-labelledby="result-heading" className="flex flex-col gap-6">
        <SectionHeading id="result-heading" title="The result">
          <p className="text-muted-foreground">
            Each chart fetches its own endpoint. Select <span className="font-medium">Mock data</span> on a chart to see
            the JSON it draws.
          </p>
        </SectionHeading>
        <Charts />
      </section>
    </>
  );
}
