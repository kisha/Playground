export type ThemeName = "light" | "dark";

/** The theme the toggle switches to from the one currently showing. */
export function oppositeTheme(currentTheme: string | undefined): ThemeName {
  return currentTheme === "dark" ? "light" : "dark";
}
