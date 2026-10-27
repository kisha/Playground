import { Suspense } from "react";

import { Eyebrow } from "@/components/eyebrow";
import { ExternalLink } from "@/components/external-link";
import { PulseDot } from "@/components/landing/pulse-dot";
import {
  type Application,
  applications,
  DATABASE_MARK,
  databaseCommands,
  databaseNote,
  dataStoreOptions,
  type Library,
  SETUP_HINT,
  SETUP_MARK,
  setupNote,
  tooling,
} from "@/content/stack";
import { cn } from "@/lib/utils";
import { currentDatabaseEngine, type DatabaseEngine } from "@/services/health";

function LibraryChips({ libraries }: { libraries: Library[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {libraries.map((library) => (
        <li
          key={library.name}
          title={library.needsSetup ? SETUP_HINT : undefined}
          className={cn(
            "rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground",
            library.needsSetup && "border-dashed border-foreground/40",
          )}
        >
          {library.name}
          {library.needsSetup && (
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

function ApplicationCard({ application }: { application: Application }) {
  return (
    <article className="flex flex-col gap-5 rounded-2xl border p-6 transition-[border-color,box-shadow,transform] duration-300 hover:border-foreground/25 hover:shadow-[0_8px_30px_-12px_color-mix(in_oklab,var(--foreground)_25%,transparent)] motion-safe:hover:-translate-y-0.5 sm:p-8">
      <div className="flex flex-col gap-1">
        <Eyebrow>{application.role}</Eyebrow>
        <h3 className="text-2xl font-semibold tracking-tight">{application.name}</h3>
        <p className="font-mono text-xs text-muted-foreground">{application.folder}/</p>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{application.summary}</p>
      <LibraryChips libraries={application.includes} />
      <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-2 text-sm">
        {application.links.map((link) => (
          <ExternalLink key={link.label} href={link.href}>
            {link.label}
          </ExternalLink>
        ))}
      </div>
    </article>
  );
}

/** PostgreSQL with pgvector, or SQLite. The one this instance runs on pulses "in use" once the API answers. */
function DataStoreChoices({ engineInUse }: { engineInUse?: DatabaseEngine }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-3 gap-y-2">
      {dataStoreOptions.map((option, index) => {
        const inUse = option.engine === engineInUse;
        return (
          <li key={option.engine} className="flex items-center gap-3">
            {index > 0 && <span className="text-xs text-muted-foreground">or</span>}
            <div className={cn("flex items-center gap-2", engineInUse && !inUse && "opacity-50")}>
              <LibraryChips libraries={option.libraries} />
              {inUse && (
                <span className="flex items-center gap-1.5 text-xs font-medium">
                  <PulseDot state="healthy" className="size-2" />
                  in use
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

async function DataStoreChoicesInUse() {
  return <DataStoreChoices engineInUse={await currentDatabaseEngine()} />;
}

function Footnote({ mark, children }: { mark: string; children: React.ReactNode }) {
  return (
    <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
      <span className="shrink-0 rounded-full border border-dashed border-foreground/40 px-2 py-0.5">{mark}</span>
      <span className="pt-0.5">{children}</span>
    </p>
  );
}

/** "What's inside": one card per application plus the shared foundation. */
export function StackOverview() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        {applications.map((application) => (
          <ApplicationCard key={application.folder} application={application} />
        ))}
      </div>
      <div className="grid gap-4 rounded-2xl border p-6 sm:grid-cols-2 sm:p-8">
        <div className="flex flex-col gap-3">
          <Eyebrow>
            Data Store <span aria-hidden>{DATABASE_MARK}</span>
          </Eyebrow>
          <Suspense fallback={<DataStoreChoices />}>
            <DataStoreChoicesInUse />
          </Suspense>
        </div>
        <div className="flex flex-col gap-3">
          <Eyebrow>Tooling</Eyebrow>
          <LibraryChips libraries={tooling} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Footnote mark={SETUP_MARK}>{setupNote}</Footnote>
        <Footnote mark={DATABASE_MARK}>
          {databaseNote}{" "}
          {databaseCommands.map((command, index) => (
            <span key={command}>
              {index > 0 && " or "}
              <code className="font-mono whitespace-nowrap text-foreground">{command}</code>
            </span>
          ))}
        </Footnote>
      </div>
    </div>
  );
}
