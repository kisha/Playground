import Link from "next/link";

import { SHELL_PARAM, appShellStyles, findAppShellStyle } from "@/content/app-shells";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

import { ApplyShellStyle } from "./apply-shell-style";

type ShellStylesProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** Every app shell style, each with its own address, and the one the URL names marked. */
export async function ShellStyles({ searchParams }: ShellStylesProps) {
  const selectedStyle = findAppShellStyle((await searchParams)[SHELL_PARAM]);

  return (
    <>
      <ApplyShellStyle hasChatPanel={selectedStyle.hasChatPanel} />
      <ul className="flex flex-col gap-2">
        {appShellStyles.map((style) => (
          <li key={style.id}>
            <Link
              href={`${routes.sandboxAppShell}?${SHELL_PARAM}=${style.id}`}
              aria-current={style.id === selectedStyle.id ? "page" : undefined}
              className={cn(
                "flex flex-col gap-1 rounded-xl border p-4 transition-colors hover:bg-muted",
                style.id === selectedStyle.id && "border-foreground",
              )}
            >
              <span className="font-medium">{style.label}</span>
              <span className="text-sm text-muted-foreground">{style.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
