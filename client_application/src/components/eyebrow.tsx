import { cn } from "@/lib/utils";

/** Small uppercase label above a title or card, e.g. "Sandbox" or "Example". */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-xs tracking-widest text-muted-foreground uppercase", className)}>{children}</p>;
}
