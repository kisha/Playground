import { ArrowUpRight, Heart } from "lucide-react";
import Image from "next/image";

import { LiveStatus } from "@/components/landing/live-status";
import { StackOverview } from "@/components/landing/stack-overview";
import { ThemeToggle } from "@/components/theme-toggle";
import { brand } from "@/content/brand";
import { env } from "@/lib/env";

export default function Home() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex items-center justify-between px-6 py-5 sm:px-10">
        <div className="flex items-center gap-3">
          {brand.logo ? (
            <>
              {/* The logo artwork has a black background, so it sits in a black badge in both themes. */}
              <span className="flex h-8 items-center rounded-md bg-black px-1.5 ring-1 ring-foreground/10">
                <Image
                  src={brand.logo.src}
                  alt={brand.logo.alt}
                  width={brand.logo.width}
                  height={brand.logo.height}
                  className="h-6 w-auto"
                  loading="eager"
                />
              </span>
              {/* The hero already shows the name, so the header only needs it when there is no logo. */}
              <span className="sr-only">{brand.name}</span>
            </>
          ) : (
            <span className="text-sm font-semibold tracking-tight">{brand.name}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full border px-2.5 py-0.5 text-[11px] tracking-widest text-muted-foreground uppercase">
            {env.appEnv}
          </span>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-28 px-6 pt-16 pb-28 sm:px-10 sm:pt-24">
        <section className="flex flex-col items-center gap-6 text-center">
          <h1 className="text-6xl font-semibold tracking-tighter motion-safe:animate-fade-up sm:text-8xl">
            Playground
          </h1>
          <p className="max-w-2xl text-lg text-balance text-muted-foreground motion-safe:animate-fade-up motion-safe:[animation-delay:150ms]">
            A Next.js client application and a FastAPI server application, preconfigured with core
            libraries and connected end to end, out of the box.
          </p>
          <p className="font-mono text-xs tracking-wide text-muted-foreground motion-safe:animate-fade-up motion-safe:[animation-delay:300ms]">
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

      <footer className="px-6 py-8 text-center text-xs text-muted-foreground sm:px-10">
        {brand.name} · a reusable starter client and server application
        {brand.madeBy && (
          <>
            {" "}
            made with{" "}
            <Heart
              className="inline size-3 -translate-y-px fill-foreground text-foreground"
              aria-label="love"
              role="img"
            />{" "}
            by {brand.madeBy}
          </>
        )}
      </footer>
    </div>
  );
}
