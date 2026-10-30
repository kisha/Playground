import { cn } from "@/lib/utils";

/** A question someone asked, right-aligned like a sent message. */
export function QuestionBubble({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-foreground px-4 py-2.5 text-sm text-background",
        className,
      )}
    >
      {children}
    </p>
  );
}
