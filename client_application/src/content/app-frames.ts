/** The app frame's styles, offered by /sandbox/app-ui-frame. The first is the default. A new layout also needs frame code. */

type AppFrameStyle = {
  id: string;
  label: string;
  description: string;
  hasChatPanel: boolean;
};

export const APP_FRAME_PARAM = "app-frame";

export const appFrameStyles: AppFrameStyle[] = [
  {
    id: "ui-frame-1",
    label: "UI Frame 1 (default)",
    description: "A collapsible sidebar on the left, the page in the middle, and a chat panel on the right.",
    hasChatPanel: true,
  },
  {
    id: "ui-frame-2",
    label: "UI Frame 2",
    description: "A collapsible sidebar on the left and the page beside it, with no chat panel.",
    hasChatPanel: false,
  },
];

/** The style with this id. A missing or unknown one gets the default. */
export function findAppFrameStyle(styleId: string | string[] | undefined): AppFrameStyle {
  return appFrameStyles.find((style) => style.id === styleId) ?? appFrameStyles[0];
}
