import { notFound } from "next/navigation";

import { env } from "@/lib/env";

/** Every page under /sandbox: a 404 in production where the sandbox is off, and the page's width and padding. */
export default function SandboxLayout({ children }: LayoutProps<"/sandbox">) {
  if (!env.sandboxEnabled) notFound();

  return <div className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 pt-12 pb-24 sm:px-10 sm:pt-16">{children}</div>;
}
