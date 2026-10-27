import type { Metadata } from "next";
import Link from "next/link";

import { PageIntro } from "@/components/page-intro";
import { HowToAddASandboxPage } from "@/components/sandbox/how-to-add-a-sandbox-page";
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
        This page is the example. A sandbox page has two halves: endpoints in the Server Application (FastAPI), here{" "}
        <code className="font-mono text-base">/api/v1/sandbox/enrollment</code>, and a page in the Client
        Application (Next.js) that draws them. Copy one folder on each side to start your own. All data is mock data.
      </PageIntro>

      <section aria-labelledby="result-heading" className="flex flex-col gap-6">
        <SectionHeading id="result-heading" title="The result">
          <p className="text-muted-foreground">Two new endpoints, drawn with the same chart components as the main sandbox.</p>
        </SectionHeading>
        <Charts />
      </section>

      <HowToAddASandboxPage />
    </>
  );
}
