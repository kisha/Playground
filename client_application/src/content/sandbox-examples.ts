/** The sandbox's links in the left sidebar. Add an entry here and a new sandbox page appears there. */

import {
  ChartColumnBig,
  FilePlus2,
  Gauge,
  ListFilter,
  type LucideIcon,
  MessageCircle,
  PanelsTopLeft,
  Send,
  SlidersHorizontal,
  Upload,
} from "lucide-react";

import { routes } from "@/lib/routes";

type SandboxExample = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const SANDBOX_EXAMPLES_HEADING = "Sandbox Examples";

export const sandboxExamples: SandboxExample[] = [
  { label: "Charts", href: routes.sandboxChartExamples, icon: ChartColumnBig },
  { label: "App UI Frame", href: routes.sandboxAppUiFrame, icon: PanelsTopLeft },
  { label: "Chat UI", href: routes.sandboxChatUi, icon: MessageCircle },
  { label: "Measures", href: routes.sandboxMeasures, icon: ListFilter },
  { label: "Charts with Filters", href: routes.sandboxFilters, icon: SlidersHorizontal },
  { label: "Uploads", href: routes.sandboxUpload, icon: Upload },
  { label: "API requests", href: routes.sandboxApiRequests, icon: Send },
  { label: "KPI Examples", href: routes.sandboxKpiExamples, icon: Gauge },
  { label: "Add a Sandbox Example", href: routes.sandboxAddASandboxPage, icon: FilePlus2 },
];
