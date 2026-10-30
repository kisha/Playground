/** The sandbox's links in the left sidebar. Add an entry here and a new sandbox page appears there. */

import {
  ChartColumnBig,
  FilePlus2,
  type LucideIcon,
  MessageCircle,
  Send,
  SlidersHorizontal,
  Upload,
} from "lucide-react";

import { routes } from "@/lib/routes";

export type SandboxExample = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const SANDBOX_EXAMPLES_HEADING = "Sandbox Examples";

export const sandboxExamples: SandboxExample[] = [
  { label: "Charts", href: routes.sandboxChartExamples, icon: ChartColumnBig },
  { label: "Filters", href: routes.sandboxFilters, icon: SlidersHorizontal },
  { label: "Chat UI", href: routes.sandboxChatUi, icon: MessageCircle },
  { label: "Api Requests", href: routes.sandboxApiRequests, icon: Send },
  { label: "Upload", href: routes.sandboxUpload, icon: Upload },
  { label: "Add A Sandbox Page", href: routes.sandboxAddASandboxPage, icon: FilePlus2 },
];
