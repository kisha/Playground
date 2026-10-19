import Image from "next/image";
import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
import { brand } from "@/content/brand";
import { env } from "@/lib/env";

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-5 sm:px-10">
      <Link href="/" className="flex items-center gap-3" aria-label={`${brand.name} home`}>
        {brand.logo ? (
          // The logo artwork has a black background, so it sits in a black badge in both themes.
          <span className="flex h-8 items-center rounded-md bg-black px-1.5 ring-1 ring-foreground/10">
            <Image
              src={brand.logo.src}
              alt={brand.logo.alt}
              width={brand.logo.width}
              height={brand.logo.height}
              className="h-6 w-auto"
              loading="eager"
            />
          </span>
        ) : (
          <span className="text-sm font-semibold tracking-tight">{brand.name}</span>
        )}
      </Link>
      <div className="flex items-center gap-3">
        <span className="rounded-full border px-2.5 py-0.5 text-[11px] tracking-widest text-muted-foreground uppercase">
          {env.appEnv}
        </span>
        <ThemeToggle />
      </div>
    </header>
  );
}
