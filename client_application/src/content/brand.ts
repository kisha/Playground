/** Branding shown in the page header. Copies of Playground swap the logo here (or set it to null). */

export type Logo = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export const brand: { name: string; madeBy: string | null; logo: Logo | null } = {
  name: "Playground",
  /** Footer credit: "made with ♥ by …". Set to null to hide it. */
  madeBy: "dev/color",
  logo: {
    src: "/brand/devcolor-logo.png",
    alt: "dev/color",
    width: 358,
    height: 104,
  },
};
