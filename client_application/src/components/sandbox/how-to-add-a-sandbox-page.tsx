import { BuildSteps } from "@/components/sandbox/build-steps";
import { SectionHeading } from "@/components/section-heading";
import { clientSteps, serverSteps } from "@/content/sandbox-how-to";

/** "How it was built": step 1 adds the endpoints, step 2 the page that draws them. */
export function HowToAddASandboxPage() {
  return (
    <section aria-labelledby="how-to-heading" className="flex flex-col gap-6">
      <SectionHeading id="how-to-heading" title="How it was built">
        <p className="text-muted-foreground">
          Two steps: add the endpoints, then the page that draws them. Each is one folder to copy and rename after your
          topic.
        </p>
      </SectionHeading>
      <div className="grid gap-4 lg:grid-cols-2">
        <BuildSteps
          step={1}
          title="Add the endpoints"
          app="Server Application (FastAPI)"
          folder="server_application/"
          steps={serverSteps}
        />
        <BuildSteps
          step={2}
          title="Add the page"
          app="Client Application (Next.js)"
          folder="client_application/"
          steps={clientSteps}
        />
      </div>
    </section>
  );
}
