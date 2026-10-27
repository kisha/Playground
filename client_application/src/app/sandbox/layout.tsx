import { notFound } from "next/navigation";

import { PageShell } from "@/components/page-shell";
import { env } from "@/lib/env";

/** Every page under /sandbox: shared shell, and a 404 in production where the sandbox is off. */
export default function SandboxLayout({ children }: LayoutProps<"/sandbox">) {
  if (!env.sandboxEnabled) notFound();

  return (
    <PageShell className="mx-auto w-full max-w-6xl gap-20 px-6 pt-12 pb-24 sm:px-10 sm:pt-16">{children}</PageShell>
  );
}
