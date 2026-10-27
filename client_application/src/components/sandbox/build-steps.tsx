import type { BuildStep } from "@/content/sandbox-enrollment-steps";

type BuildStepsProps = {
  title: string;
  /** The application folder the paths are relative to. */
  folder: string;
  steps: BuildStep[];
};

/** A numbered list of the files one side of a sandbox page needs, with what each one does. */
export function BuildSteps({ title, folder, steps }: BuildStepsProps) {
  return (
    <article className="flex min-w-0 flex-col gap-4 rounded-2xl border p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-semibold">{title}</h3>
        <code className="font-mono text-xs text-muted-foreground">{folder}</code>
      </div>
      <ol className="flex flex-col gap-4">
        {steps.map((step, index) => (
          <li key={step.file} className="flex gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium">
              {index + 1}
            </span>
            <div className="flex min-w-0 flex-col gap-1">
              <code className="font-mono text-sm break-all">{step.file}</code>
              <p className="text-sm text-muted-foreground">{step.what}</p>
            </div>
          </li>
        ))}
      </ol>
    </article>
  );
}
