import type { LucideIcon } from "lucide-react";

import { IconTile } from "@/components/icon-tile";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  /** Below the description: a button, a note, a list of suggestions. */
  children?: React.ReactNode;
  /** Dashed box around it, for a gap in the page. Off inside panels that have their own frame. */
  bordered?: boolean;
  className?: string;
};

/** Something not here yet: an icon, a title, a sentence and what to do next. */
export function EmptyState({ icon, title, description, children, bordered = true, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-72 flex-col items-center justify-center gap-3 p-8 text-center",
        bordered && "rounded-2xl border border-dashed",
        className,
      )}
    >
      <IconTile icon={icon} />
      <p className="font-medium">{title}</p>
      {description && <p className="max-w-md text-sm text-balance text-muted-foreground">{description}</p>}
      {children}
    </div>
  );
}
