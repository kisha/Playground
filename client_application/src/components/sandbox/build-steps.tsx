import { Eyebrow } from "@/components/eyebrow";
import type { BuildStep } from "@/content/sandbox-how-to";

type BuildStepsProps = {
  /** Which of the two steps this is: 1 for the endpoints, 2 for the page. */
  step: number;
  title: string;
  /** The application this step changes, e.g. "Server Application (FastAPI)". */
  app: string;
  /** The application folder the paths are relative to. */
  folder: string;
  steps: BuildStep[];
};

/** One step of adding a sandbox page: the folder to copy on one side, and what to change in it. */
export function BuildSteps({ step, title, app, folder, steps }: BuildStepsProps) {
  return (
    <article className="flex min-w-0 flex-col gap-4 rounded-2xl border p-5 sm:p-6">
      <div className="flex flex-col gap-1">
        <Eyebrow>Step {step}</Eyebrow>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">
          {app} · <code className="font-mono text-xs">{folder}</code>
        </p>
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
