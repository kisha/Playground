import { Eyebrow } from "@/components/eyebrow";
import { cn } from "@/lib/utils";

type PageIntroProps = {
  eyebrow?: React.ReactNode;
  title: string;
  /** The lead under the title: a sentence, or short paragraphs and lists. */
  children: React.ReactNode;
  /**
   * "default" is a landing page's big, fading-in intro. "sm" uses compact spacing and type.
   * Both sizes supply the page's h1 and can accompany the shell's plain-text label.
   */
  size?: "default" | "sm";
};

/** A page's eyebrow, title and lead. */
export function PageIntro({ eyebrow, title, children, size = "default" }: PageIntroProps) {
  const small = size === "sm";
  return (
    <section data-size={size} className={cn("flex max-w-2xl flex-col", small ? "gap-2" : "gap-4")}>
      {eyebrow && <Eyebrow className={cn(!small && "motion-safe:animate-fade-up")}>{eyebrow}</Eyebrow>}
      <h1
        className={cn(
          "font-semibold tracking-tight text-balance",
          small
            ? "text-3xl"
            : "text-4xl motion-safe:animate-fade-up motion-safe:[animation-delay:100ms] sm:text-6xl",
        )}
      >
        {title}
      </h1>
      <div
        className={cn(
          "flex flex-col text-muted-foreground",
          small ? "gap-2 text-base" : "gap-4 text-lg motion-safe:animate-fade-up motion-safe:[animation-delay:200ms]",
        )}
      >
        {children}
      </div>
    </section>
  );
}
