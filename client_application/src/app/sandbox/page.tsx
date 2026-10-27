import type { Metadata } from "next";

import { ExternalLink } from "@/components/external-link";
import { PageIntro } from "@/components/page-intro";
import { ApiExplorer } from "@/components/sandbox/api-explorer";
import { ExamplePageLink } from "@/components/sandbox/example-page-link";
import { SectionHeading } from "@/components/section-heading";
import { env } from "@/lib/env";
import { repositoryFolderUrl, serverRoutesFolder, serverSandboxFolder } from "@/lib/links";

import { Charts } from "./charts";

export const metadata: Metadata = {
  title: "Sandbox",
  description: "Live requests to the server application and example charts built from its responses.",
};

export default function SandboxPage() {
  return (
    <>
      <PageIntro eyebrow="Sandbox" title="Client and server, working together.">
        Every request and chart below is live, built from mock data.
      </PageIntro>

      <section aria-labelledby="add-your-own-heading" className="flex flex-col gap-6">
        <SectionHeading id="add-your-own-heading" title="Add your own">
          <p className="text-muted-foreground">
            Everything in the sandbox is an example: reusable pieces for anyone building on the Playground starter kit.
          </p>
          <p className="text-muted-foreground">
            Add your own example charts, filters or other UI on a new sandbox page, with its own endpoints.
          </p>
        </SectionHeading>
        <ExamplePageLink />
      </section>

      <section id="api" aria-labelledby="api-heading" className="flex scroll-mt-8 flex-col gap-6">
        <SectionHeading id="api-heading" title="Try the API">
          <p className="text-muted-foreground">
            Pick a request to send it. Errors are part of the demo: the API answers each one in the same readable
            shape.
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
            </ExternalLink>{" "}
            and{" "}
            <ExternalLink href={repositoryFolderUrl(serverSandboxFolder)} variant="inline">
              {serverSandboxFolder}
            </ExternalLink>
            .
          </p>
        </SectionHeading>
        <ApiExplorer />
      </section>

      <section id="charts" aria-labelledby="charts-heading" className="flex scroll-mt-8 flex-col gap-6">
        <SectionHeading id="charts-heading" title="Example charts">
          <p className="text-muted-foreground">
            Each chart loads its own endpoint under <code className="font-mono text-sm">/api/v1/sandbox</code>, with
            the answer and the AR fields it draws on.
          </p>
        </SectionHeading>
        <Charts />
      </section>

    </>
  );
}
