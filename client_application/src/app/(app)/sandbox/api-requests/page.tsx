import type { Metadata } from "next";

import { ExternalLink } from "@/components/external-link";
import { PageIntro } from "@/components/page-intro";
import { ApiExplorer } from "@/components/sandbox/api-explorer";
import { SectionHeading } from "@/components/section-heading";
import { env } from "@/lib/env";
import { repositoryFolderUrl, serverRoutesFolder, serverSandboxFolder } from "@/lib/links";

export const metadata: Metadata = {
  title: "API requests",
  description: "Live requests to the server application.",
};

export default function ApiRequestsPage() {
  return (
    <>
      <PageIntro eyebrow="Sandbox" title="Client and server, working together.">
        Every request below is live, built from mock data.
      </PageIntro>

      <section id="api" aria-labelledby="api-heading" className="flex scroll-mt-8 flex-col gap-6">
        <SectionHeading id="api-heading" title="Try the API">
          <p className="text-muted-foreground">
            Open the list to see every endpoint the server offers, pick one and try it here. Errors are part of the
            demo: the API answers each one in the same readable shape.
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
    </>
  );
}
