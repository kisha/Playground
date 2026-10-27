import { FlowConnector } from "@/components/flow-connector";
import { BuildSteps } from "@/components/sandbox/build-steps";
import { SectionHeading } from "@/components/section-heading";
import { clientSteps, serverSteps } from "@/content/sandbox-how-to";

/** "Build your own": step 1 adds the endpoints, step 2 the page that draws them. */
export function HowToAddASandboxPage() {
  return (
    <section id="build-your-own" aria-labelledby="how-to-heading" className="flex scroll-mt-8 flex-col gap-6">
      <SectionHeading id="how-to-heading" title="Build your own">
        <p className="text-muted-foreground">
          Do step 1, then step 2. Replace <code className="font-mono text-sm">&lt;topic&gt;</code> with a short,
          lowercase name for your page, such as <code className="font-mono text-sm">grades</code>.
        </p>
      </SectionHeading>
      <div className="flex flex-col lg:flex-row">
        <BuildSteps
          step={1}
          title="Add the endpoints"
          app="Server Application (FastAPI)"
          folder="server_application/"
          steps={serverSteps}
          check={
            <>
              Your endpoints appear in the API docs at <code className="font-mono">http://localhost:8000/docs</code>.
            </>
          }
        />
        <FlowConnector direction="responsive" />
        <BuildSteps
          step={2}
          title="Add the page"
          app="Client Application (Next.js)"
          folder="client_application/"
          steps={clientSteps}
          check={
            <>
              Open <code className="font-mono">http://localhost:3000/sandbox/&lt;topic&gt;</code>. Your charts load.
            </>
          }
        />
      </div>
    </section>
  );
}
