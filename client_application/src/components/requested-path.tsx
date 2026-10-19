"use client";

import { usePathname } from "next/navigation";

/** The address the visitor asked for, shown on the 404 page. */
export function RequestedPath() {
  return <code className="rounded-md border px-1.5 py-0.5 font-mono text-sm break-all">{usePathname()}</code>;
}
