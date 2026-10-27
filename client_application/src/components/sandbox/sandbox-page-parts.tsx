import { ExternalLink } from "@/components/external-link";
import { type SandboxPagePart, sandboxPageParts } from "@/content/sandbox-how-to";
import { apiUrl, repositorySectionUrl } from "@/lib/links";

function PartExample({ part }: { part: SandboxPagePart }) {
  const code = <code className="font-mono text-sm">{part.example}</code>;
  if (!part.apiPath) return code;
  return (
    <ExternalLink href={apiUrl(part.apiPath)} variant="inline">
      {code}
    </ExternalLink>
  );
}

/** The two parts every sandbox page has, each with this example's version and its docs. */
export function SandboxPageParts() {
  return (
    <ul className="flex flex-col gap-3">
      {sandboxPageParts.map((part) => (
        <li key={part.name} className="flex flex-col gap-1 border-l-2 border-foreground pl-4 text-base">
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
        </li>
      ))}
    </ul>
  );
}
