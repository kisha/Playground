import { Heart } from "lucide-react";

import { brand } from "@/content/brand";

export function SiteFooter() {
  return (
    <footer className="px-6 py-8 text-center text-xs text-muted-foreground sm:px-10">
      {brand.name} · {brand.summary}
      {brand.madeBy && (
        <>
          {" "}
          made with{" "}
          <Heart
            className="inline size-3 -translate-y-px fill-foreground text-foreground"
            aria-label="love"
            role="img"
          />{" "}
          by {brand.madeBy}
        </>
      )}
    </footer>
  );
}
