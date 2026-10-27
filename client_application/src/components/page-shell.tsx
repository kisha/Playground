import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { cn } from "@/lib/utils";

/** Header, a full-height main area and footer. Every page sits inside one; `className` styles its main. */
export function PageShell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className={cn("flex flex-1 flex-col", className)}>{children}</main>
      <SiteFooter />
    </div>
  );
}
