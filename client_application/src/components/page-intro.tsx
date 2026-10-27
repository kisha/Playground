import { Eyebrow } from "@/components/eyebrow";

type PageIntroProps = {
  eyebrow: React.ReactNode;
  title: string;
  /** The lead paragraph under the title. */
  children: React.ReactNode;
};

/** A page's eyebrow, big title and lead paragraph, fading in one after another. */
export function PageIntro({ eyebrow, title, children }: PageIntroProps) {
  return (
    <section className="flex max-w-2xl flex-col gap-4">
      <Eyebrow className="motion-safe:animate-fade-up">{eyebrow}</Eyebrow>
      <h1 className="text-4xl font-semibold tracking-tight text-balance motion-safe:animate-fade-up motion-safe:[animation-delay:100ms] sm:text-6xl">
        {title}
      </h1>
      <p className="text-lg text-muted-foreground motion-safe:animate-fade-up motion-safe:[animation-delay:200ms]">
        {children}
      </p>
    </section>
  );
}
