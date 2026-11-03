import type { Metadata } from "next";
import Link from "next/link";

import { PageIntro } from "@/components/page-intro";
import { SectionHeading } from "@/components/section-heading";
import { addYourOwnExample, sandboxExamples, type SandboxExample } from "@/content/sandbox-examples";

export const metadata: Metadata = {
  title: "Sandbox",
  description: "Reusable examples for anyone building on the Playground starter kit.",
};

function ExampleCard({ example }: { example: SandboxExample }) {
  return (
    <Link
      href={example.href}
      className="flex h-full flex-col gap-3 rounded-2xl border bg-card p-6 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <example.icon aria-hidden className="size-5 text-muted-foreground" />
      <span className="font-medium">{example.label}</span>
      <span className="text-sm text-muted-foreground">{example.description}</span>
    </Link>
  );
}

/** Where the landing page, the header, the docs and every sandbox page's back link lead. */
export default function SandboxPage() {
  return (
    <>
      <PageIntro eyebrow="Sandbox" title="Examples to build from">
        <p>Reusable pieces for anyone building on the Playground. Everything here runs on mock data.</p>
      </PageIntro>

      <section aria-labelledby="add-your-own-heading" className="flex flex-col gap-6">
        <SectionHeading id="add-your-own-heading" title="Add your own">
          <p className="text-muted-foreground">
            Build charts, filters or other UI on a new Sandbox page, with its own endpoints.
          </p>
        </SectionHeading>
        <div className="grid gap-4 lg:grid-cols-2">
          <ExampleCard example={addYourOwnExample} />
        </div>
      </section>

      <section aria-labelledby="examples-heading" className="flex flex-col gap-6">
        <SectionHeading id="examples-heading" title="Examples" />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sandboxExamples.map((example) => (
            <li key={example.href}>
              <ExampleCard example={example} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
