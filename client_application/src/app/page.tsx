import { ArrowUpRight } from "lucide-react";

import { LiveStatus } from "@/components/landing/live-status";
import { StackOverview } from "@/components/landing/stack-overview";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { brand } from "@/content/brand";
import { env } from "@/lib/env";

export default function Home() {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />

      <main className="flex flex-1 flex-col gap-28 px-6 pt-16 pb-28 sm:px-10 sm:pt-24">
        <section className="flex flex-col items-center gap-6 text-center">
          <h1 className="text-6xl font-semibold tracking-tighter motion-safe:animate-fade-up sm:text-8xl">
            {brand.name}
          </h1>
          <p className="max-w-2xl text-lg text-balance text-muted-foreground motion-safe:animate-fade-up motion-safe:[animation-delay:150ms]">
            A Next.js client application and a FastAPI server application, preconfigured with core
            libraries and connected end to end, out of the box.
          </p>
          <p className="font-mono text-xs tracking-wide text-balance text-muted-foreground motion-safe:animate-fade-up motion-safe:[animation-delay:300ms]">
            TypeScript · Python · PostgreSQL 18 · pgvector
          </p>
          {env.apiDocsUrl && (
            <a
              href={env.apiDocsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-sm font-medium underline-offset-4 hover:underline motion-safe:animate-fade-up motion-safe:[animation-delay:450ms]"
            >
              API docs
              <ArrowUpRight className="size-3.5" aria-hidden />
            </a>
          )}
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
          <div className="flex flex-col gap-2">
            <h2 id="inside-heading" className="text-3xl font-semibold tracking-tight">
              What&apos;s inside
            </h2>
            <p className="text-muted-foreground">
              Two applications that deploy on their own and talk only over HTTP.
            </p>
          </div>
          <StackOverview />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
