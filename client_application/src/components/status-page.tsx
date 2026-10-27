import { PageShell } from "@/components/page-shell";

type StatusPageProps = {
  /** Small line above the title, e.g. "404". */
  eyebrow: string;
  title: string;
  description: React.ReactNode;
  /** Label for the unreachable box in the broken-connection diagram. */
  unreachableLabel: string;
  actions: React.ReactNode;
};

/** Shared layout for the 404 and error pages: a broken version of the landing page's diagram. */
export function StatusPage({ eyebrow, title, description, unreachableLabel, actions }: StatusPageProps) {
  return (
    <PageShell className="items-center justify-center gap-12 px-6 py-20 text-center">
        <div className="flex items-center motion-safe:animate-fade-up" aria-hidden>
          <div className="flex w-28 flex-col items-center gap-1.5 rounded-xl border border-foreground/70 px-3 py-4 sm:w-36">
            <span className="size-2 rounded-full bg-foreground" />
            <span className="text-xs font-medium">You are here</span>
          </div>
          <div className="flex w-12 items-center sm:w-28">
            <span className="h-px flex-1 bg-foreground/40" />
            <span className="px-1.5 font-mono text-xs text-muted-foreground">×</span>
            <span className="h-px flex-1 bg-[repeating-linear-gradient(to_right,var(--border)_0_4px,transparent_4px_8px)]" />
          </div>
          <div className="flex w-28 flex-col items-center gap-1.5 rounded-xl border border-dashed border-foreground/30 px-3 py-4 text-muted-foreground sm:w-36">
            <span className="size-2 rounded-full border border-foreground/60" />
            <span className="text-xs font-medium">{unreachableLabel}</span>
          </div>
        </div>

        <div className="flex max-w-lg flex-col items-center gap-4">
          <p className="font-mono text-sm tracking-widest text-muted-foreground motion-safe:animate-fade-up motion-safe:[animation-delay:100ms]">
            {eyebrow}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-balance motion-safe:animate-fade-up motion-safe:[animation-delay:200ms] sm:text-5xl">
            {title}
          </h1>
          <div className="text-muted-foreground motion-safe:animate-fade-up motion-safe:[animation-delay:300ms]">
            {description}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 motion-safe:animate-fade-up motion-safe:[animation-delay:400ms]">
          {actions}
        </div>
    </PageShell>
  );
}
