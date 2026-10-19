/** Name, wording and logo used across the site. Copies of Playground change them here. */

export type Logo = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

type Brand = {
  name: string;
  /** Under the name on the landing page, and the description search engines show. */
  tagline: string;
  /** Footer: "{name} · {summary} made with ♥ by {madeBy}". */
  summary: string;
  /** Footer credit. Set to null to hide it. */
  madeBy: string | null;
  /** Top left of every page. Set to null to show the name instead. */
  logo: Logo | null;
};

export const brand: Brand = {
  name: "Playground",
  tagline:
    "A Next.js client application and a FastAPI server application, preconfigured with core libraries and connected end to end, out of the box.",
  summary: "a reusable starter client and server application",
  madeBy: "dev/color",
  logo: {
    src: "/brand/devcolor-logo.png",
    alt: "dev/color",
    width: 358,
    height: 104,
  },
};
