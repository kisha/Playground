import type { Metadata } from "next";
import { Suspense } from "react";

import { PageIntro } from "@/components/page-intro";
import { Skeleton } from "@/components/ui/skeleton";

import { ShellStyles } from "./shell-styles";

export const metadata: Metadata = {
  title: "App Shell",
  description: "The app shell's styles, each with its own address.",
};

export default function AppShellPage({ searchParams }: PageProps<"/sandbox/app-shell">) {
  return (
    <>
      <PageIntro eyebrow="Sandbox" title="App Shell">
        <p>The shell around this page is the example. Each style has its own address, so you can share it.</p>
      </PageIntro>
      {/* The style is in the URL's query, known only when someone asks for the page. */}
      <Suspense fallback={<Skeleton className="h-20 rounded-xl" />}>
        <ShellStyles searchParams={searchParams} />
      </Suspense>
    </>
  );
}
