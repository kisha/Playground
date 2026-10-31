import { Eyebrow } from "@/components/eyebrow";

/** A chart or view's one-sentence answer. */
export function AnswerNote({ takeaway }: { takeaway: string }) {
  return (
    <div className="border-l-2 border-foreground bg-muted/60 px-4 py-3">
      <Eyebrow className="text-[10px] font-semibold">Answer</Eyebrow>
      <p className="mt-1 text-sm font-medium">{takeaway}</p>
    </div>
  );
}
