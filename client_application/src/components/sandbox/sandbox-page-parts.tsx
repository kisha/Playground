import { Eyebrow } from "@/components/eyebrow";
import { ExternalLink } from "@/components/external-link";
import { FlowConnector } from "@/components/flow-connector";
import { type SandboxPagePart, sandboxPageParts } from "@/content/sandbox-how-to";
import { apiUrl, repositorySectionUrl } from "@/lib/links";
import { cn } from "@/lib/utils";

function PartExample({ part }: { part: SandboxPagePart }) {
  const code = <code className="font-mono text-sm">{part.example}</code>;
  if (!part.apiPath) return code;
  return (
    <ExternalLink href={apiUrl(part.apiPath)} variant="inline">
      {code}
    </ExternalLink>
  );
}

/** The two parts every sandbox page has, as Step 1 and Step 2, each with this example's version and its docs. */
export function SandboxPageParts() {
  return (
    <ol className="flex flex-col">
      {sandboxPageParts.map((part, index) => {
        const stepNumber = index + 1;
        const isLastStep = stepNumber === sandboxPageParts.length;
        return (
          <li
            key={part.name}
            className="grid grid-cols-[auto_1fr] gap-x-4 text-base motion-safe:animate-fade-up"
            style={{ animationDelay: `${300 + index * 250}ms` }}
          >
            <div className="flex flex-col items-center" aria-hidden>
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background">
                {stepNumber}
              </span>
              {!isLastStep && <FlowConnector className="my-1.5" />}
            </div>
            <div className={cn("flex flex-col gap-1 pt-0.5", !isLastStep && "pb-8")}>
              <Eyebrow>Step {stepNumber}</Eyebrow>
              <span className="font-medium text-foreground">
                {part.name} <span className="font-normal text-muted-foreground">({part.framework})</span>
              </span>
              <span>{part.does}</span>
              <span>
                Example: <PartExample part={part} />
              </span>
              <span>
                Docs:{" "}
                <ExternalLink href={repositorySectionUrl(part.docs.file, part.docs.section)} variant="inline">
                  {part.docs.label}
                </ExternalLink>
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
