import { ArrowUpRight } from "lucide-react";

import { applications, type Library, setupNote, sharedFoundation } from "@/content/stack";
import { env } from "@/lib/env";
import { cn } from "@/lib/utils";

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-0.5 text-sm font-medium underline-offset-4 hover:underline"
    >
      {children}
      <ArrowUpRight className="size-3.5" aria-hidden />
    </a>
  );
}

const SETUP_MARK = "*";

function Chips({ items }: { items: Library[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li
          key={item.name}
          title={item.needsSetup ? "Installed, needs setup before use" : undefined}
          className={cn(
            "rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground",
            item.needsSetup && "border-dashed border-foreground/40",
          )}
        >
          {item.name}
          {item.needsSetup && (
            <>
              <span aria-hidden> {SETUP_MARK}</span>
              <span className="sr-only"> (needs setup)</span>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

/** "What's inside": one card per application plus the shared foundation. */
export function StackOverview() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        {applications.map((app) => (
          <article key={app.folder} className="flex flex-col gap-5 rounded-2xl border p-6 sm:p-8">
            <div className="flex flex-col gap-1">
              <p className="text-xs tracking-widest text-muted-foreground uppercase">{app.role}</p>
              <h3 className="text-2xl font-semibold tracking-tight">{app.name}</h3>
              <p className="font-mono text-xs text-muted-foreground">{app.folder}/</p>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{app.summary}</p>
            <Chips items={app.includes} />
            <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-2">
              <ExternalLink href={`${env.repositoryUrl}/tree/main/${app.folder}`}>README</ExternalLink>
              {app.folder === "server_application" && env.apiDocsUrl && (
                <ExternalLink href={env.apiDocsUrl}>API docs</ExternalLink>
              )}
            </div>
          </article>
        ))}
      </div>
      <div className="grid gap-4 rounded-2xl border p-6 sm:grid-cols-2 sm:p-8">
        {sharedFoundation.map((group) => (
          <div key={group.label} className="flex flex-col gap-3">
            <p className="text-xs tracking-widest text-muted-foreground uppercase">{group.label}</p>
            <Chips items={group.items} />
          </div>
        ))}
      </div>
      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="rounded-full border border-dashed border-foreground/40 px-2 py-0.5">{SETUP_MARK}</span>
        {setupNote}
      </p>
    </div>
  );
}
