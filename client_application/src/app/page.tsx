import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { ExternalLink } from "@/components/external-link";
import { LiveStatus } from "@/components/landing/live-status";
import { StackOverview } from "@/components/landing/stack-overview";
import { PageShell } from "@/components/page-shell";
import { SectionHeading } from "@/components/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { brand } from "@/content/brand";
import { languagesLine } from "@/content/stack";
import { env } from "@/lib/env";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <PageShell className="gap-28 px-6 pt-16 pb-28 sm:px-10 sm:pt-24" linksInNewTab>
        <section className="flex flex-col items-center gap-6 text-center">
          <h1 className="text-6xl font-semibold tracking-tighter motion-safe:animate-fade-up sm:text-8xl">
            {brand.name}
          </h1>
          <p className="max-w-2xl text-lg text-balance text-muted-foreground motion-safe:animate-fade-up motion-safe:[animation-delay:150ms]">
            {brand.tagline}
          </p>
          <p className="font-mono text-xs tracking-wide text-balance text-muted-foreground motion-safe:animate-fade-up motion-safe:[animation-delay:300ms]">
            {languagesLine}
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm motion-safe:animate-fade-up motion-safe:[animation-delay:450ms]">
            {env.sandboxEnabled && (
              <Link
                href={routes.sandboxCharts}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ size: "lg" }), "motion-safe:animate-pulse-ring hover:animate-none")}
              >
                See example charts
                <ArrowRight aria-hidden className="motion-safe:animate-nudge-x" />
              </Link>
            )}
            {env.apiDocsUrl && <ExternalLink href={env.apiDocsUrl}>API docs</ExternalLink>}
          </div>
        </section>

        <section
          aria-labelledby="live-heading"
          className="mx-auto w-full max-w-5xl motion-safe:animate-fade-up motion-safe:[animation-delay:600ms]"
        >
          <h2 id="live-heading" className="sr-only">
            Live connection
          </h2>
          <LiveStatus />
        </section>

        <section aria-labelledby="inside-heading" className="mx-auto flex w-full max-w-5xl flex-col gap-8">
          <SectionHeading id="inside-heading" title="What's inside">
            <p className="text-muted-foreground">Two applications that deploy on their own and talk only over HTTP.</p>
          </SectionHeading>
          <StackOverview />
        </section>
    </PageShell>
  );
}
