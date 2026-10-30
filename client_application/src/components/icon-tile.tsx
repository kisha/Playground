import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/** An icon on a soft rounded square, as on cards and empty states. */
export function IconTile({ icon: Icon, className }: { icon: LucideIcon; className?: string }) {
  return (
    <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted", className)}>
      <Icon className="size-4" aria-hidden />
    </span>
  );
}
