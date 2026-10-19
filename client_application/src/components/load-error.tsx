import { RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LoadErrorProps = {
  /** What failed, e.g. "This chart couldn't load." */
  title: string;
  message: string;
  onRetry: () => void;
  className?: string;
};

/** Error state for anything loaded from the API, with a button to try again. */
export function LoadError({ title, message, onRetry, className }: LoadErrorProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 text-center", className)}>
      <p className="text-sm font-medium">{title}</p>
      <p className="max-w-sm text-xs text-muted-foreground">{message}</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        <RotateCw aria-hidden /> Try again
      </Button>
    </div>
  );
}
