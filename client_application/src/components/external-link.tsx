import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

const linkStyles = {
  /** Bold label that underlines on hover, for calls to action. */
  plain: "font-medium underline-offset-4 hover:underline",
  /** Always underlined, for links inside a sentence. */
  inline: "font-medium text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground",
};

type ExternalLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof linkStyles;
  className?: string;
};

/** A link that opens in a new tab, marked with an ↗ arrow. */
export function ExternalLink({ href, children, variant = "plain", className }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn("inline-flex items-center gap-0.5", linkStyles[variant], className)}
    >
      {children}
      <ArrowUpRight className="size-3.5" aria-hidden />
    </a>
  );
}
