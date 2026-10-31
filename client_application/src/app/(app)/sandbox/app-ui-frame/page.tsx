import type { Metadata } from "next";
import { Suspense } from "react";

import { PageIntro } from "@/components/page-intro";
import { Skeleton } from "@/components/ui/skeleton";

import { FrameStyles } from "./frame-styles";

export const metadata: Metadata = {
  title: "App UI Frame",
  description: "The app frame's styles, each with its own address.",
};

export default function AppUiFramePage({ searchParams }: PageProps<"/sandbox/app-ui-frame">) {
  return (
    <>
      <PageIntro eyebrow="Sandbox" title="App UI Frame">
        <p>The frame around this page is the example. Each style has its own address, so you can share it.</p>
      </PageIntro>
      {/* The style is in the URL's query, known only when someone asks for the page. */}
      <Suspense fallback={<Skeleton className="h-20 rounded-xl" />}>
        <FrameStyles searchParams={searchParams} />
      </Suspense>
    </>
  );
}
