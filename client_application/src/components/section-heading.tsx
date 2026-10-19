type SectionHeadingProps = {
  /** Matches the section's aria-labelledby. */
  id: string;
  title: string;
  children?: React.ReactNode;
};

/** A section's title with an optional description underneath. */
export function SectionHeading({ id, title, children }: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-2">
      <h2 id={id} className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h2>
      {children}
    </div>
  );
}
