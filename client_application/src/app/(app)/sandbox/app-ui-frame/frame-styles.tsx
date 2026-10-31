import Link from "next/link";

import { APP_FRAME_PARAM, appFrameStyles, findAppFrameStyle } from "@/content/app-frames";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

import { ApplyFrameStyle } from "./apply-frame-style";

type FrameStylesProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** Every app frame style, each with its own address, and the one the URL names marked. */
export async function FrameStyles({ searchParams }: FrameStylesProps) {
  const selectedStyle = findAppFrameStyle((await searchParams)[APP_FRAME_PARAM]);

  return (
    <>
      <ApplyFrameStyle hasChatPanel={selectedStyle.hasChatPanel} />
      <ul className="flex flex-col gap-2">
        {appFrameStyles.map((style) => (
          <li key={style.id}>
            <Link
              href={`${routes.sandboxAppUiFrame}?${APP_FRAME_PARAM}=${style.id}`}
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
