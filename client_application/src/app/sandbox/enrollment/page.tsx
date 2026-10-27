import type { Metadata } from "next";
import Link from "next/link";

import { PageIntro } from "@/components/page-intro";
import { HowToAddASandboxPage } from "@/components/sandbox/how-to-add-a-sandbox-page";
import { SandboxPageParts } from "@/components/sandbox/sandbox-page-parts";
import { SectionHeading } from "@/components/section-heading";
import { routes } from "@/lib/routes";

import { Charts } from "./charts";

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
        <p>This page is a working example of a sandbox page.</p>
        <p>A sandbox page has two parts:</p>
        <SandboxPageParts />
        <p>
          To build your own, copy both folders and follow the steps in{" "}
          <a href="#build-your-own" className="font-medium text-foreground underline underline-offset-4">
            Build your own
          </a>
          .
        </p>
      </PageIntro>

      <section aria-labelledby="result-heading" className="flex flex-col gap-6">
        <SectionHeading id="result-heading" title="The result">
          <p className="text-muted-foreground">
            Each chart fetches its own endpoint. Select <span className="font-medium">Mock data</span> on a chart to see
            the JSON it draws.
          </p>
        </SectionHeading>
        <Charts />
      </section>

      <HowToAddASandboxPage />
    </>
  );
}
