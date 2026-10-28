import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { cn } from "@/lib/utils";

type PageShellProps = {
  children: React.ReactNode;
  className?: string;
  /** Open the header's links in a new tab, as the landing page does. */
  linksInNewTab?: boolean;
};

/** Header, a full-height main area and footer. Every page sits inside one; `className` styles its main. */
export function PageShell({ children, className, linksInNewTab }: PageShellProps) {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader linksInNewTab={linksInNewTab} />
      <main className={cn("flex flex-1 flex-col", className)}>{children}</main>
      <SiteFooter />
    </div>
  );
}
