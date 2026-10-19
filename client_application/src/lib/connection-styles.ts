import type { ConnectionState } from "@/lib/system-status";

/*
 * Tailwind classes per connection state. The site is black and white, so state is carried by
 * shape: solid = healthy, striped = degraded, outlined or dashed = offline, grey = pending.
 */

export const statusDotClasses: Record<ConnectionState, string> = {
  healthy: "bg-foreground",
  degraded: "stripes border border-foreground text-foreground",
  offline: "border border-foreground",
  pending: "bg-muted-foreground/40 motion-safe:animate-pulse",
};

export const trackerBlockClasses: Record<ConnectionState, string> = {
  healthy: "bg-foreground",
  degraded: "stripes border border-foreground/60 text-foreground/70",
  offline: "border border-foreground/40",
  pending: "bg-muted",
};

export const diagramNodeClasses: Record<ConnectionState, string> = {
  healthy: "border-foreground/70",
  degraded: "border-dashed border-foreground/70",
  offline: "border-dashed border-foreground/30 text-muted-foreground",
  pending: "border-border",
};
