/** The app shell's styles, offered by /sandbox/app-shell. The first is the default. A new layout also needs shell code. */

type AppShellStyle = {
  id: string;
  label: string;
  description: string;
  hasChatPanel: boolean;
};

export const SHELL_PARAM = "shell";

export const appShellStyles: AppShellStyle[] = [
  {
    id: "shell-1",
    label: "Shell 1 (default)",
    description: "A collapsible sidebar on the left, the page in the middle, and a chat panel on the right.",
    hasChatPanel: true,
  },
  {
    id: "shell-2",
    label: "Shell 2",
    description: "A collapsible sidebar on the left and the page beside it, with no chat panel.",
    hasChatPanel: false,
  },
];

/** The style with this id. A missing or unknown one gets the default. */
export function findAppShellStyle(styleId: string | string[] | undefined): AppShellStyle {
  return appShellStyles.find((style) => style.id === styleId) ?? appShellStyles[0];
}
