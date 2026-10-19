import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ExternalLink } from "@/components/external-link";
import { ApiExplorer } from "@/components/sandbox/api-explorer";
import { ExampleCharts } from "@/components/sandbox/example-charts";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { env } from "@/lib/env";
import { repositoryFolderUrl, serverRoutesFolder } from "@/lib/links";

export const metadata: Metadata = {
  title: "Sandbox",
  description: "Live requests to the server application and example charts built from its responses.",
};

export default function SandboxPage() {
  if (!env.sandboxEnabled) notFound();

  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-20 px-6 pt-12 pb-24 sm:px-10 sm:pt-16">
        <section className="flex max-w-2xl flex-col gap-4">
          <p className="text-xs tracking-widest text-muted-foreground uppercase motion-safe:animate-fade-up">
            Sandbox
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-balance motion-safe:animate-fade-up motion-safe:[animation-delay:100ms] sm:text-6xl">
            Client Application &amp; Server Application working together.
          </h1>
          <p className="text-lg text-muted-foreground motion-safe:animate-fade-up motion-safe:[animation-delay:200ms]">
            Every request below goes from this page to the Server Application and back. The charts
            are drawn from those responses, using mock data shaped like PDP Analysis-Ready files.
          </p>
        </section>

        <section id="api" aria-labelledby="api-heading" className="flex scroll-mt-8 flex-col gap-6">
          <SectionHeading id="api-heading" title="Try the API">
            <p className="text-muted-foreground">
              Pick a request to send it. Errors are part of the demo: the API answers each one in the
              same readable shape.
            </p>
            <p className="text-sm text-muted-foreground">
              These are real endpoints of the Server Application (FastAPI). See every endpoint in the{" "}
              {env.apiDocsUrl && (
                <>
                  <ExternalLink href={env.apiDocsUrl} variant="inline">
                    API docs (Swagger)
                  </ExternalLink>{" "}
                  or read their code in{" "}
                </>
              )}
              <ExternalLink href={repositoryFolderUrl(serverRoutesFolder)} variant="inline">
                {serverRoutesFolder}
              </ExternalLink>
              .
            </p>
          </SectionHeading>
          <ApiExplorer />
        </section>

        <section id="charts" aria-labelledby="charts-heading" className="flex scroll-mt-8 flex-col gap-6">
          <SectionHeading id="charts-heading" title="Example charts">
            <p className="text-muted-foreground">
              Each chart loads its own endpoint under <code className="font-mono text-sm">/api/v1/sandbox</code>,
              with the answer and the AR fields it draws on.
            </p>
          </SectionHeading>
          <ExampleCharts />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
