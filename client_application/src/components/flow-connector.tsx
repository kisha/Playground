import { cn } from "@/lib/utils";

type FlowDirection = "vertical" | "responsive";

type FlowConnectorProps = {
  /**
   * "vertical" runs top to bottom and stretches to fill its column. "responsive" runs top to bottom on
   * small screens and left to right from the lg breakpoint up.
   */
  direction?: FlowDirection;
  /** Plays the dot once each time this changes, e.g. once per request. Leave it out to keep the dot flowing. */
  trigger?: number;
  className?: string;
};

const lineClasses: Record<FlowDirection, string> = {
  vertical: "w-px flex-1",
  responsive: "h-8 w-px self-center lg:h-px lg:w-10",
};

const dotPositionClasses: Record<FlowDirection, string> = {
  vertical: "left-1/2",
  responsive: "max-lg:left-1/2 lg:top-1/2",
};

const flowingDotClasses: Record<FlowDirection, string> = {
  vertical: "motion-safe:animate-flow-y",
  responsive: "motion-safe:max-lg:animate-flow-y motion-safe:lg:animate-flow-x",
};

const onceDotClasses: Record<FlowDirection, string> = {
  vertical: "motion-safe:animate-travel-y",
  responsive: "motion-safe:max-lg:animate-travel-y motion-safe:lg:animate-travel-x",
};

/** A line between two things, with a dot moving along it: data flowing from the first to the second. */
export function FlowConnector({ direction = "vertical", trigger, className }: FlowConnectorProps) {
  const dotAnimation = trigger === undefined ? flowingDotClasses[direction] : onceDotClasses[direction];
  return (
    <span aria-hidden className={cn("relative block shrink-0 bg-foreground/30", lineClasses[direction], className)}>
      <span
        key={trigger}
        className={cn(
          "absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground opacity-0",
          dotPositionClasses[direction],
          dotAnimation,
        )}
      />
    </span>
  );
}
