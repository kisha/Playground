import { ExternalLink } from "@/components/external-link";
import {
  type Application,
  applications,
  type Library,
  SETUP_HINT,
  SETUP_MARK,
  setupNote,
  sharedFoundation,
} from "@/content/stack";
import { cn } from "@/lib/utils";

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
        <p className="text-xs tracking-widest text-muted-foreground uppercase">{application.role}</p>
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
        {sharedFoundation.map((group) => (
          <div key={group.label} className="flex flex-col gap-3">
            <p className="text-xs tracking-widest text-muted-foreground uppercase">{group.label}</p>
            <LibraryChips libraries={group.items} />
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
