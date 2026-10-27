import type { Metadata } from "next";
import Link from "next/link";

import { PageIntro } from "@/components/page-intro";
import { BuildSteps } from "@/components/sandbox/build-steps";
import { EnrollmentCharts } from "@/components/sandbox/enrollment-charts";
import { SectionHeading } from "@/components/section-heading";
import { clientSteps, serverSteps } from "@/content/sandbox-enrollment-steps";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Example: a new sandbox page",
  description: "A worked example of adding a sandbox page with its own endpoints and charts.",
};

export default function SandboxEnrollmentPage() {
  return (
    <>
      <PageIntro
        eyebrow={
          <>
            <Link href={routes.sandbox} className="underline-offset-4 hover:underline">
              Sandbox
            </Link>{" "}
            / Example
          </>
        }
        title="How to add a sandbox page."
      >
        This page is the example. It has its own route, its own endpoints under{" "}
        <code className="font-mono text-base">/api/v1/sandbox/enrollment</code> and two enrollment charts. Copy its
        files to start a page of your own. All data is mock data.
      </PageIntro>

      <section aria-labelledby="result-heading" className="flex flex-col gap-6">
        <SectionHeading id="result-heading" title="The result">
          <p className="text-muted-foreground">Two new endpoints, drawn with the same chart components as the main sandbox.</p>
        </SectionHeading>
        <EnrollmentCharts />
      </section>

      <section aria-labelledby="steps-heading" className="flex flex-col gap-6">
        <SectionHeading id="steps-heading" title="How it was built">
          <p className="text-muted-foreground">
            Eight files, four on each side. Name yours after your topic in place of{" "}
            <code className="font-mono text-sm">enrollment</code>.
          </p>
        </SectionHeading>
        <div className="grid gap-4 lg:grid-cols-2">
          <BuildSteps title="Server Application" folder="server_application/" steps={serverSteps} />
          <BuildSteps title="Client Application" folder="client_application/" steps={clientSteps} />
        </div>
      </section>
    </>
  );
}
