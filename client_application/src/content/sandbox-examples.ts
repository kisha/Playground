/** The sandbox's links, in the left sidebar and on /sandbox. Add an entry here and a new page appears in both. */

import {
  ChartColumnBig,
  FilePlus2,
  Gauge,
  ListFilter,
  type LucideIcon,
  MessageCircle,
  PanelsTopLeft,
  Send,
} from "lucide-react";

import { routes } from "@/lib/routes";

export type SandboxExample = {
  label: string;
  /** One sentence for the card on /sandbox. */
  description: string;
  href: string;
  icon: LucideIcon;
};

export const SANDBOX_EXAMPLES_HEADING = "Sandbox Examples";

export const addYourOwnExample: SandboxExample = {
  label: "Add a Sandbox Example",
  description: "A worked example of adding a page with its own endpoints and charts.",
  href: routes.sandboxAddASandboxPage,
  icon: FilePlus2,
};

/** Add new examples to the end of this list. */
export const sandboxExamples: SandboxExample[] = [
  { label: "Charts", description: "Example charts, all served by one mock-data endpoint.", href: routes.sandboxChartExamples, icon: ChartColumnBig },
  { label: "App Shell", description: "The app shell's styles, each with its own address.", href: routes.sandboxAppShell, icon: PanelsTopLeft },
  { label: "Chat UI", description: "Two chat layouts to start from, both with canned mock replies.", href: routes.sandboxChatUi, icon: MessageCircle },
  { label: "Measures", description: "A PDP-style example with typed filters and display-safe rates.", href: routes.sandboxMeasures, icon: ListFilter },
  { label: "API requests", description: "Live requests to the server application.", href: routes.sandboxApiRequests, icon: Send },
  { label: "KPI Examples", description: "KPI cards for percentages, splits and terms.", href: routes.sandboxKpiExamples, icon: Gauge },
];

/** Every example plus "Add a Sandbox Example", which stays last however many entries teams add above. */
export const sandboxNavItems: SandboxExample[] = [...sandboxExamples, addYourOwnExample];
